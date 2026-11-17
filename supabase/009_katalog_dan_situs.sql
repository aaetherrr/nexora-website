-- =====================================================================
-- NEXORA - Tahap 3 (bagian 1): katalog jasa & hosting, pengaturan situs, penyimpanan gambar
-- Jalankan SEKALI di Supabase > SQL Editor (setelah 001 sampai 008). Aman diulang.
--
-- Isi:
--   1. catalog_jasa & catalog_paket : daftar jasa setup dan paket (jasa + hosting)
--   2. site_settings                : tampilan, kontak, sosmed, rekening pembayaran
--   3. Bucket Storage "situs"       : logo dan foto paket (publik dibaca, hanya Founder/Co-Founder menulis)
--   4. public_site()                : satu panggilan untuk halaman publik (tanpa login)
--   5. Data awal                    : sama persis dengan daftar harga yang tampil sekarang
--
-- Hak akses: semua orang membaca katalog lewat public_site(); hanya Founder dan Co-Founder yang
-- boleh mengubah katalog, pengaturan, dan file gambar. Teknisi tidak.
-- CATATAN: pengulangan regex di PostgreSQL maksimal {m,255}, jadi panjang dibatasi dengan char_length.
-- =====================================================================

create or replace function public.can_edit_site()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role in ('Founder', 'Co-Founder'))
$$;
revoke all on function public.can_edit_site() from public, anon;
grant execute on function public.can_edit_site() to authenticated;

create or replace function public.touch_diubah()
returns trigger language plpgsql as $$
begin new.diubah := now(); return new; end $$;

-- ---------- 1. Katalog ----------
create table if not exists public.catalog_jasa (
  id      text primary key,
  nama    text not null,
  ikon    text not null default 'tag',
  urutan  int  not null default 0,
  dibuat  timestamptz not null default now(),
  diubah  timestamptz not null default now(),
  constraint jasa_id_fmt   check (char_length(id) between 1 and 40 and id ~ '^[a-z0-9_-]+$'),
  constraint jasa_nama_len check (char_length(nama) between 1 and 40),
  constraint jasa_ikon_fmt check (char_length(ikon) between 1 and 40 and ikon ~ '^[a-z0-9-]+$')
);

create table if not exists public.catalog_paket (
  id       uuid primary key default gen_random_uuid(),
  tipe     text not null check (tipe in ('jasa', 'hosting')),
  jasa_id  text references public.catalog_jasa(id) on delete cascade,
  nama     text not null,
  kategori text not null,
  harga    bigint not null,
  ringkas  text not null default '',
  fitur    jsonb  not null default '[]'::jsonb,
  foto_url text,
  populer  boolean not null default false,
  urutan   int not null default 0,
  dibuat   timestamptz not null default now(),
  diubah   timestamptz not null default now(),
  constraint paket_tipe_jasa  check ((tipe = 'jasa' and jasa_id is not null) or (tipe = 'hosting' and jasa_id is null)),
  constraint paket_nama_len   check (char_length(nama) between 1 and 80),
  constraint paket_kat_len    check (char_length(kategori) between 1 and 40),
  constraint paket_harga_rng  check (harga >= 0 and harga <= 1000000000),
  constraint paket_ringkas_len check (char_length(ringkas) <= 300),
  constraint paket_fitur_fmt  check (jsonb_typeof(fitur) = 'array' and jsonb_array_length(fitur) <= 30 and char_length(fitur::text) <= 4000),
  constraint paket_foto_fmt   check (foto_url is null or (char_length(foto_url) <= 500 and foto_url ~ '^https://[^[:space:]]+$'))
);
create index if not exists catalog_paket_urut on public.catalog_paket (tipe, jasa_id, urutan);

drop trigger if exists catalog_jasa_diubah  on public.catalog_jasa;
create trigger catalog_jasa_diubah  before update on public.catalog_jasa  for each row execute function public.touch_diubah();
drop trigger if exists catalog_paket_diubah on public.catalog_paket;
create trigger catalog_paket_diubah before update on public.catalog_paket for each row execute function public.touch_diubah();

alter table public.catalog_jasa  enable row level security;
alter table public.catalog_paket enable row level security;
revoke all on public.catalog_jasa, public.catalog_paket from anon, authenticated;
grant select on public.catalog_jasa, public.catalog_paket to authenticated;
grant insert, update, delete on public.catalog_jasa, public.catalog_paket to authenticated;

drop policy if exists jasa_baca  on public.catalog_jasa;
drop policy if exists jasa_tulis on public.catalog_jasa;
drop policy if exists jasa_ubah  on public.catalog_jasa;
drop policy if exists jasa_hapus on public.catalog_jasa;
create policy jasa_baca  on public.catalog_jasa for select to authenticated using (true);
create policy jasa_tulis on public.catalog_jasa for insert to authenticated with check (public.can_edit_site());
create policy jasa_ubah  on public.catalog_jasa for update to authenticated using (public.can_edit_site()) with check (public.can_edit_site());
create policy jasa_hapus on public.catalog_jasa for delete to authenticated using (public.can_edit_site());

