-- =====================================================================
-- Daftarkan Founder pertama. Jalankan SEKALI di SQL Editor, setelah 001.
-- 1) Ganti nama dan email di bawah dengan akun Google yang kamu pakai login.
--    Email harus SAMA PERSIS dengan akun Google-mu (huruf kecil semua).
-- 2) Klik Run.
-- Founder tidak bisa diubah/dihapus lewat web, hanya lewat SQL Editor.
-- =====================================================================
insert into public.staff (nama, email, role)
values ('GANTI NAMA FOUNDER', 'ganti-dengan-email-google@gmail.com', 'Founder');

-- Contoh menambah Co-Founder yang login lewat Discord (opsional, bisa juga dari menu "Tim & role"):
-- insert into public.staff (nama, discord_id, role) values ('Nama Teman', '123456789012345678', 'Co-Founder');
