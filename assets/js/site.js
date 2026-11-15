/* NEXORA - data situs publik: katalog jasa/hosting + pengaturan (tampilan, kontak, sosmed, QR).
   Dimuat di SEMUA halaman sebelum script.js. Tidak butuh login: membaca lewat fungsi database public_site().
   Mode live  : data dari Supabase (disimpan di cache browser supaya kunjungan berikutnya langsung tampil).
   Mode demo  : (config.js kosong) data dari localStorage yang diisi dashboard admin demo. */
(function () {
  var C = window.NX_CONFIG || {};
  var S = (window.NXS = { live: !!(C.supabaseUrl && C.supabaseAnonKey), snap: null });
  var CACHE = "nx-site-cache", ACC0 = "#6b55b8"; /* warna aksen bawaan situs (style.css) */
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

  /* ---------- warna aksen turunan (terang + gelap) ---------- */
  function hex2rgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function rgb2hex(c) { return "#" + c.map(function (v) { return ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); }).join(""); }
  function mixc(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function lum(c) { var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); }
  function rgb2hsl(c) { var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2, d = mx - mn;
    if (d) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h, s, l]; }
  function hsl2rgb(h, s, l) { var f = function (p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    if (!s) return [l * 255, l * 255, l * 255]; var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; return [f(p, q, h + 1 / 3) * 255, f(p, q, h) * 255, f(p, q, h - 1 / 3) * 255]; }
  function accentCSS(hex) {
    var base = hex2rgb(hex), hsl = rgb2hsl(base), WHITE = [255, 255, 255], DARK = [20, 17, 28];
    var aL = hsl2rgb(hsl[0], hsl[1], Math.min(hsl[2], .46)), aD = hsl2rgb(hsl[0], Math.min(hsl[1], .62), Math.max(hsl[2], .68));
    var L = { a: rgb2hex(aL), soft: rgb2hex(mixc(aL, WHITE, .86)), on: lum(aL) > .5 ? "#14111c" : "#ffffff", grid: "rgba(" + aL.map(Math.round).join(",") + ",.07)" };
    var D = { a: rgb2hex(aD), soft: rgb2hex(mixc(aD, DARK, .82)), on: "#14111c", grid: "rgba(" + aD.map(Math.round).join(",") + ",.08)" };
    var v = function (o) { return "--accent:" + o.a + ";--accent-soft:" + o.soft + ";--on-accent:" + o.on + ";--grid:" + o.grid + ";"; };
    return ":root{" + v(L) + "}@media (prefers-color-scheme:dark){:root:not([data-theme=\"light\"]){" + v(D) + "}}:root[data-theme=\"dark\"]{" + v(D) + "}";
  }

  /* ---------- terapkan tampilan ke halaman ---------- */
  var title0 = document.title;
  S.apply = function () {
    var T = S.setting("tampilan") || {}, st = document.getElementById("nx-accent");
    var w = String(T.warna || "").toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(w) && w !== ACC0) {
      if (!st) { st = document.createElement("style"); st.id = "nx-accent"; document.head.appendChild(st); }
      st.textContent = accentCSS(w);
    } else if (st) st.remove();
    var logo = S.safeImg(T.logo);
    if (logo) qsa('img[src$="img/logo.png"],img[data-nxl]').forEach(function (im) { im.setAttribute("data-nxl", "1"); if (im.getAttribute("src") !== logo) im.src = logo; });
    var nm = String(T.nama || "").trim().slice(0, 40);
    if (nm) { qsa(".logo-name").forEach(function (n) { if (n.textContent !== nm) n.textContent = nm; }); document.title = title0.replace(/NEXORA/g, nm); }
    var h1 = document.querySelector(".hero-copy h1"), p = document.querySelector(".hero-copy > p:not(.hero-from)");
    if (h1 && T.hero) h1.textContent = String(T.hero).slice(0, 160);
    if (p && T.sub) p.textContent = String(T.sub).slice(0, 400);
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
