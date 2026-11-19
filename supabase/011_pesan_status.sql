-- 011: status pesan ticket (centang terkirim/dibaca), balas pesan, dan sematkan pesan.
-- Jalankan sekali di Supabase > SQL Editor. Aman dijalankan ulang.

alter table public.ticket_messages add column if not exists dibaca   timestamptz;
alter table public.ticket_messages add column if not exists reply_to bigint references public.ticket_messages(id) on delete set null;
alter table public.ticket_messages add column if not exists pinned   boolean not null default false;

-- boleh menyertakan reply_to saat kirim pesan
grant insert (ticket_id, w, t, reply_to) on public.ticket_messages to authenticated;

-- pastikan pesan yang dibalas memang ada di ticket yang sama
create or replace function public.ticket_messages_reply_chk() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.reply_to is not null and not exists (select 1 from public.ticket_messages m where m.id = new.reply_to and m.ticket_id = new.ticket_id) then
    new.reply_to := null;
  end if;
  return new;
end $$;
drop trigger if exists ticket_messages_reply_chk on public.ticket_messages;
create trigger ticket_messages_reply_chk before insert on public.ticket_messages for each row execute function public.ticket_messages_reply_chk();

-- tandai pesan lawan bicara sebagai sudah dibaca (dipanggil saat chat dibuka)
create or replace function public.mark_ticket_read(p_ticket text) returns void
language plpgsql security definer set search_path = public as $$
declare t public.tickets; st boolean;
begin
  if auth.uid() is null then return; end if;
  select * into t from public.tickets where id = p_ticket;
  if t.id is null then return; end if;
  st := public.is_staff();
  if st then
    update public.ticket_messages set dibaca = now() where ticket_id = p_ticket and w = 'c' and dibaca is null;
  elsif t.customer_id = auth.uid() then
    update public.ticket_messages set dibaca = now() where ticket_id = p_ticket and w = 'a' and dibaca is null;
  end if;
end $$;
revoke all on function public.mark_ticket_read(text) from public, anon;
grant execute on function public.mark_ticket_read(text) to authenticated;

-- sematkan / lepas sematan pesan (pemilik ticket atau staf)
create or replace function public.pin_message(p_id bigint, p_pin boolean) returns void
language plpgsql security definer set search_path = public as $$
declare m public.ticket_messages; t public.tickets;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into m from public.ticket_messages where id = p_id;
  if m.id is null then raise exception 'Pesan tidak ditemukan.'; end if;
  select * into t from public.tickets where id = m.ticket_id;
  if not (public.is_staff() or t.customer_id = auth.uid()) then raise exception 'Tidak diizinkan.'; end if;
  if t.closed then raise exception 'Ticket sudah ditutup.'; end if;
  update public.ticket_messages set pinned = coalesce(p_pin, false) where id = p_id;
end $$;
revoke all on function public.pin_message(bigint, boolean) from public, anon;
grant execute on function public.pin_message(bigint, boolean) to authenticated;
