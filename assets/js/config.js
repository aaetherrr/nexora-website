/* Isi setelah project Supabase dibuat (lihat SETUP_SUPABASE.md).
   Kunci "anon" memang publik dan aman ada di sini: keamanan data dijaga aturan RLS di database.
   JANGAN PERNAH menaruh kunci "service_role" di file ini atau di repo.
   Kosongkan kedua nilai = situs berjalan dalam mode demo (data di browser). */
window.NX_CONFIG = {
  supabaseUrl: "https://kwhrwwiqhigzvxyuesxn.supabase.co",
supabaseAnonKey: "sb_publishable_4LwGJibUw0CTW8z_UwYuDg__uVPgsK5",
  sessionDays: 1   // masa login (hari). Lewat itu akun otomatis di-logout dan harus login lagi (akun TIDAK dihapus).
};
