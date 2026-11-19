-- 012: pesan sematan tampil sebagai info di chat ("<nama> menyematkan sebuah pesan").
-- Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.

-- 1) pesan sistem boleh dibuat oleh fungsi sematkan (bukan hanya staf)
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
  elsif new.w = 's' and coalesce(current_setting('nx.sys_pin', true), '') = '1' then
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

-- 2) sematkan pesan sekarang menambah info di chat
create or replace function public.pin_message(p_id bigint, p_pin boolean) returns void
language plpgsql security definer set search_path = public as $$
declare m public.ticket_messages; t public.tickets; nm text;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into m from public.ticket_messages where id = p_id;
  if m.id is null then raise exception 'Pesan tidak ditemukan.'; end if;
  select * into t from public.tickets where id = m.ticket_id;
  if not (public.is_staff() or t.customer_id = auth.uid()) then raise exception 'Tidak diizinkan.'; end if;
  if t.closed then raise exception 'Ticket sudah ditutup.'; end if;
  update public.ticket_messages set pinned = coalesce(p_pin, false) where id = p_id;
  if coalesce(p_pin, false) and m.w <> 's' then
    select coalesce((select nama from public.staff where user_id = auth.uid() limit 1),
                    (select nama from public.profiles where id = auth.uid() limit 1), 'Seseorang') into nm;
    perform set_config('nx.sys_pin', '1', true);
    insert into public.ticket_messages (ticket_id, w, t) values (m.ticket_id, 's', nm || ' menyematkan sebuah pesan');
    perform set_config('nx.sys_pin', '', true);
  end if;
end $$;
revoke all on function public.pin_message(bigint, boolean) from public, anon;
grant execute on function public.pin_message(bigint, boolean) to authenticated;
