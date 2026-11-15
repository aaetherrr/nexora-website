/* NEXORA - lapisan login Supabase (Google / Discord).
   Kalau assets/js/config.js kosong, NX.live = false dan situs tetap berjalan dalam mode demo. */
(function () {
  var C = window.NX_CONFIG || {};
  var NX = (window.NX = { live: false, user: null, profile: null, role: "", staff: [], identities: [] });
  if (!C.supabaseUrl || !C.supabaseAnonKey || !window.supabase || !window.supabase.createClient) return;
  NX.live = true;
  try { var pc = document.createElement("link"); pc.rel = "preconnect"; pc.href = C.supabaseUrl; pc.crossOrigin = ""; document.head.appendChild(pc); } catch (x) {}
  function deadSession(e) { return !!e && (e.status === 401 || e.status === 403 || e.status === 404 || e.name === "AuthSessionMissingError"); }
  var sb = (NX.sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, { auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }));
  /* Catat alasan kalau login gagal, supaya halaman login bisa menampilkannya (bukan memantul diam-diam). */
  function setErr(m) { try { if (m) sessionStorage.setItem("nx-autherr", String(m).slice(0, 300)); else sessionStorage.removeItem("nx-autherr"); } catch (x) {} }
  var QS = new URLSearchParams(location.search), HS = new URLSearchParams((location.hash || "").replace(/^#/, ""));
  function keepErr() { try { return !!sessionStorage.getItem("nx-autherr"); } catch (x) { return false; } }
  var BACKCODE = !!QS.get("code");
  var OERR = QS.get("error_description") || HS.get("error_description") || QS.get("error") || HS.get("error") || "";
  var OCODE = QS.get("error_code") || HS.get("error_code") || "";
  if (OERR) {
    setErr((OERR.replace(/\+/g, " ") + (OCODE ? " [" + OCODE + "]" : "")).trim());
    try { history.replaceState(null, "", location.pathname); } catch (x) {} /* bersihkan alamat supaya muat ulang tidak mengulang error */
  }
  NX.init = (typeof sb.auth.initialize === "function" ? sb.auth.initialize() : Promise.resolve({})).then(function (r) {
    if (r && r.error) { console.error("Login Supabase:", r.error); if (!OERR && !keepErr()) setErr(r.error.message || "Sesi login tidak bisa dibuat."); }
  }, function (er) { console.error("Login Supabase:", er); if (!OERR && !keepErr()) setErr((er && er.message) || "Sesi login tidak bisa dibuat."); });
  var PROV = { Google: "google", Discord: "discord", google: "google", discord: "discord" };

  function ssSet(k, v) { try { if (v) sessionStorage.setItem(k, v); else sessionStorage.removeItem(k); } catch (x) {} }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
  function fail(er) { throw er instanceof Error ? er : new Error((er && er.message) || "Terjadi kesalahan"); }
  function sibling(file) { return new URL(file, location.href).href; }

  function waNorm(v) {
    var d = String(v || "").replace(/[^0-9+]/g, "").replace(/^\+/, "");
    if (!d) return null;
    if (d.charAt(0) === "0") d = "62" + d.slice(1); else if (d.charAt(0) === "8") d = "62" + d;
    if (!/^62[0-9]{8,13}$/.test(d)) throw new Error("Nomor WhatsApp tidak valid. Contoh: 081234567890");
    return d;
  }
  function dcNorm(v) {
    var s = String(v || "").trim().replace(/^@/, "").toLowerCase();
    if (!s) return null;
    if (!/^[a-z0-9_.]{2,32}$/.test(s)) throw new Error("Username Discord hanya boleh huruf kecil, angka, titik, dan garis bawah (2-32 karakter).");
    return s;
  }
  NX.waNorm = waNorm; NX.dcNorm = dcNorm;

  function mapStaff(r) { return { id: r.id, nama: r.nama, email: r.email || "", discord_id: r.discord_id || "", role: r.role, user_id: r.user_id || "", dibuat: Date.parse(r.dibuat) || Date.now() }; }
  function reloadStaff() {
    return sb.from("staff").select("*").order("dibuat", { ascending: true }).then(function (r) {
      if (r.error) fail(r.error); NX.staff = (r.data || []).map(mapStaff);
    });
  }
  function clearSession() {
    NX.user = null; NX.profile = null; NX.role = ""; NX.staff = []; NX.identities = [];
    ["nx-role", "nx-arole", "nx-name", "nx-email", "nx-via", "nx-avatar"].forEach(function (k) { ssSet(k, ""); }); NX.tk = []; NX.users = {}; NX.cat = null; NX.set = {};
  }
  function hasId(p) { return NX.identities.some(function (i) { return i.provider === p; }); }

  function load(user, mode) {
    NX.user = user;
    return Promise.all([
      sb.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      sb.auth.getUserIdentities(),
      mode === "admin" ? sb.rpc("claim_staff") : Promise.resolve({ data: "" }),
      mode === "admin" ? sb.from("staff").select("*").order("dibuat", { ascending: true }) : Promise.resolve({ data: [] })
    ]).then(function (r) {
      if (r[0].error) fail(r[0].error);
      var um = user.user_metadata || {};
      NX.profile = r[0].data || { nama: um.full_name || um.name || "", email: user.email || "" };
      NX.identities = (r[1].data && r[1].data.identities) || [];
      NX.err = r[2].error ? r[2].error.message : "";
      if (NX.err) console.error("claim_staff:", r[2].error);
      NX.role = mode === "admin" && !r[2].error && r[2].data ? r[2].data : "";
      var P = NX.profile;
      // isi otomatis username Discord bila belum ada
      if (!P.discord_username && hasId("discord")) {
        var idd = (NX.identities.filter(function (i) { return i.provider === "discord"; })[0] || {}).identity_data || {};
        try { var g = dcNorm(idd.full_name || idd.name || idd.user_name); if (g) { P.discord_username = g; sb.from("profiles").update({ discord_username: g }).eq("id", user.id).then(function () {}); } } catch (x) {}
      }
      var AVRE = /^https:\/\/(lh[0-9]+\.googleusercontent\.com|cdn\.discordapp\.com)\/[^\s]{1,500}$/;
      var avu = um.avatar_url || um.picture || "";
      if (avu && AVRE.test(avu) && P.avatar_url !== avu) { P.avatar_url = avu; sb.from("profiles").update({ avatar_url: avu }).eq("id", user.id).then(function () {}); }
      ssSet("nx-avatar", P.avatar_url && AVRE.test(P.avatar_url) ? P.avatar_url : "");
      var via = cap((user.app_metadata && user.app_metadata.provider) || "");
      ssSet("nx-name", P.nama || um.full_name || um.name || (user.email || "").split("@")[0] || "Customer");
      ssSet("nx-email", P.email || user.email || "");
      ssSet("nx-via", via);
      ssSet("nx-role", mode === "admin" ? (NX.role ? "admin" : "") : "cust");
      ssSet("nx-arole", NX.role);
      try {
        var old = JSON.parse(localStorage.getItem("nx-prof") || "{}") || {};
        old.discord = P.discord_username || ""; old.wa = P.whatsapp || "";
        old.lk = { g: hasId("google"), d: hasId("discord") };
        localStorage.setItem("nx-prof", JSON.stringify(old));
      } catch (x) {}
      NX.staff = NX.role && !r[3].error ? (r[3].data || []).map(mapStaff) : [];
      var more = [NX.tkReload().catch(function (e) { console.error("tiket:", e); NX.tkErr = e.message; NX.tk = []; })];
      more.push(NX.catLoad().catch(function (e) { console.error("katalog:", e); NX.catErr = e.message; NX.cat = null; }));
      more.push(NX.setLoad().catch(function (e) { console.error("pengaturan:", e); NX.set = {}; }));
      if (NX.role) { more.push(NX.usersReload().catch(function () { NX.users = {}; })); if (!NX.staff.length) more.push(reloadStaff()); }
      return Promise.all(more).then(function () { startLive(); return null; });
    });
  }

  /* mode: "cust" atau "admin". Menunggu pertukaran kode OAuth selesai, lalu memuat profil dan role. */
  NX.ready = function (mode, force) {
    if (NX._p && !force) return NX._p;
    NX._p = NX.init.then(function () { return sb.auth.getSession(); }).then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { clearSession(); if (BACKCODE && !sessionStorage.getItem("nx-autherr")) setErr("Sesi login tidak terbentuk setelah kembali dari Google/Discord."); return null; }
      var pu = sb.auth.getUser().then(function (u) { return u; }, function (e) { return { error: e }; });
      var pl = load(s.user, mode).then(function () { return null; }, function (e) { return e; });
      return Promise.all([pu, pl]).then(function (x) {
        var er = x[0].error;
        if ((er && deadSession(er)) || (!er && !(x[0].data && x[0].data.user))) {
          setErr("Sesi login sudah berakhir atau akunmu tidak ditemukan. Silakan masuk lagi.");
          return sb.auth.signOut({ scope: "local" }).then(clearSession, clearSession).then(function () { return null; });
        }
        if (x[1]) throw x[1];
        setErr("");
        return null;
      });
    });
    NX._mode = mode;
    return NX._p;
  };
  NX.hydrate = function () { return NX.ready(NX._mode || "cust", true); };

  NX.login = function (provider, mode) {
    var to = mode === "alogin" ? "nexora-admin.html" : "dashboard.html";
    return sb.auth.signInWithOAuth({ provider: PROV[provider], options: { redirectTo: sibling(to) } }).then(function (r) { if (r.error) fail(r.error); });
  };
  NX.logout = function () { return sb.auth.signOut().then(clearSession, clearSession); };

  NX.refresh = function () {
    return sb.rpc("my_staff_role").then(function (r) {
      NX.role = (!r.error && r.data) || "";
      ssSet("nx-arole", NX.role); if (!NX.role) ssSet("nx-role", "");
      return NX.role;
    });
  };

  NX.saveProfile = function (p) {
    var nama = String(p.nama || "").trim();
    if (!nama) throw new Error("Nama tidak boleh kosong.");
    if (nama.length > 60) throw new Error("Nama maksimal 60 karakter.");
    var upd = { nama: nama, discord_username: dcNorm(p.discord_username), whatsapp: waNorm(p.whatsapp) };
    return sb.from("profiles").update(upd).eq("id", NX.user.id).select().then(function (r) {
      if (r.error) fail(r.error);
      if (!r.data || !r.data.length) throw new Error("Profil tidak ditemukan atau tidak diizinkan.");
      NX.profile = r.data[0]; ssSet("nx-name", nama);
      try { var old = JSON.parse(localStorage.getItem("nx-prof") || "{}") || {}; old.discord = upd.discord_username || ""; old.wa = upd.whatsapp || ""; localStorage.setItem("nx-prof", JSON.stringify(old)); } catch (x) {}
      return NX.profile;
    });
  };

  NX.link = function (provider) {
    return sb.auth.linkIdentity({ provider: PROV[provider], options: { redirectTo: location.href.split("#")[0] } }).then(function (r) { if (r.error) fail(r.error); });
  };
  NX.unlink = function (provider) {
    var id = NX.identities.filter(function (i) { return i.provider === PROV[provider]; })[0];
    if (!id) return Promise.resolve();
    if (NX.identities.length < 2) throw new Error("Minimal satu akun harus tetap terhubung.");
    return sb.auth.unlinkIdentity(id).then(function (r) { if (r.error) fail(r.error); });
  };

  /* Menyimpan perubahan daftar staf (hanya Founder yang lolos aturan database). */
  NX.saveStaff = function (L) {
    var byId = {}, keep = {}, ops = [];
    NX.staff.forEach(function (x) { byId[x.id] = x; });
    L.forEach(function (x) {
      var o = byId[x.id];
      if (o) { keep[x.id] = 1; if (o.role !== x.role || o.nama !== x.nama) ops.push(sb.from("staff").update({ role: x.role, nama: x.nama }).eq("id", x.id).select("id")); }
      else ops.push(sb.from("staff").insert({ nama: x.nama, email: x.email || null, discord_id: x.discord_id || null, role: x.role }).select("id"));
    });
    NX.staff.forEach(function (x) { if (!keep[x.id]) ops.push(sb.from("staff").delete().eq("id", x.id).select("id")); });
    NX.staff = L.slice();
    return Promise.all(ops).then(function (rs) {
      var bad = rs.filter(function (q) { return q.error || !q.data || !q.data.length; })[0];
      return reloadStaff().then(function () {
        var self = NX.staff.filter(function (s) { return NX.user && s.user_id === NX.user.id; })[0];
        if (self && NX.profile && self.nama && self.nama !== NX.profile.nama) { NX.profile.nama = self.nama; ssSet("nx-name", self.nama); sb.from("profiles").update({ nama: self.nama }).eq("id", NX.user.id).then(function () {}); }
        if (bad) throw new Error(bad.error ? (/duplicate|unique/i.test(bad.error.message) ? "Akun ini sudah terdaftar di tim." : bad.error.message) : "Tidak diizinkan. Hanya Founder yang bisa mengatur tim.");
      });
    });
  };

  /* ===== Tahap 2: ticket, chat real time, daftar customer (untuk staf) ===== */
  NX.tk = []; NX.users = {}; NX.tkErr = "";
  var DAYF = { day: "2-digit", month: "short" }, FULLF = { day: "2-digit", month: "short", year: "numeric" };
  function dLabel(d) { return d.toDateString() === new Date().toDateString() ? "Hari ini" : d.toLocaleDateString("id-ID", DAYF); }
  function hLabel(d) { return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function mapTk(r) {
    var asCust = NX._mode !== "admin" || !NX.role, mine = NX.user && r.customer_id === NX.user.id;
    var ms = (r.ticket_messages || []).slice().sort(function (a, b) { return a.id - b.id; }).map(function (m) {
      var d = new Date(m.dibuat), o = { w: m.w, t: m.t, d: dLabel(d), h: hLabel(d) };
      if (m.n) o.n = m.n; if (m.r) o.r = m.r; if (m.av) o.av = m.av; return o;
    });
    return { id: r.id, subj: r.subj, kat: r.kat, paket: r.paket, st: r.st, closed: !!r.closed, tgl: new Date(r.dibuat).toLocaleDateString("id-ID", FULLF), user: asCust && mine ? "__me" : (r.cust_nama || "Customer"), cav: r.cust_avatar || "", m: ms };
  }
  NX.tkReload = function () {
    return sb.from("tickets").select("*, ticket_messages(*)").order("dibuat", { ascending: false }).then(function (r) {
      if (r.error) fail(r.error);
      NX.tkErr = ""; var before = JSON.stringify(NX.tk); NX.tk = (r.data || []).map(mapTk);
      return before !== JSON.stringify(NX.tk);
    });
  };
  NX.tkGet = function () { return JSON.parse(JSON.stringify(NX.tk)); };
  function oneErr(q) { if (q.error) fail(q.error); if (!q.data || (Array.isArray(q.data) && !q.data.length)) throw new Error("Tidak diizinkan atau data tidak ditemukan."); return q; }
  NX.tkSet = function (arr) {
    var old = {}, seen = {}, ops = [];
    NX.tk.forEach(function (x) { old[x.id] = x; });
    arr.forEach(function (x) {
      seen[x.id] = 1; var o = old[x.id];
      if (!o) {
        ops.push(function () {
          return sb.from("tickets").insert({ subj: x.subj, kat: x.kat, paket: x.paket || "-" }).select("id").single().then(function (r) {
            if (r.error) fail(r.error);
            var chain = Promise.resolve();
            x.m.forEach(function (m) { chain = chain.then(function () { return sb.from("ticket_messages").insert({ ticket_id: r.data.id, w: m.w, t: m.t }).then(function (q) { if (q.error) fail(q.error); }); }); });
            return chain;
          });
        });
        return;
      }
      x.m.slice(o.m.length).forEach(function (m) { ops.push(function () { return sb.from("ticket_messages").insert({ ticket_id: x.id, w: m.w, t: m.t }).then(function (q) { if (q.error) fail(q.error); }); }); });
      if (x.st !== o.st || !!x.closed !== !!o.closed) ops.push(function () { return sb.from("tickets").update({ st: x.st, closed: !!x.closed }).eq("id", x.id).select("id").then(oneErr); });
    });
    NX.tk.forEach(function (o) { if (!seen[o.id]) ops.push(function () { return sb.from("tickets").delete().eq("id", o.id).select("id").then(oneErr); }); });
    NX.tk = JSON.parse(JSON.stringify(arr));
    var run = ops.reduce(function (p, f) { return p.then(f); }, Promise.resolve());
    return run.then(function () { return NX.tkReload(); }, function (er) { return NX.tkReload().then(function () { throw er; }, function () { throw er; }); }).then(function () { if (window.nxDraw) window.nxDraw(); }, function (er) { if (window.nxToast) window.nxToast(er.message); if (window.nxDraw) window.nxDraw(); });
  };
  NX.usersReload = function () {
    return sb.from("profiles").select("*").then(function (r) {
      if (r.error) fail(r.error);
      var staffIds = {}; NX.staff.forEach(function (s) { if (s.user_id) staffIds[s.user_id] = 1; });
      var u = {};
      (r.data || []).forEach(function (p) {
        if (staffIds[p.id]) return;
        var nm = p.nama || "Customer", k = nm, i = 2; while (u[k]) k = nm + " (" + (i++) + ")";
        u[k] = { email: p.email || "", discord: p.discord_username || "", wa: p.whatsapp || "", joined: new Date(p.dibuat).toLocaleDateString("id-ID", FULLF) };
      });
      NX.users = u;
    });
  };
  /* ===== Tahap 3: katalog (jasa + hosting), pengaturan situs, upload gambar ===== */
  NX.cat = null; NX.set = {}; NX.catErr = "";
  var BUCKET = "situs";
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
  }
  function eachPaket(H, f) { Object.keys(H.jasa).forEach(function (k) { H.jasa[k].forEach(f); }); H.hosting.forEach(f); }
  function mapPaket(r) { return { _id: r.id, nama: r.nama, kat: r.kategori, harga: Number(r.harga), ringkas: r.ringkas || "", fitur: Array.isArray(r.fitur) ? r.fitur : [], foto: r.foto_url || "", populer: !!r.populer }; }

  NX.catLoad = function () {
    return Promise.all([
      sb.from("catalog_jasa").select("*").order("urutan", { ascending: true }).order("dibuat", { ascending: true }),
      sb.from("catalog_paket").select("*").order("urutan", { ascending: true }).order("dibuat", { ascending: true })
    ]).then(function (r) {
      if (r[0].error) fail(r[0].error); if (r[1].error) fail(r[1].error);
      var H = { jasa: {}, hosting: [], meta: {} };
      (r[0].data || []).forEach(function (j) { H.jasa[j.id] = []; H.meta[j.id] = { nama: j.nama, ic: j.ikon }; });
      (r[1].data || []).forEach(function (p) { if (p.tipe === "hosting") H.hosting.push(mapPaket(p)); else if (H.jasa[p.jasa_id]) H.jasa[p.jasa_id].push(mapPaket(p)); });
      var changed = JSON.stringify(H) !== JSON.stringify(NX.cat);
      NX.cat = H; NX._catSynced = clone(H); NX.catErr = "";
      return changed;
    });
  };
  NX.catGet = function () { return NX.cat ? clone(NX.cat) : null; };

  /* ----- upload gambar ke Storage (bucket publik "situs") ----- */
  function dataToBlob(d) {
    var m = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+\/=]+)$/.exec(d || "");
    if (!m) throw new Error("Format gambar tidak didukung (pakai PNG, JPG, atau WEBP).");
    var bin = atob(m[2]), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    var b = new Blob([u], { type: m[1] });
    if (b.size > 2 * 1024 * 1024) throw new Error("Gambar terlalu besar (maksimal 2 MB).");
    return b;
  }
  NX.upload = function (dataUrl, folder) {
    return Promise.resolve().then(function () {
      var b = dataToBlob(dataUrl), ext = b.type === "image/png" ? "png" : b.type === "image/webp" ? "webp" : "jpg";
      var name = folder + "/" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
      return sb.storage.from(BUCKET).upload(name, b, { contentType: b.type, cacheControl: "31536000", upsert: false }).then(function (r) {
        if (r.error) fail(r.error);
        return sb.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
      });
    });
  };
  function bucketPath(u) { var m = /\/storage\/v1\/object\/public\/situs\/(.+)$/.exec(String(u || "")); return m ? decodeURIComponent(m[1]) : ""; }
  function dropFiles(urls) { /* bersih-bersih file lama, tidak boleh menggagalkan penyimpanan */
    var ps = urls.map(bucketPath).filter(Boolean);
    if (ps.length) sb.storage.from(BUCKET).remove(ps).then(function () {}, function () {});
  }
  function queue(name, fn) { NX[name] = (NX[name] || Promise.resolve()).then(fn, fn); return NX[name]; }
  function rowOf(p, tipe, jasa, i) {
    return { id: p._id, tipe: tipe, jasa_id: jasa, nama: String(p.nama || "").trim(), kategori: String(p.kat || "").trim(), harga: Math.round(Number(p.harga) || 0),
      ringkas: String(p.ringkas || "").trim(), fitur: (p.fitur || []).map(function (f) { return String(f).trim(); }).filter(Boolean), foto_url: p.foto || null, populer: !!p.populer, urutan: i };
  }
  function allRows(H) {
    var rows = {};
    Object.keys(H.jasa).forEach(function (k) { H.jasa[k].forEach(function (p, i) { rows[p._id] = rowOf(p, "jasa", k, i); }); });
    H.hosting.forEach(function (p, i) { rows[p._id] = rowOf(p, "hosting", null, i); });
    return rows;
  }

  /* Menyimpan seluruh katalog: hanya baris yang berubah yang dikirim (dibandingkan dengan data terakhir dari database). */
  function persistCat(H) {
    var old = NX._catSynced || { jasa: {}, hosting: [], meta: {} }, byId = {};
    eachPaket(H, function (p) { byId[p._id] = p; });
    var ups = [];
    eachPaket(H, function (p) { if (p.foto && /^data:image\//.test(p.foto)) ups.push(NX.upload(p.foto, "paket").then(function (u) { p.foto = u; })); });
    return Promise.all(ups).then(function () {
      if (NX.cat) eachPaket(NX.cat, function (p) { if (byId[p._id] && byId[p._id].foto !== p.foto) p.foto = byId[p._id].foto; });
      var oldKeys = Object.keys(old.jasa), keys = Object.keys(H.jasa);
      var jRows = keys.map(function (k, i) { return { id: k, nama: String(H.meta[k].nama).trim(), ikon: H.meta[k].ic || "tag", urutan: i }; }).filter(function (r) {
        var o = old.meta[r.id]; return !o || o.nama !== r.nama || o.ic !== r.ikon || oldKeys.indexOf(r.id) !== keys.indexOf(r.id);
      });
      var delJ = oldKeys.filter(function (k) { return !(k in H.jasa); });
      var oldRows = allRows(old), newRows = allRows(H), pRows = [], delP = [];
      Object.keys(newRows).forEach(function (id) { if (!oldRows[id] || JSON.stringify(oldRows[id]) !== JSON.stringify(newRows[id])) pRows.push(newRows[id]); });
      Object.keys(oldRows).forEach(function (id) { var o = oldRows[id]; if (!newRows[id] && !(o.jasa_id && delJ.indexOf(o.jasa_id) >= 0)) delP.push(id); });
      var chain = Promise.resolve();
      if (jRows.length) chain = chain.then(function () { return sb.from("catalog_jasa").upsert(jRows).select("id").then(function (q) { if (q.error) fail(q.error); if (!q.data || q.data.length !== jRows.length) throw new Error("Tidak diizinkan. Hanya Founder dan Co-Founder yang bisa mengubah katalog."); }); });
      if (delJ.length) chain = chain.then(function () { return sb.from("catalog_jasa").delete().in("id", delJ).select("id").then(function (q) { if (q.error) fail(q.error); if (!q.data || q.data.length !== delJ.length) throw new Error("Jasa tidak bisa dihapus (tidak diizinkan)."); }); });
      if (delP.length) chain = chain.then(function () { return sb.from("catalog_paket").delete().in("id", delP).select("id").then(function (q) { if (q.error) fail(q.error); if (!q.data || q.data.length !== delP.length) throw new Error("Paket tidak bisa dihapus (tidak diizinkan)."); }); });
      if (pRows.length) chain = chain.then(function () { return sb.from("catalog_paket").upsert(pRows).select("id").then(function (q) { if (q.error) fail(q.error); if (!q.data || q.data.length !== pRows.length) throw new Error("Tidak diizinkan. Hanya Founder dan Co-Founder yang bisa mengubah katalog."); }); });
      return chain.then(function () {
        var keep = {}; Object.keys(newRows).forEach(function (id) { if (newRows[id].foto_url) keep[newRows[id].foto_url] = 1; });
        var gone = []; Object.keys(oldRows).forEach(function (id) { var u = oldRows[id].foto_url; if (u && !keep[u]) gone.push(u); });
        dropFiles(gone);
        NX._catSynced = clone(H);
      });
    });
  }
  /* Dipanggil dari dashboard: langsung memperbarui tampilan (optimistis), lalu menyimpan ke database. */
  NX.catSet = function (H2) {
    var H = clone(H2);
    H.meta = H.meta || {}; Object.keys(H.jasa).forEach(function (k) { if (!H.meta[k]) H.meta[k] = { nama: k, ic: "tag" }; });
    eachPaket(H, function (p) { if (!p._id) p._id = uuid(); });
    NX.cat = clone(H);
    return queue("_catQ", function () { return persistCat(H); }).catch(function (er) {
      return NX.catLoad().then(function () { throw er; }, function () { throw er; });
    });
  };

  /* ----- pengaturan situs: tampilan, kontak, sosmed, bayar, qr ----- */
  NX.setLoad = function () {
    return sb.from("site_settings").select("key,value").then(function (r) {
      if (r.error) fail(r.error);
      var m = {}; (r.data || []).forEach(function (x) { m[x.key] = x.value; });
      var changed = JSON.stringify(m) !== JSON.stringify(NX.set); NX.set = m; NX._setSynced = clone(m); return changed;
    });
  };
  NX.setGet = function (k) { return NX.set[k] === undefined ? null : clone(NX.set[k]); };
  function imgField(k) { return k === "tampilan" ? "logo" : k === "qr" ? "url" : ""; }
  NX.setPut = function (k, v) {
    var val = v == null ? null : clone(v);
    if (val === null) delete NX.set[k]; else NX.set[k] = clone(val);
    return queue("_setQ", function () {
      var f = imgField(k), old = NX._setSynced && NX._setSynced[k], oldImg = old && f ? old[f] : "", pre = Promise.resolve();
      if (val && f && val[f] && /^data:image\//.test(val[f])) pre = NX.upload(val[f], k === "qr" ? "qr" : "logo").then(function (u) { val[f] = u; if (NX.set[k]) NX.set[k][f] = u; });
      return pre.then(function () {
        var q = val === null ? sb.from("site_settings").delete().eq("key", k).select("key") : sb.from("site_settings").upsert({ key: k, value: val }).select("key");
        return q.then(function (r) {
          if (r.error) fail(r.error);
          if (val !== null && (!r.data || !r.data.length)) throw new Error("Tidak diizinkan. Hanya Founder dan Co-Founder yang bisa mengubah pengaturan situs.");
          if (!NX._setSynced) NX._setSynced = {};
          if (val === null) delete NX._setSynced[k]; else NX._setSynced[k] = clone(val);
          var nu = val && f ? val[f] : ""; if (oldImg && oldImg !== nu) dropFiles([oldImg]);
        });
      });
    }).catch(function (er) { return NX.setLoad().then(function () { throw er; }, function () { throw er; }); });
  };

  function startLive() {
    if (NX._live) return; NX._live = true;
    var t, deb = function () { clearTimeout(t); t = setTimeout(function () { NX.tkReload().then(function (ch) { if (ch && window.nxRemote) window.nxRemote(); }, function () {}); }, 250); };
    try { sb.channel("nx-tiket").on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, deb).on("postgres_changes", { event: "*", schema: "public", table: "ticket_messages" }, deb).subscribe(); } catch (x) {}
    setInterval(function () { if (!document.hidden && NX.user) deb(); }, 20000);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden || !NX.user) return;
      Promise.all([NX.catLoad().catch(function () { return false; }), NX.setLoad().catch(function () { return false; })]).then(function (c) { if ((c[0] || c[1]) && window.nxRemote) window.nxRemote(); });
    });
  }
})();
