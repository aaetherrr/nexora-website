# NEXORA

```
index.html                 beranda
pages/                     halaman publik
  harga-hosting.html
  faq.html
  kontak.html              Hubungi kami (isi diatur dari dashboard admin > Kontak)
  terms.html
  privacy.html
masuk.html                 login dan daftar              -> /masuk
dashboard.html             dashboard customer            -> /dashboard
nexora-admin-access.html   login admin                   -> /nexora-admin-access
nexora-admin.html          dashboard admin               -> /nexora-admin
_redirects                 aturan Cloudflare Pages (alamat lama -> baru, rute menu dashboard)
assets/
  css/  style.css, dash.css
  js/   script.js, dash.js
  img/  logo.png, plugin/, paket/
```

Halaman publik memakai path relatif. Halaman akun/admin (`masuk`, `dashboard`, `nexora-admin`,
`nexora-admin-access`) memakai alamat absolut (`/assets/...`, `/dashboard`) karena menu dashboard punya
alamat sendiri (`/dashboard/ticket`, `/dashboard/ticket/T-1043`, `/nexora-admin/tagihan`). Alamat itu hanya
berfungsi di Cloudflare Pages (lewat `_redirects`) atau `npx wrangler pages dev .`, bukan di file langsung/Live Server.
Kalau menambah halaman baru di `pages/`,
pakai pola yang sama dengan `pages/faq.html`: `../assets/...` untuk css/js/gambar dan
`../index.html` untuk link ke beranda.

## Catatan update 16 Nov 2026
- Dashboard admin > "Nama situs": nama situs diatur dari dashboard. Logo = ganti file `assets/img/logo.png`; warna aksen = edit `assets/css/style.css`; teks halaman utama = edit `index.html`.
- Akun yang terdaftar sebagai tim (Founder / Co-Founder / Teknisi) tidak bisa masuk panel customer.
- Masa login dibatasi `sessionDays` di `assets/js/config.js` (bawaan 7 hari). Lewat itu otomatis logout dan harus login ulang; akun tidak dihapus.