drop policy if exists paket_baca  on public.catalog_paket;
drop policy if exists paket_tulis on public.catalog_paket;
drop policy if exists paket_ubah  on public.catalog_paket;
drop policy if exists paket_hapus on public.catalog_paket;
create policy paket_baca  on public.catalog_paket for select to authenticated using (true);
create policy paket_tulis on public.catalog_paket for insert to authenticated with check (public.can_edit_site());
create policy paket_ubah  on public.catalog_paket for update to authenticated using (public.can_edit_site()) with check (public.can_edit_site());
create policy paket_hapus on public.catalog_paket for delete to authenticated using (public.can_edit_site());

-- ---------- 2. Pengaturan situs ----------
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  diubah      timestamptz not null default now(),
  diubah_oleh uuid references auth.users(id) on delete set null,
  constraint set_key_ok  check (key in ('tampilan', 'kontak', 'sosmed', 'bayar', 'qr')),
  constraint set_val_len check (char_length(value::text) <= 20000)
);
create or replace function public.set_diubah_oleh()
returns trigger language plpgsql as $$
begin new.diubah := now(); new.diubah_oleh := auth.uid(); return new; end $$;
drop trigger if exists site_settings_diubah on public.site_settings;
create trigger site_settings_diubah before insert or update on public.site_settings for each row execute function public.set_diubah_oleh();

alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to authenticated;
grant insert, update, delete on public.site_settings to authenticated;
drop policy if exists set_baca  on public.site_settings;
drop policy if exists set_tulis on public.site_settings;
drop policy if exists set_ubah  on public.site_settings;
drop policy if exists set_hapus on public.site_settings;
create policy set_baca  on public.site_settings for select to authenticated using (true);
create policy set_tulis on public.site_settings for insert to authenticated with check (public.can_edit_site());
create policy set_ubah  on public.site_settings for update to authenticated using (public.can_edit_site()) with check (public.can_edit_site());
create policy set_hapus on public.site_settings for delete to authenticated using (public.can_edit_site());

-- ---------- 3. Storage: bucket "situs" (logo dan foto paket) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('situs', 'situs', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

drop policy if exists situs_lihat on storage.objects;
drop policy if exists situs_tulis on storage.objects;
drop policy if exists situs_ubah  on storage.objects;
drop policy if exists situs_hapus on storage.objects;
create policy situs_lihat on storage.objects for select to authenticated using (bucket_id = 'situs');
create policy situs_tulis on storage.objects for insert to authenticated with check (bucket_id = 'situs' and public.can_edit_site());
create policy situs_ubah  on storage.objects for update to authenticated using (bucket_id = 'situs' and public.can_edit_site()) with check (bucket_id = 'situs' and public.can_edit_site());
create policy situs_hapus on storage.objects for delete to authenticated using (bucket_id = 'situs' and public.can_edit_site());

-- ---------- 4. Data untuk halaman publik (tanpa login), satu panggilan ----------
create or replace function public.public_site()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'jasa',  coalesce((select jsonb_agg(jsonb_build_object('id', id, 'nama', nama, 'ikon', ikon) order by urutan, dibuat) from public.catalog_jasa), '[]'::jsonb),
    'paket', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'tipe', tipe, 'jasa', jasa_id, 'nama', nama, 'kat', kategori, 'harga', harga,
                                                          'ringkas', ringkas, 'fitur', fitur, 'foto', foto_url, 'populer', populer) order by urutan, dibuat) from public.catalog_paket), '[]'::jsonb),
    'set',   coalesce((select jsonb_object_agg(key, value) from public.site_settings where key in ('tampilan', 'kontak', 'sosmed', 'qr')), '{}'::jsonb)
  )
$$;
revoke all on function public.public_site() from public;
grant execute on function public.public_site() to anon, authenticated;

