/* NEXORA dashboard (DEMO: data di browser, belum terhubung ke Supabase) */
(function () {
  var D = {"jasa":{"minecraft":[{"nama":"Vanilla Starter","kat":"JAVA VERSION","harga":40000,"ringkas":"Server dasar untuk main bareng teman.","fitur":["Server vanilla Java","Whitelist & operator","Pengaturan dasar"]}],"discord":[{"nama":"Rapi Dasar","kat":"Dasar","harga":20000,"ringkas":"Channel dan role dasar.","fitur":["Channel & kategori","Role dasar","Aturan server"]},{"nama":"Server Gaming","kat":"Dasar","harga":35000,"ringkas":"Struktur khusus komunitas game.","fitur":["Channel suara & teks","Role per game","Aturan server"]},{"nama":"Welcome & Verifikasi","kat":"Bot","harga":40000,"ringkas":"Sambutan dan verifikasi member baru.","fitur":["Pesan sambutan","Verifikasi member","Role otomatis"]}]},"hosting":[{"nama":"Pulse","kat":"Basic","harga":19000,"ringkas":"Untuk mulai dengan resource ringan.","fitur":["CPU 100%","RAM 1 GB","Storage 8 GB","1 MySQL Database","1 Automatic Backup"]},{"nama":"Orbit","kat":"Basic","harga":36000,"ringkas":"Pilihan pas untuk server kecil.","fitur":["CPU 100%","RAM 2 GB","Storage 8 GB","1 MySQL Database","1 Automatic Backup"]},{"nama":"Nova","kat":"Basic","harga":70000,"ringkas":"Ruang lebih untuk komunitas kecil.","fitur":["CPU 150%","RAM 4 GB","Storage 20 GB","1 MySQL Database","1 Automatic Backup"]},{"nama":"Quasar","kat":"Basic","harga":104000,"ringkas":"Untuk yang mulai ramai.","fitur":["CPU 200%","RAM 6 GB","Storage 24 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Nebula","kat":"Basic","harga":138000,"ringkas":"Resource lega untuk komunitas aktif.","fitur":["CPU 250%","RAM 8 GB","Storage 32 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Astra","kat":"Basic","harga":172000,"ringkas":"Untuk komunitas yang terus tumbuh.","fitur":["CPU 300%","RAM 10 GB","Storage 32 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Zenith","kat":"Basic","harga":207000,"ringkas":"Ruang besar untuk komunitas ramai.","fitur":["CPU 350%","RAM 12 GB","Storage 40 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Cosmos","kat":"Basic","harga":275000,"ringkas":"Untuk kebutuhan skala besar.","fitur":["CPU 400%","RAM 16 GB","Storage 64 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Eclipse","kat":"Basic","harga":412000,"ringkas":"Resource besar untuk server ramai.","fitur":["CPU 450%","RAM 24 GB","Storage 80 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Infinity","kat":"Basic","harga":549000,"ringkas":"Resource tertinggi di Basic.","fitur":["CPU 500%","RAM 32 GB","Storage 96 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Aurora","kat":"Premium","harga":24999,"ringkas":"Awal yang nyaman di Premium.","fitur":["CPU 150%","RAM 1 GB","Storage 10 GB","1 MySQL Database","1 Automatic Backup"]},{"nama":"Vega","kat":"Premium","harga":48000,"ringkas":"CPU lebih tinggi untuk server kecil.","fitur":["CPU 200%","RAM 2 GB","Storage 10 GB","1 MySQL Database","1 Automatic Backup"]},{"nama":"Sirius","kat":"Premium","harga":94000,"ringkas":"Seimbang dengan backup lebih banyak.","fitur":["CPU 250%","RAM 4 GB","Storage 24 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Polaris","kat":"Premium","harga":140000,"ringkas":"Untuk komunitas yang mulai ramai.","fitur":["CPU 300%","RAM 6 GB","Storage 28 GB","1 MySQL Database","2 Automatic Backups"]},{"nama":"Arcturus","kat":"Premium","harga":186000,"ringkas":"Ruang lega dengan 3 backup.","fitur":["CPU 350%","RAM 8 GB","Storage 36 GB","1 MySQL Database","3 Automatic Backups"]},{"nama":"Draco","kat":"Premium","harga":233000,"ringkas":"Untuk komunitas yang terus tumbuh.","fitur":["CPU 400%","RAM 10 GB","Storage 40 GB","1 MySQL Database","3 Automatic Backups"]},{"nama":"Andromeda","kat":"Premium","harga":279000,"ringkas":"Ruang besar untuk komunitas ramai.","fitur":["CPU 450%","RAM 12 GB","Storage 48 GB","1 MySQL Database","3 Automatic Backups"]},{"nama":"Celestia","kat":"Premium","harga":372000,"ringkas":"Untuk kebutuhan skala besar.","fitur":["CPU 500%","RAM 16 GB","Storage 72 GB","1 MySQL Database","3 Automatic Backups"]},{"nama":"Stellaris","kat":"Premium","harga":558000,"ringkas":"Resource besar untuk skala besar.","fitur":["CPU 600%","RAM 24 GB","Storage 96 GB","1 MySQL Database","3 Automatic Backups"]},{"nama":"Empyrean","kat":"Premium","harga":744000,"ringkas":"Resource tertinggi di Premium.","fitur":["CPU 700%","RAM 32 GB","Storage 112 GB","1 MySQL Database","3 Automatic Backups"]}]};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {};
  var DEMOTXT = window.NX && NX.live ? "" : " (demo, belum mengubah web asli)";
  function ordFromTk() {
    var H = HG(), nm = {};
    Object.keys(H.jasa).forEach(function (k) { H.jasa[k].forEach(function (p) { nm[p.nama] = (H.meta && H.meta[k] && H.meta[k].nama) || k; }); }); H.hosting.forEach(function (p) { nm[p.nama] = "Hosting"; });
    return NX.tkGet().filter(function (x) { return x.kat === "Order baru"; }).map(function (x) { return { id: "ORD-" + String(x.id).replace(/^[A-Z]-/, ""), tk: x.id, item: x.paket, jenis: nm[x.paket] || nm[String(x.paket).split(" + ")[0]] || "Order via ticket", tgl: x.tgl, st: x.st === "Pesanan Diproses" ? "Diproses" : x.st === "Orderan Selesai" ? "Selesai" : "Menunggu" }; });
  }
  var LIVESET = { "nx-tampilan": "tampilan", "nx-kontak": "kontak", "nx-sosmed": "sosmed", "nx-bayar": "bayar" };
  function liveMsg(er) {
    var m = String((er && er.message) || "");
    if (/paket_fitur_fmt/.test(m)) return "Isi paket terlalu banyak atau terlalu panjang (maksimal 30 baris).";
    if (/paket_harga_rng/.test(m)) return "Harga harus antara 0 sampai 1.000.000.000.";
    if (/row-level security|42501|not allowed|tidak diizinkan/i.test(m)) return "Tidak diizinkan. Hanya Founder dan Co-Founder yang bisa mengubah ini.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "Koneksi bermasalah. Coba lagi.";
    return m || "coba lagi";
  }
  function liveFail(er) { toast("Gagal menyimpan: " + liveMsg(er)); if (window.nxDraw) window.nxDraw(); }
  function ld(k, d) { if (window.NX && NX.live) { if (k === "nx-tk") return NX.tkGet(); if (k === "nx-or") return ordFromTk(); if (k === "nx-harga") return NX.catGet() || d; if (LIVESET[k]) { var lv = NX.setGet(LIVESET[k]); return lv == null ? d : lv; } } try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (x) { return k in mem ? mem[k] : d; } }
  function sv(k, v) { if (window.NX && NX.live) { if (k === "nx-tk") { NX.tkSet(v); return; } if (k === "nx-or") return;
      if (k === "nx-harga") { if (NX.cat === null) { toast("Katalog belum termuat dari database" + (NX.catErr ? " (" + NX.catErr + ")" : "") + ". Pastikan 009_katalog_dan_situs.sql sudah dijalankan, lalu muat ulang halaman."); if (window.nxDraw) window.nxDraw(); return; } NX.catSet(v).then(function () {}, liveFail); return; }
      if (LIVESET[k]) { NX.setPut(LIVESET[k], v).then(function () {}, liveFail); return; } } mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (x) {} }
  function ss(k, v) {
    if (v === undefined) { try { var r = sessionStorage.getItem(k); return r === null ? mem["s" + k] : r; } catch (x) { return mem["s" + k]; } }
    mem["s" + k] = v; window.__nxS = window.__nxS || {}; window.__nxS[k] = v; try { sessionStorage.setItem(k, v); } catch (x) {}
  }
  function go(u) { if (window.__nxGo) window.__nxGo(u); else location.href = u; }
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function rp(n) { return "Rp\u00a0" + Number(n).toLocaleString("id-ID"); }
  var TOAST_I = { ok: "check-circle-fill", err: "x-octagon-fill", warn: "exclamation-triangle-fill", info: "info-circle-fill" }, TOAST_T = { ok: "Berhasil", err: "Gagal", warn: "Perhatian", info: "Info" };
  function toast(t, type) {
    t = String(t == null ? "" : t); if (!t) return;
    var ty = type || (/^(pesan baru|ticket baru|status )/i.test(t) ? "info" : /gagal|tidak (bisa|boleh|valid|diizinkan|ditemukan)|belum (bisa|termuat)|ditolak|minimal|wajib|salah|error|hanya (founder|ticket)/i.test(t) ? "err" : /dicabut|dihapus|dikembalikan|sementara|dibuang/i.test(t) ? "warn" : /tersimpan|berhasil|diperbarui|disalin|terkirim|dibuat|makasih|dipindah|diaktifkan|dinonaktifkan|tampil|disembunyikan|ditutup|diganti|ditambah|diputuskan|diambil alih|ditampilkan|disembunyikan/i.test(t) ? "ok" : "info");
    var box = document.querySelector(".nxt-box"); if (!box) { box = document.createElement("div"); box.className = "nxt-box"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    [].slice.call(box.children).forEach(function (c) { if (c.dataset.m === t) c.remove(); });
    while (box.children.length >= 4) box.firstChild.remove();
    var d = document.createElement("div"); d.className = "nxt " + ty; d.dataset.m = t; d.setAttribute("role", ty === "err" ? "alert" : "status");
    d.innerHTML = '<span class="nxt-i"><i class="bi bi-' + TOAST_I[ty] + '"></i></span><div class="nxt-t"><b>' + TOAST_T[ty] + '</b><span></span></div><button type="button" class="nxt-x" aria-label="Tutup notifikasi"><i class="bi bi-x-lg"></i></button><i class="nxt-p"></i>';
    d.querySelector(".nxt-t span").textContent = t;
    function bye() { if (d._g) return; d._g = 1; d.classList.add("out"); setTimeout(function () { d.remove(); }, 260); }
    d.querySelector(".nxt-x").addEventListener("click", bye); d.querySelector(".nxt-p").addEventListener("animationend", bye);
    box.appendChild(d);
  }
  var AVRE = /^https:\/\/(lh[0-9]+\.googleusercontent\.com|cdn\.discordapp\.com)\/[^\s]{1,500}$/;
  function safeAv(u) { return u && AVRE.test(u) ? u : ""; }
  function avImg(u) { return '<img src="' + e(u) + '" alt="" referrerpolicy="no-referrer" loading="lazy">'; }
  function av(n, u) { u = safeAv(u); return u ? '<span class="av">' + avImg(u) + "</span>" : '<span class="av">' + e(String(n || "?").trim().charAt(0).toUpperCase()) + "</span>"; }
  function avh(u, cls, fb) { u = safeAv(u); return '<span class="av' + (cls ? " " + cls : "") + '">' + (u ? avImg(u) : fb) + "</span>"; }
  function myFoto() { try { var d0 = document.querySelector(".dash"); if (!d0 || d0.dataset.dash !== "cust") return ""; var f = (JSON.parse(localStorage.getItem("nx-prof") || "{}") || {}).foto; return /^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(f || "") ? f : ""; } catch (x) { return ""; } }
  function setAv(el, name) { var u = myFoto() || safeAv(ss("nx-avatar")); if (u) el.innerHTML = avImg(u); else el.textContent = String(name || "?").charAt(0).toUpperCase(); }
  var ST = ["Menunggu admin balas", "Terhubung dengan admin", "Menunggu pembayaran", "Pembayaran Dikonfirmasi", "Pesanan Diproses", "Orderan Selesai"];
  var SHORT = { "Menunggu admin balas": "Menunggu balas", "Terhubung dengan admin": "Terhubung", "Menunggu pembayaran": "Pembayaran", "Pembayaran Dikonfirmasi": "Dikonfirmasi", "Pesanan Diproses": "Diproses", "Orderan Selesai": "Order selesai" };
  var BC = { "Menunggu admin balas": "b1", "Terhubung dengan admin": "b2", "Menunggu pembayaran": "b3", "Pembayaran Dikonfirmasi": "b7", "Pesanan Diproses": "b8", "Orderan Selesai": "b4", Menunggu: "b3", Selesai: "b4", Diproses: "b8", Terbuka: "b1", "Belum dibayar": "b1", Terlambat: "b5", Lunas: "b4", Dibatalkan: "b6", Ditutup: "b6" };
  function bd(s, short) { return '<span class="bd ' + (BC[s] || "b1") + '">' + e(short && SHORT[s] ? SHORT[s] : s) + "</span>"; }
  var MAXT = 3;
  function me() { return ss("nx-name") || "Customer"; }
  var ROLES = ["Founder", "Co-Founder", "Teknisi"];
  var PERM = {
    Founder: ["ringkasan", "tiket", "tagihan", "customer", "ulasan", "jasa", "hosting", "tampilan", "kontak", "bayar", "ekspor", "tim"],
    "Co-Founder": ["ringkasan", "tiket", "tagihan", "customer", "ulasan", "jasa", "hosting", "tampilan", "kontak", "bayar", "ekspor"],
    Teknisi: ["ringkasan", "tiket", "tagihan"]
  };
  var RC = { Founder: "b8", "Co-Founder": "b2", Teknisi: "b7" };
  function STAFF() { return window.NX && NX.live ? NX.staff.map(function (x) { return Object.assign({}, x); }) : ld("nx-staff", []); }
  function saveStaff(L, okMsg) {
    var redo = function () { if (window.nxDraw) window.nxDraw(); };
    if (window.NX && NX.live) { return NX.saveStaff(L).then(function () { if (okMsg) toast(okMsg); redo(); }, function (er) { toast("Gagal menyimpan: " + er.message); redo(); }); }
    sv("nx-staff", L); if (okMsg) toast(okMsg); redo();
  }
  function staffBy(em) { em = String(em || "").toLowerCase(); return STAFF().filter(function (x) { return x.email === em; })[0]; }
  function arole() { return ss("nx-arole") || ""; }
  function can(t) { return (PERM[arole()] || []).indexOf(t) > -1; }
  function rbd(r) { return '<span class="bd ' + (RC[r] || "b6") + '">' + e(r) + "</span>"; }
  function whoR() { return arole() ? arole() + " - " + me() : me(); }
  function nmOf(em) { return String(em).split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); }) || "Admin"; }
  function hm() { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function ptime(id, i) { var n = 0; for (var k = 0; k < id.length; k++) n = (n * 31 + id.charCodeAt(k)) % 997; n = (n + i * 137) % 720; return ("0" + (8 + Math.floor(n / 60))).slice(-2) + ":" + ("0" + (n % 60)).slice(-2); }
  function mkId() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function nm(o) { o.ts = Date.now(); o.mid = mkId(); return o; }
  function isRd(m) { return !m.ts || !!m.rd; }
  function p2(n) { return ("0" + n).slice(-2); }
  function fts(ts) { var d = new Date(ts); return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) + " \u00b7 " + p2(d.getHours()) + ":" + p2(d.getMinutes()); }
  var CK1 = '<svg class="ck" viewBox="0 0 12 10" aria-hidden="true"><path d="M1 5.4l3.2 3.2L11 1.6"/></svg>', CK2 = '<svg class="ck" viewBox="0 0 17 10" aria-hidden="true"><path d="M1 5.4l3.2 3.2L10.4 1.6"/><path d="M6.4 7.2l1.4 1.4L16 1.6"/></svg>';
  function dayL(m) { return m.d === "Baru saja" || m.d === "Hari ini" ? "Hari ini" : m.d; }
  var NCOL = ["#d9534f", "#2a9a56", "#3b7ddd", "#c43d85", "#0e9594", "#b7791f"];
  function ncol(n) { var h = 0; for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) % 97; return NCOL[h % NCOL.length]; }
  function uname(t) { return t.user === "__me" ? (window.__nxAdm ? ld("nx-cust", "Demo Customer") : me()) : t.user; }
  var LEG = { Terbuka: "Menunggu admin balas", Diproses: "Pesanan Diproses", Selesai: "Orderan Selesai" };
  function mig(a) { a.forEach(function (x) { if (LEG[x.st]) { if (x.st === "Selesai") x.closed = true; x.st = LEG[x.st]; } }); return a; }
  function cl(x) { return x.closed === true; }
  function TK() { return mig(ld("nx-tk", [
    { id: "T-1043", subj: "Tanya perpanjangan hosting", kat: "Bantuan", paket: "-", st: "Terbuka", tgl: "20 Okt 2026", user: "__me", m: [{ w: "c", t: "Bagaimana cara memperpanjang paket hosting?", d: "20 Okt" }] },
    { id: "T-1042", subj: "Setup Survival Plugin", kat: "Order baru", paket: "Survival Plugin", st: "Diproses", tgl: "18 Okt 2026", user: "__me", m: [{ w: "c", t: "Halo, saya mau pesan setup Survival Plugin untuk server Java.", d: "18 Okt" }, { w: "a", t: "Siap! Versi Java yang kamu pakai berapa?", d: "18 Okt" }, { w: "c", t: "Java 21, sekitar 30 pemain.", d: "18 Okt" }] },
    { id: "T-1031", subj: "Setup Vanilla Starter", kat: "Order baru", paket: "Vanilla Starter", st: "Selesai", tgl: "02 Okt 2026", user: "__me", m: [{ w: "c", t: "Mau pesan Vanilla Starter.", d: "02 Okt" }, { w: "a", t: "Server sudah jadi, detailnya sudah kami kirim. Terima kasih!", d: "03 Okt" }] },
    { id: "T-1040", subj: "Setup Discord Server Gaming", kat: "Order baru", paket: "Server Gaming", st: "Menunggu pembayaran", tgl: "15 Okt 2026", user: "Rizky", m: [{ w: "c", t: "Mau setup Discord untuk komunitas gaming.", d: "15 Okt" }, { w: "a", t: "Harga final sudah kami kirim, silakan konfirmasi pembayaran.", d: "15 Okt" }] },
    { id: "T-1038", subj: "Whitelist tidak berfungsi", kat: "Bantuan", paket: "-", st: "Selesai", tgl: "12 Okt 2026", user: "Andi", m: [{ w: "c", t: "Whitelist tidak jalan di server saya.", d: "12 Okt" }, { w: "a", t: "Sudah diperbaiki ya, coba cek lagi.", d: "12 Okt" }] }])); }
  function OR() { return ld("nx-or", [
    { id: "ORD-2044", tk: "T-1042", item: "Survival Plugin", jenis: "Setup Minecraft", tgl: "18 Okt 2026", st: "Diproses" },
    { id: "ORD-2031", tk: "T-1031", item: "Vanilla Starter", jenis: "Setup Minecraft", tgl: "02 Okt 2026", st: "Selesai" }]); }
  var JDEF = { minecraft: { nama: "Setup Minecraft", ic: "box2" }, discord: { nama: "Setup Discord", ic: "discord" } };
  function HG() { var H = ld("nx-harga", D); if (!H.meta) { H.meta = {}; Object.keys(H.jasa).forEach(function (k) { H.meta[k] = JDEF[k] || { nama: k, ic: "tag" }; }); } return H; }
  function JK() { return Object.keys(HG().jasa); }
  function JM(k) { var m = HG().meta[k]; return m || JDEF[k] || { nama: k, ic: "tag" }; }
  function JR(k) { return k === "hosting" ? HG().hosting : (HG().jasa[k] || []); }
  var SI = { "Ticket terbuka": "chat-dots", "Sedang diproses": "lightning-charge", "Total ticket": "tags", "Total pesanan": "receipt", "Ticket aktif": "chat-dots", "Ticket selesai": "check2", "Pesanan berjalan": "lightning-charge", "Menunggu pembayaran": "receipt", "Tagihan aktif": "cash-stack" };
  function stat(l, v) { return '<div class="dstat"><span class="si"><i class="bi bi-' + SI[l] + '"></i></span><div><small>' + l + "</small><b>" + v + "</b></div></div>"; }
  function table(h, rows, cls) {
    rows = rows.replace(/<tr>([\s\S]*?)<\/tr>/g, function (_, r) { var i = 0; return "<tr>" + r.replace(/<td( class="[^"]*")?>/g, function (_m, c) { return "<td" + (c || "") + ' data-l="' + h[i++] + '">'; }) + "</tr>"; });
    return '<div class="tw"><table class="dt' + (cls ? " " + cls : "") + '"><thead><tr>' + h.map(function (x) { return "<th>" + x + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + "</tbody></table></div>";
  }
  function modal(html, mount) {
    var m = document.createElement("div"); m.className = "modal"; m.innerHTML = html; document.body.appendChild(m);
    function close() { m.remove(); }
    m.addEventListener("click", function (ev) { if (ev.target === m || ev.target.closest("[data-x]")) close(); });
    if (mount) mount(m, close); return close;
  }
  function shrink(file, max, type, cb) {
    var fr = new FileReader();
    fr.onload = function () { var im = new Image(); im.onload = function () { var s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); var cx = c.getContext("2d"); if (type === "image/jpeg") { cx.fillStyle = "#fff"; cx.fillRect(0, 0, c.width, c.height); } cx.drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL(type, 0.8)); }; im.src = fr.result; };
    fr.readAsDataURL(file);
  }

  /* Petunjuk perbaikan berdasarkan pesan error asli dari Supabase / Google / Discord. */
  function authHint(t) {
    t = String(t || "");
    if (/database error saving new user/i.test(t)) return "Database gagal menyimpan akun baru. Di Supabase > SQL Editor jalankan supabase/008_perbaiki_foto_profil.sql (Run), lalu coba login lagi. Kalau masih sama, pastikan 001 sampai 007 sudah dijalankan tanpa error.";
    if (/error getting user email|email from external/i.test(t)) return "Provider tidak mengirim email. Untuk Discord: pastikan email akun Discord sudah terverifikasi, lalu coba lagi.";
    if (/unable to exchange external code|invalid_client|client secret|invalid client/i.test(t)) return "Client ID atau Client Secret di Supabase > Authentication > Providers salah (atau sudah di-reset). Salin ulang dari Google Cloud / Discord Developer.";
    if (/redirect_uri|redirect uri|not allowed|redirect url/i.test(t)) return "Alamat belum terdaftar. Tambahkan alamat dashboard ini di Supabase > Authentication > URL Configuration > Redirect URLs, dan Callback URL Supabase di Google/Discord.";
    if (/access_denied|denied/i.test(t)) return "Login dibatalkan di halaman Google/Discord. Coba lagi dan pilih Izinkan.";
    if (/verifier|pkce|flow url/i.test(t)) return "Muat ulang halaman dengan Ctrl+F5, lalu mulai login lagi dari tombol di halaman ini dengan alamat yang sama (jangan campur www dan tanpa www, atau localhost dan 127.0.0.1).";
    return "Kalau berulang, cek Authentication > URL Configuration di Supabase: Site URL dan Redirect URLs harus memuat alamat situs ini.";
  }
  function authInit(mode, root) {
    var forms = $$("form", root), ae = $("#ae", root);
    function aerr(t) { if (ae) { ae.textContent = t; ae.hidden = false; } else toast(t); }
    var AE = ss("nx-autherr");
    if (AE || /[?&]err=auth/.test(location.search)) {
      ss("nx-autherr", "");
      var hint = authHint(AE);
      aerr("Login belum berhasil" + (AE ? ": " + AE : ".") + (hint ? " " + hint : ""));
    }
    if ((window.NX && NX.sessEnd) || /[?&]err=expired/.test(location.search)) aerr("Sesi login sudah berakhir (masa login maksimal " + ((window.NX && NX.sessionDays) || 7) + " hari). Silakan masuk lagi. Akunmu tetap aman dan tidak dihapus.");
    if (/[?&]err=staff/.test(location.search)) aerr("Akun ini terdaftar sebagai tim NEXORA, jadi tidak bisa dipakai di panel customer. Untuk order sebagai customer, masuk dengan akun Google/Discord yang lain.");
    if (/[?&]info=order/.test(location.search) && ae) { ae.textContent = "Masuk dulu untuk membuka ticket. Setelah login, kamu langsung diarahkan ke form buka ticket."; ae.classList.add("info"); ae.hidden = false; }
    if (/[?&]err=notstaff/.test(location.search)) aerr("Akun ini tidak terdaftar sebagai tim NEXORA. Minta Founder menambahkan akunmu.");
    function masuk(n, em, via) { ss("nx-via", via || "email"); ss("nx-role", mode === "alogin" ? "admin" : "cust"); ss("nx-name", n); ss("nx-email", em || ""); if (mode !== "alogin") ss("nx-arole", ""); go(mode === "alogin" ? "/nexora-admin" : "/dashboard"); }
    if (location.hash === "#daftar") setTimeout(function () { var d = $('[data-m="daftar"]', root); if (d) d.click(); }, 0);
    $$("[data-m]", root).forEach(function (b) { b.addEventListener("click", function () {
      $$("[data-m]", root).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      forms.forEach(function (f) { f.hidden = f.dataset.f !== b.dataset.m; });
      $("[data-ttl]", root).textContent = b.dataset.m === "daftar" ? "Buat akun NEXORA" : "Masuk ke NEXORA";
    }); });
    root.addEventListener("click", function (ev) {
      var t = ev.target.closest(".pw-t,[data-sso]"); if (!t) return;
      if (t.dataset.sso) {
        if (window.NX && NX.live) return NX.login(t.dataset.sso, mode).catch(function (er) { aerr(er.message); });
        if (mode === "alogin") { var S0 = STAFF(); if (!S0.length) { S0.push({ id: "s" + Date.now(), nama: "Demo Founder", email: "demo-founder@example.com", role: "Founder", dibuat: Date.now() }); sv("nx-staff", S0); } ss("nx-arole", S0[0].role); return masuk(S0[0].nama, S0[0].email, t.dataset.sso); }
        return masuk("Demo " + t.dataset.sso, "", t.dataset.sso);
      }
      var i = $("input", t.parentNode), show = i.type === "password"; i.type = show ? "text" : "password"; $("i", t).className = "bi bi-" + (show ? "eye-slash" : "eye");
    });
    forms.forEach(function (f) { f.addEventListener("submit", function (ev) {
      ev.preventDefault(); var er = $(".err", f);
      if (f.dataset.f === "daftar") {
        var msg = f.password.value.length < 8 ? "Password minimal 8 karakter." : f.password.value !== f.ulang.value ? "Password dan ulangi password tidak sama." : "";
        if (msg) { er.textContent = msg; er.hidden = false; return; }
      }
      if (mode === "alogin") {
        var em = f.email.value.trim().toLowerCase(), S = STAFF();
        if (!S.length) { S.push({ id: "s" + Date.now(), nama: nmOf(em), email: em, role: "Founder", dibuat: Date.now() }); sv("nx-staff", S); }
        var u = S.filter(function (x) { return x.email === em; })[0];
        if (!u) { er.textContent = "Email ini belum terdaftar sebagai tim NEXORA. Minta Founder menambahkan akunmu dan rolenya."; er.hidden = false; return; }
        ss("nx-arole", u.role); return masuk(u.nama, em);
      }
      masuk((f.nama && f.nama.value) || f.email.value.split("@")[0], f.email.value);
    }); });
  }

  function dashInit(adm, root) {
    var bcat = "semua", bpg = 0;
    var pfSw = false, ifl = "Semua", iq = "", id1 = "", id2 = "", dpOn = false, dpStep = 1, dpY = 0, dpM = 0, ipg = 1, iopen = "", idet = "", isort = "desc", kinfo = false, kf = "Semua", kk = "Semua", kq = "", stab = "aktif", stabFor = "", kpg = 1, rlOpen = false, ctab = "aktif", ptab = "profil", tab = "ringkasan", sel = null, tg = "aktif", hs = "minecraft", tv = "list", af = "Aktif", aq = "", foto = "", bsv = "minecraft", bfil = "semua", bnew = false, BF = {}, lastTab = "", lastSg = "", hcat = {}, cq = "";
    document.body.classList.add("is-dash");
    var scrim = document.createElement("div"); scrim.className = "side-scrim"; document.body.appendChild(scrim);
    function isMob() { return window.matchMedia("(max-width:820px)").matches; }
    function syncT() {
      var t = $("#side-t"); if (!t) return; var mob = isMob(), o = root.classList.contains("open"), mi = root.classList.contains("mini");
      $("i", t).className = "bi bi-" + (mob ? (o ? "x-lg" : "list") : (mi ? "layout-sidebar-inset-reverse" : "layout-sidebar-inset"));
      t.setAttribute("aria-expanded", String(mob ? o : !mi)); t.setAttribute("aria-label", mob ? (o ? "Tutup menu" : "Buka menu") : (mi ? "Perlebar menu" : "Persempit menu")); t.title = t.getAttribute("aria-label");
    }
    function setOpen(o) { root.classList.toggle("open", o); scrim.classList.toggle("on", o); syncT(); }
    var autoMini = false;
    function setWide() { if (isMob()) setOpen(!root.classList.contains("open")); else { autoMini = false; root.classList.toggle("mini"); syncT(); } }
    function autoSide(chat) {
      if (isMob()) return;
      if (chat && !root.classList.contains("mini")) { root.classList.add("mini"); autoMini = true; syncT(); }
      else if (!chat && autoMini) { root.classList.remove("mini"); autoMini = false; syncT(); }
    }
    (function () {
      var side = $(".side", root), hd = $(".topbar"), w = $(".wrap", hd), lg = $(".logo", w), nr = $(".nav-right", w), dc = $(".dc-icon", nr); if (dc) dc.remove();
      var st = $("#side-t"); st.className = "tgl"; st.innerHTML = '<i class="bi bi-layout-sidebar-inset"></i>';
      var sh = document.createElement("div"); sh.className = "side-head"; var lg2 = document.createElement("div"); lg2.className = "logo side-logo"; lg2.innerHTML = lg.innerHTML; lg.parentNode.removeChild(lg); lg = lg2;
      var sx = document.createElement("button"); sx.type = "button"; sx.className = "side-x"; sx.setAttribute("aria-label", "Tutup menu"); sx.innerHTML = '<i class="bi bi-x-lg"></i>';
      side.insertBefore(sh, side.firstChild); sh.appendChild(lg); sh.appendChild(sx);
      var sn = document.createElement("div"); sn.className = "side-nav"; var sf = document.createElement("div"); sf.className = "side-foot";
      [].slice.call(side.children).forEach(function (x) { if (x === sh || x === st || x.classList.contains("who")) return; (x.classList.contains("home") || x.id === "logout" ? sf : sn).appendChild(x); });
      if (adm) {
        $$(".sl", sn).forEach(function (x) { x.remove(); });
        [["Utama", ["ringkasan", "tiket", "tagihan"]], ["Pengguna", ["customer", "ulasan", "tim"]], ["Katalog", ["jasa", "hosting"]], ["Situs", ["tampilan", "kontak", "bayar"]], ["Sistem", ["ekspor"]]].forEach(function (g) {
          var w = document.createElement("div"); w.className = "sg"; w.dataset.g = g[0];
          w.innerHTML = '<small class="sl">' + g[0] + '</small><div class="sgx"></div>';
          g[1].forEach(function (k) { var b = $('[data-tab="' + k + '"]', sn); if (b) $(".sgx", w).appendChild(b); });
          sn.appendChild(w);
        });
      }
      side.appendChild(sn); side.appendChild(sf);
      var tl = document.createElement("div"); tl.className = "tb-l"; tl.appendChild(st); if (!adm) { var tbk = document.createElement("button"); tbk.type = "button"; tbk.className = "tgl tb-bk"; tbk.setAttribute("data-ibk", ""); tbk.setAttribute("aria-label", "Kembali ke invoice"); tbk.innerHTML = '<i class="bi bi-chevron-left"></i>'; tl.appendChild(tbk); }
      var dl = document.createElement("span"); dl.className = "tb-sub"; dl.textContent = adm ? "Dashboard Admin" : "Dashboard"; tl.appendChild(dl);
      w.insertBefore(tl, nr); root.insertBefore(hd, $(".dmain", root));
      var un = ss("nx-name") || (adm ? "Admin" : "Customer"), em = ss("nx-email") || "-", AVU = safeAv(ss("nx-avatar"));
      var uw = document.createElement("div"); uw.className = "uwrap";
      uw.innerHTML = '<button type="button" class="uchip" aria-haspopup="true" aria-expanded="false">' + avh(AVU, "", '<i class="bi bi-person-fill"></i>') + '<span class="un">' + e(un.split(" ")[0]) + '</span><i class="bi bi-chevron-down chv"></i></button><div class="umenu" hidden><div class="ux-id"><span class="ux-ic" aria-hidden="true"><i class="bi bi-person"></i></span><div class="ux-tx"><b>' + e(un) + '</b><small class="ux-em">' + e(em) + '</small>' + (adm && arole() ? '<span class="ux-role">' + rbd(arole()) + '</span>' : '') + '</div></div>' + (adm ? '<div class="um-sep"></div><button type="button" class="ux-tg" role="switch" aria-checked="' + showOn() + '"><i class="bi bi-broadcast" aria-hidden="true"></i><span>Status online</span><span class="swt" aria-hidden="true"></span></button>' : "") + '<div class="um-sep"></div><button type="button" class="ux-out"><i class="bi bi-box-arrow-right" aria-hidden="true"></i><span>Keluar</span></button></div>';
      nr.appendChild(uw);
      if (!adm) {
        var nw = document.createElement("div"); nw.className = "nwrap";
        nw.innerHTML = '<button type="button" class="nbell" aria-label="Notifikasi" aria-haspopup="true" aria-expanded="false"><svg class="nbi" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><b class="nb" hidden>0</b></button><div class="nmenu" hidden><div class="nm-h"><div class="nm-ti"><b>Notifikasi</b><span class="nm-cn" hidden></span></div><button type="button" class="nm-all"><i class="bi bi-check2-all"></i> Tandai dibaca</button></div><div class="nm-l"></div><div class="nm-f"><button type="button" class="nm-p" hidden><i class="bi bi-bell"></i> Aktifkan notifikasi browser</button></div></div>';
        nr.insertBefore(nw, uw);
        var nbtn = $(".nbell", nw), nmn = $(".nmenu", nw), nbg = $(".nb", nw), seen = null;
        function nOpen(o) { nmn.hidden = !o; nbtn.setAttribute("aria-expanded", String(o)); if (o) { uOpen(false); nfUp(); } }
        function ago(ts) { var m = Math.round((Date.now() - ts) / 60000); return m < 1 ? "Baru saja" : m < 60 ? m + " mnt lalu" : m < 1440 ? Math.floor(m / 60) + " jam lalu" : new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short" }); }
        nfUp = function () {
          var a = nfMine(), un = a.filter(function (n) { return !n.r; });
          nbg.hidden = !un.length; nbg.textContent = un.length > 9 ? "9+" : un.length;
          nbtn.setAttribute("aria-label", "Notifikasi" + (un.length ? ", " + un.length + " belum dibaca" : ""));
          var SV = { bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>', tk: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/>' };
          var row = function (n) { return '<button type="button" class="nm-i' + (n.r ? "" : " un") + '" data-n="' + n.id + '"><span class="nm-ic ' + n.k + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (SV[n.k] || SV.tk) + '</svg></span><span class="nm-t"><b>' + e(n.t) + "</b><small>" + e(n.x) + "</small><em>" + ago(n.ts) + "</em></span></button>"; };
          var lt = a.slice(0, 20), nu = lt.filter(function (n) { return !n.r; }), nr0 = lt.filter(function (n) { return n.r; });
          $(".nm-l", nw).innerHTML = (nu.length ? '<div class="nm-g">Baru <b>' + nu.length + "</b></div>" + nu.map(row).join("") : "") + (nr0.length ? '<div class="nm-g">Sebelumnya</div>' + nr0.map(row).join("") : "") || '<div class="nm-e"><span class="nm-eb"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></span><b>Belum ada notifikasi</b><small>Balasan admin dan update invoice akan muncul di sini.</small></div>';
          var cn0 = $(".nm-cn", nw); cn0.hidden = !un.length; cn0.textContent = un.length + " baru";
          $(".nm-p", nw).hidden = !("Notification" in window) || Notification.permission !== "default"; $(".nm-all", nw).hidden = !un.length;
          if (seen === null) { seen = {}; a.forEach(function (n) { seen[n.id] = 1; }); return; }
          un.forEach(function (n) { if (seen[n.id]) return; seen[n.id] = 1; if ("Notification" in window && Notification.permission === "granted") { try { new Notification(n.t, { body: n.x, icon: "../assets/img/favicon.png" }); } catch (er) {} } });
        };
        nbtn.addEventListener("click", function (ev) { ev.stopPropagation(); nOpen(nmn.hidden); });
        $(".nm-all", nw).addEventListener("click", function () { var a = nfAll(); a.forEach(function (n) { if (n.u === "__me" || n.u === me()) n.r = true; }); sv("nx-notif", a); nfUp(); });
        $(".nm-p", nw).addEventListener("click", function () { Notification.requestPermission().then(function () { nfUp(); toast(Notification.permission === "granted" ? "Notifikasi browser aktif" : "Izin notifikasi ditolak"); }); });
        $(".nm-l", nw).addEventListener("click", function (ev) {
          var it = ev.target.closest("[data-n]"); if (!it) return;
          var a = nfAll(), n = a.filter(function (x) { return x.id === it.dataset.n; })[0]; if (!n) return; n.r = true; sv("nx-notif", a); nOpen(false);
          var tk = TK().filter(function (x) { return x.id === n.tk; })[0]; if (tk) { sel = tk.id; tv = "chat"; tab = "tiket"; setOpen(false); draw(); } else nfUp();
        });
        document.addEventListener("click", function (ev) { if (!nw.contains(ev.target)) nOpen(false); });
        document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") nOpen(false); });
        nfClose = function () { nOpen(false); };
        nfUp();
      }
      var uc = $(".uchip", uw), um = $(".umenu", uw);
      var utg = $(".ux-tg", uw); if (utg) utg.addEventListener("click", function (ev) { ev.stopPropagation(); setOnl(!showOn()); });
      function uOpen(o) { um.hidden = !o; uc.setAttribute("aria-expanded", String(o)); }
      uc.addEventListener("click", function (ev) { ev.stopPropagation(); if (nfClose) nfClose(); uOpen(um.hidden); });
      $(".ux-out", uw).addEventListener("click", function () { uOpen(false); outAsk(); });
      $$(".um-a", uw).forEach(function (b) { b.addEventListener("click", function () { uOpen(false); }); });
      document.addEventListener("click", function (ev) { if (!uw.contains(ev.target)) uOpen(false); });
      sx.addEventListener("click", function () { setOpen(false); });
      scrim.addEventListener("click", function () { setOpen(false); });
      document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { uOpen(false); if (root.classList.contains("open")) setOpen(false); } });
      window.addEventListener("resize", function () { if (!isMob()) root.classList.remove("open"), scrim.classList.remove("on"); syncT(); });
      syncT();
    })();
    function out() { ss("nx-role", ""); ss("nx-arole", ""); var to = adm ? "/nexora-admin-access" : "/masuk"; if (window.NX && NX.live) return NX.logout().then(function () { go(to); }, function () { go(to); }); go(to); }
    function outAsk() {
      modal('<div class="mbox sm warn" role="alertdialog" aria-modal="true" aria-labelledby="lo-t"><span class="warn-ic"><i class="bi bi-box-arrow-right"></i></span><div class="mb"><h3 id="lo-t">Keluar dari akun?</h3><p>Apakah kamu yakin ingin keluar dari akun?</p></div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button type="button" class="btn dng" data-ok>Ya, keluar</button></div></div>', function (m, close) {
        $("[data-ok]", m).addEventListener("click", out);
        m.addEventListener("keydown", function (ev) { if (ev.key === "Escape") close(); });
        $("[data-x].btn", m).focus();
      });
    }
    function tb() { var h = $(".topbar"); if (h) document.documentElement.style.setProperty("--tb", h.offsetHeight + "px"); }
    tb(); window.addEventListener("resize", tb);
    if (window.visualViewport) { var vvf = function () { var vv = window.visualViewport, de = document.documentElement; de.style.setProperty("--vvh", vv.height + "px"); de.style.setProperty("--vvt", Math.max(0, vv.offsetTop) + "px"); de.classList.toggle("kbd", window.innerHeight - vv.height > 120); var tmv = root.classList.contains("chatv") ? $(".th-m", root) : null; if (tmv) tmv.scrollTop = tmv.scrollHeight; }; window.visualViewport.addEventListener("resize", vvf); window.visualViewport.addEventListener("scroll", vvf); vvf(); }
    /* Chat ticket di HP: halaman di belakang tidak boleh ikut ter-scroll/tergeser (terutama saat keyboard terbuka).
       Gerakan jari hanya boleh menggulung daftar pesan / panel info / kotak ketik kalau memang masih bisa digulung. */
    (function () {
      var ty = 0;
      document.addEventListener("touchstart", function (ev) { if (ev.touches.length) ty = ev.touches[0].clientY; }, { passive: true });
      document.addEventListener("touchmove", function (ev) {
        if (!root.classList.contains("chatv") || !isMob() || !ev.touches.length) return;
        var t = ev.target; if (!t || !t.closest || t.closest(".side,.mbox,.umenu,.nmenu,.mmenu")) return;
        var sc = t.closest(".th-m,.th-i,textarea"), dy = ev.touches[0].clientY - ty;
        if (sc && sc.scrollHeight > sc.clientHeight + 1) {
          var top = sc.scrollTop <= 0, bot = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1;
          if (!((dy > 0 && top) || (dy < 0 && bot))) return;
        }
        if (ev.cancelable) ev.preventDefault();
      }, { passive: false });
    })();
    window.__nxAdm = adm; if (!adm) { sv("nx-cust", me()); var UU = USR(), pp = ld("nx-prof", {}), nu = UU[me()] || {}; nu.email = ss("nx-email") || nu.email || ""; nu.discord = pp.discord || nu.discord || ""; nu.wa = pp.wa || nu.wa || ""; nu.joined = nu.joined || new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }); UU[me()] = nu; sv("nx-users", UU); }
    $("#who").textContent = ss("nx-name") || (adm ? "Admin" : "Customer"); var wv = $("#wav"); if (wv) setAv(wv, me()); applyPerms();
    function mine() { return TK().filter(function (x) { return x.user === "__me" || x.user === me(); }); }
    function last(t) { return t.m[t.m.length - 1]; }
    /* ambil ticket: admin yang chat duluan jadi penangan; admin lain terkunci sampai mengambil alih */
    function hdMe(t) { return !!(t.hd && (window.NX && NX.live ? t.hd.me : t.hd.n === me())); }
    function locked(t) { return adm && !cl(t) && !!t.hd && !hdMe(t); }
    /* ===== status online / offline (hanya tampil di header chat ticket) =====
       live: Supabase Realtime Presence (lihat auth.js) | demo tanpa Supabase: detak jantung lewat localStorage antar-tab */
    var PRS = { key: "", off: null, tm: null, st: null, pref: null }, prHid = 0;
    function isLive() { return !!(window.NX && NX.live); }
    function showOn() { if (isLive()) return !(NX.profile && NX.profile.show_online === false); try { return localStorage.getItem("nx-onl:" + me()) !== "0"; } catch (x) { return true; } }
    function prActive() { return !document.hidden || Date.now() - prHid < 120000; }
    function prBeat() {
      if (isLive()) { if (NX.presTrackOn) NX.presTrackOn(); return; }
      try {
        var k = "nx-pr:" + me(), kv = "nx-prv:" + me();
        localStorage.setItem(kv, showOn() ? "1" : "0");
        if (showOn() && prActive()) localStorage.setItem(k, String(Date.now())); else localStorage.removeItem(k);
      } catch (x) {}
    }
    function prBoot() {
      if (window.__nxPrBoot) return; window.__nxPrBoot = 1;
      prBeat(); setInterval(prBeat, 8000);
      document.addEventListener("visibilitychange", function () { if (document.hidden) prHid = Date.now(); prBeat(); });
      window.addEventListener("pagehide", function () { if (!isLive()) try { localStorage.removeItem("nx-pr:" + me()); } catch (x) {} });
    }
    function prPeer(t) { return isLive() ? (adm ? t.cid : (t.hd && t.hd.id)) || "" : adm ? uname(t) : (t.hd && t.hd.n) || ""; }
    function prStop() { if (PRS.off) { try { PRS.off(); } catch (x) {} } PRS.off = null; clearInterval(PRS.tm); PRS.tm = null; }
    function prStart(key) {
      if (isLive()) {
        var ask = function () { NX.presPref(key).then(function (v) { if (PRS.key === key) { PRS.pref = v; prPaint(); } }); };
        ask(); PRS.tm = setInterval(ask, 60000);
        PRS.off = NX.presWatch(key, function (on) { if (PRS.key === key) { PRS.st = on; prPaint(); } });
      } else {
        var rd = function () {
          try { PRS.pref = localStorage.getItem("nx-prv:" + key) !== "0"; PRS.st = Date.now() - (Number(localStorage.getItem("nx-pr:" + key)) || 0) < 20000; } catch (x) {}
          prPaint();
        };
        rd(); PRS.tm = setInterval(rd, 3000);
      }
    }
    function prPaint() {
      var dot = $(".th-h .pdot", root), tx = $(".th-h .pst", root); if (!dot) return;
      var ok = PRS.pref === true && PRS.st !== null, on = ok && PRS.st === true;
      dot.hidden = !ok; dot.classList.toggle("on", on);
      if (tx) { tx.hidden = !ok; tx.classList.toggle("on", on); tx.textContent = ok ? " · " + (on ? "Online" : "Offline") : ""; }
    }
    function presSync() {
      var dot = $(".th-h .pdot", root), t = dot ? curT() : null, key = t && !cl(t) ? prPeer(t) : "";
      if (key !== PRS.key) { prStop(); PRS.key = key; PRS.st = null; PRS.pref = null; if (key) prStart(key); }
      prPaint();
    }
    function onlUi() {
      var on = showOn(), m = document.querySelector(".ux-tg"); if (m) m.setAttribute("aria-checked", String(on));
      var sw = $("[data-onl]", root); if (sw) sw.setAttribute("aria-checked", String(on));
    }
    function setOnl(v) {
      var done = function () { toast(v ? "Status online ditampilkan" : "Status online disembunyikan"); onlUi(); prBeat(); };
      if (isLive()) { NX.setShowOnline(v).then(done, function (er) { toast(liveMsg(er)); onlUi(); }); return; }
      try { localStorage.setItem("nx-onl:" + me(), v ? "1" : "0"); } catch (x) {} done();
    }
    function USR() {
      if (window.NX && NX.live && adm) return NX.users;
      var u = ld("nx-users", { "Demo Customer": { email: "demo@example.com", discord: "democustomer", wa: "081234567890", joined: "10 Okt 2026" }, "Rizky": { email: "rizky@example.com", discord: "rizky_gg", wa: "085711112222", joined: "02 Okt 2026" }, "Andi": { email: "", discord: "", wa: "", joined: "28 Sep 2026" } });
      return u;
    }
    function waNum(v) { var d = String(v || "").replace(/\D/g, ""); if (!d) return ""; if (d.charAt(0) === "0") d = "62" + d.slice(1); return d; }
    /* validasi nomor WhatsApp: nomor seluler Indonesia (08xx / 62xx / +62xx) */
    function waCheck(v) {
      var raw = String(v || "").trim();
      if (!raw) return { ok: true, val: "" };
      if (!/^\+?[\d\s().-]+$/.test(raw)) return { ok: false, msg: "Nomor WhatsApp hanya boleh berisi angka. Contoh: 0812 3456 7890." };
      var d = raw.replace(/\D/g, ""), r;
      if (d.indexOf("62") === 0) { r = d.slice(2); if (r.charAt(0) === "0") r = r.slice(1); }
      else if (d.charAt(0) === "0") r = d.slice(1);
      else if (d.charAt(0) === "8") r = d;
      else return { ok: false, msg: "Nomor harus diawali 08, 62, atau +62. Contoh: 0812 3456 7890." };
      if (r.charAt(0) !== "8") return { ok: false, msg: "Gunakan nomor seluler Indonesia yang diawali 08. Contoh: 0812 3456 7890." };
      if (r.length < 9) return { ok: false, msg: "Nomor terlalu pendek. Nomor seluler Indonesia minimal 10 digit." };
      if (r.length > 12) return { ok: false, msg: "Nomor terlalu panjang. Nomor seluler Indonesia maksimal 13 digit." };
      if (/^(\d)\1+$/.test(r)) return { ok: false, msg: "Nomor WhatsApp tidak valid. Periksa lagi nomormu." };
      return { ok: true, val: "62" + r };
    }
    function waShow(v) { var d = String(v || "").replace(/\D/g, ""); if (!d) return ""; if (d.indexOf("62") === 0) d = "0" + d.slice(2); return d.replace(/^(\d{4})(\d{4})(\d+)$/, "$1 $2 $3"); }
    function waErr(f, msg) {
      var el = $("#wa-err", f), inp = f.wa; if (!el || !inp) return;
      el.textContent = msg || ""; if (msg) { inp.classList.add("bad"); inp.setAttribute("aria-invalid", "true"); } else { inp.classList.remove("bad"); inp.removeAttribute("aria-invalid"); }
    }
    function custNames() {
      var n = Object.keys(USR());
      TK().forEach(function (x) { var u = uname(x); if (n.indexOf(u) < 0) n.push(u); });
      BL().forEach(function (b) { var u = bcust(b); if (n.indexOf(u) < 0) n.push(u); });
      return n;
    }
    function custInfo(name) {
      var u = USR()[name] || {}, tk = TK().filter(function (x) { return uname(x) === name; }), bl = BL().filter(function (b) { return bcust(b) === name; });
      return { name: name, email: u.email || "", discord: u.discord || "", wa: u.wa || "", joined: u.joined || "-", tk: tk, act: tk.filter(function (x) { return !cl(x); }), bl: bl, unpaid: bl.filter(function (b) { return b.st === "Belum dibayar"; }) };
    }
    function custModal(name) {
      var c = custInfo(name), wn = waNum(c.wa), none = '<span class="cu-none">Belum diisi</span>';
      var row = function (ic, lb, v, raw, extra) { return '<div class="cu-r"><span class="cu-i"><i class="bi bi-' + ic + '"></i></span><div class="cu-v"><small>' + lb + "</small>" + (v ? "<b>" + e(v) + "</b>" : none) + "</div>" + (v && raw ? '<button type="button" class="ib" data-c="' + e(raw) + '" aria-label="Salin ' + lb + '"><i class="bi bi-copy"></i></button>' : "") + (extra || "") + "</div>"; };
      var rec = c.tk.slice(0, 4).map(function (x) { return '<button type="button" class="li ln" data-g="' + x.id + '"><span><b>' + e(x.subj) + "</b><small>" + e(x.id) + " · " + e(x.tgl) + "</small></span>" + bd(x.st, 1) + (cl(x) ? '<span class="bd b6">Ditutup</span>' : "") + "</button>"; }).join("") || '<p class="muted">Belum ada ticket.</p>';
      modal('<div class="mbox cu-m"><div class="mh"><div class="cu-h">' + av(name) + '<div><b>' + e(name) + '</b><small>Akun customer</small></div></div><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb">' +
        '<div class="cu-st"><div><b>' + c.act.length + "</b><small>Ticket aktif</small></div><div><b>" + c.tk.length + "</b><small>Total ticket</small></div><div><b>" + c.unpaid.length + "</b><small>Tagihan aktif</small></div></div>" +
        '<section class="bd-s"><h4><i class="bi bi-person-lines-fill"></i> Kontak customer</h4><div class="cu-list">' + row("person", "Nama akun", name, name) + row("envelope", "Email", c.email, c.email) + row("discord", "Username Discord", c.discord, c.discord) + row("whatsapp", "WhatsApp", wn ? "+" + wn : "", wn ? "+" + wn : "") + "</div>" + (c.wa || c.discord ? "" : '<p class="cu-note"><i class="bi bi-info-circle"></i> Customer belum melengkapi Discord / WhatsApp di halaman Profile. Hubungi lewat ticket atau email.</p>') + "</section>" +
        '<section class="bd-s"><h4><i class="bi bi-calendar3"></i> Akun</h4><dl class="bd-dl"><div><dt>Bergabung</dt><dd>' + e(c.joined) + "</dd></div></dl></section>" +
        '<section class="bd-s"><h4><i class="bi bi-chat-dots"></i> Ticket terbaru</h4><div class="lis">' + rec + "</div></section></div>" +
        '<div class="mf cu-f"><button type="button" class="btn ghost sm" data-all><i class="bi bi-clipboard"></i> Salin semua kontak</button>' + (wn ? '<a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/' + wn + '"><i class="bi bi-whatsapp"></i> Chat WhatsApp</a>' : '<button type="button" class="btn sm" disabled><i class="bi bi-whatsapp"></i> Chat WhatsApp</button>') + "</div></div>", function (m, close) {
        m.addEventListener("click", function (ev) {
          var b = ev.target.closest("[data-c]"); if (b) { cpy(b.dataset.c); toast("Disalin"); return; }
          var g = ev.target.closest("[data-g]"); if (g) { var id = g.dataset.g, x = TK().filter(function (z) { return z.id === id; })[0]; close(); sel = id; tv = "chat"; tab = "tiket"; if (x) af = cl(x) ? "Riwayat" : "Aktif"; setOpen(false); draw(); }
        });
        $("[data-all]", m).addEventListener("click", function () { cpy("Nama: " + name + "\nEmail: " + (c.email || "-") + "\nDiscord: " + (c.discord || "-") + "\nWhatsApp: " + (wn ? "+" + wn : "-")); toast("Kontak disalin"); });
      });
    }
    function custCards() {
      var q = cq.toLowerCase(), a = custNames().map(custInfo).filter(function (c) { return (c.name + " " + c.email + " " + c.discord + " " + c.wa).toLowerCase().indexOf(q) > -1; });
      return a.map(function (c) {
        var wn = waNum(c.wa), none = '<span class="cu-none">Belum diisi</span>';
        return '<article class="cu-c">' + '<div class="cu-ch">' + av(c.name) + '<div><b>' + e(c.name) + "</b><small>" + c.act.length + " ticket aktif · " + c.tk.length + ' total</small></div>' + (c.unpaid.length ? '<span class="bd b3">' + c.unpaid.length + " tagihan</span>" : "") + "</div>" +
          '<ul class="cu-ls"><li><i class="bi bi-envelope"></i><span>' + (c.email ? e(c.email) : none) + '</span></li><li><i class="bi bi-discord"></i><span>' + (c.discord ? e(c.discord) : none) + '</span></li><li><i class="bi bi-whatsapp"></i><span>' + (wn ? "+" + wn : none) + "</span></li></ul>" +
          '<div class="cu-ca"><button type="button" class="btn ghost sm" data-cu="' + e(c.name) + '"><i class="bi bi-person-vcard"></i> Lihat akun</button>' + (wn ? '<a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/' + wn + '"><i class="bi bi-whatsapp"></i> WhatsApp</a>' : "") + "</div></article>";
      }).join("") || '<div class="dcard empty"><i class="bi bi-people"></i><b>Customer tidak ditemukan</b></div>';
    }
    function nfAll() { return ld("nx-notif", []); }
    function nfMine() { return nfAll().filter(function (n) { return n.u === "__me" || n.u === me(); }); }
    function nt(x, kind, title, text) {
      var P = ld("nx-prof", {}); if ((kind === "tk" && P.nTk === false) || (kind === "bill" && P.nBill === false)) return;
      var a = nfAll(); a.unshift({ id: "N" + Date.now() + Math.random().toString(36).slice(2, 6), u: x.user, k: kind, t: title, x: text, tk: x.id, ts: Date.now(), r: false }); sv("nx-notif", a.slice(0, 60));
    }
    var nfUp, nfClose;
    function isF() { return adm && arole() === "Founder"; }
    function audit(txt) { var a = ld("nx-audit", []); a.unshift({ t: Date.now(), by: whoR(), a: txt }); sv("nx-audit", a.slice(0, 200)); }
    function nextTid() {
      if (window.NX && NX.live) return "T-n" + Date.now().toString(36);
      var mx = Number(ld("nx-tkseq", 0)) || 0, up = function (v) { var n = Number(String(v || "").slice(2)) || 0; if (n > mx) mx = n; };
      TK().forEach(function (x) { up(x.id); }); RV().forEach(function (r) { up(r.tk); }); BL().forEach(function (b) { up(b.tk); up(b.ticket); }); nfAll().forEach(function (n) { up(n.tk); });
      mx = Math.max(mx, 1043) + 1; sv("nx-tkseq", mx); return "T-" + mx;
    }
    function delTk(ids) {
      var top = Number(ld("nx-tkseq", 0)) || 0; ids.forEach(function (i) { top = Math.max(top, Number(String(i).slice(2)) || 0); }); sv("nx-tkseq", top);
      sv("nx-tk", TK().filter(function (x) { return ids.indexOf(x.id) < 0; })); sv("nx-notif", nfAll().filter(function (n) { return ids.indexOf(n.tk) < 0; })); audit("Hapus " + ids.length + " ticket: " + ids.slice(0, 20).join(", ")); sel = null; tv = "list"; toast(ids.length + " ticket riwayat dihapus"); draw(); }
    function delBl(ids) { sv("nx-bill", BL().filter(function (b) { return ids.indexOf(b.id) < 0; })); audit("Hapus " + ids.length + " tagihan: " + ids.slice(0, 20).join(", ")); toast(ids.length + " tagihan dihapus"); draw(); }
    function tkHist() { var q = aq.toLowerCase(); return TK().filter(function (x) { return cl(x) && (x.subj + " " + uname(x) + " " + x.id).toLowerCase().indexOf(q) > -1; }); }
    function blHist() { return BL().filter(function (b) { return bfil === "Lunas" ? b.st === "Lunas" : bfil === "Dibatalkan" ? b.st === "Dibatalkan" : bfil === "semua" ? (b.st === "Lunas" || b.st === "Dibatalkan") : false; }); }
    function actCount() { return mine().filter(function (x) { return !cl(x); }).length; }
    function limitModal() {
      modal('<div class="mbox sm warn" role="alertdialog" aria-modal="true" aria-labelledby="lm-t"><span class="warn-ic am"><i class="bi bi-exclamation-triangle"></i></span><div class="mb"><h3 id="lm-t">Batas ticket tercapai</h3><p>Kamu sudah mempunyai ' + MAXT + ' ticket aktif silahkan menutup 1 ticket untuk membuat ticket baru.</p></div><div class="mf"><button type="button" class="btn ghost" data-x>Mengerti</button><button type="button" class="btn" data-ok>Lihat ticket</button></div></div>', function (m, close) {
        $("[data-ok]", m).addEventListener("click", function () { close(); tab = "tiket"; setOpen(false); draw(); });
        $("[data-x].btn", m).focus();
      });
    }
    function syncOrd(x) {
      var o = OR(), ch = false;
      o.forEach(function (r) { if (r.tk === x.id) { var n = x.st === "Pesanan Diproses" ? "Diproses" : x.st === "Orderan Selesai" ? "Selesai" : "Menunggu"; if (r.st !== n) { r.st = n; ch = true; } } });
      if (ch) sv("nx-or", o);
    }
    function tkStat(id, st, note) {
      var a = TK(), ch = false;
      a.forEach(function (x) { if (x.id === id && !cl(x) && x.st !== st) { x.st = st; x.m.push({ w: "s", t: note || ("Status: " + st), d: "Baru saja", h: hm() }); ch = true; syncOrd(x); nt(x, /agihan|embayaran/.test(note || "") ? "bill" : "tk", /dibatalkan/.test(note || "") ? "Invoice dibatalkan" : st === "Menunggu pembayaran" ? "Invoice baru" : st === "Pembayaran Dikonfirmasi" ? "Pembayaran dikonfirmasi" : "Status diperbarui", (note || st) + " · " + x.id); } });
      if (ch) sv("nx-tk", a);
    }
    var AFS = ["Aktif", "Menunggu admin balas", "Terhubung dengan admin", "Menunggu pembayaran", "Pembayaran Dikonfirmasi", "Pesanan Diproses", "Orderan Selesai", "Riwayat"], snap = {};
    function inAf(x, s) { return s === "Aktif" ? !cl(x) : s === "Riwayat" ? cl(x) : (x.st === s && !cl(x)); }
    function mk() { snap = {}; TK().forEach(function (x) { snap[x.id] = [x.m.length, x.st, cl(x), x.m.filter(function (m) { return m.rd; }).length, x.hd ? x.hd.n : "", hdMe(x)]; }); }
    function remote() {
      var cm = $(".cmp", root), val = cm ? cm.value : "", foc = cm && document.activeElement === cm, mw = adm ? "a" : "c";
      TK().forEach(function (x) { var s = snap[x.id], l = last(x);
        if (!s) { if (adm) toast("Ticket baru: " + x.id); return; }
        if (x.m.length > s[0] && l.w !== mw && l.w !== "s") toast("Pesan baru di " + x.id);
        if (x.hd && s[4] && s[4] !== x.hd.n) { if (adm && s[5] && !hdMe(x)) toast("Ticket " + x.id + " diambil alih oleh " + x.hd.n); else if (!adm) toast("Ticket kamu diambil alih oleh " + x.hd.n); }
        if (!adm && !s[2] && cl(x)) toast("Ticket " + x.id + " ditutup oleh admin"); else if (!adm && s[1] !== x.st) toast("Status " + x.id + ": " + x.st); });
      draw(); cm = $(".cmp", root); if (cm && val) { cm.value = val; fitCmp(cm); if (foc) cm.focus(); }
    }

    /* ===== Ulasan / rating NEXORA ===== */
    var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z"/></svg>', rvf = "semua", RVL = ["", "Kurang puas", "Biasa saja", "Cukup bagus", "Bagus", "Bagus banget!"];
    function RV() { return ld("nx-ulasan", []); }
    function rvOf(t) { return RV().filter(function (r) { return r.tk === t.id; })[0]; }
    function rvs(n) { var h = ""; for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? "on" : "") + '">' + STAR + "</i>"; return '<span class="rvs" role="img" aria-label="' + n + ' dari 5 bintang">' + h + "</span>"; }
    function rvBlock(t) {
      var r = rvOf(t);
      if (r) return '<section class="rvb done"><div class="rvb-h"><span class="rvb-ic">' + STAR + '</span><div><b>' + (adm ? "Ulasan customer" : "Ulasanmu untuk NEXORA") + "</b><small>" + e(r.tgl) + (adm ? "" : " · terkirim, tidak bisa diubah") + "</small></div>" + rvs(r.bintang) + "</div>" + (r.teks ? "<p>" + e(r.teks) + "</p>" : '<p class="muted">Tanpa komentar.</p>') + "</section>";
      if (adm || t.kat !== "Order baru" || t.st !== "Orderan Selesai") return "";
      var radios = [5, 4, 3, 2, 1].map(function (n) { return '<input type="radio" name="bintang" id="rv' + n + '" value="' + n + '"><label for="rv' + n + '" title="' + n + ' bintang">' + STAR + "</label>"; }).join("");
      return '<form class="rvb" data-rvsend="' + e(t.id) + '"><div class="rvb-h"><span class="rvb-ic">' + STAR + '</span><div><b>Gimana pengalamanmu pakai NEXORA?</b><small>Pesananmu <b>' + e(t.paket) + '</b> sudah selesai. Ulasan cuma bisa dikirim sekali dan tidak bisa diedit.</small></div></div><div class="rvin" role="radiogroup" aria-label="Rating">' + radios + '</div><span class="rvl" data-rvl>Pilih bintang 1-5</span><textarea class="txa" name="teks" maxlength="300" rows="3" placeholder="Ceritakan pengalamanmu (opsional)"></textarea><div class="rvb-f"><small class="hint"><span data-rvc>0</span>/300</small><button class="btn" type="submit"><i class="bi bi-send"></i> Kirim ulasan</button></div><p class="err" data-rve hidden></p></form>';
    }
    function stDD(t) {
      var dot = function (st) { return '<i class="sdot ' + (BC[st] || "b6") + '"></i>'; };
      return '<div class="dd stdd" data-stdd><button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Ubah status ticket">' + dot(t.st) + '<span class="dd-val">' + e(t.st) + '</span><i class="bi bi-chevron-down chev"></i></button><div class="dd-menu" role="listbox" hidden>' +
        ["Pesanan Diproses", "Orderan Selesai"].map(function (st) { return '<button class="dd-opt" type="button" role="option" data-v="' + e(st) + '" aria-selected="' + (st === t.st) + '"' + (st === t.st ? " disabled" : "") + '>' + dot(st) + '<span class="tx"><b>' + e(st) + '</b></span><i class="bi bi-check2 ck"></i></button>'; }).join("") + "</div></div>";
    }
    /* Satu tombol icon (titik tiga) untuk admin: ubah status + tutup ticket */
    function stMenu(t, lockC) {
      var dot = function (st) { return '<i class="sdot ' + (BC[st] || "b6") + '"></i>'; }, fin = t.st === "Orderan Selesai";
      var opts = fin ? "" : '<div class="dd-grp">Ubah status</div>' + ["Pesanan Diproses", "Orderan Selesai"].map(function (st) { return '<button class="dd-opt" type="button" role="option" data-v="' + e(st) + '" aria-selected="' + (st === t.st) + '"' + (st === t.st ? " disabled" : "") + '>' + dot(st) + '<span class="tx"><b>' + e(st) + '</b></span><i class="bi bi-check2 ck"></i></button>'; }).join("") + '<div class="tkm-sep"></div>';
      var cls = lockC ? '<button class="dd-opt tkm-x lk" type="button" role="menuitem" data-v="__close"><i class="bi bi-lock"></i><span class="tx"><b>Tutup ticket</b><small>Ubah status ke Orderan Selesai dulu</small></span></button>' : '<button class="dd-opt tkm-x" type="button" role="menuitem" data-v="__close"><i class="bi bi-x-circle"></i><span class="tx"><b>Tutup ticket</b></span></button>';
      var hb = lockC ? '<button type="button" hidden tabindex="-1" aria-hidden="true" data-close-lock></button>' : '<button type="button" hidden tabindex="-1" aria-hidden="true" data-close></button>';
      return '<div class="dd stdd tkm" data-stdd><button class="dd-btn" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Menu ticket" data-tip="Menu ticket" data-tipw="i"><i class="bi bi-gear"></i></button><div class="dd-menu" role="menu" hidden>' + opts + cls + hb + '</div></div>';
    }
    /* ===== Chat: balas, sematkan, salin, info, centang ===== */
    var rpl = null, pinI = 0, rdTry = {};
    function curT() { return TK().filter(function (x) { return x.id === sel; })[0]; }
    function msgOf(t, mid) { var r = null; t.m.forEach(function (m, i) { if (m.w !== "s" && (m.mid || ("i" + i)) === mid) r = m; }); return r; }
    function whoOf(t, m) { return m.w === "a" ? (m.r || "Admin") + (m.n ? " - " + m.n : "") : uname(t); }
    function rpWho(r, t) { return r.w === (adm ? "a" : "c") ? "Kamu" : (r.w === "a" ? (r.n || "Admin") : uname(t)); }
    function pinList(t) { var o = []; t.m.forEach(function (m, i) { if (m.pin && m.w !== "s") o.push({ mid: m.mid || ("i" + i), m: m }); }); return o; }
    function pinBar(t) {
      var p = pinList(t); if (!p.length) return "";
      if (pinI >= p.length) pinI = 0; var c = p[pinI];
      return '<div class="pinb" data-pinb><button type="button" class="pb-b" data-qj="' + e(c.mid) + '" data-pn="1"><i class="bi bi-pin-angle-fill"></i><span><b>Pesan disematkan' + (p.length > 1 ? " · " + (pinI + 1) + "/" + p.length : "") + "</b><em>" + e(whoOf(t, c.m)) + ": " + e(c.m.t.length > 90 ? c.m.t.slice(0, 90) + "…" : c.m.t) + "</em></span></button>" + (cl(t) ? "" : '<button type="button" class="pb-x" data-unpin="' + e(c.mid) + '" aria-label="Lepas sematan" title="Lepas sematan"><i class="bi bi-x-lg"></i></button>') + "</div>";
    }
    function rpInner(t) { return rpl && rpl.tk === t.id ? '<i class="bi bi-reply"></i><span class="rp-t"><b>Membalas ' + e(rpWho(rpl, t)) + "</b><em>" + e(rpl.t.length > 100 ? rpl.t.slice(0, 100) + "…" : rpl.t) + '</em></span><button type="button" class="rp-x" data-rpx aria-label="Batalkan balasan"><i class="bi bi-x-lg"></i></button>' : ""; }
    function rpBar(t) { if (cl(t)) return ""; var h = rpInner(t); return '<div class="rpb" data-rpb' + (h ? "" : " hidden") + ">" + h + "</div>"; }
    function paintRp() { var t = curT(), b = $("[data-rpb]", root); if (!t || !b) return; var h = rpInner(t); b.innerHTML = h; b.hidden = !h; }
    function jumpTo(mid) {
      var th = $(".th-m", root); if (!th) return; var r = null; $$("[data-mid]", th).forEach(function (x) { if (x.dataset.mid === mid) r = x; });
      if (!r) { toast("Pesan tidak ditemukan"); return; }
      r.scrollIntoView({ block: "center", behavior: "smooth" }); r.classList.remove("flash"); void r.offsetWidth; r.classList.add("flash"); setTimeout(function () { r.classList.remove("flash"); }, 1600);
    }
    function doReply(mid) {
      var t = curT(); if (!t || cl(t)) return; var m = msgOf(t, mid); if (!m) return;
      rpl = { tk: t.id, mid: mid, w: m.w, n: m.n || "", t: m.t }; paintRp(); var c = $(".cmp", root); if (c) c.focus();
    }
    function doPin(mid) {
      var t = curT(); if (!t || cl(t)) return; var m = msgOf(t, mid); if (!m) return; var on = !m.pin;
      if (window.NX && NX.live) { NX.msgPin(mid, on); toast(on ? "Pesan disematkan" : "Sematan dilepas"); return; }
      var a = TK(), c = a.filter(function (x) { return x.id === sel; })[0]; c.m.forEach(function (y, i) { if (y.w !== "s" && (y.mid || ("i" + i)) === mid) { if (!y.mid) y.mid = "i" + i; if (on) y.pin = true; else delete y.pin; } });
      if (on) c.m.push({ w: "s", t: me() + " menyematkan sebuah pesan", d: "Baru saja", h: hm() });
      sv("nx-tk", a); pinI = 0; if (on) { var pl = pinList(c); pinI = Math.max(0, pl.length - 1); } toast(on ? "Pesan disematkan" : "Sematan dilepas"); draw();
    }
    function doInfo(mid) {
      var t = curT(); if (!t) return; var m = msgOf(t, mid); if (!m) return; var mn = m.w === (adm ? "a" : "c"), i = t.m.indexOf(m);
      var sent = m.ts ? fts(m.ts) : e(dayL(m)) + " · " + (m.h || ptime(t.id, i));
      var rd = m.rd ? fts(m.rd) : (isRd(m) ? "Sudah dibaca (waktu tidak tercatat)" : "Belum dibaca");
      modal('<div class="mbox sm minf"><div class="mh"><b>Info pesan</b><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb"><div class="mi-pv"><b>' + e(mn ? "Kamu" : whoOf(t, m)) + "</b><span>" + e(m.t.length > 160 ? m.t.slice(0, 160) + "…" : m.t) + '</span></div><dl class="mi-l"><div><dt><span class="mtk">' + CK1 + "</span> Terkirim</dt><dd>" + sent + '</dd></div><div><dt><span class="mtk' + (isRd(m) ? " rd" : "") + '">' + CK2 + "</span> Dibaca</dt><dd" + (isRd(m) ? "" : ' class="no"') + ">" + rd + "</dd></div></dl></div></div>");
    }
    var mm = null;
    function closeMenu() { if (mm) { mm.remove(); mm = null; } $$(".mact.open", root).forEach(function (x) { x.classList.remove("open"); }); }
    function openMenu(btn, mid) {
      closeMenu(); var t = curT(); if (!t) return; var m = msgOf(t, mid); if (!m) return; var closed = cl(t);
      mm = document.createElement("div"); mm.className = "mmenu"; mm.setAttribute("role", "menu");
      mm.innerHTML = (closed ? "" : '<button type="button" role="menuitem" data-mi="rp"><i class="bi bi-reply"></i>Balas</button><button type="button" role="menuitem" data-mi="pn"><i class="bi bi-pin-angle' + (m.pin ? "-fill" : "") + '"></i>' + (m.pin ? "Lepas sematan" : "Sematkan") + "</button>") + '<button type="button" role="menuitem" data-mi="cp"><i class="bi bi-clipboard"></i>Salin teks</button><button type="button" role="menuitem" data-mi="in"><i class="bi bi-info-circle"></i>Info</button>';
      document.body.appendChild(mm); var a = btn.getBoundingClientRect(), w = mm.offsetWidth, h = mm.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
      var x = Math.min(Math.max(8, a.right - w), vw - w - 8), y = a.bottom + 6; if (y + h > vh - 8) y = Math.max(8, a.top - h - 6);
      mm.style.left = x + "px"; mm.style.top = y + "px"; var ma = btn.closest(".mact"); if (ma) ma.classList.add("open");
      mm.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-mi]"); if (!b) return; var k = b.dataset.mi; closeMenu();
        if (k === "rp") doReply(mid); else if (k === "pn") doPin(mid); else if (k === "in") doInfo(mid);
        else if (k === "cp") { cpy(m.t); toast("Teks disalin"); }
      });
      var f = $("button", mm); if (f) f.focus();
    }
    document.addEventListener("mousedown", function (ev) { if (mm && !ev.target.closest(".mmenu") && !ev.target.closest("[data-ma=mn]")) closeMenu(); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeMenu(); });
    window.addEventListener("resize", closeMenu); document.addEventListener("scroll", closeMenu, true);
    /* panah penanda menu filter ticket bisa digeser (HP) */
    function tkAr() {
      $$(".tkx-tw", root).forEach(function (w) {
        var sc = $(".tkx-tabs", w); if (!sc) return;
        var mx = sc.scrollWidth - sc.clientWidth;
        w.classList.toggle("can-l", sc.scrollLeft > 4);
        w.classList.toggle("can-r", mx > 4 && sc.scrollLeft < mx - 4);
      });
    }
    root.addEventListener("scroll", function (ev) { if (ev.target.classList && ev.target.classList.contains("tkx-tabs")) tkAr(); }, true);
    window.addEventListener("resize", tkAr);
    root.addEventListener("click", function (ev) {
      var b = ev.target.closest(".tkx-ar"); if (!b) return;
      var sc = $(".tkx-tabs", b.parentNode); if (!sc) return;
      sc.scrollBy({ left: (b.classList.contains("r") ? 1 : -1) * Math.max(120, Math.round(sc.clientWidth * 0.6)), behavior: "smooth" });
    });
    root.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-ma]"), q = ev.target.closest("[data-qj]"), u = ev.target.closest("[data-unpin]"), x = ev.target.closest("[data-rpx]");
      if (x) { rpl = null; paintRp(); return; }
      if (u) { doPin(u.dataset.unpin); return; }
      if (q) { if (q.dataset.pn) { var t = curT(), pl = t ? pinList(t) : []; jumpTo(q.dataset.qj); if (pl.length > 1) { pinI = (pinI + 1) % pl.length; var pb = $("[data-pinb]", root); if (pb) { var tmp = document.createElement("div"); tmp.innerHTML = pinBar(t); pb.replaceWith(tmp.firstChild); } } } else jumpTo(q.dataset.qj); return; }
      if (!b) return; var row = b.closest("[data-mid]"); if (!row) return;
      if (b.dataset.ma === "rp") { closeMenu(); doReply(row.dataset.mid); } else if (mm && b.classList.contains("mn") && b.closest(".mact.open")) closeMenu(); else openMenu(b, row.dataset.mid);
    });
    function markRd() {
      if (!sel || tv !== "chat" || tab !== "tiket") return; var a = TK(), c = a.filter(function (x) { return x.id === sel; })[0]; if (!c) return;
      var mw = adm ? "a" : "c", n = Date.now(), ch = false; c.m.forEach(function (m) { if (m.w !== mw && m.w !== "s" && m.ts && !m.rd) { m.rd = n; ch = true; } }); if (!ch) return;
      var key = c.id + ":" + c.m.length; if (window.NX && NX.live) { if (rdTry[key]) return; rdTry[key] = 1; NX.msgRead(c.id); } else sv("nx-tk", a);
    }
    function thread(t, back) {
      var mineW = adm ? "a" : "c", prev = "", closed = cl(t), lk0 = locked(t), pd = t.m.length ? dayL(t.m[0]) : "";
      var body = '<div class="sys">Ticket dibuat · ' + e(t.tgl) + "</div>" + t.m.map(function (m, i) {
        var tm = m.h || ptime(t.id, i);
        if (m.w === "s") { prev = ""; var stx = adm ? String(m.t).replace(/^Ticket kamu diambil alih/, "Ticket diambil alih") : m.t, tko = /diambil alih oleh/.test(stx); return '<div class="sys' + (tko ? " tko" : "") + '">' + (tko ? '<i class="bi bi-arrow-left-right"></i> ' : "") + e(stx) + " · " + e(dayL(m)) + ", " + tm + "</div>"; }
        var dv = ""; if (dayL(m) !== pd) { pd = dayL(m); dv = '<div class="sys day">' + e(pd) + "</div>"; prev = ""; }
        var first = m.w !== prev, mn = m.w === mineW; prev = m.w;
        var who = m.w === "a" ? (m.r || "Admin") + (m.n ? " - " + m.n : "") : uname(t), nc = m.w === "a" ? "var(--accent)" : ncol(who), mid = m.mid || ("i" + i);
        var rdk = isRd(m), tick = mn ? '<span class="mtk' + (rdk ? " rd" : "") + '" title="' + (rdk ? "Dibaca" : "Terkirim") + '">' + (rdk ? CK2 : CK1) + "</span>" : "";
        var qt = m.rp ? '<button type="button" class="qt" data-qj="' + e(m.rp.mid) + '"><b>' + e(rpWho(m.rp, t)) + "</b><span>" + e(m.rp.t.length > 140 ? m.rp.t.slice(0, 140) + "\u2026" : m.rp.t) + "</span></button>" : "";
        var mact = '<div class="mact">' + (closed || lk0 ? "" : '<button type="button" class="ma rp" data-ma="rp" aria-label="Balas pesan" title="Balas"><i class="bi bi-reply"></i></button>') + '<button type="button" class="ma mn" data-ma="mn" aria-label="Menu pesan" aria-haspopup="menu" title="Lainnya"><i class="bi bi-three-dots"></i></button></div>';
        return dv + '<div class="row ' + (mn ? "me" : "ot") + (first ? " first" : "") + (m.pin ? " pinned" : "") + '" data-mid="' + e(mid) + '">' + (mn ? "" : first ? (m.w === "a" ? (m.av ? av(who, m.av) : '<span class="av nx"><i class="bi bi-box2"></i></span>') : av(uname(t), t.cav)) : '<span class="av gh"></span>') + '<div class="col"><div class="bub">' + (mn ? "" : '<span class="bn" style="--nc:' + nc + '">' + e(who) + "</span>") + (m.pin ? '<i class="bi bi-pin-angle-fill pn" title="Disematkan"></i>' : "") + qt + e(m.t) + "<time>" + tm + tick + "</time></div>" + mact + "</div></div>";
      }).join("") + (closed && last(t).w !== "s" ? '<div class="sys">Ticket ditutup</div>' : "") + rvBlock(t);
      var lockC = adm && !closed && (t.st === "Pembayaran Dikonfirmasi" || t.st === "Pesanan Diproses"), si = ST.indexOf(t.st), nmsg = t.m.filter(function (m) { return m.w !== "s"; }).length;
      var lkH = "";
      var info = lkH ? '<div class="th-i">' + lkH + '</div>' : "";
      var cbd = "";
      var ibtn = '<button type="button" class="th-info' + (kinfo ? " on" : "") + '" data-kinfo aria-pressed="' + kinfo + '" aria-label="' + (kinfo ? "Sembunyikan detail" : "Tampilkan detail") + '" data-tip="' + (kinfo ? "Sembunyikan detail" : "Tampilkan detail") + '"><i class="bi bi-layout-sidebar-inset' + (kinfo ? "-reverse" : "") + '"></i></button>';
      var act = lk0 ? bd(t.st) + '<span class="st-lk hd" title="Status hanya bisa diubah admin yang menangani ticket"><i class="bi bi-lock-fill"></i> Ditangani ' + e(t.hd.n) + "</span>" + ibtn : adm ? (closed ? bd(t.st) + cbd + (isF() ? '<button class="btn dng sm" type="button" data-tdel aria-label="Hapus ticket" data-tip="Hapus ticket" data-tipw="i"><i class="bi bi-trash3"></i> Hapus</button>' : "") + ibtn : (t.st === "Orderan Selesai" ? '<span class="st-lk" title="Status final, tidak bisa diubah lagi"><i class="bi bi-lock-fill"></i> Orderan Selesai</span>' : bd(t.st)) + stMenu(t, lockC) + ibtn) : bd(t.st) + cbd + ibtn;
      var chd = !adm && t.hd ? t.hd : null, ttl = chd ? chd.n : t.subj, sub = t.id + (adm ? " · " + uname(t) : chd ? " · " + (chd.r || "Admin") : "");
      return '<div class="th"><div class="th-h">' + (adm || chd ? '<span class="th-aw">' + (adm ? av(uname(t), t.cav) : av(chd.n, chd.a)) + '<i class="pdot" hidden></i></span>' : '<span class="th-ic"><i class="bi bi-' + (t.kat === "Order baru" ? "receipt" : t.kat === "Pembayaran" ? "wallet2" : "chat-dots") + '"></i></span>') + '<div class="th-t"><b data-tip="' + e(ttl) + '" data-tipw="t">' + e(ttl) + '</b><small data-tip="' + e(sub) + '" data-tipw="t">' + e(sub) + '<span class="pst" hidden></span></small></div><div class="th-a">' + act + "</div></div>" + info +
        pinBar(t) + '<div class="th-m">' + body + "</div>" + (lk0 ? "" : rpBar(t)) +
        (closed ? '<p class="muted done"><i class="bi bi-chat-dots"></i> Ticket ini sudah ditutup, chat tidak bisa dikirim lagi.' + (adm ? "" : " Buka ticket baru kalau masih butuh bantuan.") + "</p>" : lk0 ? '<div class="th-lock" role="group" aria-label="Ticket sedang ditangani admin lain"><p><i class="bi bi-lock-fill"></i><span>Ticket ini sedang ditangani <b>' + e(t.hd.n) + "</b> (" + e(t.hd.r) + '). Kamu tidak bisa membalas chat.</span></p><button type="button" class="btn" data-takeover="' + e(t.id) + '"><i class="bi bi-arrow-left-right"></i> Apakah kamu ingin mengambil alih ticket ini?</button></div>' : '<form class="th-f" data-rep><textarea class="cmp" rows="1" placeholder="Tulis pesan…" enterkeyhint="send" required></textarea><button class="send" type="submit" aria-label="Kirim"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3.4 20.4 21.9 12.5a.6.6 0 0 0 0-1.1L3.4 3.6a.6.6 0 0 0-.84.55L2.5 9.7c0 .3.2.55.5.6L14 12 3 13.7a.6.6 0 0 0-.5.6l.06 5.55c0 .45.45.75.84.55z"/></svg></button></form>') + "</div>";
    }
    function admList() {
      var a = TK().filter(function (x) { return inAf(x, af) && (x.subj + " " + uname(x) + " " + x.id).toLowerCase().indexOf(aq.toLowerCase()) > -1; });
      return a.map(function (x) { var l = last(x); return '<button class="tk-item" data-id="' + x.id + '" aria-current="' + (x.id === sel) + '">' + av(uname(x), x.cav) + '<span class="ti"><b>' + (!cl(x) && l.w === "c" ? '<i class="dot" title="Menunggu balasan"></i>' : "") + e(x.subj) + "</b><small>" + e(x.id) + " · " + e(uname(x)) + '</small></span><span class="tr"><small>' + e(l.d) + "</small>" + bd(x.st, 1) + "</span></button>"; }).join("") || '<p class="muted pad">Tidak ada ticket.</p>';
    }
    function cList() {
      var q = aq.toLowerCase();
      var a = mine().filter(function (x) { return !cl(x) && (x.subj + " " + x.id + " " + x.paket + " " + x.kat).toLowerCase().indexOf(q) > -1; });
      return a.map(function (x) {
        var l = last(x), who = l.w === "a" ? "Admin: " : l.w === "c" ? "Kamu: " : "";
        return '<button class="tk-item cti" data-id="' + x.id + '" aria-current="' + (x.id === sel) + '"><span class="ct-ic"><i class="bi bi-' + (x.kat === "Order baru" ? "receipt" : x.kat === "Pembayaran" ? "wallet2" : "chat-dots") + '"></i></span><span class="ti"><b>' + (l.w === "a" ? '<i class="dot" title="Ada balasan admin"></i>' : "") + e(x.subj) + "</b><small>" + e(x.id) + " · " + e(x.kat) + (x.paket !== "-" ? " · " + e(x.paket) : "") + '</small><span class="pv">' + who + e(l.t) + '</span></span><span class="tr"><small>' + e(l.d) + "</small>" + bd(x.st, 1) + "</span></button>";
      }).join("") || '<p class="muted pad">Tidak ada ticket yang cocok.</p>';
    }
    var PG = { bh: 1, bl: 1 }, PS = 10;
    function pgs(key, arr) { var n = Math.max(1, Math.ceil(arr.length / PS)); if (PG[key] > n) PG[key] = n; if (PG[key] < 1) PG[key] = 1; return arr.slice((PG[key] - 1) * PS, PG[key] * PS); }
    function pgr(key, total) {
      var n = Math.ceil(total / PS); if (n <= 1) return ""; var c = Math.min(PG[key], n), L = [];
      if (n <= 7) { for (var i = 1; i <= n; i++) L.push(i); } else { L = [1]; if (c > 3) L.push("…"); for (var j = Math.max(2, c - 1); j <= Math.min(n - 1, c + 1); j++) L.push(j); if (c < n - 2) L.push("…"); L.push(n); }
      var b = function (p, ic, lb, off) { return '<button type="button" class="pgb pgi" data-pg="' + key + ":" + p + '" aria-label="' + lb + '"' + (off ? " disabled" : "") + '><i class="bi bi-chevron-' + ic + '"></i></button>'; };
      return '<nav class="pgn" aria-label="Halaman"><div class="pgn-b">' + b(c - 1, "left", "Halaman sebelumnya", c === 1) + L.map(function (x) { return x === "…" ? '<span class="pgd">…</span>' : '<button type="button" class="pgb" data-pg="' + key + ":" + x + '"' + (x === c ? ' aria-current="page"' : "") + ' aria-label="Halaman ' + x + '">' + x + "</button>"; }).join("") + b(c + 1, "right", "Halaman berikutnya", c === n) + '</div><small class="pgn-i">' + ((c - 1) * PS + 1) + "–" + Math.min(c * PS, total) + " dari " + total + "</small></nav>";
    }
    /* Ticket (customer & admin): tampilan tabel (tab status, cari, jenis, halaman) */
    var KPER = 10, KJ = ["Semua", "Jasa Setup", "Hosting", "Pembayaran", "Bantuan"];
    function kJenis(x) {
      if (x.kat === "Pembayaran") return "Pembayaran";
      if (x.kat === "Bantuan") return "Bantuan";
      if (x.kat !== "Order baru") return "Lainnya";
      var p = String(x.paket || ""), host = JR("hosting").some(function (h) { return h.nama === p; }) || /hosting/i.test(p);
      return host ? "Hosting" : "Jasa Setup";
    }
    function kSrc() { return adm ? TK() : mine().filter(function (x) { return !cl(x); }); }
    function kRows() {
      var q = kq.toLowerCase();
      return kSrc().filter(function (x) {
        return (adm ? inAf(x, af) : (kf === "Semua" || x.st === kf)) && (kk === "Semua" || kJenis(x) === kk) &&
          (!q || (x.subj + " " + x.id + " " + x.kat + " " + x.paket + " " + (adm ? uname(x) + " " : "") + x.m.map(function (m) { return m.t; }).join(" ")).toLowerCase().indexOf(q) >= 0);
      });
    }
    function kTabs() {
      var all = kSrc(), its = [[adm ? "Aktif" : "Semua", "Semua"]].concat(ST.map(function (s2) { return [s2, SHORT[s2]]; }));
      if (adm) its.push(["Riwayat", "Riwayat"]);
      return '<div class="tkx-tw"><div class="tkx-tabs" role="tablist" aria-label="Filter status ticket">' + its.map(function (it) {
        var n = adm ? all.filter(function (x) { return inAf(x, it[0]); }).length : (it[0] === "Semua" ? all.length : all.filter(function (x) { return x.st === it[0]; }).length);
        return '<button type="button" role="tab" data-kf="' + e(it[0]) + '" aria-selected="' + ((adm ? af : kf) === it[0]) + '">' + e(it[1]) + (n ? "<em>" + n + "</em>" : "") + "</button>";
      }).join("") + '</div><button type="button" class="tkx-ar l" aria-label="Geser ke kiri"><i class="bi bi-chevron-left"></i></button><button type="button" class="tkx-ar r" aria-label="Geser ke kanan"><i class="bi bi-chevron-right"></i></button></div>';
    }
    function kShell() {
      var kc = KJ;
      if (kc.indexOf(kk) < 0) kk = "Semua";
      var kopt = kc.map(function (v) { return '<button class="dd-opt" type="button" role="option" data-v="' + e(v) + '" aria-selected="' + (v === kk) + '"><span class="tx"><b>' + e(v) + '</b></span><i class="bi bi-check2 ck"></i></button>'; }).join("");
      return kTabs() +
        '<div class="tkx-f"><label class="tkx-fb grow"><span>Cari ticket dan pesan</span><span class="tkx-sb"><i class="bi bi-search"></i><input data-kq type="search" placeholder="' + (adm ? "Cari ticket, customer, atau pesan" : "Cari ticket atau pesan") + '" value="' + e(kq) + '" autocomplete="off"></span></label>' +
        '<div class="tkx-fb"><span>Jenis</span><div class="dd tkx-kd" data-kkd><button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false"><span class="dd-val">' + e(kk) + '</span><i class="bi bi-chevron-down chev"></i></button><div class="dd-menu" role="listbox" hidden>' + kopt + "</div></div></div></div>" +
        '<div class="tkx-box"><div class="tkx-res">' + kBody() + "</div></div>";
    }
    function kBody() {
      var rows = kRows(), tot = rows.length, per = KPER, np = Math.max(1, Math.ceil(tot / per));
      if (kpg > np) kpg = np; if (kpg < 1) kpg = 1;
      var a = (kpg - 1) * per, pg = rows.slice(a, a + per);
      var list = pg.map(function (x) {
        var wait = adm && !cl(x) && last(x).w === "c" ? '<i class="dot" title="Menunggu balasan"></i>' : "";
        return '<button type="button" class="tkx-r' + (adm ? " adm" : "") + '" data-kr="' + e(x.id) + '"><span class="tkx-t"><b>' + wait + e(x.subj) + "</b><small><code>" + e(x.id) + "</code><span>" + e(kJenis(x) !== "Lainnya" ? kJenis(x) : x.kat) + (adm && x.paket && x.paket !== "-" ? " · " + e(x.paket) : "") + "</span></small></span>" +
          (adm ? '<span class="tkx-u">' + av(uname(x), x.cav) + "<span>" + e(uname(x)) + "</span></span>" : "") +
          '<span class="tkx-s">' + bd(x.st, 1) + "</span>" + (adm ? "" : '<span class="tkx-p">' + (x.paket && x.paket !== "-" ? e(x.paket) : "-") + "</span>") + '<span class="tkx-d">' + e(x.tgl) + "</span></button>";
      }).join("");
      var any = kSrc().some(function (x) { return adm ? inAf(x, af) : true; });
      if (!tot) list = '<div class="tkx-empty"><i class="bi bi-chat-dots"></i><b>' + (any ? "Tidak ada ticket yang cocok" : (adm && af === "Riwayat" ? "Belum ada riwayat ticket" : "Belum ada ticket aktif")) + "</b><p>" + (any ? "Coba ubah kata kunci atau filter." : (adm ? "Ticket dari customer akan muncul di sini." : "Buka ticket baru untuk order atau bertanya ke tim NEXORA.")) + "</p></div>";
      var del = adm && isF() && af === "Riwayat" && tot ? '<button class="btn dng sm tkx-del" type="button" data-tdelall><i class="bi bi-trash3"></i> Hapus semua riwayat (' + tot + ")</button>" : "";
      return '<div class="tkx-h' + (adm ? " adm" : "") + '"><span>Ticket</span>' + (adm ? "<span>Customer</span>" : "") + "<span>Status</span>" + (adm ? "" : "<span>Paket</span>") + "<span>Dibuat</span></div>" + '<div class="tkx-list">' + list + "</div>" +
        (np > 1 || del ? '<div class="tkx-foot">' + del + (np > 1 ? '<span class="tkx-rg">' + (a + 1) + "–" + (a + pg.length) + " dari " + tot + '</span><button type="button" class="tkx-pb" data-kpg="prev" aria-label="Halaman sebelumnya"' + (kpg <= 1 ? " disabled" : "") + '><i class="bi bi-chevron-left"></i></button><button type="button" class="tkx-pb" data-kpg="next" aria-label="Halaman berikutnya"' + (kpg >= np ? " disabled" : "") + '><i class="bi bi-chevron-right"></i></button>' : "") + "</div>" : "");
    }
    /* Daftar ticket di samping chat (desktop): kolom cari + tab Aktif/Selesai + list. Di HP disembunyikan lewat CSS. */
    function sideRows() {
      var q = kq.toLowerCase();
      return (adm ? TK() : mine()).filter(function (x) {
        return (stab === "selesai" ? cl(x) : !cl(x)) &&
          (!q || (x.subj + " " + x.id + " " + x.kat + " " + x.paket + " " + (adm ? uname(x) + " " : "") + x.m.map(function (m) { return m.t; }).join(" ")).toLowerCase().indexOf(q) >= 0);
      });
    }
    function sideItems() {
      return sideRows().map(function (x) {
        var wait = adm && !cl(x) && last(x).w === "c" ? '<i class="dot" title="Menunggu balasan"></i>' : "";
        return '<button type="button" class="tk-item tks-i" data-id="' + e(x.id) + '" aria-current="' + (x.id === sel) + '"><b>' + wait + e(x.subj) + "</b><small><code>" + e(x.id) + "</code><span>" + e(x.tgl) + "</span>" + (adm ? "<span>" + e(uname(x)) + "</span>" : "") + "</small></button>";
      }).join("") || '<p class="muted pad">' + (kq ? "Tidak ada ticket yang cocok." : (stab === "selesai" ? "Belum ada ticket selesai." : "Belum ada ticket aktif.")) + "</p>";
    }
    /* Panel info ticket (kanan chat): orang di ticket, tahapan, tentang ticket */
    function tkInfo(t) {
      var closed = cl(t), si = closed ? ST.length : Math.max(0, ST.indexOf(t.st)), ppl = [], seen = {};
      t.m.forEach(function (m) { if (m.w !== "a") return; var k = m.n || m.r || "Admin"; if (seen[k]) return; seen[k] = 1; ppl.push({ n: m.n || "Tim NEXORA", r: m.r || "Admin", a: m.av }); });
      var cust = '<div class="ti-p">' + av(uname(t), t.cav) + "<div><b>" + e(uname(t)) + "</b><small>Customer · Pembuka ticket</small></div></div>";
      var h1 = t.hd ? { n: t.hd.n, r: t.hd.r, a: t.hd.a } : ppl[0], hand = h1 ? '<div class="ti-p">' + (h1.a ? av(h1.n, h1.a) : '<span class="av nx"><i class="bi bi-box2"></i></span>') + "<div><b>" + e(h1.n) + "</b><small>" + e(h1.r) + (adm ? " · Menangani ticket" : "") + "</small></div></div>" :
        '<div class="ti-p"><span class="ti-q" aria-hidden="true">?</span><div><b class="ti-wait">' + (adm ? "Belum ada admin yang menangani" : "Menunggu admin mengambil ticket kamu") + "</b></div></div>";
      var fin = closed || si >= ST.length - 1, ph = fin ? 3 : (si === 0 ? 0 : 1);
      var hs = ["Menunggu admin", "Ditangani", "Selesai"].map(function (l, i) {
        var done = i < ph, cur = i === ph;
        return '<li class="' + (done ? "is-done" : cur ? "is-cur" : "") + '" style="--i:' + i + '"' + (cur ? ' aria-current="step"' : "") + '><span class="ti-dot">' + (done ? '<i class="bi bi-check-lg"></i>' : i + 1) + '</span><span class="ti-lb">' + l + "</span>" + (ph === 1 && i === 0 ? '<span class="ti-trk" aria-hidden="true"><i class="ti-bead"></i></span>' : "") + "</li>";
      }).join("");
      var dib = t.tgl + (t.m[0] && t.m[0].h ? ", " + t.m[0].h : "");
      var row = function (l, v) { return '<div class="ti-r"><span>' + l + "</span><span>" + v + "</span></div>"; };
      var cb = "";
      if (adm) {
        var cu = custInfo(uname(t)), none = '<span class="ti-none">Belum diisi</span>';
        var cp = function (v) { return '<button type="button" class="ti-cp" data-kcp="' + e(v) + '" aria-label="Salin" title="Salin"><i class="bi bi-copy"></i></button>'; };
        cb = '<h4>Info customer</h4><div class="ti-ab">' + row("Nama akun", e(uname(t))) + row("Discord", cu.discord ? e(cu.discord) + cp(cu.discord) : none) + '</div>' + (arole() !== "Teknisi" ? '<button type="button" class="btn ghost sm ti-cu" data-cu="' + e(uname(t)) + '"><i class="bi bi-person-vcard"></i> Lihat akun lengkap</button>' : "");
      }
      return '<aside class="tk-info" aria-label="Info ticket"><div class="ti-in"><button type="button" class="ti-x" data-kinfo aria-label="Tutup info"><i class="bi bi-x-lg"></i></button>' +
        '<h4>Orang di ticket ini</h4><div class="ti-pl">' + (adm ? hand + cust : hand) + "</div>" +
        '<h4>Tahapan</h4><ol class="ti-hs ph' + ph + '">' + hs + "</ol>" +
        '<h4>Tentang ticket</h4><div class="ti-ab">' + row("Nomor", '<code class="ti-id">' + e(t.id) + '</code><button type="button" class="ti-cp" data-kcopy="' + e(t.id) + '" aria-label="Salin nomor ticket" title="Salin nomor"><i class="bi bi-copy"></i></button>') +
        row("Dibuat", e(dib)) + "</div>" + cb + "</div></aside>";
    }
    function sidePane(t) {
      if (stabFor !== t.id) { stabFor = t.id; stab = cl(t) ? "selesai" : "aktif"; }
      return '<div class="tk-side tks"><div class="tk-tools"><label class="sbox"><i class="bi bi-search"></i><input class="inp" data-sq type="search" placeholder="Cari tiket atau pesan" value="' + e(kq) + '" autocomplete="off"></label><div class="tks-tabs" role="tablist" aria-label="Filter ticket"><button type="button" role="tab" data-stab="aktif" aria-selected="' + (stab !== "selesai") + '">Aktif</button><button type="button" role="tab" data-stab="selesai" aria-selected="' + (stab === "selesai") + '">Selesai</button></div></div><div class="tk-list tks-list">' + sideItems() + "</div></div>";
    }
    function tkPanel() {
      if (!adm) {
        tg = "aktif";
        var cur = mine();
        if (!cur.some(function (x) { return x.id === sel; })) sel = null;
        var t = cur.filter(function (x) { return x.id === sel; })[0];
        if (t && tv === "chat") return '<div class="tk adm cs chat tkx-chat tkx-two' + (kinfo ? " has-info" : "") + '">' + sidePane(t) + '<div class="tk-chat">' + thread(t, true) + "</div>" + tkInfo(t) + "</div>";
        return '<div class="tkx"><button type="button" class="btn tkx-new" data-go="buka"><i class="bi bi-plus-circle"></i> Ticket baru</button>' + kShell() + "</div>";
      }
      var all = TK();
      if (!all.some(function (x) { return x.id === sel; })) sel = null;
      var t2 = all.filter(function (x) { return x.id === sel; })[0];
      if (t2 && tv === "chat") return '<div class="tk adm chat tkx-chat tkx-two' + (kinfo ? " has-info" : "") + '">' + sidePane(t2) + '<div class="tk-chat">' + thread(t2) + "</div>" + tkInfo(t2) + "</div>";
      return '<div class="tkx">' + kShell() + "</div>";
    }
    /* Filter ticket admin: 3 tab ringkas + dropdown status (custom, bukan <select> bawaan). Semua muat tanpa geser ke samping. */
    function tkFilter(all) {
      var cnt = function (st) { return all.filter(function (x) { return inAf(x, st); }).length; },
          W = "Menunggu admin balas", nA = cnt("Aktif"), nW = cnt(W), nH = cnt("Riwayat"),
          lab = function (st) { return st === "Aktif" ? "Semua status" : st; },
          tab = function (key, txt, n, on, cls) { return '<button type="button" data-af="' + key + '" aria-pressed="' + on + '"' + (cls ? ' class="' + cls + '"' : "") + ">" + txt + " <b>" + n + "</b></button>"; };
      var seg = '<div class="tkf-seg" role="group" aria-label="Filter ticket">' + tab("Aktif", "Aktif", nA, af !== "Riwayat" && af !== W) + tab(W, "Perlu dibalas", nW, af === W, nW ? "hot" : "") + tab("Riwayat", "Riwayat", nH, af === "Riwayat") + "</div>";
      if (af === "Riwayat") return seg;
      var cur = AFS.indexOf(af) >= 0 ? af : "Aktif", dot = function (st) { return '<i class="sdot ' + (BC[st] || "b6") + '"></i>'; };
      var opts = AFS.filter(function (st) { return st !== "Riwayat"; });
      return seg + '<div class="dd full tkf-dd" id="dd-tkf" data-afdd><button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Filter status ticket"><span class="dd-val tkf-v"><span class="tkf-k">Status</span>' + (cur === "Aktif" ? '<i class="sdot all"></i>' : dot(cur)) + "<b>" + e(lab(cur)) + '</b><em>' + cnt(cur) + '</em></span><i class="bi bi-chevron-down chev"></i></button><div class="dd-menu" role="listbox" hidden>' +
        opts.map(function (st) { return '<button class="dd-opt" type="button" role="option" data-v="' + e(st) + '" aria-selected="' + (st === cur) + '">' + (st === "Aktif" ? '<i class="sdot all"></i>' : dot(st)) + '<span class="tx"><b>' + e(lab(st)) + '</b></span><em class="tkf-n">' + cnt(st) + '</em><i class="bi bi-check2 ck"></i></button>'; }).join("") + "</div></div>";
    }
    /* ===== Buka ticket: kartu paket (pengganti dropdown) ===== */
    function pkUnit() { return bsv === "hosting" ? "per bulan" : "sekali bayar"; }
    var PSEP = " + ";
    function pkList(v) { return v ? String(v).split(PSEP).filter(Boolean) : []; }
    function pkSubj(l) { return "Order " + (l[0] || "") + (l.length > 1 ? " +" + (l.length - 1) : ""); }
    function pkDraw(rows) {
      var f = $("#f-buka"), box = $("#pk-box"); if (!f || !box) return;
      var cats = [], sl = pkList(f.paket.value), cur = sl[0];
      rows.forEach(function (p) { if (cats.indexOf(p.kat) < 0) cats.push(p.kat); });
      if (bcat !== "semua" && cats.indexOf(bcat) < 0) bcat = "semua";
      var chips = cats.length > 1 ? '<div class="chips mini pk-chips" role="group" aria-label="Kategori paket">' + ["semua"].concat(cats).map(function (c) { var n = c === "semua" ? rows.length : rows.filter(function (p) { return p.kat === c; }).length; return '<button class="chip" type="button" data-pkc="' + e(c) + '" aria-pressed="' + (c === bcat) + '">' + (c === "semua" ? "Semua" : e(c)) + " <b>" + n + "</b></button>"; }).join("") + "</div>" : "";
      var lst = rows.filter(function (p) { return bcat === "semua" || p.kat === bcat; }), ps = window.innerWidth <= 640 ? 4 : 6, np = Math.max(1, Math.ceil(lst.length / ps));
      if (bpg < 1) { var ci = -1; lst.forEach(function (p, i) { if (p.nama === cur) ci = i; }); bpg = ci >= 0 ? Math.floor(ci / ps) + 1 : 1; }
      if (bpg > np) bpg = np;
      var cards = lst.slice((bpg - 1) * ps, bpg * ps).map(function (p) {
        var fi = (p.fitur || []).slice(0, 3);
        return '<button type="button" class="pk" data-pk="' + e(p.nama) + '" aria-pressed="' + (sl.indexOf(p.nama) >= 0) + '"><span class="pk-ck" aria-hidden="true"><i class="bi bi-check-lg"></i></span><span class="pk-nm"><b>' + e(p.nama) + "</b>" + (p.populer ? '<em class="pk-pop"><i class="bi bi-stars"></i> Populer</em>' : "") + "</span>" +
          (p.ringkas ? '<span class="pk-ds">' + e(p.ringkas) + "</span>" : "") +
          (fi.length ? '<span class="pk-ft">' + fi.map(function (x) { return "<span>" + e(x) + "</span>"; }).join("") + "</span>" : "") +
          '<span class="pk-pr"><strong>' + rp(p.harga) + "</strong><small>" + pkUnit() + "</small></span></button>";
      }).join("");
      var a0 = (bpg - 1) * ps, foot = np > 1 ? '<div class="pk-foot"><span class="pk-rg">' + (a0 + 1) + "–" + Math.min(a0 + ps, lst.length) + " dari " + lst.length + ' paket</span><div class="pk-nav"><button type="button" class="tkx-pb" data-pkpg="prev" aria-label="Halaman sebelumnya"' + (bpg <= 1 ? " disabled" : "") + '><i class="bi bi-chevron-left"></i></button><span class="pk-pn">' + bpg + " / " + np + '</span><button type="button" class="tkx-pb" data-pkpg="next" aria-label="Halaman berikutnya"' + (bpg >= np ? " disabled" : "") + '><i class="bi bi-chevron-right"></i></button></div></div>' : "";
      box.innerHTML = !bsv ? '<div class="pk-empty"><i class="bi bi-hand-index-thumb"></i><span>Pilih jenis layanan di atas dulu, nanti daftar paketnya muncul di sini.</span></div>' : rows.length ? chips + '<div class="pk-grid' + (bsv === "hosting" ? "" : " multi") + '" role="group" aria-label="Pilih paket">' + cards + "</div>" + foot : '<div class="pk-empty"><i class="bi bi-inbox"></i><span>Belum ada paket untuk layanan ini.</span></div>';
    }
    function ddClose() { $$(".dd-menu").forEach(function (m) { m.hidden = true; if (m.previousElementSibling) m.previousElementSibling.setAttribute("aria-expanded", "false"); }); }
    document.addEventListener("click", function (ev) { if (!ev.target.closest(".dd")) ddClose(); });
    function LK() { var P = ld("nx-prof", {}), via = ss("nx-via") || "email", L = P.lk || {}; return { P: P, via: via, g: via === "Google" || L.g === true, d: via === "Discord" || L.d === true }; }
    function PC() {
      var k = LK(), P = k.P;
      var v = String(k.via || "").toLowerCase(), it = [["whatsapp", "Nomor WhatsApp", !!P.wa, "profile"]];
      if (v !== "google") it.push(["google", "Akun Google", k.g, "profile"]);
      if (v !== "discord") it.push(["link-45deg", "Akun Discord", k.d, "profile"]);
      return { it: it, n: it.filter(function (x) { return x[2]; }).length, t: it.length };
    }
    function pcBanner() {
      var c = PC(); if (c.n >= c.t) return "";
      var pct = Math.round(c.n / c.t * 100), TX = { "Nama akun": "Isi nama akun di profil", "Nomor WhatsApp": "Isi nomor WhatsApp supaya teknisi gampang menghubungimu", "Akun Google": "Hubungkan akun Google", "Akun Discord": "Hubungkan akun Discord" }, nx = -1;
      c.it.forEach(function (x, i) { if (!x[2] && nx < 0) nx = i; });
      return '<section class="pcb" aria-label="Kelengkapan akun"><div class="pcb-r" style="--p:' + pct + '" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><b>' + pct + '%</b></div><div class="pcb-m"><h3>Lengkapi akunmu</h3><ul class="pcb-l">' +
        c.it.map(function (x, i) { return '<li class="' + (x[2] ? "ok" : i === nx ? "next" : "") + '">' + (x[2] ? '<i class="bi bi-check-circle pcb-s"></i>' : '<span class="pcb-d" aria-hidden="true"></span>') + '<span class="pcb-n">' + e(TX[x[1]] || x[1]) + "</span>" + (i === nx ? '<button type="button" class="btn pcb-b" data-go="profile">' + (/^Akun /.test(x[1]) ? "Hubungkan" : "Isi profil") + "</button>" : "") + "</li>"; }).join("") + "</ul></div></section>";
    }
    function lkCard(bare) {
      var k = LK(), row = function (key, ic, nm, on, sub) {
        var utama = k.via.toLowerCase() === key;
        return '<div class="lk"><span class="lk-i ' + key + '"><i class="bi bi-' + ic + '"></i></span><div class="lk-t"><b>' + nm + "</b><small>" + sub + '</small></div>' + (on ? '<span class="bd b4"><i class="bi bi-check2"></i> Terhubung</span>' : "") +
          '<button type="button" class="btn ' + (on ? "ghost" : "") + ' lk-b" data-lk="' + key + '"' + (utama ? " disabled" : "") + ">" + (on ? (utama ? "Login utama" : "Putuskan") : "Hubungkan") + "</button></div>";
      };
      return (bare ? '' : '<section class="dcard"><h3><i class="bi bi-link-45deg"></i> Akun terhubung</h3>') + '<p class="muted lk-n">Hubungkan Google dan Discord supaya bisa masuk lewat salah satunya dengan akun yang sama.</p>' +
        row("google", "google", "Google", k.g, k.g ? (k.via === "Google" ? "Kamu login lewat Google" : "Bisa dipakai untuk masuk") : "Belum terhubung") +
        row("discord", "discord", "Discord", k.d, k.d ? (k.via === "Discord" ? "Kamu login lewat Discord" : (k.P.discord ? "@" + e(k.P.discord) : "Bisa dipakai untuk masuk")) : "Belum terhubung") + (bare ? "" : "</section>");
    }
    /* indikator tab (latar yang bergeser ke tab terpilih): layanan di Mulai Order, filter di Ticket dan Invoice */
    function tabInd(tb, anim) {
      if (!tb) return;
      var sl = $('button[aria-selected="true"]', tb), ind = $(".tkx-ind", tb); if (!sl) return;
      tb.classList.add("sl-tabs");
      if (!ind) { ind = document.createElement("span"); ind.className = "tkx-ind nt"; ind.setAttribute("aria-hidden", "true"); tb.insertBefore(ind, tb.firstChild); }
      var tl = sl.offsetLeft + "px", tw = sl.offsetWidth + "px";
      if (!anim && ind.style.left === tl && ind.style.width === tw) return;
      if (!anim) ind.classList.add("nt"); else if (ind.classList.contains("nt")) { void ind.offsetWidth; ind.classList.remove("nt"); }
      ind.style.left = tl; ind.style.width = tw;
    }
    function bkInd(anim) { tabInd($("#p-buka .tkx-tabs"), anim); }
    function allInd() { if (adm) return; $$("#p-buka .tkx-tabs,#p-tiket .tkx-tabs,#p-tagihan .tkx-tabs,#p-profile .tkx-tabs", root).forEach(function (tb) { tabInd(tb, false); }); }
    window.addEventListener("resize", allInd);
    function bukaSync() {
      var f = $("#f-buka"); if (!f) return;
      var k = f.kat.value, ord = k === "Order baru";
      $("#ord").hidden = !ord; $("#rq").hidden = ord; f.subj.required = !ord; $("#n3").textContent = ord ? "3" : "2";
      var rows = JR(bsv);
      if (ord && f.paket.dataset.l !== bsv) { f.paket.value = ""; f.paket.dataset.l = bsv; bcat = "semua"; bpg = 0; pkDraw(rows); }
      var sl = pkList(f.paket.value), ps = rows.filter(function (x) { return sl.indexOf(x.nama) >= 0; }), p = ps[0], tot = ps.reduce(function (a, x) { return a + x.harga; }, 0), multi = ps.length > 1;
      $$(".pk", f).forEach(function (b) { b.setAttribute("aria-pressed", sl.indexOf(b.dataset.pk) >= 0); });
      var ohs = $("#ord h3 small"); if (ohs) ohs.textContent = !bsv ? "Pilih jenis layanan, lalu paket yang paling cocok." : bsv === "hosting" ? "Pilih jenis layanan, lalu paket hosting yang paling cocok." : "Pilih jenis layanan, lalu satu atau beberapa paket sekaligus.";
      var svn = !bsv ? "Belum dipilih" : bsv === "hosting" ? "Hosting" : JM(bsv).nama;
      var sh = $("#bsum .bsum-h"), sj = f.subj.value.trim();
      if (sh) { $("b", sh).textContent = ord ? "Ringkasan" : "Ringkasan bantuan"; $("small", sh).textContent = ord ? "Cek dulu sebelum dikirim" : "Tim NEXORA siap membantu"; $(".bsum-hi i", sh).className = "bi bi-" + (ord ? "receipt-cutoff" : "life-preserver"); }
      $("#bsum-l").innerHTML = ord ? "<div><dt>Jenis</dt><dd>" + e(k) + "</dd></div><div><dt>Layanan</dt><dd>" + e(svn) + "</dd></div>"
        : "<div><dt>Jenis</dt><dd>" + e(k) + '</dd></div><div><dt>Topik</dt><dd class="ell' + (sj ? "" : " mut") + '">' + (sj ? e(sj) : "Belum diisi") + '</dd></div>';
      var bt = $("#bsum-t"); bt.className = "bsum-t" + (ord ? "" : " free");
      bt.innerHTML = ord
        ? '<div class="bsum-pk' + (multi ? " multi" : "") + '"><small>' + (multi ? ps.length + " paket dipilih" : p ? e(p.kat) : "Paket") + "</small><b>" + (p ? e(ps.map(function (x) { return x.nama; }).join(", ")) : "Belum dipilih") + '</b></div><div class="bsum-pr"><b>' + (p ? rp(tot) : "-") + "</b>" + (p ? "<small>" + pkUnit() + "</small>" : "") + "</div>"
        : '<div class="bsum-pk"><b>Konsultasi dengan tim</b></div>';
      var bn = $("#bsum-n"); bn.textContent = ord ? "Harga final dikonfirmasi tim NEXORA setelah ticket dibalas." : ""; bn.hidden = !ord;
      f.subj.placeholder = ord ? (ps.length ? "Boleh dikosongkan, otomatis jadi " + pkSubj(ps.map(function (x) { return x.nama; })) : "Boleh dikosongkan, otomatis mengikuti paket yang dipilih") : "Ringkas masalah atau pertanyaanmu";
      f.msg.placeholder = ord ? "Ceritakan kebutuhanmu: versi Minecraft, jumlah pemain, plugin atau mod yang diinginkan, dll." : "Tulis pesanmu dengan jelas agar cepat kami bantu.";
    }
    function li(a) { return a.map(function (x) { return '<button class="li" data-gt="' + x.id + '"><span><b>' + e(x.subj) + "</b><small>" + e(x.id) + " · " + e(x.tgl) + "</small></span>" + bd(x.st, 1) + "</button>"; }).join("") || '<p class="muted">Belum ada.</p>'; }
    function harga(kind) {
      var H = HG(), j = kind === "jasa", cats = []; if (j && !H.jasa[hs]) hs = Object.keys(H.jasa)[0] || ""; var rows = kind === "hosting" ? H.hosting : (H.jasa[hs] || []);
      rows.forEach(function (p) { if (cats.indexOf(p.kat) < 0) cats.push(p.kat); });
      var cf = hcat[kind] || "semua"; if (cf !== "semua" && cats.indexOf(cf) < 0) cf = "semua"; hcat[kind] = cf;
      var JKs = Object.keys(H.jasa), head = '<div class="tkhead">' + (j ? '<div class="seg2 jseg jdesk">' + JKs.map(function (k) { return '<button type="button" data-hs="' + k + '" aria-pressed="' + (k === hs) + '"><i class="bi bi-' + e(JM(k).ic) + '"></i>' + e(JM(k).nama) + " <b>" + H.jasa[k].length + "</b></button>"; }).join("") + '<button type="button" class="jnew" data-jadd><i class="bi bi-plus-lg"></i> Jasa baru</button></div>' + jmob(JKs, hs, H) : '<span class="muted">' + rows.length + " paket hosting</span>") + (j && !hs ? "" : '<button class="btn" type="button" data-add><i class="bi bi-plus-circle"></i> Tambah paket</button>') + '</div>' + (j && hs ? '<div class="jbar"><span class="jbar-i"><i class="bi bi-' + e(JM(hs).ic) + '"></i></span><div class="jbar-t"><b>' + e(JM(hs).nama) + '</b><small>' + rows.length + ' paket · tampil sebagai pilihan layanan di tiket order</small></div><button class="btn ghost sm" type="button" data-jedit><i class="bi bi-pencil"></i> Ubah jasa</button><button class="btn ghost sm dn" type="button" data-jdel><i class="bi bi-trash"></i> Hapus jasa</button></div>' : '');
      var chips = cats.length > 1 ? '<div class="chips mini pk-chips">' + ["semua"].concat(cats).map(function (c) { var n = c === "semua" ? rows.length : rows.filter(function (p) { return p.kat === c; }).length; return '<button class="chip" type="button" data-hc="' + e(c) + '" aria-pressed="' + (c === cf) + '">' + (c === "semua" ? "Semua" : e(c)) + " <b>" + n + "</b></button>"; }).join("") + "</div>" : "";
      var card = function (p, i) {
        var f = p.fitur || [];
        return '<article class="pkc"><div class="pkc-t">' + (j ? '<span class="thumb">' + (p.foto ? '<img src="' + p.foto + '" alt="">' : '<i class="bi bi-image"></i>') + "</span>" : "") + '<div class="pkc-n"><b>' + e(p.nama) + '</b><span class="pkc-k">' + e(p.kat) + '</span></div><div class="pkc-p"><strong>' + rp(p.harga) + "</strong><small>" + (j ? "sekali bayar" : "per bulan") + "</small></div></div>" +
          (p.ringkas ? '<p class="pkc-d">' + e(p.ringkas) + "</p>" : "") +
          '<ul class="pkc-f">' + f.slice(0, 3).map(function (x) { return '<li><i class="bi bi-check2"></i>' + e(x) + "</li>"; }).join("") + (f.length > 3 ? '<li class="more">+' + (f.length - 3) + " fitur lainnya</li>" : "") + (f.length ? "" : '<li class="more">Belum ada isi paket</li>') + "</ul>" +
          '<div class="pkc-a"><button class="btn ghost sm" type="button" data-edit="' + i + '"><i class="bi bi-pencil"></i> Edit</button><button class="btn ghost sm dn" type="button" data-del="' + i + '"><i class="bi bi-trash"></i> Hapus</button></div></article>';
      };
      var body = cats.filter(function (c) { return cf === "semua" || c === cf; }).map(function (c) {
        var it = rows.map(function (p, i) { return p.kat === c ? card(p, i) : ""; }).join("");
        return '<div class="pk-grp"><h3 class="pk-gh">' + e(c) + "<small>" + rows.filter(function (p) { return p.kat === c; }).length + ' paket</small></h3><div class="pk-grid">' + it + "</div></div>";
      }).join("") || (j && !hs ? '<div class="dcard empty"><i class="bi bi-tags"></i><b>Belum ada jasa</b><p class="muted">Klik Jasa baru untuk membuat jasa pertama, misalnya Setup Minecraft.</p></div>' : '<div class="dcard empty"><i class="bi bi-tags"></i><b>Belum ada paket</b><p class="muted">Klik Tambah paket untuk membuat paket pertama.</p></div>');
      $("#p-" + kind).innerHTML = head + chips + body;
    }
    function formPaket(kind, idx) {
      var H = HG(), rows = JR(kind === "hosting" ? "hosting" : hs), p = idx == null ? {} : rows[idx], j = kind === "jasa";
      var cats = []; rows.forEach(function (x) { if (cats.indexOf(x.kat) < 0) cats.push(x.kat); }); foto = p.foto || "";
      var fr = function (v) { return '<div class="frow"><span class="fgrip"><i class="bi bi-check2"></i></span><input class="inp" maxlength="80" value="' + e(v || "") + '" placeholder="Contoh: RAM 2 GB"><button type="button" class="ib dn" data-fx aria-label="Hapus baris"><i class="bi bi-x-lg"></i></button></div>'; };
      var f0 = p.fitur || [], sp = j ? {} : { cpu: (f0[0] || "").replace(/^CPU\s*/i, ""), ram: (f0[1] || "").replace(/^RAM\s*/i, ""), sto: (f0[2] || "").replace(/^Storage\s*/i, "") }, ex = j ? f0 : f0.slice(3);
      var feats = (ex.length ? ex : [""]).map(fr).join("");
      var ringkasH = '<label class="fld"><span>Deskripsi singkat</span><input class="inp" name="ringkas" maxlength="90" value="' + e(p.ringkas) + '" placeholder="Satu kalimat yang menjelaskan paket ini"></label>';
      var spec = function (nm, ic, lb, v, ph) { return '<label class="fld sp-f"><span><i class="bi bi-' + ic + '"></i>' + lb + ' <em class="req">*</em></span><input class="inp" name="' + nm + '" required maxlength="20" value="' + e(v) + '" placeholder="' + ph + '"></label>'; };
      modal('<form class="mbox pk" id="f-pkt"><div class="mh"><div><b>' + (idx == null ? "Tambah paket" : "Edit paket") + "</b>" + (idx == null ? "" : '<small class="muted pk-sub">' + e(p.nama) + "</small>") + '</div><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb">' +
        '<div class="pk-s"><h4><i>1</i>Info paket</h4><label class="fld"><span>Nama paket <em class="req">*</em></span><input class="inp" name="nama" required maxlength="40" value="' + e(p.nama) + '" placeholder="Contoh: Pulse"></label>' +
        '<div class="fld"><span>Kategori <em class="req">*</em></span><input class="inp" name="kat" required maxlength="30" value="' + e(p.kat) + '" placeholder="Pilih di bawah atau ketik kategori baru">' + (cats.length ? '<div class="catpick">' + cats.map(function (c) { return '<button type="button" class="cat-chip" data-cc="' + e(c) + '" aria-pressed="' + (c === p.kat) + '">' + e(c) + "</button>"; }).join("") + "</div>" : "") + "</div>" +
        (j ? ringkasH : "") + '<label class="fld chk-r"><input type="checkbox" name="populer"' + (p.populer ? " checked" : "") + '><span><b>Tandai sebagai Populer</b><small>Kartu paket diberi lencana dan disorot di halaman harga.</small></span></label></div>' +
        '<div class="pk-s"><h4><i>2</i>Harga</h4><label class="fld"><span>Harga (Rp) <em class="req">*</em></span><div class="money"><span>Rp</span><input class="inp" name="harga" type="number" inputmode="numeric" min="0" required value="' + (p.harga == null ? "" : p.harga) + '" placeholder="0"></div><small class="hint" id="hg-v">' + (p.harga == null ? "Tulis angka tanpa titik." : rp(p.harga) + (j ? " · sekali bayar" : " · per bulan")) + "</small></label></div>" +
        (j ? '<div class="pk-s"><h4><i>3</i>Isi paket</h4><small class="hint">Satu fitur per baris. Tekan Enter untuk menambah baris baru.</small><div class="flist" id="fr-list">' + feats + '</div><button type="button" class="btn ghost sm" id="fr-add"><i class="bi bi-plus-lg"></i> Tambah baris</button></div>' :
          '<div class="pk-s"><h4><i>3</i>Spesifikasi utama</h4><small class="hint">Tampil sebagai 3 ikon di kartu paket (CPU, RAM, Storage). Wajib diisi.</small><div class="sp-g">' + spec("cpu", "cpu", "CPU", sp.cpu, "100%") + spec("ram", "memory", "RAM", sp.ram, "2 GB") + spec("sto", "device-hdd", "Storage", sp.sto, "8 GB") + '</div></div>' +
          '<div class="pk-s"><h4><i>4</i>Deskripsi paket</h4>' + ringkasH + '<div class="fld"><span>Fitur tambahan</span><small class="hint">Satu fitur per baris, contoh: 1 MySQL Database. Tekan Enter untuk menambah baris.</small><div class="flist" id="fr-list">' + feats + '</div><button type="button" class="btn ghost sm" id="fr-add"><i class="bi bi-plus-lg"></i> Tambah baris</button></div></div>') +
        (j ? '<div class="pk-s"><h4><i>4</i>Foto</h4><div class="upl"><input class="upl-in" type="file" accept="image/*" id="pf"><label class="upl-box" for="pf"><span class="upl-pv" id="fp">' + (foto ? '<img src="' + foto + '" alt="">' : '<i class="bi bi-image"></i>') + '</span><span class="upl-t"><b>Foto paket</b><small id="pf-name">' + (foto ? "Foto aktif. Klik atau seret gambar baru." : PF_TXT) + '</small></span><span class="btn sm upl-btn"><i class="bi bi-cloud-arrow-up"></i> Pilih foto</span></label><button type="button" class="btn ghost sm" id="pf-x"><i class="bi bi-trash3"></i> Hapus foto</button></div></div>' : "") +
        '</div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button class="btn" type="submit"><i class="bi bi-check2"></i> Simpan paket</button></div></form>', function (m, close) {
        var fl = $("#fr-list", m), kin = $('[name="kat"]', m), hin = $('[name="harga"]', m);
        function addRow(v, focus) { var d = document.createElement("div"); d.innerHTML = fr(v); var r = d.firstChild; fl.appendChild(r); if (focus) $("input", r).focus(); }
        $("#fr-add", m).addEventListener("click", function () { addRow("", true); });
        fl.addEventListener("click", function (ev) { var x = ev.target.closest("[data-fx]"); if (!x) return; var r = x.closest(".frow"); if ($$(".frow", fl).length > 1) r.remove(); else $("input", r).value = ""; });
        fl.addEventListener("keydown", function (ev) { if (ev.key === "Enter" && ev.target.matches("input")) { ev.preventDefault(); addRow("", true); } });
        function syncCat() { $$(".cat-chip", m).forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.cc === kin.value.trim()); }); }
        $$(".cat-chip", m).forEach(function (c) { c.addEventListener("click", function () { kin.value = c.dataset.cc; syncCat(); }); });
        kin.addEventListener("input", syncCat);
        hin.addEventListener("input", function () { $("#hg-v", m).textContent = hin.value !== "" ? rp(hin.value) + (j ? " · sekali bayar" : " · per bulan") : "Tulis angka tanpa titik."; });
        var pf = $("#pf", m); if (pf) {
          var setF = function (file) { if (!file || file.type.indexOf("image/") !== 0) return toast("File harus berupa gambar"); shrink(file, 640, "image/jpeg", function (d) { foto = d; $("#fp", m).innerHTML = '<img src="' + d + '" alt="">'; $("#pf-name", m).textContent = file.name + " · " + Math.max(1, Math.round(file.size / 1024)) + " KB"; }); };
          pf.addEventListener("change", function () { if (pf.files[0]) setF(pf.files[0]); pf.value = ""; });
          var ub = $(".upl-box", m);
          ub.addEventListener("dragover", function (ev) { ev.preventDefault(); ub.classList.add("drag"); });
          ub.addEventListener("dragleave", function () { ub.classList.remove("drag"); });
          ub.addEventListener("drop", function (ev) { ev.preventDefault(); ub.classList.remove("drag"); setF(ev.dataTransfer.files[0]); });
          $("#pf-x", m).addEventListener("click", function () { foto = ""; $("#fp", m).innerHTML = '<i class="bi bi-image"></i>'; $("#pf-name", m).textContent = PF_TXT; });
        }
        $("#f-pkt", m).addEventListener("submit", function (ev) {
          ev.preventDefault(); var f = ev.target, it = { nama: f.nama.value.trim(), kat: f.kat.value.trim(), harga: Number(f.harga.value), ringkas: f.ringkas.value.trim(), populer: !!f.populer.checked, fitur: $$(".frow input", fl).map(function (x) { return x.value.trim(); }).filter(Boolean) };
          if (idx != null && p && p._id) it._id = p._id;
          if (!j) it.fitur = ["CPU " + f.cpu.value.trim(), "RAM " + f.ram.value.trim(), "Storage " + f.sto.value.trim()].concat(it.fitur);
          if (j && foto) it.foto = foto;
          var H2 = HG(), r = kind === "hosting" ? H2.hosting : H2.jasa[hs]; if (!r) return close(); if (idx == null) r.push(it); else r[idx] = it;
          sv("nx-harga", H2); close(); toast("Paket tersimpan" + DEMOTXT); draw();
        });
      });
    }
    var JIC = ["box2", "discord", "controller", "code-slash", "palette", "camera-video", "globe2", "bag", "music-note-beamed", "robot", "brush", "tools"];
    function jasaForm(key) {
      var H = HG(), cur = key ? JM(key) : { nama: "", ic: "tag" }, ic = key ? cur.ic : JIC[0];
      modal('<form class="mbox sm pk" id="f-jasa"><div class="mh"><b>' + (key ? "Ubah jasa" : "Tambah jasa baru") + '</b><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb"><label class="fld"><span>Nama jasa <em class="req">*</em></span><input class="inp" name="nama" required maxlength="40" value="' + e(cur.nama) + '" placeholder="Contoh: Setup Server Roblox"></label><div class="fld"><span>Icon Bootstrap</span><div class="jic-in"><span class="jic-pv" id="j-pv"><i class="bi bi-' + e(ic) + '"></i></span><input class="inp" name="ic" id="j-icn" maxlength="40" value="' + e(ic) + '" placeholder="Contoh: controller" autocomplete="off" spellcheck="false"></div><small class="hint">Ketik nama icon dari <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener">icons.getbootstrap.com</a> (tanpa "bi-"), misalnya <b>rocket-takeoff</b>. Atau pilih cepat:</small><div class="jic-q" id="j-ic">' + JIC.map(function (x) { return '<button type="button" class="jq" data-v="' + x + '" aria-label="' + x + '" title="' + x + '" aria-pressed="' + (x === ic) + '"><i class="bi bi-' + x + '"></i></button>'; }).join("") + '</div></div</div></div><small class="hint">Nama ini tampil sebagai pilihan layanan saat customer membuka ticket order.</small><p class="err" id="j-e" hidden></p></div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button class="btn" type="submit"><i class="bi bi-check2"></i> Simpan</button></div></form>', function (m, close) {
        var inI = $("#j-icn", m); function cic(v) { return String(v || "").trim().toLowerCase().replace(/^bi[\s-]+(bi-)?/, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); }
        function setIc(v) { ic = cic(v) || "tag"; $("#j-pv", m).innerHTML = '<i class="bi bi-' + e(ic) + '"></i>'; $$("#j-ic button", m).forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.v === ic); }); }
        inI.addEventListener("input", function () { setIc(inI.value); });
        $$("#j-ic button", m).forEach(function (b) { b.addEventListener("click", function () { inI.value = b.dataset.v; setIc(b.dataset.v); }); });
        $("#f-jasa", m).addEventListener("submit", function (ev) {
          ev.preventDefault(); var nm = ev.target.nama.value.trim(), er = $("#j-e", m), H2 = HG();
          if (!nm) { er.textContent = "Nama jasa wajib diisi."; er.hidden = false; return; }
          if (Object.keys(H2.jasa).some(function (k) { return k !== key && JM(k).nama.toLowerCase() === nm.toLowerCase(); })) { er.textContent = "Nama jasa itu sudah ada."; er.hidden = false; return; }
          var k2 = key || "j" + Date.now().toString(36); if (!key) H2.jasa[k2] = []; H2.meta[k2] = { nama: nm, ic: cic(inI.value) || "tag" };
          sv("nx-harga", H2); hs = k2; hcat.jasa = "semua"; close(); toast(key ? "Jasa diperbarui" : "Jasa ditambahkan"); draw();
        });
      });
    }
    function jasaDel(key) {
      var H = HG(), n = (H.jasa[key] || []).length;
      modal('<div class="mbox sm"><div class="mh"><b>Hapus jasa?</b></div><div class="mb"><p class="muted">Jasa "' + e(JM(key).nama) + '"' + (n ? " beserta " + n + " paketnya" : "") + ' akan dihapus dan tidak tampil lagi sebagai pilihan layanan.</p></div><div class="mf"><button class="btn ghost" data-x>Batal</button><button class="btn dng" data-ok>Hapus jasa</button></div></div>', function (m, close) {
        $("[data-ok]", m).addEventListener("click", function () { var H2 = HG(); delete H2.jasa[key]; delete H2.meta[key]; sv("nx-harga", H2); hs = Object.keys(H2.jasa)[0] || ""; close(); toast("Jasa dihapus"); draw(); });
      });
    }
    var PF_TXT = "JPG, PNG, atau WEBP. Disarankan rasio 16:9.";
    function tmpSync() { var b = $("#sbar"); if (!b) return; var dirty = JSON.stringify(root._T) !== root._T0; b.classList.toggle("on", dirty); b.setAttribute("aria-hidden", String(!dirty)); }
    function tampilan() {
      var T0 = ld("nx-tampilan", {}) || {}, T = { nama: String(T0.nama || "NEXORA") };
      $("#p-tampilan").innerHTML = '<div class="tmp"><div class="tcol"><div class="dcard"><b>Nama situs</b><p class="muted">Tampil di navbar, footer, dan judul tab browser.</p><label class="fld" style="margin-top:12px"><span>Nama situs</span><input class="inp" data-t="nama" maxlength="40" value="' + e(T.nama) + '"></label><p class="hint tmp-dc"><i class="bi bi-discord"></i> Link Discord (tombol navbar, footer, dan halaman Kontak) diatur di tab <button type="button" class="tmp-lnk" data-tab="kontak">Kontak</button>.</p></div></div></div><div class="sbar" id="sbar" role="region" aria-label="Perubahan belum disimpan"><span class="sb-d"><i class="bi bi-exclamation-circle-fill"></i><span><b>Perubahan belum disimpan</b><small>Simpan agar nama situs ikut berubah.</small></span></span><div class="sb-a"><button class="btn ghost sm" type="button" id="rs-tmp">Reset</button><button class="btn sm" type="button" id="sv-tmp"><i class="bi bi-check2"></i> Simpan perubahan</button></div></div>';
      root._T = T; root._T0 = JSON.stringify(T);
    }
    /* ===== Tagihan ===== */
    var BMS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], BMF = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    function pad(n) { return ("0" + n).slice(-2); }
    function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    function pdt(s) { var a = s.split("-"); return new Date(+a[0], +a[1] - 1, +a[2]); }
    function fdt(s) { var d = pdt(s); return d.getDate() + " " + BMS[d.getMonth()] + " " + d.getFullYear(); }
    function t0() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
    function dleft(s) { return Math.round((pdt(s) - t0()) / 864e5); }
    function stamp() { var t = new Date(); return t.getDate() + " " + BMS[t.getMonth()] + " " + t.getFullYear() + ", " + pad(t.getHours()) + ":" + pad(t.getMinutes()); }
    function seedB() {
      var ad = function (n) { return iso(new Date(t0().getTime() + n * 864e5)); }, lg = [{ a: "Tagihan dibuat dan dikirim ke customer", by: "Admin NEXORA", at: "15 Okt 2026, 10:00" }];
      return [
        { id: "INV-3003", tk: "T-1042", user: "__me", item: "Pulse", siklus: "Bulanan", dasar: 19000, adj: "none", pct: 0, alasan: "", total: 19000, jatuh: ad(5), st: "Belum dibayar", dibuat: ad(-2), by: "Admin NEXORA", ts: 0, ticket: "", log: lg },
        { id: "INV-3002", tk: "T-1040", user: "Rizky", item: "Server Gaming", siklus: "Sekali bayar", dasar: 35000, adj: "none", pct: 0, alasan: "", total: 35000, jatuh: ad(-3), st: "Belum dibayar", dibuat: ad(-10), by: "Admin NEXORA", ts: 0, ticket: "", log: lg },
        { id: "INV-3001", tk: "T-1031", user: "__me", item: "Vanilla Starter", siklus: "Sekali bayar", dasar: 40000, adj: "none", pct: 0, alasan: "", total: 40000, jatuh: ad(-20), st: "Lunas", dibuat: ad(-25), by: "Admin NEXORA", ts: 0, ticket: "", log: lg.concat([{ a: "Ditandai lunas", by: "Admin NEXORA", at: "03 Okt 2026, 09:12" }]) }];
    }
    /* Mode live: tidak ada tagihan contoh (seedB hanya untuk mode demo); sisa tagihan contoh yang sempat tersimpan di browser disaring. */
    function BL() { if (window.NX && NX.live) return ld("nx-bill", []).filter(function (b) { return !(b.ts === 0 && /^INV-300[123]$/.test(b.id)); }); return ld("nx-bill", seedB()); }
    function bj(b) { return b.jenis || (b.siklus === "Sekali bayar" ? "bill" : "hosting"); }
    function cpy(t) { if (navigator.clipboard) navigator.clipboard.writeText(t).catch(function () {}); else { var x = document.createElement("textarea"); x.value = t; document.body.appendChild(x); x.select(); try { document.execCommand("copy"); } catch (e) {} x.remove(); } }
    function bs(b) { return b.st === "Belum dibayar" && dleft(b.jatuh) < 0 ? "Terlambat" : b.st; }
    function rel(b) { var n = dleft(b.jatuh); return n < 0 ? "Terlambat " + (-n) + " hari" : n === 0 ? "Jatuh tempo hari ini" : "Dalam " + n + " hari"; }
    function bmine(b) { return b.user === "__me" || b.user === me(); }
    function bcust(b) { return b.user === "__me" ? ld("nx-cust", "Demo Customer") : b.user; }
    function pk1(n) {
      var H = HG(), f = function (r) { return r.filter(function (x) { return x.nama === n; })[0]; }, p = f(H.hosting);
      if (p) return { harga: p.harga, host: true };
      Object.keys(H.jasa).forEach(function (k) { if (!p) p = f(H.jasa[k]); }); return p ? { harga: p.harga, host: false } : null;
    }
    /* paket bisa lebih dari satu (hanya jasa setup): nama digabung " + ", harga dijumlah */
    function pk(n) {
      var q = pk1(n); if (q || String(n).indexOf(PSEP) < 0) return q;
      var tot = 0, ok = true; pkList(n).forEach(function (x) { var y = pk1(x); if (!y || y.host) ok = false; else tot += y.harga; });
      return ok ? { harga: tot, host: false } : null;
    }
    function OTL() { return TK().filter(function (x) { if (x.kat !== "Order baru" || cl(x) || x.st === "Orderan Selesai") return false; if (BF.jenis === "bill") return true; var q = pk(x.paket); return !!(q && q.host); }); }
    function sik(t) { var q = pk(t.paket); return q && q.host ? ["Bulanan", "Tahunan"] : ["Sekali bayar"]; }
    function bfReset() { var x = new Date(Date.now() + 7 * 864e5); BF = { kode: 0, jenis: "hosting", tk: "", siklus: "", d: String(x.getDate()), m: String(x.getMonth() + 1), y: String(x.getFullYear()), adj: "none", pct: "", alasan: "", nom: "", ket: "" }; }
    function bDue() { return BF.y + "-" + pad(BF.m) + "-" + pad(BF.d); }
    var KODE_MIN = 1, KODE_MAX = 99; /* kode unik cukup kecil: hanya untuk membedakan transfer yang bersamaan */
    function kodeUnik(n, skip) {
      var used = {}; BL().forEach(function (b) { if (b.st === "Belum dibayar") used[b.total] = 1; });
      for (var i = 0; i < 80; i++) { var k = KODE_MIN + Math.floor(Math.random() * (KODE_MAX - KODE_MIN + 1)); if (k !== skip && !used[n + k]) return k; }
      for (var j = KODE_MIN; j <= 999; j++) if (j !== skip && !used[n + j]) return j;
      return KODE_MIN;
    }
    function calc() {
      var t = TK().filter(function (x) { return x.id === BF.tk; })[0]; if (!t) return null;
      if (BF.jenis === "bill") {
        var n = Math.round(Number(BF.nom) || 0), kd = 0;
        if (n > 0) { var ada = BL().some(function (b) { return b.st === "Belum dibayar" && b.total === n + (BF.kode || 0); }); if (!BF.kode || ada) BF.kode = kodeUnik(n, BF.kode); kd = BF.kode; }
        return { t: t, dasar: n, kode: kd, pct: 0, total: n + kd };
      }
      var q = pk(t.paket); if (!q) return null;
      var dasar = q.harga * (BF.siklus === "Tahunan" ? 12 : 1), pct = BF.adj === "none" ? 0 : Math.min(20, Math.max(0, Number(BF.pct) || 0)), sg = BF.adj === "diskon" ? -1 : 1;
      return { t: t, dasar: dasar, pct: pct, total: Math.round(dasar * (1 + sg * pct / 100)) };
    }
    function srows(p) { return '<div class="sum">' + p.map(function (x) { return "<div><span>" + e(x[0]) + "</span><b>" + e(x[1]) + "</b></div>"; }).join("") + "</div>"; }
    /* Pilihan jasa untuk layar HP: dropdown custom (memakai komponen .dd), bukan <select> bawaan browser. */
    function jmob(keys, cur, HH) {
      var c = cur && keys.indexOf(cur) >= 0 ? cur : "", cnt = function (k) { return HH.jasa[k].length + " paket"; };
      var val = c ? '<span class="jd-ic"><i class="bi bi-' + e(JM(c).ic) + '"></i></span><span class="jv-t"><b>' + e(JM(c).nama) + "</b><small>" + cnt(c) + "</small></span>" : '<span class="jd-ic"><i class="bi bi-grid"></i></span><span class="jv-t"><b>Belum ada jasa</b><small>Tambah jasa baru</small></span>';
      return '<div class="jmob">' + (keys.length ? '<div class="dd full jdd" id="dd-jasa" data-jdd><button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Pilih jasa"><span class="dd-val jv">' + val + '</span><i class="bi bi-chevron-down chev"></i></button><div class="dd-menu" role="listbox" hidden>' +
        keys.map(function (k) { return '<button class="dd-opt" type="button" role="option" data-v="' + e(k) + '" aria-selected="' + (k === c) + '"><span class="jd-ic"><i class="bi bi-' + e(JM(k).ic) + '"></i></span><span class="tx"><b>' + e(JM(k).nama) + "</b><small>" + cnt(k) + '</small></span><i class="bi bi-check2 ck"></i></button>'; }).join("") + "</div></div>" : "") +
        '<button type="button" class="jnew" data-jadd><i class="bi bi-plus-lg"></i> Jasa baru</button></div>';
    }
    function ddH(id, cur, opts) {
      var c = opts.filter(function (o) { return String(o.v) === String(cur); })[0];
      return '<div class="dd full" id="' + id + '" data-bdd><button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false"><span class="dd-val">' + (c ? "<b>" + e(c.t) + "</b>" + (c.s ? "<small>" + e(c.s) + "</small>" : "") : "<b>Pilih</b>") + '</span><i class="bi bi-chevron-down chev"></i></button><div class="dd-menu" role="listbox" hidden>' +
        opts.map(function (o) { return '<button class="dd-opt" type="button" role="option" data-v="' + e(o.v) + '" aria-selected="' + (String(o.v) === String(cur)) + '"><span class="tx"><b>' + e(o.t) + "</b>" + (o.s ? "<small>" + e(o.s) + "</small>" : "") + '</span><i class="bi bi-check2 ck"></i></button>'; }).join("") + "</div></div>";
    }
    function bdd(id, v) {
      var k = { "dd-bo": "tk", "dd-bd": "d", "dd-bm": "m", "dd-by": "y" }[id]; BF[k] = v;
      if (k === "tk") { var t = TK().filter(function (x) { return x.id === v; })[0], q = pk(t.paket); if (BF.jenis === "bill") { BF.siklus = "Sekali bayar"; if (q) BF.nom = String(q.harga); } else BF.siklus = sik(t)[0]; }
      draw();
    }
    function bForm() {
      var els = OTL(), y = new Date().getFullYear(), c = calc(), days = [], mons = [], bill = BF.jenis === "bill", n = 0;
      for (var i = 1; i <= 31; i++) days.push({ v: i, t: String(i) });
      BMF.forEach(function (m, k) { mons.push({ v: k + 1, t: m }); });
      var adjs = [["none", "Tanpa penyesuaian"], ["diskon", "Diskon"], ["biaya", "Biaya tambahan"]];
      var sec = function (t, h) { n++; return '<section class="bs"><h3><i>' + n + "</i>" + t + "</h3>" + h + "</section>"; };
      return '<div class="tkhead"><button class="btn ghost" type="button" data-bx="back"><i class="bi bi-arrow-left"></i> Kembali ke daftar</button></div><div class="bk"><div class="bfm">' +
        sec("Jenis tagihan", '<div class="seg2 full" role="group"><button type="button" data-bx="jenis" data-v="hosting" aria-pressed="' + !bill + '">Hosting berkala</button><button type="button" data-bx="jenis" data-v="bill" aria-pressed="' + bill + '">Bill order</button></div><small class="hint">' + (bill ? "Untuk order apa pun, sekali bayar. Customer membayar lewat transfer rekening atau e-wallet." : "Tagihan bulanan atau tahunan untuk hosting. Customer membayar lewat ticket.") + "</small>") +
        sec("Pilih order customer", (els.length ? ddH("dd-bo", BF.tk, els.map(function (x) { var q = pk(x.paket); return { v: x.id, t: x.paket + " · " + x.id, s: uname(x) + " · " + (q ? rp(q.harga) : "harga manual") }; })) : '<p class="muted">' + (bill ? "Belum ada order ticket." : "Belum ada order hosting. Pakai Bill order atau tunggu customer memesan hosting.") + "</p>") + '<small class="hint">Tagihan hanya bisa dibuat dari order ticket yang sudah ada.</small>') +
        (bill ? sec("Nominal dan keterangan", '<label class="fld"><span>Nominal (Rp) <em class="req">*</em></span><input class="inp" type="number" inputmode="numeric" min="1000" max="10000000" data-bf="nom" value="' + e(BF.nom) + '" placeholder="Maks. 10.000.000"></label><label class="fld"><span>Keterangan tagihan <em class="req">*</em></span><input class="inp" data-bf="ket" maxlength="100" value="' + e(BF.ket) + '" placeholder="Contoh: Tambahan plugin dan revisi"></label><div class="kbox" id="kbox"></div>')
          : sec("Siklus tagihan", c ? '<div class="seg2 full" role="group">' + sik(c.t).map(function (s) { return '<button type="button" data-bx="sik" data-v="' + s + '" aria-pressed="' + (BF.siklus === s) + '">' + s + "</button>"; }).join("") + "</div>" : '<p class="muted">Pilih order dulu.</p>')) +
        sec("Tanggal jatuh tempo", '<div class="dates">' + ddH("dd-bd", BF.d, days) + ddH("dd-bm", BF.m, mons) + ddH("dd-by", BF.y, [{ v: y, t: String(y) }, { v: y + 1, t: String(y + 1) }]) + '</div><small class="hint">Tidak boleh tanggal yang sudah lewat dan maksimal 12 bulan dari hari ini.</small>') +
        (bill ? "" : sec("Penyesuaian harga (opsional)", '<div class="seg2 full" role="group">' + adjs.map(function (a) { return '<button type="button" data-bx="adj" data-v="' + a[0] + '" aria-pressed="' + (BF.adj === a[0]) + '">' + a[1] + "</button>"; }).join("") + "</div>" +
          (BF.adj === "none" ? "" : '<div class="row2"><label class="fld"><span>Persen (1-20) <em class="req">*</em></span><input class="inp" type="number" min="1" max="20" data-bf="pct" value="' + e(BF.pct) + '"></label><label class="fld"><span>Alasan <em class="req">*</em></span><input class="inp" data-bf="alasan" maxlength="120" value="' + e(BF.alasan) + '" placeholder="Min. 10 karakter, tercatat di log"></label></div>'))) +
        '<button class="btn" type="button" data-bx="review"><i class="bi bi-shield-check"></i> Tinjau dan kirim</button></div>' +
        '<aside class="dcard bki bsm"><div class="bsm-h"><span class="bsm-ic"><i class="bi bi-receipt-cutoff"></i></span><div><b>Ringkasan tagihan</b><small>Terisi otomatis saat kamu mengisi form</small></div></div><div id="bsum"></div><div class="bsm-g"><div class="bsm-gh"><i class="bi bi-shield-check"></i><b>Pengaman</b></div><ul class="bsm-l"><li><i class="bi bi-check2"></i>Hanya dari order ticket yang ada</li><li><i class="bi bi-check2"></i>Hosting: penyesuaian maks. 20% wajib beralasan</li><li><i class="bi bi-check2"></i>Bill order: Rp 1.000 - 10.000.000, wajib keterangan, ditambah kode unik 3 digit</li><li><i class="bi bi-check2"></i>Kirim wajib kode keamanan admin</li><li><i class="bi bi-check2"></i>Maksimal 5 tagihan baru per 24 jam</li><li><i class="bi bi-check2"></i>Setelah terkirim tidak bisa diedit atau dihapus</li></ul></div></aside></div>';
    }
    function updSum() {
      var b = $("#bsum"); if (!b) return; var c = calc(), bill = BF.jenis === "bill";
      var kb = $("#kbox"); if (kb) kb.innerHTML = c && bill && c.dasar > 0 ? '<span class="kbox-i"><i class="bi bi-hash"></i></span><div class="kbox-t"><b>Kode unik otomatis: +' + rp(c.kode) + '</b><small>Customer transfer <b>' + rp(c.total) + '</b>. Kode unik 3 digit bikin tiap tagihan punya nominal yang beda, jadi gampang dicek.</small></div><button type="button" class="btn ghost sm" data-bx="kode"><i class="bi bi-arrow-repeat"></i> Acak ulang</button>' : '<span class="kbox-i"><i class="bi bi-hash"></i></span><div class="kbox-t"><b>Kode unik otomatis</b><small>Muncul setelah kamu mengisi nominal. Ditambahkan ke total supaya pembayaran mudah dicek.</small></div>';
      if (!c) { b.innerHTML = '<div class="bsm-e"><span><i class="bi bi-hand-index-thumb"></i></span><b>Pilih order dulu</b><small>Ringkasan dan total akan muncul di sini.</small></div>'; return; }
            var due = fdt(bDue()), rl = dleft(bDue()), rows = (bill ? [["Siklus", "Sekali bayar"], ["Keterangan", BF.ket || "-"], ["Nominal", rp(c.dasar)], ["Kode unik", "+" + rp(c.kode)]] : [["Siklus", BF.siklus || "-"], ["Harga dasar", rp(c.dasar)], ["Penyesuaian", BF.adj === "none" ? "-" : (BF.adj === "diskon" ? "Diskon " : "Biaya tambahan ") + c.pct + "%"]]).concat([["Jatuh tempo", due + (rl >= 0 ? " · " + (rl === 0 ? "hari ini" : rl + " hari lagi") : "")]]);
      b.innerHTML = '<div class="bsm-c">' + av(uname(c.t)) + '<div><b>' + e(uname(c.t)) + '</b><small>' + e(c.t.id) + " · " + e(c.t.paket) + '</small></div><span class="bd ' + (bill ? "b2" : "b8") + '">' + (bill ? "Bill order" : "Hosting") + '</span></div><dl class="bsm-r">' + rows.map(function (x) { return "<div><dt>" + e(x[0]) + "</dt><dd>" + e(x[1]) + "</dd></div>"; }).join("") + '</dl><div class="bsm-t"><span>' + (bill ? "Total transfer" : "Total tagihan") + '</span><b>' + rp(c.total) + "</b></div>";
    }
    function bValid() {
      var c = calc(); if (!c) return "Pilih order customer dulu."; if (c.t.st === "Orderan Selesai" || cl(c.t)) return "Order ini sudah selesai dan tidak bisa ditagih lagi.";
      var dt = new Date(+BF.y, +BF.m - 1, +BF.d); if (dt.getDate() !== +BF.d || dt.getMonth() !== +BF.m - 1) return "Tanggal tidak valid.";
      var n = dleft(bDue()); if (n < 0) return "Jatuh tempo tidak boleh tanggal yang sudah lewat."; if (n > 366) return "Jatuh tempo maksimal 12 bulan dari hari ini.";
      var all = BL();
      if (BF.jenis === "bill") {
        if (c.dasar < 1000 || c.dasar > 10000000) return "Nominal harus Rp 1.000 sampai Rp 10.000.000 (belum termasuk kode unik).";
        if ((BF.ket || "").trim().length < 5) return "Keterangan tagihan minimal 5 karakter.";
        if (all.some(function (b) { return b.tk === BF.tk && b.st === "Belum dibayar" && b.total === c.total && b.jatuh === bDue(); })) return "Tagihan yang sama untuk order ini sudah ada.";
      } else {
        if (BF.adj !== "none") { var p = Number(BF.pct); if (!(p >= 1 && p <= 20)) return "Persentase penyesuaian harus 1 sampai 20%."; if ((BF.alasan || "").trim().length < 10) return "Alasan penyesuaian minimal 10 karakter."; }
        if (all.some(function (b) { return b.tk === BF.tk && b.st === "Belum dibayar" && bj(b) === "hosting" && b.jatuh.slice(0, 7) === bDue().slice(0, 7); })) return "Sudah ada tagihan aktif untuk order ini di bulan jatuh tempo yang sama.";
      }
      if (all.filter(function (b) { return b.by === me() && Date.now() - b.ts < 864e5; }).length >= 5) return "Batas 5 tagihan baru per 24 jam sudah tercapai.";
      return "";
    }
    function guard(o, fn) {
      modal('<div class="mbox sm"><div class="mh"><b>' + o.title + '</b><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb">' + o.html +
        (o.reason ? '<label class="fld"><span>Alasan <em class="req">*</em></span><textarea class="txa" id="g-r" maxlength="200" placeholder="Min. 10 karakter, tercatat di log"></textarea></label>' : "") +
        '<p class="err" id="g-e" hidden></p></div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button type="button" class="btn' + (o.danger ? " dng" : "") + '" data-ok>' + o.ok + "</button></div></div>", function (m, close) {
        $("[data-ok]", m).addEventListener("click", function () {
          var er = $("#g-e", m), r = o.reason ? $("#g-r", m).value.trim() : "";
          function bad(x) { er.textContent = x; er.hidden = false; }
          if (o.reason && r.length < 10) return bad("Alasan minimal 10 karakter.");
          close(); fn(r);
        });
      });
    }
    /* ambil alih ticket: hitung mundur 10 detik, bisa dibatalkan, lalu otomatis diambil alih */
    function takeModal(id) {
      var t = TK().filter(function (y) { return y.id === id; })[0];
      if (!t || cl(t) || !t.hd || hdMe(t)) return draw();
      var N = 10, iv = null, over = false;
      modal('<div class="mbox sm tko-m" role="alertdialog" aria-modal="true" aria-labelledby="tko-t"><div class="mb tko-b"><div class="tko-r"><svg viewBox="0 0 80 80" aria-hidden="true"><circle class="bg" cx="40" cy="40" r="35"/><circle class="fg" cx="40" cy="40" r="35"/></svg><b id="tko-n">' + N + '</b></div><h3 id="tko-t">Kamu akan mengambil alih ticket ini</h3><p class="muted">Ticket <b>' + e(t.id) + "</b> sedang ditangani <b>" + e(t.hd.n) + '</b>. Pengambilalihan berjalan otomatis dalam <b id="tko-s">' + N + '</b> detik.</p></div><div class="mf tko-f"><button type="button" class="btn ghost" data-x data-tko-x>Batal</button></div></div>', function (m, close) {
        function stop() { clearInterval(iv); document.removeEventListener("keydown", esc); }
        function esc(ev) { if (ev.key === "Escape") { stop(); close(); } }
        document.addEventListener("keydown", esc);
        var nEl = $("#tko-n", m), sEl = $("#tko-s", m); m.classList.add("run");
        iv = setInterval(function () {
          if (!document.body.contains(m)) return stop();
          N--; nEl.textContent = N; sEl.textContent = N;
          if (N > 0 || over) return;
          over = true; stop(); close(); doTake(id);
        }, 1000);
      });
    }
    function doTake(id) {
      var t = TK().filter(function (y) { return y.id === id; })[0];
      if (!t || cl(t)) { toast("Ticket sudah ditutup"); return draw(); }
      if (window.NX && NX.live) { NX.takeOver(id).then(function () { toast("Ticket " + id + " berhasil diambil alih"); }, function (er) { toast(er.message); draw(); }); return; }
      var a = TK(); a.forEach(function (x) { if (x.id === id && !cl(x)) { x.hd = { n: me(), r: arole(), a: "", me: true }; x.m.push(nm({ w: "s", t: "Ticket kamu diambil alih oleh " + me(), d: "Baru saja", h: hm() })); nt(x, "tk", "Ticket diambil alih", x.id + " sekarang ditangani " + me()); } });
      sv("nx-tk", a); toast("Ticket " + id + " berhasil diambil alih"); draw();
    }
    function bSend() {
      var er = bValid(); if (er) return toast(er);
      var c = calc(), due = bDue(), bill = BF.jenis === "bill";
      guard({ title: "Kirim tagihan ke customer?", ok: "Kirim tagihan", html: srows([["Customer", uname(c.t)], ["Jenis", bill ? "Bill order" : "Hosting berkala"], ["Paket", c.t.paket], ["Siklus", bill ? "Sekali bayar" : BF.siklus]].concat(bill ? [["Keterangan", BF.ket.trim()], ["Nominal", rp(c.dasar)], ["Kode unik", "+" + rp(c.kode)]] : []).concat([["Total", rp(c.total)], ["Jatuh tempo", fdt(due)]])) + '<p class="muted">Setelah terkirim, tagihan tidak bisa diedit. Hanya bisa dibatalkan dengan alasan.</p>' }, function () {
        var all = BL(), n = all.reduce(function (m, b) { return Math.max(m, Number(b.id.slice(4)) || 0); }, 3000) + 1;
        all.unshift({ id: "INV-" + n, jenis: BF.jenis, ket: bill ? BF.ket.trim() : "", tk: c.t.id, user: c.t.user, item: c.t.paket, siklus: bill ? "Sekali bayar" : BF.siklus, dasar: c.dasar, kode: bill ? c.kode : 0, adj: bill ? "none" : BF.adj, pct: c.pct, alasan: bill ? "" : (BF.alasan || "").trim(), total: c.total, jatuh: due, st: "Belum dibayar", dibuat: iso(t0()), by: whoR(), ts: Date.now(), ticket: "", log: [{ a: "Tagihan dibuat dan dikirim ke customer", by: whoR(), at: stamp() }] });
        sv("nx-bill", all); bnew = false; tkStat(c.t.id, "Menunggu pembayaran", "Tagihan INV-" + n + " dikirim · status: Menunggu pembayaran"); toast("Tagihan INV-" + n + " terkirim ke " + uname(c.t)); draw();
      });
    }
    function bUpd(id, st, aksi, r) {
      var all = BL(); all.forEach(function (b) {
        if (b.id !== id) return; b.st = st; b.log.push({ a: aksi + (r ? ": " + r : ""), by: whoR(), at: stamp() });
        if (b.ticket) { var tk = TK(); tk.forEach(function (x) { if (x.id === b.ticket) x.m.push({ w: "s", t: "Tagihan " + id + (st === "Lunas" ? " ditandai lunas" : " dibatalkan"), d: "Baru saja", h: hm() }); }); sv("nx-tk", tk); }
      });
      var bb = all.filter(function (x) { return x.id === id; })[0], oth = bb && all.some(function (o) { return o.id !== id && o.tk === bb.tk && o.st === "Belum dibayar"; });
      sv("nx-bill", all);
      if (bb && !oth) {
        if (st === "Lunas") tkStat(bb.tk, "Pembayaran Dikonfirmasi", "Pembayaran " + id + " dikonfirmasi admin");
        else if (st === "Dibatalkan") { var tt = TK().filter(function (x) { return x.id === bb.tk; })[0]; if (tt && tt.st === "Menunggu pembayaran") tkStat(bb.tk, "Terhubung dengan admin", "Tagihan " + id + " dibatalkan"); }
      }
      toast("Tagihan " + id + ": " + st); draw();
    }
    function bDetail(id) {
      var b = BL().filter(function (x) { return x.id === id; })[0]; if (!b) return; var act = b.st === "Belum dibayar", hs = bj(b) === "hosting";
      var dl = function (rows) { return '<dl class="bd-dl">' + rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + (r[2] ? r[1] : e(r[1])) + "</dd></div>"; }).join("") + "</dl>"; };
      var adj = b.adj === "none" ? "Tidak ada" : (b.adj === "diskon" ? "Diskon " : "Biaya tambahan ") + b.pct + "%" + (b.alasan ? " (" + e(b.alasan) + ")" : "");
      modal('<div class="mbox bd-m"><div class="mh"><div class="bd-ti"><b>' + e(b.id) + "</b>" + bd(bs(b)) + '</div><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb">' +
        '<div class="bd-top"><div><small>Total tagihan</small><strong>' + rp(b.total) + '</strong></div><div class="bd-dd"><small>Jatuh tempo</small><b>' + fdt(b.jatuh) + "</b>" + (act ? "<em>" + rel(b) + "</em>" : "") + "</div></div>" +
        '<section class="bd-s"><h4><i class="bi bi-person"></i> Informasi</h4>' + dl([["Customer", bcust(b)], ["Jenis", hs ? "Hosting berkala" : "Bill order"], ["Paket", b.item], ["Siklus", b.siklus], ["Order ticket", b.tk || "-"]].concat(hs ? [] : [["Keterangan", b.ket || "-"]])) + "</section>" +
        '<section class="bd-s"><h4><i class="bi bi-cash-stack"></i> Rincian harga</h4>' + dl(b.kode ? [["Nominal", rp(b.dasar)], ["Kode unik", "+" + rp(b.kode)], ["Total transfer", "<b>" + rp(b.total) + "</b>", 1]] : [["Harga dasar", rp(b.dasar)], ["Penyesuaian", adj, 1], ["Total", "<b>" + rp(b.total) + "</b>", 1]]) + "</section>" +
        '<section class="bd-s"><h4><i class="bi bi-wallet2"></i> Pembayaran</h4>' + dl([hs ? ["Ticket pembayaran", b.ticket || "Belum dibuka customer"] : ["Konfirmasi bayar", b.lapor ? "Customer sudah konfirmasi · " + b.lapor : "Belum ada konfirmasi"], ["Dibuat oleh", b.by + " · " + fdt(b.dibuat)]]) + "</section>" +
        '<section class="bd-s"><h4><i class="bi bi-clock-history"></i> Log aktivitas</h4><ol class="bd-tl">' + b.log.map(function (l) { return "<li><b>" + e(l.a) + "</b><small>" + e(l.by) + " · " + e(l.at) + "</small></li>"; }).join("") + "</ol></section></div>" +
        (act ? '<div class="mf bd-f"><button type="button" class="btn ghost sm" data-pay><i class="bi bi-check2-circle"></i> Tandai lunas</button><button type="button" class="btn dng sm" data-void><i class="bi bi-x-circle"></i> Batalkan tagihan</button></div>' : (isF() ? '<div class="mf bd-f"><button type="button" class="btn dng sm" data-bdel><i class="bi bi-trash3"></i> Hapus tagihan</button></div>' : "")) + "</div>", function (m, close) {
        var p = $("[data-pay]", m), v = $("[data-void]", m), dx = $("[data-bdel]", m);
        if (dx) dx.addEventListener("click", function () { close(); guard({ title: "Hapus tagihan " + b.id + "?", ok: "Hapus permanen", danger: true, html: "<p>Tagihan <b>" + e(b.id) + "</b> (" + e(b.item) + " · " + rp(b.total) + ") akan dihapus permanen dan tidak bisa dikembalikan.</p>" }, function () { delBl([b.id]); }); });
        if (p) p.addEventListener("click", function () { close(); guard({ title: "Tandai lunas?", ok: "Tandai lunas", reason: true, html: "<p>Pastikan pembayaran " + e(b.id) + " (" + rp(b.total) + ") sudah kamu terima. Isi catatan bukti pembayaran.</p>" }, function (r) { bUpd(id, "Lunas", "Ditandai lunas", r); }); });
        if (v) v.addEventListener("click", function () { close(); guard({ title: "Batalkan tagihan?", ok: "Batalkan tagihan", danger: true, reason: true, html: "<p>Tagihan " + e(b.id) + " akan dibatalkan dan tidak bisa dibuka lagi.</p>" }, function (r) { bUpd(id, "Dibatalkan", "Dibatalkan", r); }); });
      });
    }
    function bList() {
      var all = BL(), F = ["semua", "Belum dibayar", "Terlambat", "Lunas", "Dibatalkan"], ok = function (b, f) { return f === "semua" || bs(b) === f; };
      var fl0 = all.filter(function (b) { return ok(b, bfil); }), rows = pgs("bl", fl0).map(function (b) {
        var act = b.st === "Belum dibayar", hs2 = bj(b) === "hosting";
        return '<tr><td class="bt-id"><b>' + e(b.id) + '</b></td><td class="bt-c"><span class="bt-cu">' + av(bcust(b)) + "<span>" + e(bcust(b)) + '</span></span></td><td class="bt-pk"><b>' + e(b.item) + "</b><small>" + (hs2 ? e(b.siklus) : "Bill order") + '</small></td><td class="bt-amt">' + rp(b.total) + '</td><td class="bt-due">' + fdt(b.jatuh) + (act ? "<small>" + rel(b) + "</small>" : "") + '</td><td class="bt-st">' + bd(bs(b)) + (b.lapor && act ? ' <span class="bd b2" title="Customer sudah konfirmasi bayar">Dikonfirmasi</span>' : "") + '</td><td class="act"><button class="btn ghost sm" type="button" data-bx="det" data-v="' + e(b.id) + '"><i class="bi bi-eye"></i> Detail</button></td></tr>';
      }).join("");
      return '<div class="guard"><i class="bi bi-shield-check"></i><div><b>Pengaman tagihan aktif</b><small>Tagihan hanya dari order ticket, kirim wajib kode keamanan, log permanen, hanya Founder yang bisa menghapus riwayat (lunas atau dibatalkan).</small></div></div>' +
        '<div class="tkhead bhead"><div class="chips mini bchips">' + F.map(function (f) { return '<button class="chip" type="button" data-bx="fil" data-v="' + f + '" aria-pressed="' + (bfil === f) + '">' + (f === "semua" ? "Semua" : f) + " <b>" + all.filter(function (b) { return ok(b, f); }).length + "</b></button>"; }).join("") + '</div>' + (isF() && blHist().length ? '<button class="btn ghost sm bl-clr" type="button" data-bdelall><i class="bi bi-trash3"></i> Hapus riwayat (' + blHist().length + ")</button>" : "") + '<button class="btn" type="button" data-bx="new"><i class="bi bi-plus-circle"></i> Buat tagihan</button></div>' +
        (rows ? '<div id="bl-top"></div>' + table(["ID", "Customer", "Paket", "Total", "Jatuh tempo", "Status", "Aksi"], rows, "bt") + pgr("bl", fl0.length) : '<div class="dcard empty"><i class="bi bi-cash-stack"></i><b>Tidak ada tagihan</b><p class="muted">Tagihan yang kamu buat akan muncul di sini.</p></div>');
    }
    /* ===== Invoice (customer): ringkasan, tab status, cari, tanggal, tabel ===== */
    var IPER = 10, IF = ["Semua", "Belum dibayar", "Lunas", "Kedaluwarsa", "Dibatalkan"];
    function iAll() { return BL().filter(bmine); }
    function iOk(b, f) { return f === "Semua" || (f === "Kedaluwarsa" ? b.st === "Belum dibayar" && dleft(b.jatuh) < 0 : b.st === f); }
    function iBd(b) { var l = b.st === "Belum dibayar" && dleft(b.jatuh) < 0 ? "Kedaluwarsa" : b.st; return '<span class="bd ' + (l === "Kedaluwarsa" ? "b5" : (BC[l] || "b1")) + '">' + e(l) + "</span>"; }
    function iPaid(b) {
      var l = (b.log || []).filter(function (x) { return /lunas/i.test(x.a); }).pop(), m = l && /(\d{1,2}) (\w{3}) (\d{4})/.exec(l.at || ""), mi = m ? BMS.indexOf(m[2]) : -1;
      return mi >= 0 ? new Date(+m[3], mi, +m[1]) : pdt(b.jatuh);
    }
    function iRows() {
      var q = iq.trim().toLowerCase();
      return iAll().filter(function (b) {
        var dt = b.dibuat || b.jatuh;
        return iOk(b, ifl) && (!q || (b.id + " " + b.item).toLowerCase().indexOf(q) >= 0) && (!id1 || dt >= id1) && (!id2 || dt <= id2);
      }).sort(function (x, y) { var p = x.dibuat || "", r = y.dibuat || "", k = isort === "asc" ? -1 : 1; return p === r ? (x.id < y.id ? k : -k) : (p < r ? k : -k); });
    }
    function iSum() {
      var a = iAll(), un = a.filter(function (b) { return b.st === "Belum dibayar"; }), ok = a.filter(function (b) { return b.st === "Lunas"; }), nw = new Date();
      var mo = ok.filter(function (b) { var d = iPaid(b); return d.getMonth() === nw.getMonth() && d.getFullYear() === nw.getFullYear(); });
      var sm = function (l) { return l.reduce(function (z, b) { return z + Number(b.total || 0); }, 0); };
      var c = function (ic, k, l, v, n) { return '<div class="is-c"><span class="is-i ' + k + '"><i class="bi bi-' + ic + '"></i></span><div><small>' + l + "</small><b>" + rp(v) + "</b>" + (n === null ? "" : "<small>" + n + " invoice</small>") + "</div></div>"; };
      var up = un.filter(function (b) { return dleft(b.jatuh) >= 0; }).sort(function (x, y) { return x.jatuh < y.jatuh ? -1 : x.jatuh > y.jatuh ? 1 : 0; })[0], nx;
      if (up) { var dl = dleft(up.jatuh); nx = '<div class="is-c"><span class="is-i am"><i class="bi bi-hourglass-split"></i></span><div><small>Tagihan mendatang</small><b>' + rp(up.total) + '</b><small class="is-cd' + (dl <= 3 ? " soon" : "") + '">' + (dl === 0 ? "Jatuh tempo hari ini" : dl === 1 ? "Besok jatuh tempo" : dl + " hari lagi") + "</small></div></div>"; }
      else nx = '<div class="is-c"><span class="is-i am"><i class="bi bi-hourglass-split"></i></span><div><small>Tagihan mendatang</small><b>' + rp(0) + '</b><small class="is-cd">Tidak ada tagihan</small></div></div>';
      return '<div class="is-box">' + c("clock", "", "Belum dibayar", sm(un), un.length) + nx + c("calendar2-check", "bl", "Lunas bulan ini", sm(mo), null) + c("check-circle", "gr", "Total belanja", sm(ok), ok.length) + "</div>";
    }
    function iTabs() {
      var a = iAll();
      return '<div class="tkx-tw"><div class="tkx-tabs" role="tablist" aria-label="Filter status invoice">' + IF.map(function (f) {
        return '<button type="button" role="tab" data-ifl="' + f + '" aria-selected="' + (ifl === f) + '">' + f + "<em>" + a.filter(function (b) { return iOk(b, f); }).length + "</em></button>";
      }).join("") + '</div><button type="button" class="tkx-ar l" aria-label="Geser ke kiri"><i class="bi bi-chevron-left"></i></button><button type="button" class="tkx-ar r" aria-label="Geser ke kanan"><i class="bi bi-chevron-right"></i></button></div>';
    }
    function iDet(b) {
      var hs = bj(b) === "hosting", un = b.st === "Belum dibayar", tkid = hs ? b.ticket : (TK().some(function (x) { return x.id === b.tk; }) ? b.tk : "");
      return '<div class="ix-det"><div class="ix-dg"><div><small>Total tagihan</small><b>' + rp(b.total) + "</b></div><div><small>Jatuh tempo</small><b>" + fdt(b.jatuh) + "</b></div><div><small>Dibuat</small><b>" + fdt(b.dibuat || b.jatuh) + "</b></div></div>" +
        (!hs && b.ket ? '<p class="bill-n">Untuk: ' + e(b.ket) + "</p>" : "") +
        (un && !hs && b.kode ? '<p class="bill-n kode"><i class="bi bi-hash"></i><span> Nominal ' + rp(b.dasar) + " + kode unik <b>" + rp(b.kode) + "</b>. Transfer tepat sampai digit terakhir supaya pembayaranmu langsung terdeteksi.</span></p>" : "") +
        (b.adj !== "none" ? '<p class="bill-n">Termasuk ' + (b.adj === "diskon" ? "diskon " : "biaya tambahan ") + b.pct + "%: " + e(b.alasan) + "</p>" : "") +
        (un && !hs && b.lapor ? '<p class="bill-n ok"><i class="bi bi-hourglass-split"></i> Konfirmasi pembayaran sudah dikirim, menunggu dicek admin.</p>' : "") +
        (un ? '<p class="bill-n"><i class="bi bi-info-circle"></i> ' + (hs ? "Pembayaran hosting dilakukan lewat ticket." : "Bayar lewat transfer ke rekening atau e-wallet NEXORA.") + "</p>" : "") +
        (un || tkid ? '<div class="bill-a">' + (un ? '<button class="btn" type="button" data-bx="pay" data-v="' + e(b.id) + '"><i class="bi bi-credit-card"></i> Bayar sekarang</button>' : "") + (tkid ? '<button class="btn ghost" type="button" data-bx="tk" data-v="' + e(tkid) + '"><i class="bi bi-chat-dots"></i> Lihat ticket ' + e(tkid) + "</button>" : "") + "</div>" : "") + "</div>";
    }
    function iBody() {
      var rows = iRows(), tot = rows.length, np = Math.max(1, Math.ceil(tot / IPER));
      if (ipg > np) ipg = np; if (ipg < 1) ipg = 1;
      var a = (ipg - 1) * IPER, pg = rows.slice(a, a + IPER);
      if (!tot) return '<div class="ix-empty">' + (iAll().length ? "<p>Tidak ada invoice yang cocok dengan filter.</p>" : '<p>Belum ada invoice. Invoice muncul di sini setelah admin mengirim tagihan untuk pesananmu.</p><button type="button" class="btn" data-go="buka">Pesan jasa</button>') + "</div>";
      var list = pg.map(function (b) {
        var hs = bj(b) === "hosting", un = b.st === "Belum dibayar";
        return '<div class="ix-row"><div class="ix-r" data-iv="' + e(b.id) + '" role="link" tabindex="0" aria-label="Lihat detail invoice ' + e(b.id) + '"><span class="ix-t"><b>' + e(b.item) + "</b><small><code>" + e(b.id) + "</code><span>" + (hs ? e(b.siklus) : "Bill order") + '</span></small></span><span class="ix-a">' + rp(b.total) + '</span><span class="ix-d">' + fdt(b.dibuat || b.jatuh) + '</span><span class="ix-j">' + fdt(b.jatuh) + (un ? "<small>" + rel(b) + "</small>" : "") + '</span><span class="ix-s">' + iBd(b) + '</span><span class="ix-m"><button type="button" class="ix-dots" data-imn="' + e(b.id) + '" aria-haspopup="menu" aria-label="Menu invoice ' + e(b.id) + '"><i class="bi bi-three-dots"></i></button></span></div></div>';
      }).join("");
      return '<div class="ix-scr"><div class="ix-sin"><div class="ix-h"><span>Invoice</span><span>Jumlah</span><span class="ix-sw"><button type="button" class="ix-sort" data-isort aria-label="Urutkan tanggal terbit: ' + (isort === "asc" ? "terlama" : "terbaru") + ' dulu" title="' + (isort === "asc" ? "Terlama dulu" : "Terbaru dulu") + '">Tanggal Terbit<span class="srt" aria-hidden="true"><i class="bi bi-chevron-' + (isort === "asc" ? "up" : "down") + '"></i></span></button></span><span>Jatuh Tempo</span><span>Status</span><span></span></div><div class="ix-list">' + list + "</div></div></div>" +
        (np > 1 ? '<div class="tkx-foot"><span class="tkx-rg">' + (a + 1) + "–" + (a + pg.length) + " dari " + tot + '</span><button type="button" class="tkx-pb" data-ipg="prev" aria-label="Halaman sebelumnya"' + (ipg <= 1 ? " disabled" : "") + '><i class="bi bi-chevron-left"></i></button><button type="button" class="tkx-pb" data-ipg="next" aria-label="Halaman berikutnya"' + (ipg >= np ? " disabled" : "") + '><i class="bi bi-chevron-right"></i></button></div>' : "");
    }
    /* ===== Filter tanggal invoice: kalender buatan sendiri (bukan bawaan browser) ===== */
    var DPW = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    function dpGrid() {
      var lead = (new Date(dpY, dpM, 1).getDay() + 6) % 7, td = iso(t0()), rg = id1 && id2 && id1 !== id2, out = "";
      for (var i = 0; i < 42; i++) {
        var d = new Date(dpY, dpM, 1 - lead + i), k = iso(d), c = "dp-d" + (d.getMonth() !== dpM ? " out" : "") + (k === td ? " today" : "") + (id1 && k === id1 ? " s" : "") + (id2 && k === id2 ? " e" : "") + (rg && k > id1 && k < id2 ? " in" : "");
        out += '<button type="button" class="' + c + '" data-dpd="' + k + '" aria-label="' + d.getDate() + " " + BMF[d.getMonth()] + " " + d.getFullYear() + '" aria-pressed="' + (k === id1 || k === id2) + '">' + d.getDate() + "</button>";
      }
      return '<div class="dp-g' + (rg ? " rg" : "") + '">' + out + "</div>";
    }
    function dpPop() {
      return '<div class="dp-h"><button type="button" class="dp-n" data-dpn="-1" aria-label="Bulan sebelumnya"><i class="bi bi-chevron-left"></i></button><b aria-live="polite">' + BMF[dpM] + " " + dpY + '</b><button type="button" class="dp-n" data-dpn="1" aria-label="Bulan berikutnya"><i class="bi bi-chevron-right"></i></button></div>' +
        '<div class="dp-w">' + DPW.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>" + dpGrid() +
        '<div class="dp-f"><span class="dp-hint">' + (dpStep === 1 ? "Pilih tanggal awal" : "Pilih tanggal akhir") + '</span><span class="dp-fa"><button type="button" data-dpq="today">Hari ini</button><button type="button" data-dpq="clear">Hapus</button></span></div>';
    }
    function dtBox() {
      return '<div class="ix-dtw"><div class="ix-dt">' +
        '<button type="button" class="ix-df' + (dpOn && dpStep === 1 ? " on" : "") + '" data-dpf="1" aria-haspopup="dialog" aria-expanded="' + dpOn + '"><i class="bi bi-calendar3"></i><span class="' + (id1 ? "v" : "ph") + '">' + (id1 ? fdt(id1) : "Dari tanggal") + "</span></button>" +
        '<span class="ix-ar" aria-hidden="true"></span>' +
        '<button type="button" class="ix-df' + (dpOn && dpStep === 2 ? " on" : "") + '" data-dpf="2" aria-haspopup="dialog" aria-expanded="' + dpOn + '"><i class="bi bi-calendar3"></i><span class="' + (id2 ? "v" : "ph") + '">' + (id2 ? fdt(id2) : "Sampai tanggal") + "</span></button>" +
        '<button type="button" class="ix-x" data-dpx aria-label="Hapus filter tanggal"' + (id1 || id2 ? "" : " hidden") + '><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dp-pop" role="dialog" aria-label="Pilih tanggal"' + (dpOn ? "" : " hidden") + ">" + (dpOn ? dpPop() : "") + "</div></div>";
    }
    function dpRender(fs) { var w = $(".ix-dtw", root); if (!w) return; w.outerHTML = dtBox(); if (fs) { var f = $(fs, root); if (f) f.focus(); } }
    function dpApply() { ipg = 1; iopen = ""; var r = $(".ix-res", root); if (r) r.innerHTML = iBody(); }
    function dpPick(k) {
      if (dpStep === 1) { id1 = k; if (id2 && id2 < k) id2 = ""; dpStep = 2; }
      else { if (id1 && k < id1) { id2 = id1; id1 = k; } else id2 = k; dpOn = false; }
      var d = pdt(k); dpY = d.getFullYear(); dpM = d.getMonth();
      dpApply(); dpRender(dpOn ? '[data-dpd="' + k + '"]' : "[data-dpf]");
    }
    document.addEventListener("click", function (ev) {
      var w = $(".ix-dtw", root), tg = ev.target; if (!w || !tg || !tg.closest) return;
      var f = tg.closest("[data-dpf]");
      if (f) {
        var st = Number(f.dataset.dpf);
        if (dpOn && dpStep === st) { dpOn = false; return dpRender(); }
        dpOn = true; dpStep = st === 2 && id1 ? 2 : 1;
        var d = pdt((st === 2 && id2) ? id2 : (id1 || id2 || iso(t0()))); dpY = d.getFullYear(); dpM = d.getMonth();
        return dpRender();
      }
      var dd = tg.closest("[data-dpd]"); if (dd) return dpPick(dd.dataset.dpd);
      var nv = tg.closest("[data-dpn]"); if (nv) { dpM += Number(nv.dataset.dpn); if (dpM < 0) { dpM = 11; dpY--; } else if (dpM > 11) { dpM = 0; dpY++; } return dpRender('[data-dpn="' + nv.dataset.dpn + '"]'); }
      var q = tg.closest("[data-dpq]");
      if (q) { if (q.dataset.dpq === "today") return dpPick(iso(t0())); id1 = ""; id2 = ""; dpStep = 1; dpApply(); return dpRender('[data-dpq="clear"]'); }
      if (tg.closest("[data-dpx]")) { id1 = ""; id2 = ""; dpOn = false; dpStep = 1; dpApply(); return dpRender("[data-dpf]"); }
      if (dpOn && !tg.closest(".dp-pop")) { dpOn = false; dpRender(); }
    });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && dpOn && $(".ix-dtw", root)) { dpOn = false; dpRender("[data-dpf]"); } });
    /* ===== Invoice: detail halaman, menu titik tiga, unduh PDF ===== */
    function iLbl(b) { return b.st === "Belum dibayar" && dleft(b.jatuh) < 0 ? "Kedaluwarsa" : b.st; }
    function iAdj(b) { var x = Math.round(Number(b.total || 0) - Number(b.dasar || 0) - Number(b.kode || 0)); return b.adj && b.adj !== "none" && x !== 0 ? x : 0; }
    function iRows2(b) {
      var hs = bj(b) === "hosting", r = [{ n: b.item, s: hs ? b.siklus : (b.ket ? "Untuk: " + b.ket : "Bill order"), v: rp(b.dasar) }];
      var aj = iAdj(b); if (aj) r.push({ n: (b.adj === "diskon" ? "Diskon " : "Biaya tambahan ") + b.pct + "%", s: b.alasan || "", v: (aj < 0 ? "- " : "") + rp(Math.abs(aj)) });
      if (b.kode) r.push({ n: "Kode unik", s: "Untuk pencocokan pembayaran otomatis", v: rp(b.kode) });
      return r;
    }
    function iStat(b) {
      var l = iLbl(b), tkid = bj(b) === "hosting" ? b.ticket : "";
      if (l === "Lunas") return ["ok", "check-circle", "Lunas", "Pembayaran sudah dikonfirmasi."];
      if (l === "Dibatalkan") return ["mu", "x-circle", "Dibatalkan", "Invoice ini dibatalkan dan tidak perlu dibayar."];
      if (l === "Kedaluwarsa") return ["rd", "exclamation-circle", "Kedaluwarsa", "Lewat jatuh tempo " + (-dleft(b.jatuh)) + " hari. Hubungi admin lewat ticket untuk bantuan."];
      return ["am", "clock", "Menunggu pembayaran", b.lapor ? "Konfirmasi pembayaran sudah dikirim, menunggu dicek admin." : "Jatuh tempo " + fdt(b.jatuh) + " (" + rel(b).toLowerCase() + ")."];
    }
    function iView(b) {
      var hs = bj(b) === "hosting", un = b.st === "Belum dibayar", l = iLbl(b), st = iStat(b), tkid = hs ? b.ticket : (TK().some(function (x) { return x.id === b.tk; }) ? b.tk : ""), em = ss("nx-email") || "";
      var rows = iRows2(b).map(function (r, ri) { return '<div class="iv-li"><span class="iv-no">' + (ri + 1) + "</span><div><b>" + e(r.n) + "</b>" + (r.s ? "<small>" + e(r.s) + "</small>" : "") + "</div><span>" + r.v + "</span></div>"; }).join("");
      var inf = [["hash", "Order", tkid || b.tk || "-"], ["box-seam", "Paket", b.item], ["tag", "Jenis", hs ? "Hosting berkala" : "Bill order"], ["arrow-repeat", "Siklus", b.siklus || "-"]];
      var ini = String(me() || "?").charAt(0).toUpperCase(), paid = l === "Lunas", sp2;
      if (paid) sp2 = ["done", "check-lg", "Dibayar", fdt(iso(iPaid(b)))];
      else if (l === "Dibatalkan") sp2 = ["bad", "x-lg", "Dibatalkan", "Tidak perlu dibayar"];
      else if (l === "Kedaluwarsa") sp2 = ["bad", "exclamation-lg", "Kedaluwarsa", "Jatuh tempo " + fdt(b.jatuh)];
      else sp2 = ["now", "hourglass-split", b.lapor ? "Menunggu dicek admin" : "Menunggu pembayaran", "Jatuh tempo " + fdt(b.jatuh)];
      var steps = '<ol class="iv-sp" aria-label="Alur invoice"><li class="done"><i class="bi bi-check-lg"></i><div><b>Diterbitkan</b><small>' + fdt(b.dibuat || b.jatuh) + '</small></div></li><li class="' + sp2[0] + '"><i class="bi bi-' + sp2[1] + '"></i><div><b>' + e(sp2[2]) + "</b><small>" + e(sp2[3]) + "</small></div></li></ol>";
      return '<div class="tkx ix iv"><div class="iv-g">' +
        '<section class="iv-doc ' + st[0] + '"><div class="iv-hd"><div class="iv-bw"><span class="iv-lg"><img src="/assets/img/logo.png" alt="" width="44" height="44"></span><div><b class="iv-br">NEXORA</b><small>' + (hs ? "Hosting " + e(b.siklus || "") : "Bill order") + '</small></div></div><div class="iv-id"><small>Invoice</small><b>' + e(b.id) + '</b><span class="iv-st ' + st[0] + '"><i></i>' + e(l) + "</span></div></div>" +
        '<div class="iv-mx"><div class="iv-bt"><span class="iv-av">' + e(ini) + '</span><div><small>Ditagihkan ke</small><b>' + e(me()) + "</b>" + (em ? "<span>" + e(em) + "</span>" : "") + '</div></div><div class="iv-dt"><div><small><i class="bi bi-calendar-plus"></i> Tanggal terbit</small><b>' + fdt(b.dibuat || b.jatuh) + '</b></div><div><small><i class="bi bi-' + (paid ? "calendar-check" : "calendar-event") + '"></i> ' + (paid ? "Dibayar" : "Jatuh tempo") + "</small><b>" + (paid ? fdt(iso(iPaid(b))) : fdt(b.jatuh)) + "</b></div></div></div>" + steps +
        '<div class="iv-lh"><span>Deskripsi</span><span>Jumlah</span></div><div class="iv-sc">' + rows + '</div><div class="iv-tt"><b>Total</b><span>' + rp(b.total) + '</span></div><div class="iv-in"><h4><i class="bi bi-receipt"></i> Informasi order</h4><dl>' + inf.map(function (x) { return '<div><i class="bi bi-' + x[0] + '"></i><div><dt>' + x[1] + "</dt><dd>" + e(x[2]) + "</dd></div></div>"; }).join("") + '</dl></div><p class="iv-ft"><i class="bi bi-patch-check"></i><span>Dokumen ini dibuat otomatis oleh NEXORA dan sah tanpa tanda tangan.</span></p></section>' +
        '<aside class="iv-sd"><div class="iv-tg"><small>Total Tagihan</small><b>' + rp(b.total) + '</b></div><div class="iv-sb ' + st[0] + '"><i class="bi bi-' + st[1] + '"></i><div><b>' + st[2] + "</b><span>" + e(st[3]) + "</span></div></div>" +
        (un && !hs && b.kode ? '<p class="iv-nt"><i class="bi bi-hash"></i><span>Nominal ' + rp(b.dasar) + " + kode unik <b>" + rp(b.kode) + "</b>. Transfer tepat sampai digit terakhir supaya langsung terdeteksi.</span></p>" : "") +
        (un && hs ? '<p class="iv-nt"><i class="bi bi-info-circle"></i><span>Pembayaran hosting dilakukan lewat ticket.</span></p>' : "") +
        '<div class="iv-ac">' + (un ? '<button class="btn" type="button" data-bx="pay" data-v="' + e(b.id) + '"><i class="bi bi-credit-card"></i> Bayar sekarang</button>' : "") + (tkid ? '<button class="btn ghost" type="button" data-bx="tk" data-v="' + e(tkid) + '"><i class="bi bi-chat-dots"></i> Lihat ticket ' + e(tkid) + "</button>" : "") +
        '<button class="btn ghost iv-dl" type="button" data-idl="' + e(b.id) + '"><i class="bi bi-download"></i> Unduh Invoice</button></div></aside></div></div>';
    }
    function pdfLib(cb) {
      if (window.jspdf && window.jspdf.jsPDF) return cb(window.jspdf.jsPDF);
      var sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; sc.async = true;
      sc.onload = function () { if (window.jspdf && window.jspdf.jsPDF) cb(window.jspdf.jsPDF); else toast("Gagal menyiapkan PDF"); };
      sc.onerror = function () { sc.remove(); toast("Gagal memuat pembuat PDF. Cek koneksi internetmu."); };
      document.head.appendChild(sc);
    }
    function iPdf(id) {
      var b = BL().filter(function (x) { return x.id === id; })[0]; if (!b) return; toast("Menyiapkan PDF…");
      pdfLib(function (J) {
        var d = new J({ unit: "mm", format: "a4" }), l = iLbl(b), hs = bj(b) === "hosting", R = 190, L = 20, y;
        var pl = function (n) { return "Rp " + Number(n).toLocaleString("id-ID"); };
        var col = { "Lunas": [34, 154, 86], "Belum dibayar": [200, 130, 10], "Kedaluwarsa": [208, 58, 58], "Dibatalkan": [120, 120, 130] }[l] || [120, 120, 130];
        if (l === "Lunas" || l === "Dibatalkan") { d.setTextColor(l === "Lunas" ? 218 : 225, l === "Lunas" ? 240 : 225, l === "Lunas" ? 225 : 230); d.setFont("helvetica", "bold"); d.setFontSize(l === "Lunas" ? 90 : 64); d.text(l === "Lunas" ? "LUNAS" : "DIBATALKAN", 105, 170, { align: "center", angle: 30 }); }
        d.setTextColor(25, 22, 40); d.setFont("helvetica", "bold"); d.setFontSize(22); d.text("NEXORA", L, 26);
        d.setFont("helvetica", "normal"); d.setFontSize(10); d.setTextColor(120, 118, 135); d.text(hs ? "Hosting " + (b.siklus || "") : "Bill order", L, 32);
        d.text("Invoice", R, 20, { align: "right" }); d.setFont("courier", "bold"); d.setFontSize(17); d.setTextColor(25, 22, 40); d.text(b.id, R, 28, { align: "right" });
        d.setFont("helvetica", "bold"); d.setFontSize(10); d.setTextColor(col[0], col[1], col[2]); d.text(l.toUpperCase(), R, 35, { align: "right" });
        d.setFont("helvetica", "normal"); d.setFontSize(9.5); d.setTextColor(120, 118, 135); d.text("Ditagihkan ke", L, 54); d.text("Tanggal", R, 54, { align: "right" });
        d.setFont("helvetica", "bold"); d.setFontSize(11.5); d.setTextColor(25, 22, 40); d.text(me(), L, 61); d.text(fdt(b.dibuat || b.jatuh), R, 61, { align: "right" });
        var em = ss("nx-email") || ""; d.setFont("helvetica", "normal"); d.setFontSize(10); d.setTextColor(120, 118, 135); if (em) d.text(em, L, 67);
        d.text(l === "Lunas" ? "Dibayar" : "Jatuh tempo", R, 70, { align: "right" }); d.setFont("helvetica", "bold"); d.setFontSize(11.5); d.setTextColor(25, 22, 40); d.text(l === "Lunas" ? fdt(iso(iPaid(b))) : fdt(b.jatuh), R, 77, { align: "right" });
        d.setDrawColor(220, 218, 230); d.line(L, 88, R, 88); y = 99;
        iRows2(b).forEach(function (r) {
          d.setFont("helvetica", "bold"); d.setFontSize(11); d.setTextColor(25, 22, 40); d.text(String(r.n), L, y); d.setFont("courier", "bold"); d.text(r.v.replace(/ /g, " "), R, y, { align: "right" });
          if (r.s) { d.setFont("helvetica", "normal"); d.setFontSize(9); d.setTextColor(120, 118, 135); d.text(String(r.s).slice(0, 80), L, y + 5); y += 5; } y += 11;
        });
        d.line(L, y - 3, R, y - 3); y += 8; d.setFont("helvetica", "bold"); d.setFontSize(13); d.setTextColor(25, 22, 40); d.text("Total", L, y); d.setFont("courier", "bold"); d.setFontSize(18); d.text(pl(b.total), R, y, { align: "right" });
        y += 10; d.line(L, y, R, y); y += 12; d.setFont("helvetica", "bold"); d.setFontSize(11); d.text("Informasi order", L, y); y += 8; d.setFont("helvetica", "normal"); d.setFontSize(10);
        [["Order", (hs ? b.ticket : b.tk) || "-"], ["Paket", b.item], ["Jenis", hs ? "Hosting berkala" : "Bill order"], ["Siklus", b.siklus || "-"]].forEach(function (x) { d.setTextColor(120, 118, 135); d.text(x[0], L, y); d.setTextColor(25, 22, 40); d.text(String(x[1]), L + 32, y); y += 7; });
        if (l === "Belum dibayar" && !hs && b.kode) { y += 6; d.setFontSize(9.5); d.setTextColor(120, 118, 135); d.text(d.splitTextToSize("Transfer tepat " + pl(b.total) + " (sudah termasuk kode unik " + pl(b.kode) + ") supaya pembayaran langsung terdeteksi.", R - L), L, y); }
        d.setFontSize(8.5); d.setTextColor(150, 148, 165); d.text("Dokumen ini dibuat otomatis oleh NEXORA dan sah tanpa tanda tangan.", 105, 286, { align: "center" });
        d.save(b.id + ".pdf"); toast("Invoice diunduh");
      });
    }
    function iOpen(id) { idet = id; draw(); var pt = $("#p-tagihan"); if (pt && pt.scrollIntoView) pt.scrollIntoView({ block: "start" }); }
    var imm = null;
    function iClose() { if (imm) { imm.remove(); imm = null; } $$(".ix-dots.open", root).forEach(function (x) { x.classList.remove("open"); x.setAttribute("aria-expanded", "false"); }); }
    function iMenu(btn, id) {
      iClose(); imm = document.createElement("div"); imm.className = "mmenu"; imm.setAttribute("role", "menu");
      imm.innerHTML = '<button type="button" role="menuitem" data-im="v"><i class="bi bi-eye"></i>Lihat Detail</button><button type="button" role="menuitem" data-im="d"><i class="bi bi-download"></i>Download Invoice</button>';
      document.body.appendChild(imm); var a = btn.getBoundingClientRect(), w = imm.offsetWidth, h = imm.offsetHeight, x = Math.min(Math.max(8, a.right - w), window.innerWidth - w - 8), y = a.bottom + 6; if (y + h > window.innerHeight - 8) y = Math.max(8, a.top - h - 6);
      imm.style.left = x + "px"; imm.style.top = y + "px"; btn.classList.add("open"); btn.setAttribute("aria-expanded", "true");
      imm.addEventListener("click", function (ev) { var m = ev.target.closest("[data-im]"); if (!m) return; iClose(); if (m.dataset.im === "v") iOpen(id); else iPdf(id); });
      var f = $("button", imm); if (f) f.focus();
    }
    document.addEventListener("mousedown", function (ev) { if (imm && !ev.target.closest(".mmenu") && !ev.target.closest("[data-imn]")) iClose(); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") iClose(); });
    window.addEventListener("resize", iClose); document.addEventListener("scroll", iClose, true);
    root.addEventListener("click", function (ev) {
      var m = ev.target.closest("[data-imn]"), so = ev.target.closest("[data-isort]"), bk = ev.target.closest("[data-ibk]"), dl = ev.target.closest("[data-idl]");
      if (m) { if (imm && m.classList.contains("open")) iClose(); else iMenu(m, m.dataset.imn); return; }
      if (so) { isort = isort === "desc" ? "asc" : "desc"; ipg = 1; var r = $(".ix-res", root); if (r) r.innerHTML = iBody(); return; }
      if (bk) { idet = ""; draw(); return; }
      if (dl) { iPdf(dl.dataset.idl); return; }
      var rv = ev.target.closest("[data-iv]"); if (rv) iOpen(rv.dataset.iv);
    });
    root.addEventListener("keydown", function (ev) { if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches && ev.target.matches("[data-iv]")) { ev.preventDefault(); iOpen(ev.target.dataset.iv); } });
    function cBills() {
      dpOn = false;
      if (idet) { var vb = BL().filter(function (x) { return x.id === idet && bmine(x); })[0]; if (vb) return iView(vb); idet = ""; }
      return '<div class="tkx ix">' + iSum() + iTabs() +
        '<div class="tkx-f"><label class="tkx-fb grow"><span>Cari</span><span class="tkx-sb"><i class="bi bi-search"></i><input data-iq type="search" placeholder="Nomor invoice" value="' + e(iq) + '" autocomplete="off"></span></label>' +
        '<div class="tkx-fb"><span>Tanggal</span>' + dtBox() + '</div></div>' +
        '<div class="tkx-box"><div class="ix-res">' + iBody() + "</div></div></div>";
    }
    function bPay(id, sudah) {
      var b = BL().filter(function (x) { return x.id === id; })[0]; if (!b) return;
      var all = TK(), ex = all.filter(function (x) { return x.id === b.ticket && !cl(x); })[0];
      var msg = sudah ? "Halo, saya sudah transfer untuk tagihan " + b.id + " (" + b.item + ", " + rp(b.total) + "). Berikut bukti transfernya, mohon dicek." : "Halo, saya ingin membayar tagihan " + b.id + " (" + b.item + ", " + rp(b.total) + ", jatuh tempo " + fdt(b.jatuh) + "). Mohon info cara pembayarannya.";
      if (!ex) {
        var tid = nextTid();
        all.unshift({ id: tid, subj: (sudah ? "Konfirmasi bayar " : "Bayar ") + b.id + " · " + b.item, kat: "Pembayaran", paket: b.item, st: "Menunggu admin balas", tgl: "Hari ini", user: "__me", m: [nm({ w: "c", t: msg, d: "Baru saja", h: hm() })] }); sv("nx-tk", all);
        var bl = BL(); bl.forEach(function (x) { if (x.id === id) { x.ticket = tid; x.log.push({ a: "Customer membuka ticket pembayaran " + tid, by: me(), at: stamp() }); } }); sv("nx-bill", bl);
        ex = { id: tid }; toast("Ticket " + tid + " dibuat untuk pembayaran " + b.id);
      } else if (sudah) { all.forEach(function (x) { if (x.id === ex.id) x.m.push(nm({ w: "c", t: msg, d: "Baru saja", h: hm() })); }); sv("nx-tk", all); }
      sel = ex.id; tg = "aktif"; tab = "tiket"; tv = "chat"; draw();
    }
    function bPaid(id) {
      var bl = BL(), b = bl.filter(function (x) { return x.id === id; })[0]; if (!b) return;
      var all = TK(), ot = all.filter(function (x) { return x.id === b.tk && !cl(x); })[0];
      if (!b.lapor) {
        b.lapor = stamp(); (b.log = b.log || []).push({ a: "Customer mengonfirmasi sudah membayar", by: me(), at: stamp() }); sv("nx-bill", bl);
        if (ot) { ot.m.push(nm({ w: "c", t: "Halo, saya sudah transfer untuk tagihan " + b.id + " (" + b.item + ", " + rp(b.total) + "). Berikut bukti transfernya, mohon dicek.", d: "Baru saja", h: hm() })); sv("nx-tk", all); }
        toast(ot ? "Konfirmasi terkirim ke ticket " + ot.id + ". Kirim bukti transfermu di sini." : "Konfirmasi pembayaran terkirim ke admin");
      } else toast("Konfirmasi sudah terkirim, tunggu admin mengecek.");
      if (ot) { sel = ot.id; tg = "aktif"; tab = "tiket"; tv = "chat"; }
      draw();
    }
    function bPayClick(id) {
      var b = BL().filter(function (x) { return x.id === id; })[0]; if (!b) return;
      if (bj(b) === "hosting") return bPay(id, false);
      var ac = BYR().filter(function (x) { return x.aktif !== false; }),
        ot = TK().filter(function (x) { return x.id === b.tk && !cl(x); })[0],
        cp = function (v, m, l) { return '<button class="pm-cp" type="button" data-cp="' + e(v) + '" data-msg="' + e(m) + '"><i class="bi bi-copy"></i> ' + l + "</button>"; };
      modal('<div class="mbox pm"><div class="mh pm-h"><span class="pm-ic"><i class="bi bi-wallet2"></i></span><div><b>Pembayaran</b><small>Bill order · ' + e(b.id) + '</small></div><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb">' +
        '<div class="pm-total"><small>Total yang harus ditransfer</small><div class="pm-amt"><b>' + rp(b.total) + "</b>" + cp(String(b.total), "Nominal disalin", "Salin nominal") + '</div><div class="pm-meta"><span><i class="bi bi-box2"></i> ' + e(b.item) + '</span><span><i class="bi bi-calendar-event"></i> Jatuh tempo ' + fdt(b.jatuh) + "</span>" + (b.ket ? '<span><i class="bi bi-card-text"></i> ' + e(b.ket) + "</span>" : "") + "</div>" + (b.kode ? '<p class="pm-kode"><i class="bi bi-hash"></i><span> Nominal ' + rp(b.dasar) + " + kode unik <b>" + rp(b.kode) + "</b>. Jangan dibulatkan, transfer sampai 3 digit terakhir.</span></p>" : "") + "</div>" +
        '<div class="pm-code"><span><small>Kode berita / catatan transfer</small><b>' + e(b.id) + "</b></span>" + cp(b.id, "Kode disalin", "Salin kode") + "</div>" +
        (ac.length ? '<h3 class="pm-sec">Transfer ke salah satu</h3><div class="pm-list">' + ac.map(function (x) { return '<div class="pm-acc"><span class="pm-ai"><i class="bi bi-' + (x.jenis === "Bank" ? "bank" : "wallet2") + '"></i></span><div class="pm-at"><small>' + e(x.jenis) + " · " + e(x.nama) + '</small><b class="pm-no">' + e(x.no) + "</b><small>a.n. " + e(x.an) + "</small></div>" + cp(x.no, "Nomor disalin", "Salin") + "</div>"; }).join("") + "</div>" : '<p class="pm-note"><i class="bi bi-info-circle"></i><span>Rekening belum diatur. Hubungi admin lewat ' + (ot ? "ticket " + e(ot.id) : "Discord NEXORA") + " untuk info pembayaran.</span></p>") +
        '<ol class="pm-steps"><li><span>Transfer tepat <b>' + rp(b.total) + "</b>" + (b.kode ? " (sudah termasuk kode unik)" : "") + " ke salah satu rekening di atas.</span></li><li><span>Tulis kode <b>" + e(b.id) + "</b> di berita atau catatan transfer.</span></li><li><span>Klik <b>Saya sudah bayar</b>" + (ot ? ", lalu kirim bukti transfer di ticket <b>" + e(ot.id) + "</b>." : ", lalu tunggu admin mengecek pembayaranmu.") + "</span></li></ol>" +
        (b.lapor ? '<p class="pm-note ok"><i class="bi bi-hourglass-split"></i><span>Konfirmasi pembayaran sudah dikirim ke admin. Tunggu admin mengecek.</span></p>' : "") +
        '</div><div class="mf"><button type="button" class="btn ghost" data-x>Tutup</button><button type="button" class="btn" data-done><i class="bi bi-check2-circle"></i> Saya sudah bayar</button></div></div>', function (m, close) {
        m.addEventListener("click", function (ev) {
          var c = ev.target.closest("[data-cp]"); if (!c || c.classList.contains("ok")) return;
          cpy(c.dataset.cp); toast(c.dataset.msg || "Disalin");
          var h = c.innerHTML; c.classList.add("ok"); c.innerHTML = '<i class="bi bi-check2"></i> Tersalin';
          setTimeout(function () { c.classList.remove("ok"); c.innerHTML = h; }, 1500);
        });
        $("[data-done]", m).addEventListener("click", function () { close(); bPaid(id); });
      });
    }
    function bAct(d) {
      var v = d.v;
      if (d.bx === "new") { bnew = true; bfReset(); return draw(); }
      if (d.bx === "back") { bnew = false; return draw(); }
      if (d.bx === "jenis") { BF.jenis = v; BF.tk = ""; BF.siklus = ""; return draw(); }
      if (d.bx === "kode") { var kdOld = BF.kode; BF.kode = 0; BF.kode = kodeUnik(Math.round(Number(BF.nom) || 0), kdOld); updSum(); return toast("Kode unik diganti jadi " + rp(BF.kode)); }
      if (d.bx === "sik") { BF.siklus = v; return draw(); }
      if (d.bx === "adj") { BF.adj = v; return draw(); }
      if (d.bx === "review") return bSend();
      if (d.bx === "fil") { bfil = v; PG.bl = 1; return draw(); }
      if (d.bx === "det") return bDetail(v);
      if (d.bx === "pay") return bPayClick(v);
      if (d.bx === "tk") { sel = v; tg = "aktif"; tv = "chat"; tab = "tiket"; return draw(); }
    }
    /* ===== Kontak & rekening (diedit admin) ===== */
    var KT = [["email", "Email", "envelope", "nama@domain.com"], ["whatsapp", "WhatsApp", "whatsapp", "081234567890"], ["discord", "Discord", "discord", "https://discord.gg/kodeinvite"], ["instagram", "Instagram", "instagram", "https://instagram.com/akunmu"], ["telegram", "Telegram", "telegram", "https://t.me/akunmu"], ["youtube", "YouTube", "youtube", "https://youtube.com/@kanalmu"], ["lainnya", "Link lain", "link-45deg", "https://..."]];
    var SKT = [["instagram", "Instagram", "instagram", "https://instagram.com/akunmu"], ["tiktok", "TikTok", "tiktok", "https://tiktok.com/@akunmu"], ["youtube", "YouTube", "youtube", "https://youtube.com/@kanalmu"], ["facebook", "Facebook", "facebook", "https://facebook.com/akunmu"], ["x", "X", "twitter-x", "https://x.com/akunmu"], ["discord", "Discord", "discord", "https://discord.gg/kodeinvite"], ["telegram", "Telegram", "telegram", "https://t.me/akunmu"], ["whatsapp", "WhatsApp", "whatsapp", "081234567890"], ["lainnya", "Link lain", "link-45deg", "https://..."]];
    function ktf(t) { return KT.concat(SKT).filter(function (x) { return x[0] === t; })[0] || KT[6]; }
    function SOS() { return ld("nx-sosmed", [{ id: "s1", tipe: "instagram", label: "Instagram", nilai: "https://instagram.com/nexora", aktif: true }, { id: "s2", tipe: "tiktok", label: "TikTok", nilai: "https://tiktok.com/@nexora", aktif: true }]); }
    function LST(k) { return k === "k" ? KON() : k === "s" ? SOS() : BYR(); }
    function STO(k) { return k === "k" ? "nx-kontak" : k === "s" ? "nx-sosmed" : "nx-bayar"; }
    function KON() { return ld("nx-kontak", [{ id: "k1", tipe: "discord", label: "Discord", nilai: "https://discord.gg/7bFYCRheRm", ket: "Konsultasi dan order lewat server Discord NEXORA.", aktif: true }, { id: "k2", tipe: "whatsapp", label: "WhatsApp", nilai: "6281234567890", ket: "Chat langsung dengan tim NEXORA.", aktif: true }, { id: "k3", tipe: "email", label: "Email", nilai: "halo@nexora.id", ket: "Untuk pertanyaan dan kerja sama.", aktif: true }]); }
    function BYR() { return ld("nx-bayar", [{ id: "p1", jenis: "Bank", nama: "BCA", no: "1234567890", an: "NEXORA", aktif: true }, { id: "p2", jenis: "E-wallet", nama: "DANA", no: "081234567890", an: "NEXORA", aktif: true }]); }
    function edList(k) {
      var isK = k !== "b", isS = k === "s", a = LST(k);
      return '<div class="tkhead"><span class="muted">' + a.length + (isS ? " akun sosmed · tampil di footer (Ikuti kami)" : isK ? " kontak · tampil di halaman Hubungi kami" : " rekening / e-wallet · tampil ke customer saat bayar bill order") + '</span><button class="btn" type="button" data-ed="' + k + 'new"><i class="bi bi-plus-circle"></i> Tambah ' + (isS ? "sosmed" : isK ? "kontak" : "rekening") + '</button></div><div class="klist">' +
        (a.map(function (x, i) {
          var ic = isK ? ktf(x.tipe)[2] : (x.jenis === "Bank" ? "bank" : "wallet2"), on = x.aktif !== false;
          return '<div class="kr' + (on ? "" : " off") + '"><span class="kr-i"><i class="bi bi-' + ic + '"></i></span><div class="kr-t"><b>' + e(isK ? x.label : x.jenis + " · " + x.nama) + "</b><small>" + e(isK ? x.nilai : x.no + " · a.n. " + x.an) + '</small></div><div class="kr-ac"><button class="swt" type="button" role="switch" aria-checked="' + on + '" aria-label="Tampilkan" data-ed="' + k + 'tgl" data-i="' + i + '"></button><em class="kr-lb">' + (on ? "Ditampilkan" : "Disembunyikan") + '</em><span class="kr-sp"></span><button class="ib" type="button" data-ed="' + k + 'edit" data-i="' + i + '" aria-label="Edit"><i class="bi bi-pencil"></i></button><button class="ib dn" type="button" data-ed="' + k + 'del" data-i="' + i + '" aria-label="Hapus"><i class="bi bi-trash"></i></button></div></div>';
        }).join("") || '<div class="dcard empty"><i class="bi bi-' + (isS ? "share" : isK ? "telephone" : "bank") + '"></i><b>Belum ada ' + (isS ? "sosmed" : isK ? "kontak" : "rekening") + "</b></div>") + '</div><p class="muted kr-n">' + (window.NX && NX.live ? "Perubahan langsung tampil di situs untuk semua pengunjung." : "Demo: perubahan tersimpan di browser ini dan belum mengubah web asli.") + '</p>';
    }
    function edModal(k, i) {
      var isK = k !== "b", isS = k === "s", a = LST(k), cur = i >= 0 ? a[i] : null, tip = cur ? (isK ? cur.tipe : cur.jenis) : (isS ? "instagram" : isK ? "email" : "Bank");
      var opts = isK ? (isS ? SKT : KT).map(function (x) { return [x[0], x[1], x[2]]; }) : [["Bank", "Bank", "bank"], ["E-wallet", "E-wallet", "wallet2"]];
      var f = isK ? [["Label", cur ? cur.label : "", isS ? "Contoh: Instagram NEXORA" : "Contoh: Email support"], ["Nilai (email / nomor / link)", cur ? cur.nilai : "", ktf(tip)[3]], ["Keterangan (opsional)", cur ? cur.ket || "" : "", "Tampil di bawah kontak"]].slice(0, isS ? 2 : 3) : [["Nama bank / e-wallet", cur ? cur.nama : "", "Contoh: BCA atau DANA"], ["Nomor rekening / HP", cur ? cur.no : "", "Nomor tujuan transfer"], ["Atas nama", cur ? cur.an : "", "Nama pemilik rekening"]];
      modal('<div class="mbox sm pk"><div class="mh"><b>' + (cur ? "Edit " : "Tambah ") + (isS ? "sosmed" : isK ? "kontak" : "rekening / e-wallet") + '</b><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb"><div class="fld"><span>Jenis</span><div class="tipe" id="ed-t" role="group">' + opts.map(function (o) { return '<button type="button" class="tp" data-v="' + o[0] + '" aria-pressed="' + (o[0] === tip) + '"><i class="bi bi-' + o[2] + '"></i><span>' + o[1] + "</span></button>"; }).join("") + "</div></div>" +
        f.map(function (x, n) { return '<label class="fld"><span>' + x[0] + '</span><input class="inp" id="ed-' + "abc".charAt(n) + '" maxlength="120" value="' + e(x[1]) + '" placeholder="' + e(x[2]) + '"></label>'; }).join("") + '<p class="err" id="ed-e" hidden></p></div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button type="button" class="btn" data-ok>Simpan</button></div></div>', function (m, close) {
        var T = tip;
        $$("#ed-t button", m).forEach(function (b) { b.addEventListener("click", function () { T = b.dataset.v; $$("#ed-t button", m).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); if (isK) $("#ed-b", m).placeholder = ktf(T)[3]; }); });
        $("[data-ok]", m).addEventListener("click", function () {
          var A = $("#ed-a", m).value.trim(), B = $("#ed-b", m).value.trim(), C = $("#ed-c", m) ? $("#ed-c", m).value.trim() : "", er = $("#ed-e", m);
          function bad(x) { er.textContent = x; er.hidden = false; }
          if (!A || !B) return bad(isK ? "Label dan nilai wajib diisi." : "Nama dan nomor wajib diisi.");
          if (isK) {
            if (T === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(B)) return bad("Format email tidak valid.");
            if (T === "whatsapp") { B = B.replace(/\D/g, ""); if (B.charAt(0) === "0") B = "62" + B.slice(1); if (B.length < 9) return bad("Nomor WhatsApp tidak valid."); }
            if (T !== "email" && T !== "whatsapp") { if (!/^https?:\/\//i.test(B)) B = "https://" + B; if (!/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(B)) return bad("Link tidak valid."); }
          } else if (!C) return bad("Atas nama wajib diisi.");
          var ak = cur ? cur.aktif !== false : true, o = isK ? { id: cur ? cur.id : "k" + Date.now(), tipe: T, label: A, nilai: B, ket: C, aktif: ak } : { id: cur ? cur.id : "p" + Date.now(), jenis: T, nama: A, no: B, an: C, aktif: ak };
          if (cur) a[i] = o; else a.push(o);
          sv(STO(k), a); close(); toast("Tersimpan"); draw();
        });
      });
    }
    function edAct(d) {
      var k = d.ed.charAt(0), op = d.ed.slice(1), isK = k !== "b", a = LST(k), i = Number(d.i);
      if (op === "new") return edModal(k, -1);
      if (op === "edit") return edModal(k, i);
      if (op === "tgl") { a[i].aktif = a[i].aktif === false; sv(STO(k), a); toast((isK ? (a[i].label || "Kontak") : (a[i].nama || "Rekening")) + (a[i].aktif === false ? " disembunyikan dari customer" : " ditampilkan ke customer")); return draw(); }
      if (op === "del") return modal('<div class="mbox sm"><div class="mh"><b>Hapus ' + (k === "s" ? "sosmed" : isK ? "kontak" : "rekening") + '?</b></div><div class="mb"><p>' + e(isK ? a[i].label : a[i].nama) + ' akan dihapus dan tidak tampil lagi.</p></div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button type="button" class="btn dng" data-ok>Hapus</button></div></div>', function (m, close) { $("[data-ok]", m).addEventListener("click", function () { a.splice(i, 1); sv(STO(k), a); close(); toast("Dihapus"); draw(); }); });
    }
    var TITLES = { c: { ringkasan: ["Dashboard", ""], tiket: ["Ticket", "Tanya dulu sebelum membeli, atau pantau pesanan yang sedang dikerjakan."], tagihan: ["Invoice", "Semua tagihan dari pesananmu."], buka: ["Mulai Order", "Order baru atau tanya sesuatu ke tim NEXORA."], profile: ["Profile", "Kelola data akunmu."] },
      a: { ulasan: ["Ulasan", "Penilaian customer untuk NEXORA. Pilih mana yang tampil di halaman Ulasan."], ringkasan: ["Dashboard", "Kondisi ticket dan pesanan saat ini."], tiket: ["Ticket", "Lihat, balas, dan ubah status ticket customer."], tagihan: ["Tagihan", "Buat dan pantau tagihan customer dengan pengaman."], kontak: ["Kontak & sosmed", "Atur kontak halaman Hubungi kami dan icon sosmed di footer."], bayar: ["Pembayaran", "Rekening dan e-wallet untuk pembayaran bill order."], jasa: ["Jasa setup", "Kelola jasa dan paketnya. Tambah jasa baru atau hapus yang tidak dipakai."], hosting: ["Hosting", "Kelola paket hosting."], tampilan: ["Nama situs", "Atur nama website."], ekspor: ["Ekspor data", "Unduh cadangan ticket dan pesanan."], customer: ["Customer", "Data akun customer untuk menghubungi jika ada kendala."], tim: ["Tim & role", "Atur siapa saja yang bisa masuk dashboard admin dan role-nya."] } };
    var RDESC = { Founder: "Semua fitur dan satu-satunya yang bisa memberi atau mengubah role.", "Co-Founder": "Semua fitur dashboard admin, kecuali mengatur role.", Teknisi: "Dashboard, Ticket, dan Tagihan. Bisa membalas ticket dan membuat tagihan." };
    var RICO = { Founder: "award", "Co-Founder": "stars", Teknisi: "tools" };
    function roleDD(i, x) {
      return '<div class="dd rdd" data-rdd="' + i + '"><button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Ubah role ' + e(x.nama) + '"><span class="dd-val"><i class="bi bi-' + RICO[x.role] + '"></i><b>' + e(x.role) + '</b></span><i class="bi bi-chevron-down chev"></i></button><div class="dd-menu" role="listbox" hidden>' +
        ["Co-Founder", "Teknisi"].map(function (r) { return '<button class="dd-opt" type="button" role="option" data-v="' + r + '" aria-selected="' + (r === x.role) + '"><span class="ro-i ' + RC[r] + '"><i class="bi bi-' + RICO[r] + '"></i></span><span class="tx"><b>' + r + "</b><small>" + (r === "Co-Founder" ? "Semua fitur, kecuali atur role" : "Dashboard, ticket, dan tagihan") + '</small></span><i class="bi bi-check2 ck"></i></button>'; }).join("") + "</div></div>";
    }
    function timPanel() {
      var S = STAFF(), meE = (ss("nx-email") || "").toLowerCase(), isF = arole() === "Founder";
      var cntR = {}; S.forEach(function (x) { cntR[x.role] = (cntR[x.role] || 0) + 1; });
      var TL = { ringkasan: "Dashboard", tiket: "Ticket", tagihan: "Tagihan", customer: "Customer", ulasan: "Ulasan", jasa: "Jasa setup", hosting: "Hosting", tampilan: "Nama situs", kontak: "Kontak", bayar: "Pembayaran", ekspor: "Ekspor data", tim: "Tim & role" };
      var leg = ROLES.map(function (r) { var pm = PERM[r], all = r !== "Teknisi"; return '<article class="rl-c ' + RC[r] + '"><div class="rl-t"><span class="rl-i"><i class="bi bi-' + RICO[r] + '"></i></span><div><b>' + r + '</b><small>' + (cntR[r] || 0) + ' anggota · ' + pm.length + ' menu</small></div></div><p>' + RDESC[r] + '</p><div class="rl-a"><span class="rl-k">Akses</span>' + (all ? '<span class="rl-ch all"><i class="bi bi-check2-all"></i>' + (r === "Founder" ? "Semua fitur + atur role" : "Semua fitur") + "</span>" : pm.map(function (k) { return '<span class="rl-ch">' + TL[k] + "</span>"; }).join("")) + "</div></article>"; }).join("");
      var rows = S.map(function (x, i) {
        var self = x.email === meE, fixed = x.role === "Founder" || self;
        return '<article class="st-r"><span class="av">' + e((x.nama || "?").charAt(0).toUpperCase()) + '</span><div class="st-t"><b>' + e(x.nama) + (self ? " <em>kamu</em>" : "") + "</b><small>" + e(x.email || ("Discord ID " + x.discord_id)) + '</small></div><div class="st-o">' + (fixed || !isF ? rbd(x.role) : roleDD(i, x)) + "</div>" + (isF ? '<button class="btn ghost sm" type="button" data-tm="ren" data-i="' + i + '"><i class="bi bi-pencil"></i> Ubah nama</button>' : "") + (isF && !fixed ? '<button class="btn ghost sm dn" type="button" data-tm="del" data-i="' + i + '"><i class="bi bi-trash3"></i> Hapus</button>' : "") + "</article>";
      }).join("");
      var dots = ROLES.map(function (r) { return '<span class="rlx-dot ' + RC[r] + '" title="' + r + '"><i class="bi bi-' + RICO[r] + '"></i></span>'; }).join("");
      return '<div class="rlx' + (rlOpen ? " open" : "") + '"><button class="rlx-b" type="button" data-rlt aria-expanded="' + rlOpen + '" aria-controls="rlx-p"><span class="rlx-ic"><i class="bi bi-shield-lock"></i></span><span class="rlx-tx"><b>Role dan hak akses</b><small>Tiap role punya menu yang berbeda di dashboard admin.</small></span><span class="rlx-dots" aria-hidden="true">' + dots + '</span><span class="rlx-ch" aria-hidden="true"><i class="bi bi-chevron-down"></i></span></button><div class="rlx-p" id="rlx-p"><div class="rlx-in"><div class="rl-g">' + leg + '</div></div></div></div><div class="tkhead tm-h"><div class="tm-t"><b>Anggota tim</b><span class="bd b4">' + S.length + '</span></div>' + (isF ? '<button class="btn" type="button" data-tm="new"><i class="bi bi-person-plus"></i> Tambah anggota</button>' : "") + '</div><div class="st-l">' + rows + '</div><p class="muted kr-n">Hanya Founder yang bisa menambah anggota dan mengatur role. Demo: data tersimpan di browser ini dan password tidak diperiksa.</p>';
    }
    function trole(t) {
      if (arole() !== "Founder") { toast("Hanya Founder yang bisa mengatur role"); return draw(); }
      var S = STAFF(), x = S[Number(t.dataset.trole)]; if (!x || x.role === "Founder" || ROLES.indexOf(t.value) < 1) return;
      x.role = t.value; saveStaff(S, x.nama + " sekarang " + t.value);
    }
    function needWa() { var P = ld("nx-prof", {}); return !P.wa; }
    function waModal() {
      return modal('<div class="mbox sm"><div class="mh"><b>Isi nomor WhatsApp dulu</b><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb"><p>Untuk membuka ticket, kami butuh nomor WhatsApp-mu supaya tim NEXORA bisa menghubungimu kalau ada kendala.</p></div><div class="mf"><button type="button" class="btn ghost" data-x>Nanti</button><button type="button" class="btn" data-ok><i class="bi bi-whatsapp"></i> Isi di Profil</button></div></div>', function (m, close) {
        $("[data-ok]", m).addEventListener("click", function () { close(); tab = "profile"; ptab = "profil"; draw(); setTimeout(function () { var i = $('#p-profile [name="wa"]', root); if (i) { i.focus(); i.scrollIntoView({ block: "center" }); } }, 80); });
      });
    }
    function tmAct(d) {
      if (arole() !== "Founder") return toast("Hanya Founder yang bisa mengatur role");
      if (d.tm === "new") return modal('<form class="mbox sm" id="f-tm"><div class="mh"><b>Tambah anggota tim</b><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb"><label class="fld"><span>Nama <em class="req">*</em></span><input class="inp" name="nama" maxlength="40" required></label><label class="fld"><span>Email Google</span><input class="inp" name="email" type="email" placeholder="nama@gmail.com"><small class="hint">Untuk anggota yang login dengan Google.</small></label><label class="fld"><span>ID Discord</span><input class="inp" name="did" inputmode="numeric" pattern="[0-9]{15,22}" placeholder="angka 17-19 digit"><small class="hint">Untuk anggota yang login dengan Discord. Isi salah satu atau keduanya.</small></label><div class="fld"><span>Role</span><div class="seg2 full" id="tm-r"><button type="button" data-v="Teknisi" aria-pressed="true">Teknisi</button><button type="button" data-v="Co-Founder" aria-pressed="false">Co-Founder</button></div></div><p class="err" id="tm-e" hidden></p></div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button class="btn" type="submit"><i class="bi bi-person-plus"></i> Tambah</button></div></form>', function (m, close) {
        var R = "Teknisi";
        $$("#tm-r button", m).forEach(function (b) { b.addEventListener("click", function () { R = b.dataset.v; $$("#tm-r button", m).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); }); });
        $("#f-tm", m).addEventListener("submit", function (ev) {
          ev.preventDefault(); var f = ev.target, nm = f.nama.value.trim(), em = f.email.value.trim().toLowerCase(), did = (f.did.value || "").trim(), er = $("#tm-e", m), S2 = STAFF(); if (!em && !did) { er.textContent = "Isi email Google atau ID Discord."; er.hidden = false; return; }
          if (S2.some(function (x) { return (em && x.email === em) || (did && x.discord_id === did); })) { er.textContent = "Akun ini sudah terdaftar di tim."; er.hidden = false; return; }
          S2.push({ id: "s" + Date.now(), nama: nm, email: em, discord_id: did, role: R, dibuat: Date.now() }); close(); saveStaff(S2, nm + " ditambahkan sebagai " + R);
        });
      });
      if (d.tm === "ren") {
        var S0 = STAFF(), y = S0[Number(d.i)]; if (!y) return;
        return modal('<form class="mbox sm" id="f-ren"><div class="mh"><b>Ubah nama</b><button type="button" class="ib" data-x aria-label="Tutup"><i class="bi bi-x-lg"></i></button></div><div class="mb"><label class="fld"><span>Nama <em class="req">*</em></span><input class="inp" name="nama" maxlength="40" required value="' + e(y.nama) + '"></label><small class="hint">' + e(y.role) + " · " + e(y.email || ("Discord ID " + y.discord_id)) + '</small></div><div class="mf"><button type="button" class="btn ghost" data-x>Batal</button><button class="btn" type="submit">Simpan</button></div></form>', function (m, close) {
          $("#f-ren", m).addEventListener("submit", function (ev) { ev.preventDefault(); var nm = ev.target.nama.value.trim(); if (!nm) return; y.nama = nm; close(); saveStaff(S0, "Nama diubah menjadi " + nm); });
        });
      }
      var S = STAFF(), x = S[Number(d.i)]; if (!x || x.role === "Founder") return;
      if (d.tm === "del") return modal('<div class="mbox sm"><div class="mh"><b>Hapus anggota?</b></div><div class="mb"><p>' + e(x.nama) + " (" + e(x.role) + ") tidak bisa lagi masuk ke dashboard admin.</p></div><div class=\"mf\"><button type=\"button\" class=\"btn ghost\" data-x>Batal</button><button type=\"button\" class=\"btn dng\" data-ok>Hapus</button></div></div>", function (m, close) {
        $("[data-ok]", m).addEventListener("click", function () { var S3 = STAFF().filter(function (z) { return z.id !== x.id; }); close(); saveStaff(S3, x.nama + " dihapus dari tim"); });
      });
    }
    var PAN = {
      ringkasan: function () {
        var a = adm ? TK() : mine(), n = a.filter(function (x) { return !cl(x); }).length, el = $("#p-ringkasan");
        if (adm) {
          var all = TK(), act = all.filter(function (x) { return !cl(x); }), need = act.filter(function (x) { return last(x).w === "c"; }), bl = BL(), cn = function (st) { return act.filter(function (x) { return x.st === st; }).length; };
          var unpaid = bl.filter(function (b) { return b.st === "Belum dibayar"; }), late = unpaid.filter(function (b) { return dleft(b.jatuh) < 0; }), tot = unpaid.reduce(function (z, b) { return z + Number(b.total || 0); }, 0);
          var H = HG(), np = H.hosting.length + Object.keys(H.jasa).reduce(function (z, k) { return z + H.jasa[k].length; }, 0);
          var jm = new Date().getHours(), sl = jm < 11 ? "pagi" : jm < 15 ? "siang" : jm < 18 ? "sore" : "malam", hr = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
          var SG = [["Menunggu admin balas", "#d9a000"], ["Terhubung dengan admin", "#3b7ddd"], ["Menunggu pembayaran", "#c43d85"], ["Pembayaran Dikonfirmasi", "#0ea5a4"], ["Pesanan Diproses", "#8b5cf6"], ["Orderan Selesai", "#2a9a56"]], acc = 0, stops = [];
          SG.forEach(function (g) { var p = act.length ? cn(g[0]) / act.length * 100 : 0; if (p) { stops.push(g[1] + " " + acc.toFixed(2) + "% " + (acc + p).toFixed(2) + "%"); acc += p; } });
          var dn = stops.length ? "conic-gradient(" + stops.join(",") + ")" : "conic-gradient(var(--line) 0 100%)";
          var sx = function (ic, lb, v, tn, tb, sub) { return '<button type="button" class="dstat sx ' + tn + '" data-tab="' + tb + '"><span class="si"><i class="bi bi-' + ic + '"></i></span><div><small>' + lb + "</small><b>" + v + "</b>" + (sub ? "<em>" + sub + "</em>" : "") + "</div></button>"; };
          var needH = need.slice(0, 5).map(function (x) { return '<button class="li ln" data-gt="' + x.id + '">' + av(uname(x), x.cav) + '<span><b>' + e(x.subj) + "</b><small>" + e(x.id) + " · " + e(uname(x)) + " · " + e(last(x).d) + "</small></span>" + bd(x.st, 1) + "</button>"; }).join("") || '<div class="dcard empty sm0"><i class="bi bi-check2-circle"></i><b>Semua sudah dibalas</b><p class="muted">Tidak ada ticket yang menunggu balasanmu.</p></div>';
          var billH = unpaid.slice().sort(function (x, y) { return x.jatuh < y.jatuh ? -1 : 1; }).slice(0, 4).map(function (b) { var lt = dleft(b.jatuh) < 0; return '<button class="li ln' + (lt ? " late" : "") + '" data-tab="tagihan"><span class="bh-i ' + (lt ? "x" : "w") + '"><i class="bi bi-' + (lt ? "exclamation-triangle" : "hourglass-split") + '"></i></span><span><b>' + e(b.item) + " · " + rp(b.total) + "</b><small>" + e(b.id) + " · " + e(bcust(b)) + " · " + rel(b) + "</small></span>" + bd(bs(b)) + "</button>"; }).join("") || '<div class="dcard empty sm0"><i class="bi bi-cash-stack"></i><b>Tidak ada tagihan aktif</b><p class="muted">Tagihan yang belum dibayar muncul di sini.</p></div>';
          var legend = SG.map(function (g) { return '<li><i style="background:' + g[1] + '"></i><span>' + (SHORT[g[0]] || g[0]) + "</span><b>" + cn(g[0]) + "</b></li>"; }).join("");
          var QK = [["receipt", "Buat tagihan", "tagihan"], ["tags", "Jasa setup", "jasa"], ["hdd-stack", "Hosting", "hosting"], ["telephone", "Kontak", "kontak"]].filter(function (q) { return can(q[2]); }).map(function (q) { return '<button type="button" class="qk" data-tab="' + q[2] + '"><i class="bi bi-' + q[0] + '"></i><span>' + q[1] + "</span></button>"; }).join("");
          el.innerHTML = '<div class="hero-c adm-hero"><div><small class="hero-d">' + e(hr) + "</small><b>Selamat " + sl + ", " + e(me()) + "</b><p>" + (need.length ? need.length + " ticket menunggu balasanmu." : "Semua ticket sudah ditanggapi.") + (late.length ? " " + late.length + " tagihan terlambat." : "") + '</p></div><div class="hc-a"><button class="btn" data-tab="tiket"><i class="bi bi-chat-dots"></i> Lihat ticket</button><button class="btn ghost" data-tab="tagihan"><i class="bi bi-receipt"></i> Tagihan</button></div></div>' +
            '<div class="dstats sx-g">' + sx("chat-left-dots", "Perlu dibalas", need.length, "t1", "tiket") + sx("chat-dots", "Ticket aktif", act.length, "t2", "tiket") + sx("hourglass-split", "Menunggu pembayaran", cn("Menunggu pembayaran"), "t3", "tiket") + sx("lightning-charge", "Pesanan diproses", cn("Pesanan Diproses"), "t5", "tiket") + sx("cash-stack", "Tagihan aktif", unpaid.length, "t4", "tagihan", rp(tot)) + sx("exclamation-triangle", "Terlambat", late.length, "t6", "tagihan") + "</div>" +
            '<div class="cols2 adm-cols"><div><div class="sec-h"><h2>Perlu dibalas</h2><button type="button" class="lnk" data-tab="tiket">Lihat semua <i class="bi bi-arrow-right"></i></button></div><div class="lis">' + needH + '</div><div class="sec-h"><h2>Tagihan perlu perhatian</h2><button type="button" class="lnk" data-tab="tagihan">Lihat semua <i class="bi bi-arrow-right"></i></button></div><div class="lis">' + billH + "</div></div>" +
            '<div><div class="sec-h"><h2>Pintasan</h2></div><div class="qk-g">' + QK + '</div></div></div>'; return;
        }
        var jam = new Date().getHours(), sal = jam < 11 ? "pagi" : jam < 15 ? "siang" : jam < 18 ? "sore" : "malam";
        var hari = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
        var tg2 = BL().filter(function (b) { return bmine(b) && b.st === "Belum dibayar"; }), tot = tg2.reduce(function (z, b) { return z + Number(b.total || 0); }, 0);
        var aktif = a.filter(function (x) { return !cl(x); }), bayar = a.filter(function (x) { return x.st === "Menunggu pembayaran"; }), ls = ctab === "bayar" ? bayar : aktif;
        var HL = [["book", "Pertanyaan umum", "/pages/faq.html"], ["discord", "Discord NEXORA", "https://discord.gg/7bFYCRheRm"], ["file-earmark-text", "Syarat dan ketentuan", "/pages/terms.html"], ["shield-check", "Kebijakan privasi", "/pages/privacy.html"]];
        el.innerHTML = '<p class="dt-date">' + e(hari) + '</p><div class="cdash"><div class="cmain"><section class="cg"><h2>Selamat ' + sal + ", " + e(me()) + '</h2><p class="cg-note">Ceritakan kebutuhan servermu saat memesan. Makin jelas, makin cepat tim NEXORA memberi harga.</p><div class="cg-a"><button class="cg-b" data-go="buka"><i class="bi bi-shop"></i> Pesan jasa</button><button class="cg-b" type="button" data-go="buka" data-kat="Bantuan"><i class="bi bi-question-circle"></i> Tanya teknisi</button><button class="cg-b" data-go="tagihan"><i class="bi bi-receipt"></i> Invoice</button></div></section>' + pcBanner() +
          '<section class="cc"><header class="cc-h"><i class="bi bi-chat-dots"></i><b>Pesananmu</b></header><div class="cc-seg"><button type="button" data-ct="aktif" aria-pressed="' + (ctab !== "bayar") + '">Ticket aktif <em>' + aktif.length + '</em></button><button type="button" data-ct="bayar" aria-pressed="' + (ctab === "bayar") + '">Menunggu bayar <em>' + bayar.length + '</em></button></div><div class="cc-t">' +
          (ls.length ? '<div class="tkx-list">' + ls.slice(0, 5).map(function (x) { return '<button type="button" class="tkx-r" data-gt="' + e(x.id) + '"><span class="tkx-t"><b>' + e(x.subj) + "</b><small><code>" + e(x.id) + "</code><span>" + e(kJenis(x) !== "Lainnya" ? kJenis(x) : x.kat) + "</span></small></span>" + '<span class="tkx-p">' + (x.paket && x.paket !== "-" ? e(x.paket) : "-") + '</span><span class="tkx-d">' + e(x.tgl) + "</span></button>"; }).join("") + '</div>' : '<div class="cc-e"><i class="bi bi-inbox"></i><span>' + (ctab === "bayar" ? "Tidak ada pesanan yang menunggu pembayaran." : "Belum ada ticket aktif.") + '</span><button class="cg-b" data-go="buka"><i class="bi bi-plus-circle"></i> Pesan jasa</button></div>') + '</div>' + (ls.length ? '<div class="cc-ft"><button type="button" class="lnk" data-tab="tiket">Lihat semua <i class="bi bi-arrow-right"></i></button></div>' : "") + '</section></div>' +
          '<aside class="cside"><section class="cc"><header class="cc-h"><i class="bi bi-wallet2"></i><b>Invoice</b></header><div class="cc-p"><small>Belum dibayar</small><b class="big">' + rp(tot) + '</b><small>' + tg2.length + ' invoice aktif</small><button type="button" class="cg-w" data-go="tagihan">Lihat invoice</button></div></section>' +
          '<section class="cc"><header class="cc-h"><i class="bi bi-life-preserver"></i><b>Bantuan</b></header><div class="hl">' + HL.map(function (h) { return '<a href="' + h[2] + '"' + (h[2].indexOf("http") === 0 ? ' target="_blank" rel="noopener"' : "") + '><span><i class="bi bi-' + h[0] + '"></i></span>' + h[1] + '<i class="bi bi-arrow-up-right"></i></a>'; }).join("") + "</div></section></aside></div>";
      },
      tiket: function () { $("#p-tiket").innerHTML = tkPanel(); },
      kontak: function () { $("#p-kontak").innerHTML = edList("k") + '<h3 class="sec-h"><i class="bi bi-share"></i> Media sosial footer</h3><p class="muted sec-p">Icon yang tampil di bawah tulisan "Ikuti kami" pada footer semua halaman.</p>' + edList("s"); },
      ulasan: function () {
        var A = RV().slice().sort(function (a, b) { return b.ts - a.ts; }), n = A.length, avg = n ? A.reduce(function (z, r) { return z + r.bintang; }, 0) / n : 0, sh = A.filter(function (r) { return r.tampil; }).length;
        var fl = A.filter(function (r) { return rvf === "semua" || (rvf === "tampil") === !!r.tampil; });
        var sum = '<section class="rvsum"><div class="rvsum-a"><b>' + (n ? avg.toFixed(1).replace(".", ",") : "-") + "</b>" + rvs(Math.round(avg)) + "<small>" + n + ' ulasan · ' + sh + ' tampil di halaman Ulasan</small></div><div class="rvsum-d">' + [5, 4, 3, 2, 1].map(function (k) { var c = A.filter(function (r) { return r.bintang === k; }).length; return '<div><span>' + k + '</span><i><u style="width:' + (n ? c / n * 100 : 0) + '%"></u></i><em>' + c + "</em></div>"; }).join("") + "</div></section>";
        var chips = '<div class="chips mini">' + [["semua", "Semua", n], ["tampil", "Tampil di halaman Ulasan", sh], ["sembunyi", "Disembunyikan", n - sh]].map(function (c) { return '<button class="chip" type="button" data-rvfil="' + c[0] + '" aria-pressed="' + (rvf === c[0]) + '">' + c[1] + " <b>" + c[2] + "</b></button>"; }).join("") + "</div>";
        var cards = fl.map(function (r) {
          return '<article class="rvc' + (r.tampil ? " on" : "") + '"><div class="rvc-h">' + av(r.user) + '<div class="rvc-n"><b>' + e(r.user) + "</b><small>" + e(r.tgl) + '</small></div>' + rvs(r.bintang) + "</div>" + (r.teks ? "<p>" + e(r.teks) + "</p>" : '<p class="muted">Tanpa komentar.</p>') + '<div class="rvc-f"><span class="rvc-t"><i class="bi bi-box2"></i>' + e(r.paket || "-") + '</span><span class="rvc-s"><span>' + (r.tampil ? "Tampil di halaman Ulasan" : "Disembunyikan") + '</span><button class="swt" type="button" role="switch" aria-checked="' + !!r.tampil + '" aria-label="Tampilkan di homepage" data-rvt="' + e(r.id) + '"></button></span></div></article>';
        }).join("");
        $("#p-ulasan").innerHTML = sum + (n ? chips + '<div class="rvg">' + (cards || '<div class="dcard empty"><i class="bi bi-star"></i><b>Tidak ada ulasan di filter ini</b></div>') + "</div>" : '<div class="dcard empty"><i class="bi bi-star"></i><b>Belum ada ulasan</b><p class="muted">Ulasan masuk setelah customer menilai pesanan yang berstatus Orderan Selesai. Ulasan baru disembunyikan dulu sampai kamu aktifkan.</p></div>') + '<p class="muted kr-n">Rata-rata dan jumlah di halaman Ulasan dihitung dari semua ulasan, tapi yang tampil hanya ulasan yang kamu aktifkan.</p>';
      },
      bayar: function () { $("#p-bayar").innerHTML = edList("b"); },
      tagihan: function () { $("#p-tagihan").innerHTML = adm ? (bnew ? bForm() : bList()) : cBills(); if (adm && bnew) updSum(); },
      buka: function () {
        bsv = ""; bcat = "semua"; bpg = 0;
        $("#p-buka").innerHTML = '<div class="bk"><form class="bkf" id="f-buka"><section class="bs"><h3><i>1</i><span>Pilih jenis<small>Mau pesan layanan atau tanya dulu ke tim NEXORA?</small></span></h3><div class="opts">' +
          [["Order baru", "receipt", "Pesan setup atau hosting"], ["Bantuan", "chat-dots", "Tanya atau lapor kendala"]].map(function (o, i) { return '<label class="opt"><input type="radio" name="kat" value="' + o[0] + '"' + (i ? "" : " checked") + '><span class="opt-ic"><i class="bi bi-' + o[1] + '"></i></span><b>' + o[0] + "</b><small>" + o[2] + '</small><span class="opt-ck" aria-hidden="true"><i class="bi bi-check-lg"></i></span></label>'; }).join("") +
          '</div></section><section class="bs" id="ord"><h3><i>2</i><span>Pilih layanan dan paket<small>Pilih jenis layanan, lalu paket yang paling cocok.</small></span></h3><div class="tkx-tw"><div class="tkx-tabs" role="tablist" aria-label="Pilih layanan">' + JK().map(function (k) { return [k, JM(k).nama]; }).concat([["hosting", "Hosting"]]).map(function (s, i) { return '<button type="button" role="tab" data-svc="' + s[0] + '" aria-selected="false">' + e(s[1]) + "<em>" + JR(s[0]).length + "</em></button>"; }).join("") + '</div><button type="button" class="tkx-ar l" aria-label="Geser ke kiri"><i class="bi bi-chevron-left"></i></button><button type="button" class="tkx-ar r" aria-label="Geser ke kanan"><i class="bi bi-chevron-right"></i></button></div><input type="hidden" name="paket"><div id="pk-box"></div></section>' +
          '<section class="bs"><h3><i id="n3">3</i><span>Ceritakan kebutuhanmu<small>Makin jelas ceritamu, makin cepat pesananmu dikerjakan.</small></span></h3><label class="fld"><span>Subjek <em class="req" id="rq">*</em></span><input class="inp" name="subj" maxlength="80"></label><label class="fld"><span>Pesan <em class="req">*</em></span><textarea class="txa" name="msg" maxlength="1000" required></textarea><small class="hint"><span id="cc">0</span>/1000</small></label></section></form>' +
          '<div class="bk-side"><aside class="bsum" id="bsum" aria-label="Ringkasan ticket"><div class="bsum-h"><span class="bsum-hi"><i class="bi bi-receipt-cutoff"></i></span><div><b>Ringkasan</b><small>Cek dulu sebelum dikirim</small></div></div><dl class="bsum-l" id="bsum-l"></dl><div class="bsum-t" id="bsum-t"></div><button class="btn bsum-go" id="bsum-go" type="submit" form="f-buka"><i class="bi bi-send"></i> <span>Kirim ticket</span></button><p class="bsum-n" id="bsum-n"></p></aside></div></div>';
        bukaSync(); bkInd(false); requestAnimationFrame(function () { bkInd(false); }); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { bkInd(false); });
      },
      profile: function () {
        var P = ld("nx-prof", { discord: "", wa: "" }), em = ss("nx-email") || "", k = LK();
        var TABS = [["profil", "person", "Profil"], ["keamanan", "shield-check", "Keamanan"], ["notif", "bell", "Notifikasi"], ["akun", "link-45deg", "Akun terhubung"]];
        if (!TABS.some(function (x) { return x[0] === ptab; })) ptab = "profil";
        var foto = myFoto() || safeAv(ss("nx-avatar")), mine0 = !!myFoto();
        var tg = function (key, ic, t, sub) { var on = P[key] !== false; return '<div class="pf-tg"><span class="pf-ti"><i class="bi bi-' + ic + '"></i></span><div><b>' + t + "</b><small>" + sub + '</small></div><button type="button" class="swt" role="switch" aria-checked="' + on + '" aria-label="' + t + '" data-pf="' + key + '"></button></div>'; };
        var sec = function (t, sub, body) { return '<section class="pf-sec"><div class="pf-sh"><h3>' + t + "</h3><p>" + sub + '</p></div><div class="pf-card">' + body + "</div></section>"; };
        var body = {
          profil: sec("Profil", "Nama dan nomor yang dilihat teknisi saat menangani ticketmu.",
            '<form class="pf-form" id="f-prof"><span class="pf-lb">Foto profil</span><div class="pf-photo"><label class="pf-ava" for="pf-file" title="Klik atau seret foto ke sini">' + (foto ? '<img src="' + e(foto) + '" alt="" referrerpolicy="no-referrer">' : e(me().charAt(0).toUpperCase())) + '</label><div class="pf-pu"><div class="pf-pb"><input type="file" id="pf-file" accept="image/png,image/jpeg,image/webp" hidden><label class="btn ghost pf-up" for="pf-file"><i class="bi bi-image"></i> Unggah foto</label>' + (mine0 ? '<button type="button" class="btn ghost pf-up" id="pf-rm"><i class="bi bi-trash3"></i> Hapus</button>' : "") + '</div><p class="pf-ht">PNG, JPG, atau WebP. Otomatis dikompres saat diunggah.<br>Tanpa foto, kami pakai foto Google atau Discord, lalu inisial namamu.</p></div></div>' +
            '<span class="pf-lb">Email</span><div class="pf-em"><span class="pf-ev">' + e(em || "-") + "</span>" + (em ? '<span class="bd b4 pf-ok">Terverifikasi</span>' : "") + "</div>" +
            '<label class="fld"><span>Nama tampilan <em class="req">*</em></span><input class="inp" name="nama" required maxlength="40" value="' + e(me()) + '"></label><small class="hint">Dipakai di ticket dan invoice.</small>' +
            '<label class="fld"><span>Nomor WhatsApp</span><input class="inp" name="wa" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" aria-describedby="wa-err" placeholder="0812 3456 7890" value="' + e(waShow(P.wa)) + '"></label><small class="hint bad" id="wa-err" role="alert"></small>' +
            '<small class="hint">Dipakai teknisi kalau perlu menghubungimu. Wajib diisi untuk membuka ticket.</small><input type="hidden" name="dc" value="' + e(P.discord || "") + '"><button class="btn pf-save" type="submit">Simpan profil</button></form>') + sec("Privasi", "Atur apakah admin yang menangani ticketmu bisa melihat kamu sedang online.", '<div class="pf-tg"><span class="pf-ti"><i class="bi bi-broadcast"></i></span><div><b>Tampilkan status online</b><small>Kalau dimatikan, admin tidak melihat status online atau offline-mu di chat ticket.</small></div><button type="button" class="swt" role="switch" aria-checked="' + showOn() + '" aria-label="Tampilkan status online" data-onl="1"></button></div>'),
          keamanan: sec("Keamanan", "Cara kamu masuk dan keluar dari akunmu.",
            '<div class="pf-tg"><span class="pf-ti"><i class="bi bi-box-arrow-in-right"></i></span><div><b>Metode login</b><small>' + e(k.via === "email" ? "Email" : k.via) + '</small></div><span class="bd b4"><i class="bi bi-check2"></i> Aktif</span></div>' +
            '<div class="pf-tg"><span class="pf-ti"><i class="bi bi-envelope-check"></i></span><div><b>Email</b><small>' + e(em || "-") + '</small></div>' + (em ? '<span class="bd b4"><i class="bi bi-check2"></i> Terverifikasi</span>' : "") + "</div>" +
            '<div class="pf-tg"><span class="pf-ti"><i class="bi bi-box-arrow-right"></i></span><div><b>Keluar dari akun</b><small>Akhiri sesi di browser ini.</small></div><button type="button" class="btn ghost pf-out" id="logout2">Keluar</button></div>'),
          notif: sec("Notifikasi", "Pilih kabar apa yang mau kamu terima dari tim NEXORA.",
            tg("nTk", "chat-dots", "Balasan ticket", "Kabari saat admin membalas ticketmu.") + tg("nBill", "cash-stack", "Invoice", "Pengingat saat ada invoice dan jatuh tempo.")),
          akun: sec("Akun terhubung", "Hubungkan Google dan Discord supaya bisa masuk lewat salah satunya.",
            lkCard(true) + '<form class="pf-form pf-dc" id="f-dc"><label class="fld"><span>Username Discord</span><input class="inp" name="dc" placeholder="contoh: nexora_user" value="' + e(P.discord || "") + '"></label><small class="hint">Dipakai tim NEXORA untuk menghubungimu soal order.</small><button class="btn pf-save" type="submit">Simpan Discord</button></form>')
        };
        var pf0 = $("#p-profile .pfx");
        if (pfSw && pf0 && $(".tkx-tabs", pf0)) {
          pfSw = false; var bar = $(".tkx-tabs", pf0);
          $$("[data-ptab]", bar).forEach(function (b) { b.setAttribute("aria-selected", b.dataset.ptab === ptab); });
          while (pf0.children.length > 1) pf0.removeChild(pf0.lastChild);
          pf0.insertAdjacentHTML("beforeend", body[ptab]); tabInd(bar, true); return;
        }
        pfSw = false;
        $("#p-profile").innerHTML = '<div class="pfx"><div class="tkx-tw"><div class="tkx-tabs" role="tablist" aria-label="Pengaturan akun">' + TABS.map(function (x) { return '<button type="button" role="tab" data-ptab="' + x[0] + '" aria-selected="' + (ptab === x[0]) + '"><i class="bi bi-' + x[1] + '"></i><span>' + x[2] + "</span></button>"; }).join("") + '</div><button type="button" class="tkx-ar l" aria-label="Geser ke kiri"><i class="bi bi-chevron-left"></i></button><button type="button" class="tkx-ar r" aria-label="Geser ke kanan"><i class="bi bi-chevron-right"></i></button></div>' + body[ptab] + "</div>";
      },
      customer: function () {
        $("#p-customer").innerHTML = '<div class="tkhead"><span class="muted">' + custNames().length + ' customer · data untuk menghubungi jika ada kendala</span><label class="sbox cu-sb"><i class="bi bi-search"></i><input class="inp" data-cq type="search" placeholder="Cari nama, email, Discord, WA…" value="' + e(cq) + '"></label></div><div class="cu-grid">' + custCards() + "</div>";
      },
      tim: function () { $("#p-tim").innerHTML = timPanel(); },
      jasa: function () { harga("jasa"); },
      hosting: function () { harga("hosting"); },
      tampilan: tampilan,
      ekspor: function () { var C = [["nx-tk", "Ticket", "chat-dots", TK().length + " ticket"], ["nx-or", "Pesanan", "receipt", OR().length + " pesanan"], ["nx-harga", "Harga & paket", "tags", "Jasa dan hosting"], ["nx-ulasan", "Ulasan", "star", RV().length + " ulasan"], ["nx-audit", "Log penghapusan", "journal-text", ld("nx-audit", []).length + " catatan"]]; $("#p-ekspor").innerHTML = '<div class="exg">' + C.map(function (c) { return '<div class="dcard ex"><span class="si"><i class="bi bi-' + c[2] + '"></i></span><div><b>' + c[1] + "</b><small>" + c[3] + '</small></div><button class="btn ghost sm" data-exp="' + c[0] + '"><i class="bi bi-download"></i> Unduh JSON</button></div>'; }).join("") + "</div>"; }
    };
    function applyPerms() {
      if (!adm) return;
      $$(".side [data-tab]", root).forEach(function (b) { b.hidden = !can(b.dataset.tab); });
      $$(".side .sl", root).forEach(function (l) { if (l.parentNode.classList.contains("sg")) { l.hidden = false; return; } var n = l.nextElementSibling, any = false; while (n && !n.classList.contains("sl")) { if (n.dataset && n.dataset.tab && !n.hidden) any = true; n = n.nextElementSibling; } l.hidden = !any; });
      $$(".side .sg", root).forEach(function (g) { g.hidden = !$$("[data-tab]", g).some(function (b) { return !b.hidden; }); });
      var sm = $(".who small", root); if (sm) sm.textContent = arole() || "Admin";
    }
    function syncRole() {
      if (window.NX && NX.live) { return NX.refresh().then(function (r) { if (!r) { toast("Aksesmu ke dashboard admin dicabut oleh Founder"); return setTimeout(function () { go("/nexora-admin-access"); }, 1000); } if (r !== arole()) { ss("nx-arole", r); toast("Rolemu sekarang: " + r); applyPerms(); draw(); } }); }
      var u = staffBy(ss("nx-email"));
      if (!u) { toast("Aksesmu ke dashboard admin dicabut oleh Founder"); ss("nx-role", ""); ss("nx-arole", ""); return setTimeout(function () { go("/nexora-admin-access"); }, 1000); }
      if (u.role !== arole()) { ss("nx-arole", u.role); toast("Rolemu sekarang: " + u.role); applyPerms(); draw(); }
    }
    var hNav = "", hRest = false;
    function crumb() {
      var nv = $("#bc"); if (!nv) { nv = document.createElement("nav"); nv.id = "bc"; nv.className = "bc"; nv.setAttribute("aria-label", "Breadcrumb"); var h1 = $("#ptitle"); h1.parentNode.insertBefore(nv, h1.nextSibling); }
      var TT = TITLES[adm ? "a" : "c"], its = [];
      if (tab === "ringkasan") { nv.hidden = true; nv.innerHTML = ""; return; }
      its.push({ k: "ringkasan", t: "Dashboard" });
      its.push({ k: tab, t: (TT[tab] ? TT[tab][0] : tab).replace("{n}", me()) });
      var det = "";
      if (tab === "tiket" && sel && tv === "chat") { var tk0 = TK().filter(function (x) { return x.id === sel; })[0]; if (tk0) det = tk0.subj || tk0.id; }
      if (tab === "tagihan" && bnew) det = "Buat tagihan";
      if (det) its.push({ t: det });
      nv.hidden = false;
      nv.innerHTML = '<ol>' + its.map(function (x, i) {
        var last = i === its.length - 1, ic = x.ic ? '<i class="bi bi-' + x.ic + '"></i>' : "";
        return "<li>" + (last ? '<span class="bc-c" aria-current="page">' + ic + e(x.t) + "</span>" : '<button type="button" class="bc-l" data-bc="' + x.k + '">' + ic + e(x.t) + "</button>") + (last ? "" : '<i class="bi bi-chevron-right bc-s" aria-hidden="true"></i>') + "</li>";
      }).join("") + "</ol>";
    }
    function chSt(v) { if (!v) return; var lg1 = curT(); if (lg1 && locked(lg1)) { toast("Ticket ini ditangani " + lg1.hd.n + ". Ambil alih dulu untuk mengubah status."); return draw(); } var a = TK(); var c0 = a.filter(function (y) { return y.id === sel; })[0]; if (c0 && c0.st === "Orderan Selesai") { toast("Status sudah Orderan Selesai dan tidak bisa diubah lagi"); return draw(); } a.forEach(function (x) { if (x.id === sel && x.st !== v) { x.st = v; x.m.push({ w: "s", t: "Status diubah: " + v, d: "Baru saja", h: hm() }); syncOrd(x); nt(x, "tk", "Status diperbarui", x.id + " · " + v); } }); sv("nx-tk", a); toast("Status diperbarui"); draw(); }
    /* Tooltip [data-tip]: tombol info ticket, judul/nama yang terpotong, dan tombol yang tinggal ikon */
    var tipEl = null;
    function tipHide() { if (tipEl) tipEl.classList.remove("on"); }
    function tipShow(b) {
      var w = b.getAttribute("data-tipw");
      if ((w === "t" && b.scrollWidth <= b.clientWidth + 1) || (w === "i" && parseFloat(getComputedStyle(b).fontSize) > 0)) { tipHide(); return; }
      if (!tipEl) { tipEl = document.createElement("div"); tipEl.className = "nx-tip"; tipEl.setAttribute("role", "tooltip"); document.body.appendChild(tipEl); }
      tipEl.textContent = b.getAttribute("data-tip") || ""; tipEl.classList.remove("on"); tipEl.style.left = "0px"; tipEl.style.top = "0px";
      var r = b.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight;
      var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8), top = r.top - h - 10, below = top < 6;
      if (below) top = r.bottom + 10;
      tipEl.classList.toggle("below", below); tipEl.style.left = left + "px"; tipEl.style.top = top + "px";
      tipEl.style.setProperty("--ax", (r.left + r.width / 2 - left) + "px");
      void tipEl.offsetWidth; tipEl.classList.add("on");
    }
    document.addEventListener("pointerover", function (ev) { if (ev.pointerType === "touch") return; var b = ev.target.closest && ev.target.closest("[data-tip]"); if (b) tipShow(b); });
    document.addEventListener("pointerout", function (ev) { var b = ev.target.closest && ev.target.closest("[data-tip]"); if (b && !(ev.relatedTarget && b.contains(ev.relatedTarget))) tipHide(); });
    document.addEventListener("focusin", function (ev) { var b = ev.target.closest && ev.target.closest("[data-tip]"); if (b && ev.target.matches(":focus-visible")) tipShow(b); });
    document.addEventListener("focusout", tipHide);
    document.addEventListener("scroll", tipHide, true);
    window.addEventListener("resize", tipHide);
    /* Tinggi kotak tulis chat mengikuti isi; scrollbar baru muncul kalau teks melebihi tinggi maksimal (140px) */
    function fitCmp(t) {
      t.style.height = "auto";
      var h = t.scrollHeight + (t.offsetHeight - t.clientHeight);
      t.style.height = Math.min(h, 140) + "px";
      t.style.overflowY = h > 140 ? "auto" : "hidden";
    }
    /* Alamat (URL) tiap menu. Customer: /dashboard, /dashboard/ticket, /dashboard/ticket/T-1043.
       Admin: /nexora-admin, /nexora-admin/ticket, dst. Cloudflare Pages menyajikan halaman yang sama lewat _redirects. */
    var BASE = adm ? "/nexora-admin" : "/dashboard", SLUG = adm ? { tiket: "ticket" } : { tiket: "ticket", tagihan: "invoice" };
    function urlFor() {
      var u = BASE; if (tab && tab !== "ringkasan") u += "/" + (SLUG[tab] || tab);
      if (tab === "tiket" && tv === "chat" && sel) u += "/" + encodeURIComponent(sel);
      else if (tab === "tagihan" && adm && bnew) u += "/baru";
      else if (tab === "tagihan" && !adm && idet) u += "/" + encodeURIComponent(idet);
      return u;
    }
    function routeFrom(path) {
      var r = { tab: "ringkasan", sel: null, bnew: false, inv: "" }, parts, TT = TITLES[adm ? "a" : "c"];
      path = (path || "").replace(/\/+$/, "");
      if (path.indexOf(BASE) !== 0) return r;
      try { parts = path.slice(BASE.length).split("/").filter(Boolean).map(decodeURIComponent); } catch (xr) { return r; }
      var k = (parts[0] || "").toLowerCase(); if (k === "ticket") k = "tiket"; else if (k === "invoice" && !adm) k = "tagihan";
      if (!k || !TT[k] || !PAN[k] || k === "buka") return r;
      if (adm && !can(k)) return r;
      r.tab = k;
      if (k === "tiket" && parts[1]) { var id = parts[1]; if ((adm ? TK() : mine()).some(function (x) { return x.id === id; })) r.sel = id; }
      if (k === "tagihan" && adm && parts[1] === "baru") r.bnew = true;
      if (k === "tagihan" && !adm && parts[1] && BL().some(function (x) { return x.id === parts[1] && bmine(x); })) r.inv = parts[1];
      return r;
    }
    function navPush() {
      var nk = tab + "|" + (tv === "chat" && sel ? sel : "") + "|" + (bnew ? 1 : 0) + "|" + (tab === "tagihan" && !adm ? idet : "");
      if (!hRest && nk !== hNav) { try { var stt = { nx: 1, tab: tab, sel: tv === "chat" ? sel : null, bnew: !!bnew, inv: tab === "tagihan" && !adm ? idet : "" }, uu = urlFor(); if (hNav) history.pushState(stt, "", uu); else history.replaceState(stt, "", uu); } catch (xh) {} }
      hNav = nk; hRest = false;
    }
    function pfFoto(file) {
      if (!file) return;
      if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return toast("Format foto harus PNG, JPG, atau WebP");
      if (file.size > 20 * 1024 * 1024) return toast("Ukuran foto terlalu besar, maksimal 20 MB");
      shrink(file, 320, "image/jpeg", function (d) { var P = ld("nx-prof", {}); P.foto = d; sv("nx-prof", P); var wv = $("#wav"); if (wv) setAv(wv, me()); toast("Foto profil diganti"); pfSync(); });
    }
    function pfSync() { var a = $(".pf-ava"), pb = $(".pf-pb"); if (!a) return; var f = myFoto() || safeAv(ss("nx-avatar")); a.innerHTML = f ? avImg(f) : e(me().charAt(0).toUpperCase()); var rm = $("#pf-rm"); if (myFoto() && !rm && pb) pb.insertAdjacentHTML("beforeend", '<button type="button" class="btn ghost pf-up" id="pf-rm"><i class="bi bi-trash3"></i> Hapus</button>'); else if (!myFoto() && rm) rm.remove(); }
    function pfHapus() { var P = ld("nx-prof", {}); P.foto = ""; sv("nx-prof", P); var wv = $("#wav"); if (wv) setAv(wv, me()); toast("Foto profil dihapus"); pfSync(); }
    function draw() {
      if (adm && !can(tab)) tab = "ringkasan";
      $$(".stab[data-tab]", root).forEach(function (b) { b.setAttribute("aria-selected", b.dataset.tab === tab); });
      $$(".dpanel", root).forEach(function (p) { p.hidden = p.id !== "p-" + tab; });
      var pn = $("#p-" + tab), sx = (lastTab === tab && pn) ? $$(".chips,.bchips,.tkpills,.tkx-tabs", pn).map(function (el) { return el.scrollLeft; }) : null;
      var isNew = lastTab !== tab;
      PAN[tab]();
      if (pn && isNew) { pn.classList.remove("enter"); void pn.offsetWidth; pn.classList.add("enter"); clearTimeout(pn._en); pn._en = setTimeout(function () { pn.classList.remove("enter"); }, 1200); }
      if (pn) $$(".chips,.bchips,.tkpills,.tkx-tabs", pn).forEach(function (el, i) {
        if (sx && sx[i] != null) el.scrollLeft = sx[i];
        var on = $('[aria-pressed="true"],[aria-current="true"],[aria-selected="true"]', el);
        if (on) { var l = on.offsetLeft - el.offsetLeft; if (l < el.scrollLeft) el.scrollLeft = Math.max(0, l - 12); else if (l + on.offsetWidth > el.scrollLeft + el.clientWidth) el.scrollLeft = l + on.offsetWidth - el.clientWidth + 12; }
      });
      lastTab = tab; allInd(); requestAnimationFrame(allInd); if (document.fonts && document.fonts.ready) document.fonts.ready.then(allInd); tkAr(); setTimeout(tkAr, 250); if (nfUp) nfUp();
      var tt = TITLES[adm ? "a" : "c"][tab]; $("#ptitle").textContent = tt[0].replace("{n}", me()); $("#psub").textContent = tt[1]; $("#ptitle").hidden = tab === "ringkasan"; $("#psub").hidden = tab === "ringkasan" || !tt[1]; var tbs = $(".tb-sub"); if (tbs) tbs.textContent = tab === "ringkasan" ? (adm ? "Dashboard Admin" : "Dashboard") : (!adm && tab === "tagihan" && idet) ? idet : tt[0].replace("{n}", me());
      var tm = $(".th-m", root); if (tm) tm.scrollTop = tm.scrollHeight; markRd();
      root.classList.toggle("chatv", !!sel && tab === "tiket" && tv === "chat"); root.classList.toggle("ivdet", !adm && tab === "tagihan" && !!idet);
      autoSide(root.classList.contains("chatv"));
      var ct = $("#c-tiket"); if (ct) { var cc = (adm ? TK().filter(function (x) { return x.st === "Menunggu admin balas" && !cl(x); }) : mine().filter(function (x) { return !cl(x); })).length; ct.textContent = cc; ct.hidden = !cc; }
      var cb = $("#c-tagihan"); if (cb) { var nb = BL().filter(function (b) { return b.st === "Belum dibayar" && (adm ? dleft(b.jatuh) < 0 : bmine(b)); }).length; cb.textContent = nb; cb.hidden = !nb; }
      crumb(); navPush();
      mk();
    }
    window.addEventListener("popstate", function (ev) {
      var st = ev.state;
      if (!st || !st.nx) { if (location.pathname.replace(/\/+$/, "") === urlFor()) return; var rr = routeFrom(location.pathname); st = { nx: 1, tab: rr.tab, sel: rr.sel, bnew: rr.bnew, inv: rr.inv }; }
      if (!PAN[st.tab]) return; if (adm && !can(st.tab)) return;
      tab = st.tab; bnew = !!st.bnew; idet = st.tab === "tagihan" && st.inv ? st.inv : ""; if (st.sel) { sel = st.sel; tv = "chat"; } else { tv = "list"; if (isMob()) sel = null; }
      aq = ""; setOpen(false); hRest = true; draw();
    });
    var nl = document.getElementById("nav-logout"); if (nl) nl.addEventListener("click", function (ev) { ev.preventDefault(); outAsk(); });
    root.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-bc],[data-takeover],[data-onl],[data-tab],[data-go],[data-kr],[data-kf],[data-kpg],[data-ifl],[data-io],[data-ipg],[data-idp],[data-kinfo],[data-kcopy],[data-kcp],.tk-item,.tk-pill,[data-svc],[data-pk],[data-pkc],[data-pkpg],[data-tg],[data-gt],[data-stab],[data-af],[data-back],[data-close],[data-hs],[data-pg],[data-close-lock],[data-rvfil],[data-rvt],[data-jadd],[data-jedit],[data-jdel],[data-add],[data-edit],[data-del],#logout,#side-t,[data-exp],[data-ct],#sv-tmp,#rs-tmp,.dd-btn,.dd-opt,[data-bx],[data-ed],[data-hc],[data-pf],[data-lk],[data-ptab],#pf-rm,[data-cu],[data-tm],[data-rlt],[data-tdel],[data-tdelall],[data-bdelall],#logout2"); if (!t) return;
      var d = t.dataset;
      if (d.kinfo !== undefined) { kinfo = !kinfo; var cw = t.closest(".tkx-chat"); if (cw) cw.classList.toggle("has-info", kinfo); var tpx = kinfo ? "Sembunyikan detail" : "Tampilkan detail"; $$(".th-info", root).forEach(function (b) { b.classList.toggle("on", kinfo); b.setAttribute("aria-pressed", kinfo); b.setAttribute("aria-label", tpx); var tic = $("i", b); if (tic) tic.className = "bi bi-layout-sidebar-inset" + (kinfo ? "-reverse" : ""); b.setAttribute("data-tip", tpx); }); var hb = $(".th-info:hover", root); if (hb && tipEl && tipEl.classList.contains("on")) tipShow(hb); return; }
      if (d.takeover) return takeModal(d.takeover);
      if (d.onl) return setOnl(!showOn());
      if (d.kcp) { cpy(d.kcp); return toast("Disalin"); }
      if (d.kcopy) { var cv = d.kcopy, cok = function () { toast("Nomor ticket disalin"); }, cfb = function () { var ta = document.createElement("textarea"); ta.value = cv; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); cok(); } catch (x) { toast("Gagal menyalin nomor ticket"); } ta.remove(); }; if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(cv).then(cok, cfb); else cfb(); return; }
      if (d.ifl !== undefined) { ifl = d.ifl; ipg = 1; iopen = ""; $$("[data-ifl]", root).forEach(function (b) { b.setAttribute("aria-selected", b === t); }); if (!adm) tabInd(t.closest(".tkx-tabs"), true); $(".ix-res", root).innerHTML = iBody(); return; }
      if (d.ipg) { ipg += d.ipg === "next" ? 1 : -1; iopen = ""; $(".ix-res", root).innerHTML = iBody(); return; }
      if (d.idp !== undefined) { var di = $("[data-id1]", root), dj = $("[data-id2]", root), dx = di && di.value && dj && !dj.value ? dj : di; if (dx) { try { dx.showPicker(); } catch (x) { dx.focus(); } } return; }
      if (d.kr) { sel = d.kr; tv = "chat"; return draw(); }
      if (d.kf !== undefined) { if (adm) af = d.kf; else kf = d.kf; kpg = 1; $$("[data-kf]", root).forEach(function (b) { b.setAttribute("aria-selected", b === t); }); if (!adm) tabInd(t.closest(".tkx-tabs"), true); $(".tkx-res", root).innerHTML = kBody(); return; }
      if (d.kpg) { kpg += d.kpg === "next" ? 1 : -1; $(".tkx-res", root).innerHTML = kBody(); return; }
      if (t.classList.contains("dd-btn")) { var mn = t.nextElementSibling, op = mn.hidden; ddClose(); mn.hidden = !op; t.setAttribute("aria-expanded", op); if (op) { var cs = $('[aria-selected="true"]', mn); if (cs) cs.scrollIntoView({ block: "nearest" }); } return; }
      if (t.classList.contains("dd-opt")) { var dd = t.closest(".dd"); ddClose();
        if (dd.hasAttribute("data-kkd")) { kk = d.v; kpg = 1; $(".dd-val", dd).textContent = kk; $$(".dd-opt", dd).forEach(function (o) { o.setAttribute("aria-selected", o.dataset.v === kk); }); $(".tkx-res", root).innerHTML = kBody(); return; }
        if (dd.hasAttribute("data-rdd")) return trole({ dataset: { trole: dd.dataset.rdd }, value: d.v });
        if (dd.hasAttribute("data-afdd")) { af = d.v; return draw(); }
        if (dd.hasAttribute("data-stdd")) { if (d.v === "__close") { var hbc = $("[data-close],[data-close-lock]", dd); if (hbc) hbc.click(); return; } return chSt(d.v); }
        if (dd.hasAttribute("data-jdd")) { hs = d.v; hcat.jasa = "semua"; return draw(); }
        if (dd.hasAttribute("data-bdd")) return bdd(dd.id, d.v); return; }
      if (d.bx) return bAct(d);
      if (d.ed) return edAct(d);
      if (d.rlt !== undefined) { rlOpen = !rlOpen; var bx = t.closest(".rlx"); bx.classList.toggle("open", rlOpen); t.setAttribute("aria-expanded", rlOpen); return; }
      if (d.tm) return tmAct(d);
      if (t.id === "logout" || t.id === "logout2") return outAsk();
      if (t.id === "side-t") return setWide();
      if (d.bc) { tab = d.bc; if (isMob()) sel = null; tv = "list"; bnew = false; aq = ""; setOpen(false); return draw(); }
      if (d.ct) { ctab = d.ct; return draw(); }
      if (d.tab || d.go) { var ntb = d.tab || d.go; if (!adm && ntb === "buka" && actCount() >= MAXT) { setOpen(false); return limitModal(); } if (!adm && ntb === "buka" && needWa()) { setOpen(false); return waModal(); } if (ntb !== tab) { idet = ""; aq = ""; tv = "list"; } else if (ntb === "tiket" && tv === "chat" && sel) { tv = "list"; aq = ""; } else if (ntb === "tagihan" && !adm && idet) { idet = ""; } tab = ntb; setOpen(false); draw(); if (d.kat) { var kr = $('input[name="kat"][value="' + d.kat + '"]'); if (kr) { kr.checked = true; bukaSync(); } } return; }
      if (d.ptab) { if (d.ptab === ptab) return; ptab = d.ptab; pfSw = true; return draw(); }
      if (t.id === "pf-rm") return pfHapus();
      if (d.lk) {
        var lkx = LK(), key = d.lk === "google" ? "g" : "d", nmk = d.lk === "google" ? "Google" : "Discord";
        if (lkx.via === nmk) return toast("Ini metode login utamamu");
        if (window.NX && NX.live) { if (lkx[key]) { try { return NX.unlink(d.lk).then(function () { toast("Akun " + nmk + " diputuskan"); return NX.hydrate(); }).then(draw, function (er) { toast(er.message); }); } catch (er) { return toast(er.message); } } return NX.link(d.lk).catch(function (er) { toast(er.message); }); }
        lkx.P.lk = lkx.P.lk || {}; lkx.P.lk[key] = !lkx[key]; sv("nx-prof", lkx.P);
        toast("Akun " + nmk + (lkx[key] ? " diputuskan" : " terhubung (demo)")); return draw();
      }
      if (d.pf) { var P1 = ld("nx-prof", {}); P1[d.pf] = P1[d.pf] === false; sv("nx-prof", P1); toast((d.pf === "nBill" ? "Notifikasi tagihan " : "Notifikasi balasan ticket ") + (P1[d.pf] === false ? "dinonaktifkan" : "diaktifkan")); return draw(); }
      if (d.cu) { if (adm && arole() === "Teknisi") return; return custModal(d.cu); }
      if (d.hc !== undefined) { hcat[tab] = d.hc; return draw(); }
      if (d.stab) { stab = d.stab; $$("[data-stab]", root).forEach(function (b) { b.setAttribute("aria-selected", b === t); }); var sl = $(".tks-list", root); if (sl) { sl.innerHTML = sideItems(); sl.scrollTop = 0; } return; }
      if (d.gt) { var x = TK().filter(function (y) { return y.id === d.gt; })[0]; sel = d.gt; tg = cl(x) ? "selesai" : "aktif"; tv = "chat"; tab = "tiket"; return draw(); }
      if (d.svc) { var svs = $$("[data-svc]", root), pi = -1, ni = svs.indexOf(t); svs.forEach(function (b, i) { if (b.getAttribute("aria-selected") === "true") pi = i; }); if (pi === ni) return; bsv = d.svc; svs.forEach(function (b) { b.setAttribute("aria-selected", b === t); }); $("#f-buka").paket.dataset.l = ""; if (t.scrollIntoView) t.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" }); bukaSync(); bkInd(pi >= 0); var pbx = $("#pk-box"); if (pbx) { pbx.classList.remove("sl-r", "sl-l"); void pbx.offsetWidth; pbx.classList.add(ni > pi ? "sl-r" : "sl-l"); } return; }
      if (d.pk !== undefined) {
        var pf = $("#f-buka"), pl = pkList(pf.paket.value);
        if (bsv === "hosting") pl = [d.pk];
        else { var pi2 = pl.indexOf(d.pk); if (pi2 >= 0) { if (pl.length > 1) pl.splice(pi2, 1); } else pl.push(d.pk); var po = JR(bsv).map(function (x) { return x.nama; }); pl.sort(function (a, b) { return po.indexOf(a) - po.indexOf(b); }); }
        pf.paket.value = pl.join(PSEP); return bukaSync();
      }
      if (d.pkc !== undefined) { bcat = d.pkc; bpg = 0; pkDraw(JR(bsv)); return bukaSync(); }
      if (d.pkpg !== undefined) { bpg += d.pkpg === "next" ? 1 : -1; pkDraw(JR(bsv)); var pb = $("#pk-box"); if (pb && pb.scrollIntoView) pb.scrollIntoView({ block: "nearest", behavior: "smooth" }); return; }
      if (d.tg) { tg = d.tg; sel = null; return draw(); }
      if (t.classList.contains("tk-item") || t.classList.contains("tk-pill")) { sel = d.id; tv = "chat"; return draw(); }
      if (d.back !== undefined) { tv = "list"; return draw(); }
      if (d.af) { af = d.af; return draw(); }
      if (d.pg) { var pq = d.pg.split(":"); PG[pq[0]] = Math.max(1, Number(pq[1]) || 1); draw(); var pz = $(pq[0] === "bh" ? "#bh-top" : "#bl-top", root); if (pz) pz.scrollIntoView({ block: "start", behavior: "smooth" }); return; }
      if (t.hasAttribute("data-close-lock")) return toast("Ticket baru bisa ditutup setelah status Orderan Selesai");
      if (d.rvfil) { rvf = d.rvfil; return draw(); }
      if (d.rvt) { var RA = RV(), rr = RA.filter(function (x) { return x.id === d.rvt; })[0]; if (rr) { rr.tampil = !rr.tampil; sv("nx-ulasan", RA); toast(rr.tampil ? "Ulasan tampil di halaman Ulasan" : "Ulasan disembunyikan dari halaman Ulasan"); } return draw(); }
      if (t.hasAttribute("data-jadd")) return jasaForm(null);
      if (t.hasAttribute("data-jedit")) return jasaForm(hs);
      if (t.hasAttribute("data-jdel")) return jasaDel(hs);
      if (d.hs) { hs = d.hs; hcat.jasa = "semua"; return draw(); }
      if (d.tdel !== undefined) { if (!isF()) return toast("Hanya Founder yang bisa menghapus riwayat"); var dtk = TK().filter(function (y) { return y.id === sel; })[0]; if (!dtk || !cl(dtk)) return toast("Hanya ticket yang sudah ditutup yang bisa dihapus"); return guard({ title: "Hapus ticket " + dtk.id + "?", ok: "Hapus permanen", danger: true, html: "<p>Ticket <b>" + e(dtk.subj) + "</b> milik " + e(uname(dtk)) + " beserta seluruh chat-nya akan dihapus permanen dan tidak bisa dikembalikan. Ulasan dan rating dari customer tetap tersimpan.</p>" }, function () { delTk([dtk.id]); }); }
      if (d.tdelall !== undefined) { if (!isF()) return toast("Hanya Founder yang bisa menghapus riwayat"); var dhl = kRows().filter(cl); if (!dhl.length) return; return guard({ title: "Hapus " + dhl.length + " ticket riwayat?", ok: "Hapus semua", danger: true, html: "<p>" + dhl.length + " ticket yang sudah ditutup (beserta chatnya) akan dihapus permanen dan tidak bisa dikembalikan. Ulasan dan rating dari customer tetap tersimpan.</p>" }, function () { delTk(dhl.map(function (y) { return y.id; })); }); }
      if (d.bdelall !== undefined) { if (!isF()) return toast("Hanya Founder yang bisa menghapus riwayat"); var dbh = blHist(); if (!dbh.length) return; return guard({ title: "Hapus " + dbh.length + " riwayat tagihan?", ok: "Hapus semua", danger: true, html: "<p>" + dbh.length + " tagihan berstatus lunas atau dibatalkan akan dihapus permanen dan tidak bisa dikembalikan. Tagihan yang masih aktif tidak ikut terhapus.</p>" }, function () { delBl(dbh.map(function (y) { return y.id; })); }); }
      if (d.close !== undefined) { var lg0 = curT(); if (lg0 && locked(lg0)) return toast("Ticket ini ditangani " + lg0.hd.n + ". Ambil alih dulu untuk menutupnya."); }
      if (d.close !== undefined) { var cg = TK().filter(function (y) { return y.id === sel; })[0]; if (cg && (cg.st === "Pembayaran Dikonfirmasi" || cg.st === "Pesanan Diproses")) return toast("Ticket baru bisa ditutup setelah status Orderan Selesai"); }
      if (d.close !== undefined) return modal('<div class="mbox sm"><div class="mh"><b>Tutup ticket?</b></div><div class="mb"><p>Apakah kamu yakin ingin menutup ticket ini?</p><p class="muted">Setelah ditutup, customer dan admin tidak bisa mengirim pesan lagi dan ticket masuk ke Riwayat.</p></div><div class="mf"><button class="btn ghost" data-x>Batal</button><button class="btn dng" data-ok>Ya, tutup ticket</button></div></div>', function (m, close) { $("[data-ok]", m).addEventListener("click", function () { var a = TK(); a.forEach(function (y) { if (y.id === sel) { nt(y, "tk", "Ticket ditutup", y.id + " ditutup oleh admin."); y.closed = true; y.m.push({ w: "s", t: "Ticket ditutup oleh admin", d: "Baru saja", h: hm() }); } }); sv("nx-tk", a); close(); toast("Ticket ditutup dan dipindah ke Riwayat"); af = "Riwayat"; draw(); }); });
      if (d.add !== undefined) return formPaket(tab, null);
      if (d.edit !== undefined) return formPaket(tab, Number(d.edit));
      if (d.del !== undefined) { var H = HG(), r = tab === "hosting" ? H.hosting : H.jasa[hs], i = Number(d.del); return modal('<div class="mbox sm"><div class="mh"><b>Hapus paket?</b></div><div class="mb"><p class="muted">Paket "' + e(r[i].nama) + '" akan dihapus dari daftar.</p></div><div class="mf"><button class="btn ghost" data-x>Batal</button><button class="btn dng" data-ok>Hapus</button></div></div>', function (m, close) { $("[data-ok]", m).addEventListener("click", function () { r.splice(i, 1); sv("nx-harga", H); close(); toast("Paket dihapus"); draw(); }); }); }
      if (d.exp) { var b = new Blob([JSON.stringify(d.exp === "nx-harga" ? HG() : ld(d.exp, []), null, 2)], { type: "application/json" }), l = document.createElement("a"); l.href = URL.createObjectURL(b); l.download = d.exp + ".json"; l.click(); return; }
      if (t.id === "sv-tmp") { var nmS = String(root._T.nama || "").trim(); if (!nmS) return toast("Nama situs tidak boleh kosong"); root._T.nama = nmS; var inpS = $("[data-t=nama]", root); if (inpS) inpS.value = nmS; sv("nx-tampilan", root._T); root._T0 = JSON.stringify(root._T); tmpSync(); return toast("Nama situs tersimpan" + DEMOTXT); }
      if (t.id === "rs-tmp") { root._T = JSON.parse(root._T0 || "{}"); var inpR = $("[data-t=nama]", root); if (inpR) inpR.value = root._T.nama || ""; tmpSync(); return toast("Perubahan dibatalkan, kembali ke yang tersimpan"); }
    });
    root.addEventListener("input", function (ev) {
      var t = ev.target;
      if (t.name === "wa" && t.closest("#f-prof")) { var cl0 = t.value.replace(/[^\d+\s().-]/g, ""); if (cl0 !== t.value) t.value = cl0; waErr(t.form, ""); }
      if (t.dataset.bf) { BF[t.dataset.bf] = t.value; updSum(); }
      if (t.matches("[data-sq]")) { kq = t.value; kpg = 1; var sl2 = $(".tks-list", root); if (sl2) sl2.innerHTML = sideItems(); return; }
      if (t.matches("[data-iq]")) { iq = t.value; ipg = 1; iopen = ""; $(".ix-res", root).innerHTML = iBody(); return; }
      if (t.matches("[data-id1],[data-id2]")) { if (t.hasAttribute("data-id1")) id1 = t.value; else id2 = t.value; ipg = 1; iopen = ""; $(".ix-res", root).innerHTML = iBody(); return; }
      if (t.matches("[data-kq]")) { kq = t.value; kpg = 1; $(".tkx-res", root).innerHTML = kBody(); return; }
      if (t.matches("[data-cq]")) { cq = t.value; $(".cu-grid", root).innerHTML = custCards(); return; }
      if (t.matches("[data-q]")) { aq = t.value; $(".tk-list", root).innerHTML = adm ? admList() : cList(); }
      if (t.matches(".cmp")) fitCmp(t);
      if (t.name === "msg" && $("#cc")) { $("#cc").textContent = t.value.length; var chn = $("#cc").parentNode; if (chn) chn.classList.toggle("warn", t.value.length >= 900); if (t.closest("#f-buka")) { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight + 2, 420) + "px"; } }
      if ((t.name === "subj" || t.name === "msg") && t.closest("#f-buka") && t.form.kat.value === "Bantuan") bukaSync();
      if (t.dataset.t && root._T) { root._T[t.dataset.t] = t.value; tmpSync(); }
    });
    root.addEventListener("keydown", function (ev) {
      var dd = ev.target.closest && ev.target.closest(".dd");
      if (dd) {
        var mn = $(".dd-menu", dd), ops = $$(".dd-opt", mn);
        if (ev.key === "Escape") { ddClose(); $(".dd-btn", dd).focus(); return; }
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); if (mn.hidden) $(".dd-btn", dd).click(); var i = ops.indexOf(document.activeElement); i = ev.key === "ArrowDown" ? Math.min(ops.length - 1, i + 1) : Math.max(0, i - 1); if (ops[i]) ops[i].focus(); return; }
      }
      if (ev.key === "Enter" && !ev.shiftKey && ev.target.matches(".cmp")) { ev.preventDefault(); var f = ev.target.form; if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event("submit", { cancelable: true })); }
    });
    root.addEventListener("focusout", function (ev) {
      var t = ev.target; if (t.name !== "wa" || !t.closest || !t.closest("#f-prof")) return;
      var wc2 = waCheck(t.value); waErr(t.form, wc2.ok ? "" : wc2.msg);
    });
    root.addEventListener("change", function (ev) {
      var t = ev.target;
      if (t.closest("#f-buka")) bukaSync();
      if (t.id === "pf-file") { var pff = t.files && t.files[0]; t.value = ""; return pfFoto(pff); }
      if (t.matches("[data-trole]")) return trole(t);
      if (t.matches("[data-st]")) { return chSt(t.value); }
    });
    root.addEventListener("dragover", function (ev) { var b = ev.target.closest(".upl-box"); if (!b) return; ev.preventDefault(); b.classList.add("drag"); });
    root.addEventListener("dragleave", function (ev) { var b = ev.target.closest(".upl-box"); if (b) b.classList.remove("drag"); });
    root.addEventListener("drop", function (ev) { var b = ev.target.closest(".upl-box"); if (!b) return; ev.preventDefault(); b.classList.remove("drag"); });
    root.addEventListener("dragover", function (ev) { var b = ev.target.closest(".pf-ava"); if (!b) return; ev.preventDefault(); b.classList.add("drag"); });
    root.addEventListener("dragleave", function (ev) { var b = ev.target.closest(".pf-ava"); if (b) b.classList.remove("drag"); });
    root.addEventListener("drop", function (ev) { var b = ev.target.closest(".pf-ava"); if (!b) return; ev.preventDefault(); b.classList.remove("drag"); pfFoto(ev.dataTransfer && ev.dataTransfer.files[0]); });
    root.addEventListener("mousedown", function (ev) { if (ev.target.closest && ev.target.closest(".rvin label")) ev.preventDefault(); });
    root.addEventListener("input", function (ev) {
      var f = ev.target.closest("[data-rvsend]"); if (!f) return;
      if (ev.target.name === "bintang") { var l = $("[data-rvl]", f); l.textContent = RVL[Number(ev.target.value)] + " · " + ev.target.value + " dari 5"; l.classList.add("on"); $("[data-rve]", f).hidden = true; }
      if (ev.target.name === "teks") $("[data-rvc]", f).textContent = ev.target.value.length;
    });
    root.addEventListener("submit", function (ev) {
      ev.preventDefault(); var f = ev.target;
      if (f.matches("[data-rep]")) {
        var txt = $("textarea", f).value.trim(); if (!txt) return; var a = TK(), cur = a.filter(function (x) { return x.id === sel; })[0];
        if (!cur || cl(cur)) { toast("Ticket sudah ditutup, chat tidak bisa dikirim"); return draw(); }
        if (locked(cur)) { toast("Ticket ini ditangani " + cur.hd.n + ". Ambil alih dulu untuk membalas."); return draw(); }
        if (adm && !cur.hd && !(window.NX && NX.live)) cur.hd = { n: me(), r: arole(), a: "", me: true };
        var nmsg0 = nm(adm ? { w: "a", n: me(), r: arole(), t: txt, d: "Baru saja", h: hm() } : { w: "c", t: txt, d: "Baru saja", h: hm() }); if (rpl && rpl.tk === cur.id) nmsg0.rp = { mid: rpl.mid, w: rpl.w, n: rpl.n, t: rpl.t.slice(0, 200) }; rpl = null; cur.m.push(nmsg0); if (adm) nt(cur, "tk", "Balasan baru · " + cur.id, whoR() + ": " + (txt.length > 80 ? txt.slice(0, 80) + "…" : txt)); if (adm && cur.st === "Menunggu admin balas") cur.st = "Terhubung dengan admin"; sv("nx-tk", a); draw();
        if (!adm && !(window.NX && NX.live)) { var tid = sel; setTimeout(function () { var b = TK(); b.forEach(function (x) { if (x.id === tid && !cl(x) && last(x).w === "c") x.m.push(nm({ w: "a", t: "Terima kasih, pesanmu sudah kami terima. Tim NEXORA akan segera membalas. (balasan otomatis demo)", d: "Baru saja", h: hm() })); if (x.id === tid && !cl(x) && last(x).w === "a") nt(x, "tk", "Balasan baru · " + x.id, "Admin: Terima kasih, pesanmu sudah kami terima."); }); sv("nx-tk", b); remote(); }, 3500); }
        return;
      }
      if (f.matches("[data-rvsend]")) {
        var tk0 = TK().filter(function (x) { return x.id === f.dataset.rvsend; })[0], star = f.querySelector('input[name="bintang"]:checked'), er = $("[data-rve]", f);
        if (!tk0 || rvOf(tk0)) { toast("Ulasan untuk pesanan ini sudah ada"); return draw(); }
        if (!star) { er.textContent = "Pilih jumlah bintang dulu ya."; er.hidden = false; return; }
        var nb = Number(star.value), tx = f.teks.value.trim();
        return modal('<div class="mbox sm"><div class="mh"><b>Kirim ulasan?</b></div><div class="mb"><div class="rvconf">' + rvs(nb) + '</div><p class="muted">Setelah dikirim, ulasan tidak bisa diedit atau ditarik lagi.</p></div><div class="mf"><button class="btn ghost" data-x>Cek lagi</button><button class="btn" data-ok>Kirim ulasan</button></div></div>', function (m, close) {
          $("[data-ok]", m).addEventListener("click", function () {
            var RA = RV(); if (RA.some(function (x) { return x.tk === tk0.id; })) { close(); return draw(); }
            RA.unshift({ id: "RV-" + Date.now().toString(36), tk: tk0.id, user: me(), bintang: nb, teks: tx, paket: tk0.paket, tgl: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }), ts: Date.now(), tampil: false });
            sv("nx-ulasan", RA); close(); toast("Makasih ulasannya!"); draw();
          });
        });
      }
      if (f.id === "f-prof" || f.id === "f-dc") { var wc = f.wa ? waCheck(f.wa.value) : null; if (wc && !wc.ok) { waErr(f, wc.msg); f.wa.focus(); return; } if (wc) waErr(f, ""); var P0 = ld("nx-prof", {}), nm2 = f.nama ? f.nama.value.trim() : me(), dc2 = f.dc ? f.dc.value.trim() : (P0.discord || ""), wa2 = wc ? wc.val : (P0.wa || ""); ss("nx-name", nm2); var P2 = ld("nx-prof", {}); P2.discord = dc2; P2.wa = wa2; if (f.kota) P2.kota = f.kota.value.trim(); sv("nx-prof", P2); var UU2 = USR(), nu2 = UU2[me()] || {}; nu2.discord = P2.discord; nu2.wa = P2.wa; UU2[me()] = nu2; sv("nx-users", UU2); $("#who").textContent = me(); if (window.NX && NX.live) { NX.saveProfile({ nama: nm2, discord_username: dc2, whatsapp: wa2 }).then(function () { toast("Profil tersimpan"); draw(); }, function (er) { toast(er.message); }); return; } toast("Profil tersimpan"); return draw(); }
      if (f.id === "f-buka") {
        if (actCount() >= MAXT) return limitModal();
        if (needWa()) return waModal();
        if (f.kat.value === "Order baru" && !f.paket.value) { var ob = $("#ord"); if (ob && ob.scrollIntoView) ob.scrollIntoView({ block: "center", behavior: "smooth" }); return toast("Pilih layanan dan paket dulu ya."); }
        if (f.dataset.busy) return; f.dataset.busy = "1";
        var b = TK(), id = nextTid(), k = f.kat.value, p = k === "Order baru" ? f.paket.value : "-";
        b.unshift({ id: id, subj: f.subj.value || pkSubj(pkList(p)), kat: k, paket: p, st: "Menunggu admin balas", tgl: "Hari ini", user: "__me", m: [nm({ w: "c", t: f.msg.value, d: "Baru saja", h: hm() })] }); sv("nx-tk", b);
        if (k === "Order baru") { var o = OR(); o.unshift({ id: "ORD-" + (2045 + o.length), tk: id, item: p, jenis: "Order via ticket", tgl: "Hari ini", st: "Menunggu" }); sv("nx-or", o); }
        var gb = $("#bsum-go"); if (gb) { gb.disabled = true; gb.classList.add("ok"); gb.innerHTML = '<i class="bi bi-check-circle-fill"></i> <span>Ticket terkirim</span>'; }
        setTimeout(function () { if (tab === "buka") { sel = id; tg = "aktif"; tab = "tiket"; draw(); } toast("Ticket " + id + " dibuat. Nanti notifikasi otomatis masuk ke Discord NEXORA."); }, 650);
      }
    });
    window.addEventListener("storage", function (ev) { if (ev.key === "nx-tk" || ev.key === "nx-or" || ev.key === "nx-bill" || ev.key === "nx-notif") remote(); if (adm && ev.key === "nx-staff") syncRole(); });
    /* paket yang dipilih dari halaman Harga hosting dipilihkan otomatis di form buka ticket */
    function pilihPaket(raw) {
      if (!raw) return;
      try {
        var o = JSON.parse(raw), f = $("#f-buka"); if (!o || !o.svc || !o.paket || !f) return;
        var sb = $('[data-svc="' + o.svc + '"]', f); if (!sb || !JR(o.svc).some(function (x) { return x.nama === o.paket; })) return;
        sb.click(); f.paket.value = o.paket; bcat = "semua"; bpg = 0; pkDraw(JR(bsv)); bukaSync(); var sc = $('.pk[aria-pressed="true"]', f); if (sc && sc.scrollIntoView) sc.scrollIntoView({ block: "nearest" });
      } catch (x) {}
    }
    var draw0 = draw; draw = function () { var r0 = draw0.apply(this, arguments); try { presSync(); } catch (x) {} return r0; };
    prBoot();
    window.nxDraw = draw; window.nxRemote = remote; window.nxToast = toast;
    var r0 = routeFrom(location.pathname), rt = ss("nx-ret");
    if (rt) { ss("nx-ret", ""); if (location.pathname.replace(/\/+$/, "") === BASE) r0 = routeFrom(rt); } /* balik dari tautkan akun Google/Discord */
    tab = r0.tab; bnew = r0.bnew; idet = r0.inv || ""; if (r0.sel) { sel = r0.sel; tv = "chat"; }
    draw();
    if (!adm && ss("nx-next") === "buka") { ss("nx-next", ""); var pk = ss("nx-pkg"); ss("nx-pkg", ""); if (actCount() >= MAXT) { limitModal(); } else if (needWa()) { waModal(); } else { tab = "buka"; draw(); pilihPaket(pk); } }
  }

  function boot(root, m) {
    var live = window.NX && NX.live;
    if (m === "login" || m === "alogin") {
      if (live && ss("nx-role")) return go(m === "alogin" ? "/nexora-admin" : "/dashboard");
      if (live && NX.user && m === "alogin") { var ae0 = $("#ae", root); if (ae0) { ae0.textContent = NX.err ? "Gagal memeriksa akses: " + NX.err : "Akun ini tidak terdaftar sebagai tim NEXORA. Minta Founder menambahkan akunmu."; ae0.hidden = false; } }
      return authInit(m, root);
    }
    var need = m === "admin" ? "admin" : "cust";
    if (live && m === "admin" && !ss("nx-role")) return go("/nexora-admin-access" + (NX.sessEnd ? "?err=expired" : NX.user ? "?err=notstaff" : ss("nx-autherr") ? "?err=auth" : ""));
    if (ss("nx-role") !== need) return go((m === "admin" ? "/nexora-admin-access" : "/masuk") + (live && NX.staffBlock ? "?err=staff" : live && NX.sessEnd ? "?err=expired" : live && ss("nx-autherr") ? "?err=auth" : m !== "admin" && ss("nx-next") === "buka" ? "?info=order" : ""));
    if (m === "admin") {
      if (live) ss("nx-arole", NX.role);
      else { var su = staffBy(ss("nx-email")); if (!su) { ss("nx-role", ""); ss("nx-arole", ""); return go("/nexora-admin-access"); } ss("nx-arole", su.role); ss("nx-name", su.nama); }
    }
    dashInit(m === "admin", root);
    root.classList.remove("loading");
  }
  window.nxDash = function () {
    if (location.hash === "#buka" || /^\/dashboard\/buka\/?$/.test(location.pathname)) ss("nx-next", "buka");
    var root = $("[data-dash]"); if (!root) return; var m = root.dataset.dash;
    if (window.NX && NX.live) {
      $$(".demo-note").forEach(function (n) { n.remove(); });
      if (m !== "login" && m !== "alogin") { root.classList.add("loading"); var cn = ss("nx-name"), wh = $("#who"), wv = $("#wav"); if (cn && wh) { wh.textContent = cn; if (wv) setAv(wv, cn); } }
      return NX.ready(m === "admin" || m === "alogin" ? "admin" : "cust").then(function () { if (NX.tkErr) toast("Data ticket belum bisa dimuat: " + NX.tkErr + ". Pastikan 003_tiket.sql sudah dijalankan."); boot(root, m); }, function (er) { console.error(er); root.classList.remove("loading"); toast("Gagal memuat akun: " + er.message); });
    }
    boot(root, m);
  };
  document.addEventListener("DOMContentLoaded", window.nxDash);
})();
