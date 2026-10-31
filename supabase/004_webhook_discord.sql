-- =====================================================================
-- Simpan alamat webhook Discord di Supabase Vault (BUKAN di GitHub).
-- 1) Ganti dua nilai di bawah, 2) klik Run di SQL Editor, 3) JANGAN simpan/commit
--    versi yang sudah berisi URL asli ke repo. Cukup jalankan lalu tutup tab-nya.
-- Dijalankan SEKALI. Untuk mengganti nanti, pakai bagian "GANTI" di bawah.
-- =====================================================================
select vault.create_secret('GANTI_DENGAN_URL_WEBHOOK_DISCORD', 'discord_webhook', 'Webhook channel notifikasi ticket');
select vault.create_secret('https://nexoraminecraft.my.id', 'site_url', 'Alamat situs untuk tautan di notifikasi');

-- GANTI webhook yang sudah ada (jalankan ini, bukan yang di atas, kalau secret-nya sudah terbuat):
-- select vault.update_secret((select id from vault.secrets where name = 'discord_webhook'), 'URL_BARU', 'discord_webhook', 'Webhook channel notifikasi ticket');
