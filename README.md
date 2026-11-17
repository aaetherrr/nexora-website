# NEXORA

```
index.html                 beranda
pages/                     halaman publik
  harga-hosting.html
  faq.html
  kontak.html              Hubungi kami (isi diatur dari dashboard admin > Kontak)
  terms.html
  privacy.html
akun/                      area customer
  masuk.html               login dan daftar
  dashboard.html           dashboard customer
admin/                     area admin
  nexora-admin-access.html login admin
  nexora-admin.html        dashboard admin
assets/
  css/  style.css, dash.css
  js/   script.js, dash.js
  img/  logo.png, plugin/, paket/
```

Semua link antar-file memakai path relatif, jadi folder ini bisa dibuka dari mana saja
(file langsung, live server, atau hosting). Kalau menambah halaman baru di `pages/`,
pakai pola yang sama dengan `pages/faq.html`: `../assets/...` untuk css/js/gambar dan
`../index.html` untuk link ke beranda.

## Catatan update 16 Nov 2026
- Dashboard admin > "Nama situs": nama situs diatur dari dashboard. Logo = ganti file `assets/img/logo.png`; warna aksen = edit `assets/css/style.css`; teks halaman utama = edit `index.html`.
- Akun yang terdaftar sebagai tim (Founder / Co-Founder / Teknisi) tidak bisa masuk panel customer.
- Masa login dibatasi `sessionDays` di `assets/js/config.js` (bawaan 7 hari). Lewat itu otomatis logout dan harus login ulang; akun tidak dihapus.
