/* Isi setelah project Supabase dibuat (lihat SETUP_SUPABASE.md).
   Kunci "anon" memang publik dan aman ada di sini: keamanan data dijaga aturan RLS di database.
   JANGAN PERNAH menaruh kunci "service_role" di file ini atau di repo.
   Kosongkan kedua nilai = situs berjalan dalam mode demo (data di browser). */
window.NX_CONFIG = {
  supabaseUrl: "",      // contoh: https://abcdxyz.supabase.co
  supabaseAnonKey: "",   // kunci "anon public" dari Project Settings > API
  sessionDays: 3   // masa login (hari). Lewat itu akun otomatis di-logout dan harus login lagi (akun TIDAK dihapus).
};
