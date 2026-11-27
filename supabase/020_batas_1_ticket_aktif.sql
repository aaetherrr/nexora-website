-- 020: Batas ticket aktif customer jadi 1 (sebelumnya 3).
--  - Ticket "aktif" = belum ditutup DAN belum berstatus "Orderan Selesai".
--    Jadi customer yang ordernya sudah selesai boleh membuka ticket baru tanpa menunggu admin menutup ticket lama.
--  - Di dashboard, customer yang sudah mencapai batas dan mau membuka ticket lagi langsung diarahkan ke chat ticket aktifnya.
--  - Isi fungsi sama seperti versi 017, hanya hitungan dan pesan batasnya yang diganti.
-- Jalankan sekali di Supabase > SQL Editor setelah 019. Aman dijalankan ulang.

create or replace function public.tickets_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.profiles; n int; pre text; nn bigint;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  if public.is_staff() then raise exception 'Akun tim NEXORA tidak bisa membuka ticket sebagai customer.'; end if;
  select * into p from public.profiles where id = auth.uid();
  if p.id is null then raise exception 'Profil tidak ditemukan. Coba login ulang.'; end if;
  if coalesce(p.whatsapp, '') = '' then
    raise exception 'Isi nomor WhatsApp di menu Profil sebelum membuka ticket.';
  end if;
  select count(*) into n from public.tickets
    where customer_id = auth.uid() and not closed and st <> 'Orderan Selesai';
  if n >= 1 then raise exception 'Kamu masih punya 1 ticket aktif. Lanjutkan chat di ticket itu, atau tunggu sampai selesai untuk membuka ticket baru.'; end if;
  if new.kat = 'Order baru' then pre := 'O'; nn := nextval('public.ticket_seq_o');
  elsif new.kat = 'Bantuan' then pre := 'B'; nn := nextval('public.ticket_seq_b');
  elsif new.kat = 'Lainnya' then pre := 'L'; nn := nextval('public.ticket_seq_l');
  else pre := 'P'; nn := nextval('public.ticket_seq_p'); end if;
  new.id := pre || '-' || lpad(nn::text, 4, '0');
  new.customer_id := auth.uid();
  new.cust_nama := p.nama; new.cust_discord := p.discord_username; new.cust_wa := p.whatsapp;
  new.cust_avatar := coalesce(p.foto_url, p.avatar_url);
  new.st := 'Menunggu admin balas'; new.closed := false; new.closed_at := null; new.closed_by := null;
  new.dibuat := now(); new.diubah := now();
  return new;
end $$;
drop trigger if exists tickets_bi on public.tickets;
create trigger tickets_bi before insert on public.tickets for each row execute function public.tickets_bi();
