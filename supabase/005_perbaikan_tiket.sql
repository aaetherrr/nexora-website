-- =====================================================================
-- NEXORA - Perbaikan tahap 2 (jalankan SEKALI di SQL Editor setelah 003). Aman diulang.
--  1) Akun customer yang sudah pernah buka ticket bisa dihapus (riwayat tetap ada)
--  2) Nomor ticket per kategori: O-0001 (Order), B-0001 (Bantuan), L-0001 (Lainnya), P-0001 (Pembayaran)
--  3) Founder bisa mengganti nama anggota tim dan namanya sendiri
-- =====================================================================

-- ---------- 1) PERBAIKAN HAPUS AKUN ----------
-- Penyebab lama: trigger memaksa customer_id tetap terisi, sehingga penghapusan akun (customer_id jadi NULL) ditolak.
-- Sekarang aturan hanya berlaku untuk permintaan dari web (role authenticated/anon).
create or replace function public.tickets_bu() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user not in ('authenticated', 'anon') then return new; end if;
  if old.customer_id is not null and new.customer_id is null then return new; end if;
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

-- ---------- 2) NOMOR TICKET PER KATEGORI ----------
create sequence if not exists public.ticket_seq_o start 1;
create sequence if not exists public.ticket_seq_b start 1;
create sequence if not exists public.ticket_seq_l start 1;
create sequence if not exists public.ticket_seq_p start 1;

create or replace function public.tickets_bi() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.profiles; n int; pre text; nn bigint;
begin
  if auth.uid() is null then raise exception 'Kamu harus login dulu.'; end if;
  select * into p from public.profiles where id = auth.uid();
  if p.id is null then raise exception 'Profil tidak ditemukan. Coba login ulang.'; end if;
  if coalesce(p.whatsapp, '') = '' or coalesce(p.discord_username, '') = '' then
    raise exception 'Lengkapi username Discord dan nomor WhatsApp di menu Profil sebelum membuka ticket.';
  end if;
  select count(*) into n from public.tickets where customer_id = auth.uid() and not closed;
  if n >= 3 then raise exception 'Batas 3 ticket aktif tercapai. Tunggu salah satu ticket ditutup admin.'; end if;
  if new.kat = 'Order baru' then pre := 'O'; nn := nextval('public.ticket_seq_o');
  elsif new.kat = 'Bantuan' then pre := 'B'; nn := nextval('public.ticket_seq_b');
  elsif new.kat = 'Lainnya' then pre := 'L'; nn := nextval('public.ticket_seq_l');
  else pre := 'P'; nn := nextval('public.ticket_seq_p'); end if;
  new.id := pre || '-' || lpad(nn::text, 4, '0');
  new.customer_id := auth.uid();
  new.cust_nama := p.nama; new.cust_discord := p.discord_username; new.cust_wa := p.whatsapp;
  new.st := 'Menunggu admin balas'; new.closed := false; new.closed_at := null; new.closed_by := null;
  new.dibuat := now(); new.diubah := now();
  return new;
end $$;
drop trigger if exists tickets_bi on public.tickets;
create trigger tickets_bi before insert on public.tickets for each row execute function public.tickets_bi();

-- Reset nomor ke 0001. HANYA bisa dijalankan dari SQL Editor dan hanya kalau tidak ada ticket sama sekali.
-- Cara pakai: (1) hapus semua ticket uji coba:  delete from public.tickets;   (2) jalankan:  select public.reset_nomor_ticket();
create or replace function public.reset_nomor_ticket() returns text
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.tickets) then
    raise exception 'Masih ada ticket. Jalankan dulu: delete from public.tickets;  (ini menghapus SEMUA ticket dan chat)';
  end if;
  alter sequence public.ticket_seq_o restart with 1;
  alter sequence public.ticket_seq_b restart with 1;
  alter sequence public.ticket_seq_l restart with 1;
  alter sequence public.ticket_seq_p restart with 1;
  return 'Nomor ticket di-reset: O-0001, B-0001, L-0001, P-0001';
end $$;
revoke all on function public.reset_nomor_ticket() from public, anon, authenticated;

-- ---------- 3) FOUNDER MENGGANTI NAMA ANGGOTA ----------
drop policy if exists "staf_ubah" on public.staff;
create policy "staf_ubah" on public.staff for update to authenticated
  using (public.is_founder()) with check (public.is_founder());

create or replace function public.staff_bu() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user not in ('authenticated', 'anon') then return new; end if;
  new.id := old.id; new.email := old.email; new.discord_id := old.discord_id; new.dibuat := old.dibuat; new.user_id := old.user_id;
  if old.role = 'Founder' then new.role := 'Founder';
  elsif new.role = 'Founder' then raise exception 'Role Founder hanya bisa diatur lewat SQL Editor.'; end if;
  new.nama := left(btrim(new.nama), 40);
  if new.nama = '' then raise exception 'Nama tidak boleh kosong.'; end if;
  return new;
end $$;
drop trigger if exists staff_bu on public.staff;
create trigger staff_bu before update on public.staff for each row execute function public.staff_bu();

-- ---------- CARA PINDAH AKUN FOUNDER (ganti email Google) - jalankan manual di SQL Editor ----------
-- Cara AMAN (disarankan): tambahkan Founder baru dulu, login dan tes, baru hapus yang lama.
--   insert into public.staff (nama, email, role) values ('Nama Kamu', 'emailbaru@gmail.com', 'Founder');
--   -- login ke halaman admin dengan email baru; kalau sudah masuk sebagai Founder, hapus yang lama:
--   delete from public.staff where email = 'emaillama@gmail.com';
-- Cara cepat (tanpa cadangan; kalau email baru gagal login, perlu diperbaiki lewat SQL lagi):
--   update public.staff set email = 'emailbaru@gmail.com', user_id = null where role = 'Founder' and email = 'emaillama@gmail.com';
-- Email harus huruf kecil semua dan sama persis dengan akun Google yang dipakai login.
