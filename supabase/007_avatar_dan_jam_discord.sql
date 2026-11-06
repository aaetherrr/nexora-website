-- =====================================================================
-- NEXORA - Foto profil (Google/Discord) di dashboard dan chat + jam di notifikasi Discord
-- Jalankan SEKALI di SQL Editor setelah 006. Aman diulang.
-- =====================================================================

-- ---------- FOTO PROFIL ----------
-- Hanya alamat gambar resmi Google/Discord yang diterima (mencegah alamat sembarang).
alter table public.profiles       add column if not exists avatar_url  text;
alter table public.tickets        add column if not exists cust_avatar text;
alter table public.ticket_messages add column if not exists av         text;

alter table public.profiles drop constraint if exists profiles_avatar_fmt;
alter table public.profiles add constraint profiles_avatar_fmt
  check (avatar_url is null or (char_length(avatar_url) <= 600
         and avatar_url ~ '^https://(lh[0-9]+\.googleusercontent\.com|cdn\.discordapp\.com)/[^[:space:]]+$'));
grant update (avatar_url) on public.profiles to authenticated;

-- akun baru: ambil foto dari data login
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare v text; n text; vi text;
begin
  v := coalesce(nullif(new.raw_user_meta_data->>'avatar_url', ''), nullif(new.raw_user_meta_data->>'picture', ''));
  begin
    if v is not null and (char_length(v) > 600
       or v !~ '^https://(lh[0-9]+\.googleusercontent\.com|cdn\.discordapp\.com)/[^[:space:]]+$') then v := null; end if;
  exception when others then v := null;
  end;
  n  := left(coalesce(nullif(new.raw_user_meta_data->>'full_name', ''),
                      nullif(new.raw_user_meta_data->>'name', ''),
                      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
                      'Customer'), 60);
  vi := initcap(coalesce(new.raw_app_meta_data->>'provider', ''));
  begin
    insert into public.profiles (id, nama, email, via, avatar_url)
    values (new.id, n, new.email, vi, v)
    on conflict (id) do nothing;
  exception when others then
    -- foto bermasalah tidak boleh menggagalkan pembuatan akun: simpan tanpa foto
    insert into public.profiles (id, nama, email, via)
    values (new.id, n, new.email, vi)
    on conflict (id) do nothing;
  end;
  return new;
end $$;

-- ticket: simpan salinan foto customer
create or replace function public.tickets_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.profiles; n int; pre text; nn bigint;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into p from public.profiles where id = auth.uid();
  if p.id is null then raise exception 'Profil tidak ditemukan. Coba login ulang.'; end if;
  if coalesce(p.whatsapp, '') = '' then
    raise exception 'Isi nomor WhatsApp di menu Profil sebelum membuka ticket.';
  end if;
  select count(*) into n from public.tickets where customer_id = auth.uid() and not closed;
  if n >= 3 then raise exception 'Batas 3 ticket aktif tercapai. Tunggu salah satu ticket ditutup admin.'; end if;
  if new.kat = 'Order baru' then pre := 'O'; nn := nextval('public.ticket_seq_o');
  elsif new.kat = 'Bantuan' then pre := 'B'; nn := nextval('public.ticket_seq_b');
  elsif new.kat = 'Lainnya' then pre := 'L'; nn := nextval('public.ticket_seq_l');
  else pre := 'P'; nn := nextval('public.ticket_seq_p'); end if;
  new.id := pre || '-' || lpad(nn::text, 4, '0');
  new.customer_id := auth.uid();
  new.cust_nama := p.nama; new.cust_discord := p.discord_username; new.cust_wa := p.whatsapp; new.cust_avatar := p.avatar_url;
  new.st := 'Menunggu admin balas'; new.closed := false; new.closed_at := null; new.closed_by := null;
  new.dibuat := now(); new.diubah := now();
  return new;
end $$;
drop trigger if exists tickets_bi on public.tickets;
create trigger tickets_bi before insert on public.tickets for each row execute function public.tickets_bi();

-- pesan: foto pengirim tim ikut tersimpan
create or replace function public.ticket_messages_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare t public.tickets; s public.staff;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into t from public.tickets where id = new.ticket_id;
  if t.id is null then raise exception 'Ticket tidak ditemukan.'; end if;
  if t.closed then raise exception 'Ticket sudah ditutup, chat tidak bisa dikirim lagi.'; end if;
  select * into s from public.staff where user_id = auth.uid();
  new.av := null;
  if new.w = 'c' then
    if t.customer_id is distinct from auth.uid() then raise exception 'Tidak diizinkan.'; end if;
    new.n := null; new.r := null;
  elsif new.w in ('a', 's') then
    if s.id is null then raise exception 'Hanya tim NEXORA yang bisa mengirim pesan ini.'; end if;
    new.n := s.nama; new.r := s.role;
    if new.w = 'a' then new.av := (select avatar_url from public.profiles where id = auth.uid()); end if;
  else
    raise exception 'Jenis pesan tidak valid.';
  end if;
  new.sender_id := auth.uid(); new.dibuat := now();
  return new;
end $$;
drop trigger if exists ticket_messages_bi on public.ticket_messages;
create trigger ticket_messages_bi before insert on public.ticket_messages for each row execute function public.ticket_messages_bi();

-- ---------- JAM DI NOTIFIKASI DISCORD ----------
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
        'timestamp', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'footer', jsonb_build_object('text', 'NEXORA · ' || to_char(now() at time zone 'Asia/Jakarta', 'DD-MM-YYYY HH24:MI') || ' WIB'),
        'fields', jsonb_build_array(
          jsonb_build_object('name', 'Customer', 'value', left(t.cust_nama, 100), 'inline', true),
          jsonb_build_object('name', 'Jenis', 'value', left(t.kat || case when t.paket <> '-' then ' · ' || t.paket else '' end, 200), 'inline', true),
          jsonb_build_object('name', 'Waktu', 'value', to_char(now() at time zone 'Asia/Jakarta', 'DD-MM-YYYY HH24:MI') || ' WIB', 'inline', true),
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
