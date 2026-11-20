-- 013: sistem ambil ticket di dashboard admin.
--  - Ticket baru menunggu admin. Admin yang CHAT DULUAN otomatis jadi penangan ticket.
--  - Admin lain tidak bisa chat / ubah status / tutup ticket yang sudah ditangani.
--  - Admin lain bisa mengambil alih lewat fungsi take_over_ticket (tombol "ambil alih" di dashboard).
--  - Saat diambil alih, chat ticket mendapat pesan sistem "Ticket kamu diambil alih oleh <nama>".
-- Jalankan sekali di Supabase > SQL Editor setelah 012. Aman dijalankan ulang.

-- 1) kolom admin penangan
alter table public.tickets add column if not exists handler_id   uuid references auth.users(id) on delete set null;
alter table public.tickets add column if not exists handler_nama text;
alter table public.tickets add column if not exists handler_role text;
alter table public.tickets add column if not exists handler_av   text;

-- 2) ticket lama: penangan = admin pertama yang pernah membalas
update public.tickets t
   set handler_id = m.sender_id, handler_nama = m.n, handler_role = m.r, handler_av = m.av
  from (select distinct on (ticket_id) ticket_id, sender_id, n, r, av
          from public.ticket_messages where w = 'a' order by ticket_id, id) m
 where t.id = m.ticket_id and t.handler_nama is null;

-- 3) pesan: admin pertama yang chat otomatis jadi penangan; admin lain ditolak
create or replace function public.ticket_messages_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare t public.tickets; s public.staff; av_ text;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into t from public.tickets where id = new.ticket_id for update;
  if t.id is null then raise exception 'Ticket tidak ditemukan.'; end if;
  if t.closed then raise exception 'Ticket sudah ditutup, chat tidak bisa dikirim lagi.'; end if;
  select * into s from public.staff where user_id = auth.uid();
  new.av := null;
  if new.w = 'c' then
    if t.customer_id is distinct from auth.uid() then raise exception 'Tidak diizinkan.'; end if;
    new.n := null; new.r := null;
  elsif new.w = 's' and coalesce(current_setting('nx.sys_pin', true), '') = '1' then
    new.n := null; new.r := null;
  elsif new.w in ('a', 's') then
    if s.id is null then raise exception 'Hanya tim NEXORA yang bisa mengirim pesan ini.'; end if;
    if t.handler_nama is not null and t.handler_id is distinct from auth.uid() then
      raise exception 'Ticket ini sedang ditangani % . Ambil alih ticket dulu kalau kamu ingin membalas.', t.handler_nama;
    end if;
    av_ := (select avatar_url from public.profiles where id = auth.uid());
    new.n := s.nama; new.r := s.role;
    if new.w = 'a' then new.av := av_; end if;
    if t.handler_nama is null then
      update public.tickets
         set handler_id = auth.uid(), handler_nama = s.nama, handler_role = s.role, handler_av = av_
       where id = t.id;
    end if;
  else
    raise exception 'Jenis pesan tidak valid.';
  end if;
  new.sender_id := auth.uid(); new.dibuat := now();
  return new;
end $$;
drop trigger if exists ticket_messages_bi on public.ticket_messages;
create trigger ticket_messages_bi before insert on public.ticket_messages for each row execute function public.ticket_messages_bi();

-- 4) ubah status / tutup ticket: hanya penangan (atau siapa pun kalau belum ada penangan, lalu dia jadi penangan)
create or replace function public.tickets_bu() returns trigger
language plpgsql set search_path = public as $$
declare s public.staff; av_ text;
begin
  if current_user not in ('authenticated', 'anon') then return new; end if;
  if old.customer_id is not null and new.customer_id is null then return new; end if;
  if old.closed then raise exception 'Ticket sudah ditutup dan tidak bisa diubah lagi.'; end if;
  if old.st = 'Orderan Selesai' and new.st <> old.st then raise exception 'Status Orderan Selesai tidak bisa diubah lagi.'; end if;
  new.id := old.id; new.customer_id := old.customer_id;
  new.cust_nama := old.cust_nama; new.cust_discord := old.cust_discord; new.cust_wa := old.cust_wa;
  new.subj := old.subj; new.kat := old.kat; new.paket := old.paket; new.dibuat := old.dibuat;
  new.handler_id := old.handler_id; new.handler_nama := old.handler_nama;
  new.handler_role := old.handler_role; new.handler_av := old.handler_av;
  if new.st is distinct from old.st or new.closed is distinct from old.closed then
    if old.handler_nama is not null and old.handler_id is distinct from auth.uid() then
      raise exception 'Ticket ini sedang ditangani % . Ambil alih ticket dulu untuk mengubah status atau menutupnya.', old.handler_nama;
    end if;
    if old.handler_nama is null then
      select * into s from public.staff where user_id = auth.uid();
      if s.id is not null then
        select avatar_url into av_ from public.profiles where id = auth.uid();
        new.handler_id := auth.uid(); new.handler_nama := s.nama; new.handler_role := s.role; new.handler_av := av_;
      end if;
    end if;
  end if;
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

-- 5) ambil alih ticket dari admin lain
create or replace function public.take_over_ticket(p_ticket text) returns text
language plpgsql security definer set search_path = public as $$
declare t public.tickets; s public.staff; av_ text; had boolean;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into s from public.staff where user_id = auth.uid();
  if s.id is null then raise exception 'Hanya tim NEXORA yang bisa mengambil alih ticket.'; end if;
  select * into t from public.tickets where id = p_ticket for update;
  if t.id is null then raise exception 'Ticket tidak ditemukan.'; end if;
  if t.closed then raise exception 'Ticket sudah ditutup.'; end if;
  if t.handler_id = auth.uid() then return 'sudah'; end if;
  had := t.handler_nama is not null;
  av_ := (select avatar_url from public.profiles where id = auth.uid());
  update public.tickets
     set handler_id = auth.uid(), handler_nama = s.nama, handler_role = s.role, handler_av = av_, diubah = now()
   where id = p_ticket;
  if had then
    perform set_config('nx.sys_pin', '1', true);
    insert into public.ticket_messages (ticket_id, w, t) values (p_ticket, 's', 'Ticket kamu diambil alih oleh ' || s.nama);
    perform set_config('nx.sys_pin', '', true);
  end if;
  return 'ok';
end $$;
revoke all on function public.take_over_ticket(text) from public, anon;
grant execute on function public.take_over_ticket(text) to authenticated;
