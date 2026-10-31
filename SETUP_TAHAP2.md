# Setup Supabase - Tahap 2 (ticket, chat real time, notifikasi Discord)

Sudah beres sebelum ini: tahap 1 (login, profil, role staf). Tahap ini memindahkan **ticket dan chat** ke database,
membuat chat berjalan real time, dan mengirim notifikasi ke channel Discord admin.
Yang masih demo (tersimpan di browser): tagihan, pembayaran, ulasan, lonceng notifikasi, audit, harga, tampilan, kontak.

## 1. Jalankan SQL ticket
SQL Editor > New query > tempel isi `supabase/003_tiket.sql` > Run. Hasil yang benar: "Success", tanpa merah.
Aman dijalankan ulang kalau ada yang gagal di tengah.

## 2. Siapkan notifikasi Discord
1. Di Discord buat channel khusus admin (misalnya `#notif-ticket`).
2. Pengaturan channel > Integrations > Webhooks > New Webhook > pilih channel itu > **Copy Webhook URL**.
3. Di SQL Editor buka query baru, tempel isi `supabase/004_webhook_discord.sql`, **ganti** `GANTI_DENGAN_URL_WEBHOOK_DISCORD`
   dengan URL tadi (dan alamat situs kalau berbeda), lalu Run.
4. **Jangan** menyimpan/commit file itu setelah diisi URL asli. URL webhook = kunci channel; siapa pun yang memilikinya bisa mengirim pesan.
5. Cek: `select name from vault.secrets;` harus menampilkan `discord_webhook` dan `site_url`.

Notifikasi dikirim hanya untuk **ticket baru** dan **pesan customer pertama setelah admin membalas**.

## 3. Pasang kodenya
- Ekstrak paket ke proyek (timpa), commit, push. `auth.js` dan `dash.js` sudah memakai nomor versi baru (`?v=20261029a`).
- Isi lagi `assets/js/config.js` (URL project dan publishable key) supaya mode Supabase aktif.
- Setelah deploy: Purge Cache Cloudflare (kalau perlu) dan Ctrl+Shift+R.

## 4. Tes (centang satu per satu)
- [ ] Customer baru **belum** isi Discord/WhatsApp, klik kirim ticket: ditolak dengan pesan melengkapi Profil.
- [ ] Lengkapi Profil, buka ticket baru: muncul di "Ticket saya" dengan nomor `T-1044` dan seterusnya.
- [ ] Cek Table Editor > `tickets` dan `ticket_messages`: datanya ada.
- [ ] Admin (browser/perangkat lain) langsung melihat ticket itu **tanpa refresh** (paling lama sekitar 20 detik kalau Realtime belum aktif).
- [ ] Channel Discord admin menerima pesan "Ticket baru T-...".
- [ ] Admin membalas: customer melihat balasan tanpa refresh.
- [ ] Customer membalas lagi: Discord menerima "Balasan customer". Customer membalas **dua kali berturut-turut**: Discord hanya menerima yang pertama.
- [ ] Buka 3 ticket aktif, coba ticket ke-4: ditolak.
- [ ] Admin menutup ticket (muncul modal konfirmasi): customer dan admin tidak bisa mengirim chat lagi, ticket masuk Riwayat.
- [ ] Tab **Customer** di admin menampilkan customer asli beserta Discord dan WhatsApp-nya.
- [ ] Hapus akun customer di Authentication > Users: ticketnya **tetap** terlihat di admin (nama dan kontak tersimpan).

## Aturan di database (tidak bisa dilewati lewat tampilan)
- Customer hanya melihat ticket dan chat miliknya; staf melihat semua.
- Customer tidak bisa mengubah status/penutupan atau menulis sebagai admin/sistem; nama admin di chat diisi server.
- Ticket yang ditutup tidak bisa dibalas atau diubah lagi. Status "Orderan Selesai" tidak bisa diubah.
- Maksimal 3 ticket aktif per customer; Discord dan WhatsApp wajib terisi sebelum ticket pertama.
- Hanya Founder yang bisa menghapus ticket.

## Kalau ada masalah
| Gejala | Kemungkinan penyebab |
|---|---|
| Toast "Data ticket belum bisa dimuat" | `003_tiket.sql` belum dijalankan atau error saat dijalankan |
| "permission denied for table ..." | Bagian GRANT di akhir `003` belum ikut berjalan; jalankan ulang seluruh file |
| Ticket gagal dibuat dengan pesan Profil | Discord/WhatsApp belum terisi di database (cek tabel `profiles`) |
| Notifikasi Discord tidak masuk | Cek `select name from vault.secrets;`. Lalu `select status_code, content from net._http_response order by created desc limit 5;` untuk melihat jawaban Discord (204 = berhasil) |
| Chat tidak real time | Cek Database > Publications > `supabase_realtime` memuat `tickets` dan `ticket_messages`. Sementara itu halaman memeriksa data tiap 20 detik |
| "Tidak diizinkan..." saat admin mengubah ticket | Akun belum terdaftar sebagai staf, atau ticket sudah ditutup |
