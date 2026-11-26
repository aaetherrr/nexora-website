-- ============================================================
-- 019 - Nama customer di ticket ikut berubah kalau nama tampilan diganti
--
-- Masalah: nama customer di tabel tickets (kolom cust_nama) hanya salinan saat
-- ticket dibuat, jadi kalau customer mengganti Nama tampilan di halaman Akun,
-- nama di ticket (yang dilihat admin) tetap nama lama.
--
-- Perbaikan: sama seperti foto profil (017), tiap nama di profil berubah,
-- semua ticket milik customer itu ikut diperbarui. Berjalan sebagai pemilik
-- database, jadi tidak terhalang aturan "ticket tidak bisa diubah" milik tickets_bu.
-- Cara pakai: jalankan seluruh isi file ini sekali di Supabase > SQL Editor.
-- ============================================================

create or replace function public.profiles_au_nama() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.nama is distinct from old.nama and coalesce(btrim(new.nama), '') <> '' then
    update public.tickets set cust_nama = btrim(new.nama) where customer_id = new.id;
  end if;
  return null;
end $$;
drop trigger if exists profiles_au_nama on public.profiles;
create trigger profiles_au_nama after update on public.profiles for each row execute function public.profiles_au_nama();

-- Rapikan ticket lama yang namanya sudah terlanjur beda dengan nama di profil
update public.tickets t
   set cust_nama = btrim(p.nama)
  from public.profiles p
 where t.customer_id = p.id
   and coalesce(btrim(p.nama), '') <> ''
   and t.cust_nama is distinct from btrim(p.nama);
