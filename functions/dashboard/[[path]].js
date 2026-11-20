// Semua alamat /dashboard/... (ticket, invoice, profile, dst) menyajikan halaman dashboard.html
// TANPA mengubah URL di browser, supaya refresh tetap di menu yang sama. Menu dibaca oleh assets/js/dash.js.
export const onRequest = ({ request, env }) =>
  env.ASSETS.fetch(new URL("/dashboard", request.url));
