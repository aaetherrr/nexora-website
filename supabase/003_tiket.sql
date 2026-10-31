-- =====================================================================
-- NEXORA - Supabase Tahap 2: ticket + chat + notifikasi Discord
-- Jalankan SEKALI di SQL Editor SETELAH 001 dan 002. Aman diulang.
-- =====================================================================
create extension if not exists pg_net with schema extensions;

create sequence if not exists public.ticket_no_seq start 1044;

-- ---------- TABEL ----------
create table if not exists public.tickets (
  id            text primary key,                                  -- T-1044, dibuat otomatis oleh trigger
  customer_id   uuid references auth.users(id) on delete set null, -- akun dihapus: riwayat tetap ada untuk admin
  cust_nama     text not null,                                     -- salinan data customer saat ticket dibuat
  cust_discord  text,
  cust_wa       text,
  subj          text not null check (char_length(subj) between 1 and 120),
  kat           text not null check (kat in ('Order baru', 'Bantuan', 'Lainnya', 'Pembayaran')),
  paket         text not null default '-' check (char_length(paket) <= 120),
  st            text not null default 'Menunggu admin balas' check (st in (
                  'Menunggu admin balas', 'Terhubung dengan admin', 'Menunggu pembayaran',
                  'Pembayaran Dikonfirmasi', 'Pesanan Diproses', 'Orderan Selesai')),
  closed        boolean not null default false,
  closed_at     timestamptz,
  closed_by     text,
  dibuat        timestamptz not null default now(),
  diubah        timestamptz not null default now()
);
create index if not exists tickets_customer_idx on public.tickets (customer_id);
create index if not exists tickets_dibuat_idx   on public.tickets (dibuat desc);

create table if not exists public.ticket_messages (
  id         bigint generated always as identity primary key,
  ticket_id  text not null references public.tickets(id) on delete cascade,
  w          text not null check (w in ('c', 'a', 's')),           -- c=customer, a=admin, s=sistem
  sender_id  uuid references auth.users(id) on delete set null,
  n          text,                                                  -- nama admin (diisi server)
  r          text,                                                  -- role admin (diisi server)
  t          text not null check (char_length(t) between 1 and 4000),
  dibuat     timestamptz not null default now()
);
create index if not exists ticket_messages_ticket_idx on public.ticket_messages (ticket_id, id);

-- ---------- ATURAN SAAT TICKET DIBUAT ----------
create or replace function public.tickets_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.profiles; n int;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into p from public.profiles where id = auth.uid();
  if p.id is null then raise exception 'Profil tidak ditemukan. Coba login ulang.'; end if;
  if coalesce(p.whatsapp, '') = '' or coalesce(p.discord_username, '') = '' then
    raise exception 'Lengkapi username Discord dan nomor WhatsApp di menu Profil sebelum membuka ticket.';
  end if;
  select count(*) into n from public.tickets where customer_id = auth.uid() and not closed;
  if n >= 3 then raise exception 'Batas 3 ticket aktif tercapai. Tunggu salah satu ticket ditutup admin.'; end if;
  new.id := 'T-' || nextval('public.ticket_no_seq');
  new.customer_id := auth.uid();
  new.cust_nama := p.nama; new.cust_discord := p.discord_username; new.cust_wa := p.whatsapp;
  new.st := 'Menunggu admin balas'; new.closed := false; new.closed_at := null; new.closed_by := null;
  new.dibuat := now(); new.diubah := now();
  return new;
end $$;
drop trigger if exists tickets_bi on public.tickets;
create trigger tickets_bi before insert on public.tickets for each row execute function public.tickets_bi();

-- ---------- ATURAN SAAT TICKET DIUBAH (hanya staf) ----------
create or replace function public.tickets_bu() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.closed then raise exception 'Ticket sudah ditutup dan tidak bisa diubah lagi.'; end if;
  if old.st = 'Orderan Selesai' and new.st <> old.st then raise exception 'Status Orderan Selesai tidak bisa diubah lagi.'; end if;
  new.id := old.id; new.customer_id := old.customer_id;
  new.cust_nama := old.cust_nama; new.cust_discord := old.cust_discord; new.cust_wa := old.cust_wa;
  new.subj := old.subj; new.kat := old.kat; new.paket := old.paket; new.dibuat := old.dibuat;
  if new.closed then
    new.closed_at := now();
    new.closed_by := coalesce((select nama || ' (' || role || ')' from public.staff where user_id = auth.uid()), 'admin');
  else
    new.closed_at := null; new.closed_by := null;
  end if;
  new.diubah := now();
  return new;
end $$;
drop trigger if exists tickets_bu on public.tickets;
create trigger tickets_bu before update on public.tickets for each row execute function public.tickets_bu();

