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
    ["nx-role", "nx-arole", "nx-name", "nx-email", "nx-via", "nx-avatar"].forEach(function (k) { ssSet(k, ""); }); NX.tk = []; NX.users = {};
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
      if (NX.role) { more.push(NX.usersReload().catch(function () { NX.users = {}; })); if (!NX.staff.length) more.push(reloadStaff()); }
      return Promise.all(more).then(function () { startLive(); return null; });
    });
  }

  /* mode: "cust" atau "admin". Menunggu pertukaran kode OAuth selesai, lalu memuat profil dan role. */
  NX.ready = function (mode, force) {
    if (NX._p && !force) return NX._p;
    NX._p = sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { clearSession(); return null; }
      var pu = sb.auth.getUser().then(function (u) { return u; }, function (e) { return { error: e }; });
      var pl = load(s.user, mode).then(function () { return null; }, function (e) { return e; });
      return Promise.all([pu, pl]).then(function (x) {
        var er = x[0].error;
        if ((er && deadSession(er)) || (!er && !(x[0].data && x[0].data.user))) {
          return sb.auth.signOut({ scope: "local" }).then(clearSession, clearSession).then(function () { return null; });
        }
        if (x[1]) throw x[1];
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
  function startLive() {
    if (NX._live) return; NX._live = true;
    var t, deb = function () { clearTimeout(t); t = setTimeout(function () { NX.tkReload().then(function (ch) { if (ch && window.nxRemote) window.nxRemote(); }, function () {}); }, 250); };
    try { sb.channel("nx-tiket").on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, deb).on("postgres_changes", { event: "*", schema: "public", table: "ticket_messages" }, deb).subscribe(); } catch (x) {}
    setInterval(function () { if (!document.hidden && NX.user) deb(); }, 20000);
  }
})();
