# Setup Supabase - Tahap 1 (login Google/Discord, profil, role staf)

Tahap ini menyambungkan **login, profil, dan role staf** ke Supabase. Ticket, tagihan, ulasan, harga, dan data lain
**masih mode demo** (tersimpan di browser) sampai tahap 2-4. Jadi pakai ini untuk uji coba dulu, jangan buka untuk
customer sungguhan sebelum tahap berikutnya selesai.

> Nama menu di Supabase/Google/Discord bisa sedikit berbeda dari tulisan di bawah. Cari yang paling mirip.

## 0. Siapkan branch (supaya web yang live tidak terganggu)
```bash
git add -A && git commit -m "titik aman sebelum backend"
git checkout -b backend
```
Salin file dari paket ini ke proyek (timpa yang lama), lalu `git push -u origin backend`.
Cloudflare Pages biasanya membuat alamat preview untuk branch ini (lihat tab Deployments).

## 1. Buat project Supabase
1. Daftar di supabase.com, **New project**, region **Singapore**, simpan password database.
2. Buka **Project Settings > API**. Catat **Project URL** dan kunci **anon public**.
3. Isi `assets/js/config.js`:
   ```js
   window.NX_CONFIG = { supabaseUrl: "https://XXXX.supabase.co", supabaseAnonKey: "kunci-anon-public" };
   ```
   Kunci **anon** memang boleh ada di repo. **Jangan pernah** memasukkan kunci `service_role`.

## 2. Jalankan SQL
Di **SQL Editor** jalankan berurutan:
1. isi `supabase/001_fondasi.sql` (Run). Pesan sukses saja, tanpa error.
2. buka `supabase/002_daftarkan_founder.sql`, **ganti nama dan email** dengan akun Google yang kamu pakai login
   (huruf kecil semua, persis sama), lalu Run.

## 3. Aktifkan login Google dan Discord
Di **Authentication > Sign In / Providers**:
- Matikan provider **Email** (kita hanya pakai Google dan Discord).
- Nyalakan opsi **manual linking** (menghubungkan akun lain dari profil).
- Catat **Callback URL** milik Supabase: `https://XXXX.supabase.co/auth/v1/callback`.

**Google:** Google Cloud Console > project baru > APIs & Services > OAuth consent screen (External, isi nama dan email)
> Credentials > Create OAuth client ID > Web application. Di *Authorized redirect URIs* tempel Callback URL tadi.
Salin **Client ID** dan **Client Secret** ke Supabase > Providers > Google.

**Discord:** discord.com/developers/applications > New Application > OAuth2. Di *Redirects* tempel Callback URL tadi.
Salin **Client ID** dan **Client Secret** ke Supabase > Providers > Discord.

## 4. Daftarkan alamat situs
Di **Authentication > URL Configuration**:
- **Site URL:** `https://nexoraminecraft.my.id`
- **Redirect URLs** (tambahkan semuanya, ganti domain pages.dev sesuai milikmu):
  - `https://nexoraminecraft.my.id/dashboard`
  - `https://nexoraminecraft.my.id/nexora-admin`
  - `https://NAMA-PROJECT.pages.dev/dashboard`
  - `https://NAMA-PROJECT.pages.dev/nexora-admin`
  - alamat preview branch `backend`, juga dengan `/dashboard` dan `/nexora-admin` (kalau mau diuji di sana)
  - Alamat lama (`/akun/dashboard.html`, `/admin/nexora-admin.html`) boleh dihapus dari daftar setelah deploy ini.

## 5. Tes (centang satu per satu)
- [ ] Buka `/masuk`, klik Google: kembali ke dashboard customer, nama terisi.
- [ ] Profil: isi username Discord dan WhatsApp (`0812...` otomatis jadi `62812...`), simpan, muat ulang halaman: tetap ada.
- [ ] Profil > akun terhubung: hubungkan Discord (atau Google). Setelah kembali, statusnya "terhubung".
- [ ] Buka `/nexora-admin-access` dengan akun Founder: masuk dashboard admin dengan role Founder.
- [ ] Login halaman admin dengan akun lain (bukan staf): ditolak dengan pesan "tidak terdaftar sebagai tim".
- [ ] Menu Tim & role: tambah anggota (email Google **atau** ID Discord), ubah role, hapus.
- [ ] Anggota baru login lewat halaman admin: masuk sesuai rolenya. Teknisi tidak melihat menu Tim & role.
- [ ] Tombol Logout membuat kembali ke halaman login.

ID Discord: Discord > Pengaturan > Lanjutan > aktifkan **Developer Mode**, lalu klik kanan profil > **Salin ID Pengguna**.

## Aturan keamanan yang sudah dipasang di database
- Customer hanya bisa membaca dan mengubah profilnya sendiri (hanya kolom nama, username Discord, WhatsApp).
- Staf boleh melihat profil customer (untuk menghubungi). Customer lain tidak bisa.
- Hanya Founder yang bisa menambah, mengubah role, dan menghapus staf. Baris Founder tidak bisa diubah lewat web.
- Staf Google dicocokkan lewat email yang sudah terverifikasi. Staf Discord lewat **ID** Discord (email Discord tidak dipercaya).
- PIN admin dan penguncian login yang lama sudah dihapus.

## Kalau ada masalah
| Gejala | Kemungkinan penyebab |
|---|---|
| Setelah login Google malah error `redirect_uri_mismatch` | Callback URL Supabase belum ada di *Authorized redirect URIs* Google/Discord |
| Kembali ke halaman login tanpa pesan | Alamat dashboard belum ada di *Redirect URLs* Supabase |
| "Akun ini tidak terdaftar sebagai tim" padahal Founder | Email di `002` tidak sama persis dengan akun Google, atau SQL 001/002 belum dijalankan |
| "Gagal memeriksa akses: ... claim_staff" | `001_fondasi.sql` belum dijalankan atau ada error saat menjalankan |
| Profil gagal disimpan | Format WhatsApp/Discord salah (pesan error muncul di notifikasi) |
| Tombol hubungkan akun error | Opsi manual linking belum dinyalakan |
| Tampilan masih demo | `config.js` masih kosong atau skrip Supabase belum termuat |
| Kembali ke halaman login dengan pesan "Login belum berhasil: ..." | Alasan asli ditampilkan di kotak merah. "code verifier" berarti login dimulai dan selesai di alamat yang berbeda (www vs tanpa www, localhost vs 127.0.0.1). Selain itu cek Site URL dan Redirect URLs di Supabase |