-- ---------- ATURAN SAAT PESAN DIKIRIM ----------
create or replace function public.ticket_messages_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare t public.tickets; s public.staff;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into t from public.tickets where id = new.ticket_id;
  if t.id is null then raise exception 'Ticket tidak ditemukan.'; end if;
  if t.closed then raise exception 'Ticket sudah ditutup, chat tidak bisa dikirim lagi.'; end if;
  select * into s from public.staff where user_id = auth.uid();
  if new.w = 'c' then
    if t.customer_id is distinct from auth.uid() then raise exception 'Tidak diizinkan.'; end if;
    new.n := null; new.r := null;
  elsif new.w in ('a', 's') then
    if s.id is null then raise exception 'Hanya tim NEXORA yang bisa mengirim pesan ini.'; end if;
    new.n := s.nama; new.r := s.role;
  else
    raise exception 'Jenis pesan tidak valid.';
  end if;
  new.sender_id := auth.uid(); new.dibuat := now();
  return new;
end $$;
drop trigger if exists ticket_messages_bi on public.ticket_messages;
create trigger ticket_messages_bi before insert on public.ticket_messages for each row execute function public.ticket_messages_bi();

-- ---------- NOTIFIKASI DISCORD ----------
-- Dikirim untuk: ticket baru (pesan pertama) dan pesan customer pertama setelah admin membalas.
-- Gagal kirim tidak pernah menggagalkan ticket/pesannya.
create or replace function public.ticket_messages_ai() returns trigger
language plpgsql security definer set search_path = public, extensions, vault as $$
declare t public.tickets; cnt int; prev text; judul text; v_url text; v_site text; emb jsonb;
begin
  update public.tickets set diubah = now() where id = new.ticket_id;
  if new.w <> 'c' then return new; end if;
  select * into t from public.tickets where id = new.ticket_id;
  select count(*) into cnt from public.ticket_messages where ticket_id = new.ticket_id;
  if cnt = 1 then
    judul := 'Ticket baru ' || t.id;
  else
    select w into prev from public.ticket_messages
     where ticket_id = new.ticket_id and id < new.id and w in ('a', 'c') order by id desc limit 1;
    if prev is distinct from 'a' then return new; end if;
    judul := 'Balasan customer ' || t.id;
  end if;
  begin
    select decrypted_secret into v_url  from vault.decrypted_secrets where name = 'discord_webhook' limit 1;
    select decrypted_secret into v_site from vault.decrypted_secrets where name = 'site_url' limit 1;
    if coalesce(v_url, '') <> '' then
      emb := jsonb_build_object(
        'title', judul,
        'description', left(new.t, 300),
        'color', 7034296,
        'fields', jsonb_build_array(
          jsonb_build_object('name', 'Customer', 'value', left(t.cust_nama, 100), 'inline', true),
          jsonb_build_object('name', 'Jenis', 'value', left(t.kat || case when t.paket <> '-' then ' · ' || t.paket else '' end, 200), 'inline', true),
          jsonb_build_object('name', 'Subjek', 'value', left(t.subj, 200))));
      if coalesce(v_site, '') <> '' then emb := emb || jsonb_build_object('url', v_site || '/admin/nexora-admin.html'); end if;
      perform net.http_post(
        url := v_url,
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object('username', 'NEXORA Ticket', 'allowed_mentions', jsonb_build_object('parse', '[]'::jsonb), 'embeds', jsonb_build_array(emb)));
    end if;
  exception when others then
    null;
  end;
  return new;
end $$;
drop trigger if exists ticket_messages_ai on public.ticket_messages;
create trigger ticket_messages_ai after insert on public.ticket_messages for each row execute function public.ticket_messages_ai();

-- ---------- KEAMANAN (RLS) ----------
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

drop policy if exists "tiket_baca" on public.tickets;
create policy "tiket_baca" on public.tickets for select to authenticated
  using (customer_id = auth.uid() or public.is_staff());
drop policy if exists "tiket_buat" on public.tickets;
create policy "tiket_buat" on public.tickets for insert to authenticated
  with check (customer_id = auth.uid());
drop policy if exists "tiket_ubah" on public.tickets;
create policy "tiket_ubah" on public.tickets for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
drop policy if exists "tiket_hapus" on public.tickets;
create policy "tiket_hapus" on public.tickets for delete to authenticated
  using (public.is_founder());

drop policy if exists "pesan_baca" on public.ticket_messages;
create policy "pesan_baca" on public.ticket_messages for select to authenticated
  using (public.is_staff() or exists (select 1 from public.tickets t where t.id = ticket_id and t.customer_id = auth.uid()));
drop policy if exists "pesan_kirim" on public.ticket_messages;
create policy "pesan_kirim" on public.ticket_messages for insert to authenticated
  with check (public.is_staff() or exists (select 1 from public.tickets t where t.id = ticket_id and t.customer_id = auth.uid()));

revoke all on public.tickets, public.ticket_messages from anon, authenticated;
grant select on public.tickets to authenticated;
grant insert (subj, kat, paket) on public.tickets to authenticated;
grant update (st, closed) on public.tickets to authenticated;
grant delete on public.tickets to authenticated;
grant select on public.ticket_messages to authenticated;
grant insert (ticket_id, w, t) on public.ticket_messages to authenticated;

-- ---------- REAL TIME ----------
do $$ begin
  begin alter publication supabase_realtime add table public.tickets; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.ticket_messages; exception when duplicate_object then null; end;
end $$;