-- ---------- 5. Data awal ----------
-- Data awal: sama persis dengan daftar harga yang selama ini tampil di situs.
do $seed$
begin
  if not exists (select 1 from public.catalog_jasa) and not exists (select 1 from public.catalog_paket) then
    insert into public.catalog_jasa (id, nama, ikon, urutan) values
  ('minecraft', 'Setup Minecraft', 'box2', 0),
  ('discord', 'Setup Discord', 'discord', 1);
    insert into public.catalog_paket (tipe, jasa_id, nama, kategori, harga, ringkas, fitur, populer, urutan) values
  ('jasa', 'minecraft', 'Vanilla Starter', 'JAVA VERSION', 40000, 'Server dasar untuk main bareng teman.', '["Server vanilla Java","Whitelist & operator","Pengaturan dasar"]'::jsonb, false, 0),
  ('jasa', 'discord', 'Rapi Dasar', 'Dasar', 20000, 'Channel dan role dasar.', '["Channel & kategori","Role dasar","Aturan server"]'::jsonb, false, 0),
  ('jasa', 'discord', 'Server Gaming', 'Dasar', 35000, 'Struktur khusus komunitas game.', '["Channel suara & teks","Role per game","Aturan server"]'::jsonb, false, 1),
  ('jasa', 'discord', 'Welcome & Verifikasi', 'Bot', 40000, 'Sambutan dan verifikasi member baru.', '["Pesan sambutan","Verifikasi member","Role otomatis"]'::jsonb, false, 2),
  ('hosting', null, 'Pulse', 'Basic', 19000, 'Untuk mulai dengan resource ringan.', '["CPU 100%","RAM 1 GB","Storage 8 GB","1 MySQL Database","1 Automatic Backup"]'::jsonb, false, 0),
  ('hosting', null, 'Orbit', 'Basic', 36000, 'Pilihan pas untuk server kecil.', '["CPU 100%","RAM 2 GB","Storage 8 GB","1 MySQL Database","1 Automatic Backup"]'::jsonb, true, 1),
  ('hosting', null, 'Nova', 'Basic', 70000, 'Ruang lebih untuk komunitas kecil.', '["CPU 150%","RAM 4 GB","Storage 20 GB","1 MySQL Database","1 Automatic Backup"]'::jsonb, false, 2),
  ('hosting', null, 'Quasar', 'Basic', 104000, 'Untuk yang mulai ramai.', '["CPU 200%","RAM 6 GB","Storage 24 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 3),
  ('hosting', null, 'Nebula', 'Basic', 138000, 'Resource lega untuk komunitas aktif.', '["CPU 250%","RAM 8 GB","Storage 32 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 4),
  ('hosting', null, 'Astra', 'Basic', 172000, 'Untuk komunitas yang terus tumbuh.', '["CPU 300%","RAM 10 GB","Storage 32 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 5),
  ('hosting', null, 'Zenith', 'Basic', 207000, 'Ruang besar untuk komunitas ramai.', '["CPU 350%","RAM 12 GB","Storage 40 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 6),
  ('hosting', null, 'Cosmos', 'Basic', 275000, 'Untuk kebutuhan skala besar.', '["CPU 400%","RAM 16 GB","Storage 64 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 7),
  ('hosting', null, 'Eclipse', 'Basic', 412000, 'Resource besar untuk server ramai.', '["CPU 450%","RAM 24 GB","Storage 80 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 8),
  ('hosting', null, 'Infinity', 'Basic', 549000, 'Resource tertinggi di Basic.', '["CPU 500%","RAM 32 GB","Storage 96 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 9),
  ('hosting', null, 'Aurora', 'Premium', 24999, 'Awal yang nyaman di Premium.', '["CPU 150%","RAM 1 GB","Storage 10 GB","1 MySQL Database","1 Automatic Backup"]'::jsonb, false, 10),
  ('hosting', null, 'Vega', 'Premium', 48000, 'CPU lebih tinggi untuk server kecil.', '["CPU 200%","RAM 2 GB","Storage 10 GB","1 MySQL Database","1 Automatic Backup"]'::jsonb, false, 11),
  ('hosting', null, 'Sirius', 'Premium', 94000, 'Seimbang dengan backup lebih banyak.', '["CPU 250%","RAM 4 GB","Storage 24 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, false, 12),
  ('hosting', null, 'Polaris', 'Premium', 140000, 'Untuk komunitas yang mulai ramai.', '["CPU 300%","RAM 6 GB","Storage 28 GB","1 MySQL Database","2 Automatic Backups"]'::jsonb, true, 13),
  ('hosting', null, 'Arcturus', 'Premium', 186000, 'Ruang lega dengan 3 backup.', '["CPU 350%","RAM 8 GB","Storage 36 GB","1 MySQL Database","3 Automatic Backups"]'::jsonb, false, 14),
  ('hosting', null, 'Draco', 'Premium', 233000, 'Untuk komunitas yang terus tumbuh.', '["CPU 400%","RAM 10 GB","Storage 40 GB","1 MySQL Database","3 Automatic Backups"]'::jsonb, false, 15),
  ('hosting', null, 'Andromeda', 'Premium', 279000, 'Ruang besar untuk komunitas ramai.', '["CPU 450%","RAM 12 GB","Storage 48 GB","1 MySQL Database","3 Automatic Backups"]'::jsonb, false, 16),
  ('hosting', null, 'Celestia', 'Premium', 372000, 'Untuk kebutuhan skala besar.', '["CPU 500%","RAM 16 GB","Storage 72 GB","1 MySQL Database","3 Automatic Backups"]'::jsonb, false, 17),
  ('hosting', null, 'Stellaris', 'Premium', 558000, 'Resource besar untuk skala besar.', '["CPU 600%","RAM 24 GB","Storage 96 GB","1 MySQL Database","3 Automatic Backups"]'::jsonb, false, 18),
  ('hosting', null, 'Empyrean', 'Premium', 744000, 'Resource tertinggi di Premium.', '["CPU 700%","RAM 32 GB","Storage 112 GB","1 MySQL Database","3 Automatic Backups"]'::jsonb, false, 19);
  end if;
end
$seed$;

-- Selesai. Cek: select count(*) from public.catalog_paket;  -- harus 24
