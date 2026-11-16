/* NEXORA - data situs publik: katalog jasa/hosting + pengaturan (nama situs, kontak, sosmed, QR).
   Dimuat di SEMUA halaman sebelum script.js. Tidak butuh login: membaca lewat fungsi database public_site().
   Mode live  : data dari Supabase (disimpan di cache browser supaya kunjungan berikutnya langsung tampil).
   Mode demo  : (config.js kosong) data dari localStorage yang diisi dashboard admin demo. */
(function () {
  var C = window.NX_CONFIG || {};
  var S = (window.NXS = { live: !!(C.supabaseUrl && C.supabaseAnonKey), snap: null });
  var CACHE = "nx-site-cache";
  var DEMOKEY = { tampilan: "nx-tampilan", kontak: "nx-kontak", sosmed: "nx-sosmed", qr: "nx-qr" };

  function rd(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (x) { return null; } }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function qsa(s) { return [].slice.call(document.querySelectorAll(s)); }

  /* Hanya gambar https (Storage) atau data:image (mode demo) yang dipakai. */
  S.safeImg = function (u) {
    u = String(u || "");
    if (/^https:\/\/[^\s"'<>]+$/i.test(u) && u.length <= 600) return u;
    if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(u) && u.length < 1500000) return u;
    return "";
  };

  /* ---------- pengaturan ---------- */
  S.setting = function (k) {
    if (S.live) { var s = S.snap && S.snap.set && S.snap.set[k]; return s === undefined ? null : s; }
    var v = rd(DEMOKEY[k]);
    if (k === "qr") { try { v = localStorage.getItem("nx-qr"); } catch (x) { v = null; } return v ? { url: v } : null; }
    return v;
  };
  S.qr = function () { var q = S.setting("qr"); return q && q.url ? S.safeImg(q.url) : ""; };

  /* ---------- katalog: bentuk seragam { order, meta, jasa{key:[paket]}, hosting[] } atau null (pakai data bawaan situs) ---------- */
  function pk(p) {
    return { nama: String(p.nama || ""), kat: String(p.kat || ""), harga: Math.max(0, Number(p.harga) || 0), ringkas: String(p.ringkas || ""),
      fitur: arr(p.fitur).map(String), foto: S.safeImg(p.foto), populer: !!p.populer };
  }
  S.catalog = function () {
    if (S.live) {
      var s = S.snap; if (!s || !Array.isArray(s.jasa) || !Array.isArray(s.paket)) return null;
      var out = { order: [], meta: {}, jasa: {}, hosting: [] };
      s.jasa.forEach(function (j) { out.order.push(j.id); out.meta[j.id] = { nama: String(j.nama || j.id), ic: String(j.ikon || "tag") }; out.jasa[j.id] = []; });
      s.paket.forEach(function (p) { if (p.tipe === "hosting") out.hosting.push(pk(p)); else if (out.jasa[p.jasa]) out.jasa[p.jasa].push(pk(p)); });
      return out;
    }
    var H = rd("nx-harga"); if (!H || typeof H.jasa !== "object" || !Array.isArray(H.hosting)) return null;
    var o = { order: Object.keys(H.jasa), meta: {}, jasa: {}, hosting: H.hosting.map(pk) };
    o.order.forEach(function (k) { var m = H.meta && H.meta[k]; o.meta[k] = { nama: String((m && m.nama) || k), ic: String((m && m.ic) || "tag") }; o.jasa[k] = arr(H.jasa[k]).map(pk); });
    return o;
  };

  /* ---------- terapkan tampilan ke halaman ---------- */
  var title0 = document.title;
  /* Dari dashboard hanya nama situs yang bisa diubah. Logo (assets/img/logo.png), warna aksen (style.css),
     dan teks halaman utama (index.html) diedit manual lewat kode. */
  S.apply = function () {
    var T = S.setting("tampilan") || {};
    var nm = String(T.nama || "").trim().slice(0, 40);
    if (nm) { qsa(".logo-name").forEach(function (n) { if (n.textContent !== nm) n.textContent = nm; }); document.title = title0.replace(/NEXORA/g, nm); }
  };

  /* ---------- ambil data terbaru (live) ---------- */
  function readCache() { try { var v = JSON.parse(localStorage.getItem(CACHE) || "null"); return v && v.d && typeof v.d === "object" ? v.d : null; } catch (x) { return null; } }
  S.load = function () {
    if (!S.live) return Promise.resolve(false);
    var ctl = typeof AbortController === "function" ? new AbortController() : null, tm = ctl && setTimeout(function () { ctl.abort(); }, 9000);
    return fetch(C.supabaseUrl.replace(/\/+$/, "") + "/rest/v1/rpc/public_site", {
      method: "POST", headers: { apikey: C.supabaseAnonKey, Authorization: "Bearer " + C.supabaseAnonKey, "Content-Type": "application/json" }, body: "{}", signal: ctl ? ctl.signal : undefined
    }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }).then(function (d) {
      clearTimeout(tm);
      if (!d || typeof d !== "object" || !Array.isArray(d.jasa)) throw new Error("Data situs tidak valid");
      var changed = JSON.stringify(d) !== JSON.stringify(S.snap);
      S.snap = d; try { localStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), d: d })); } catch (x) {}
      if (changed) { S.apply(); window.dispatchEvent(new CustomEvent("nxsite")); }
      return changed;
    }).catch(function (er) { clearTimeout(tm); console.warn("Data situs:", er && er.message); return false; });
  };

  if (S.live) S.snap = readCache();
  S.apply();
  if (S.live) { S.load(); document.addEventListener("visibilitychange", function () { if (!document.hidden) S.load(); }); }
})();
