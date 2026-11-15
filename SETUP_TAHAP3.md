# NEXORA - Tahap 3 (bagian 1): katalog dan pengaturan situs di Supabase

Setelah ini, semua yang diubah admin di dashboard (jasa, paket, harga, hosting, logo, nama, warna,
teks halaman utama, kontak, sosmed, QR Discord) tersimpan di database dan langsung tampil di
website untuk semua pengunjung. Sebelumnya hanya tersimpan di browser admin.

## Langkah (sekali saja)
1. Supabase > **SQL Editor** > New query > tempel isi `supabase/009_katalog_dan_situs.sql` > **Run**.
   Harus selesai tanpa error. Cek hasilnya: `select count(*) from public.catalog_paket;` harus **24**
   (data awal sama persis dengan daftar harga yang selama ini tampil).
2. Supabase > **Storage**: harus ada bucket **situs** (Public). Dibuat otomatis oleh 009.
3. Isi `assets/js/config.js` seperti biasa (supabaseUrl dan supabaseAnonKey), lalu upload semua file website.
4. Tes: login sebagai Founder > Jasa setup > ubah harga satu paket > buka halaman utama di jendela
   incognito. Harganya harus sudah berubah.

## Siapa yang boleh mengubah
- **Founder dan Co-Founder**: katalog, pengaturan situs, dan upload gambar.
- **Teknisi**: tidak bisa (ditolak oleh database, bukan hanya disembunyikan di tampilan).
- **Pengunjung tanpa login**: hanya membaca, lewat fungsi `public_site()`. Tidak ada tabel yang terbuka langsung.
- **Customer yang login**: membaca katalog dan pengaturan (untuk form order), tidak bisa mengubah.

## Yang tersimpan di mana
| Data | Tabel / tempat |
|---|---|
| Daftar jasa setup (nama, ikon, urutan) | `catalog_jasa` |
| Paket jasa dan paket hosting (harga, isi, foto, populer) | `catalog_paket` |
| Tampilan, kontak, sosmed, rekening pembayaran, QR | `site_settings` (kunci: tampilan, kontak, sosmed, bayar, qr) |
| Logo, QR Code, foto paket | Storage bucket `situs` (PNG/JPG/WEBP, maks 2 MB) |

Rekening pembayaran (`bayar`) tidak ikut ke halaman publik. Hanya user yang login yang bisa membacanya.

## Perilaku yang perlu diketahui
- Halaman publik menyimpan salinan data terakhir di browser pengunjung, lalu memperbaruinya di latar belakang.
  Jadi perubahan admin biasanya terlihat saat kunjungan berikutnya (atau saat tab dibuka kembali), bukan detik itu juga.
- Kalau database tidak bisa dijangkau, halaman publik memakai daftar harga bawaan di `script.js`.
- Warna aksen: kalau dibiarkan `#6b55b8` (bawaan) tidak ada yang berubah. Warna lain otomatis diterapkan ke
  mode terang dan gelap.
- Tab jasa di halaman utama dibuat dari data: jasa yang ditambah admin otomatis punya tab sendiri.
- Kalau katalog gagal dimuat di dashboard (misalnya 009 belum dijalankan), dashboard menolak menyimpan perubahan
  supaya data asli tidak tertimpa, dan menampilkan pesan yang jelas.
- Mode demo (config.js kosong) tetap jalan: datanya tersimpan di browser dan ikut tampil di halaman publik di browser yang sama.

## Kalau ada masalah
| Gejala | Penyebab / solusi |
|---|---|
| Toast "Katalog belum termuat dari database" | 009 belum dijalankan, atau ada error saat Run. Jalankan ulang 009 lalu muat ulang halaman |
| Toast "Tidak diizinkan..." | Akun bukan Founder/Co-Founder |
| Upload logo/QR/foto gagal | Bucket `situs` belum ada atau file lebih dari 2 MB / bukan PNG, JPG, WEBP |
| Halaman publik masih menampilkan harga lama | Buka ulang tab / muat ulang sekali. Salinan lama di browser diperbarui otomatis |
