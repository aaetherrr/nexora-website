/* NEXORA - lapisan login Supabase (Google / Discord).
   Kalau assets/js/config.js kosong, NX.live = false dan situs tetap berjalan dalam mode demo. */
(function () {
  var C = window.NX_CONFIG || {};
  var NX = (window.NX = { live: false, user: null, profile: null, role: "", staff: [], identities: [] });
  if (!C.supabaseUrl || !C.supabaseAnonKey || !window.supabase || !window.supabase.createClient) return;
  NX.live = true;
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

  function mapStaff(r) { return { id: r.id, nama: r.nama, email: r.email || "", discord_id: r.discord_id || "", role: r.role, dibuat: Date.parse(r.dibuat) || Date.now() }; }
  function reloadStaff() {
    return sb.from("staff").select("*").order("dibuat", { ascending: true }).then(function (r) {
      if (r.error) fail(r.error); NX.staff = (r.data || []).map(mapStaff);
    });
  }
  function clearSession() {
    NX.user = null; NX.profile = null; NX.role = ""; NX.staff = []; NX.identities = [];
    ["nx-role", "nx-arole", "nx-name", "nx-email", "nx-via"].forEach(function (k) { ssSet(k, ""); });
  }
  function hasId(p) { return NX.identities.some(function (i) { return i.provider === p; }); }

  function load(user, mode) {
    NX.user = user;
    return Promise.all([
      sb.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      sb.auth.getUserIdentities(),
      mode === "admin" ? sb.rpc("claim_staff") : Promise.resolve({ data: "" })
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
      return NX.role ? reloadStaff() : null;
    });
  }

  /* mode: "cust" atau "admin". Menunggu pertukaran kode OAuth selesai, lalu memuat profil dan role. */
  NX.ready = function (mode, force) {
    if (NX._p && !force) return NX._p;
    NX._p = sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { clearSession(); return null; }
      return load(s.user, mode);
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
        if (bad) throw new Error(bad.error ? (/duplicate|unique/i.test(bad.error.message) ? "Akun ini sudah terdaftar di tim." : bad.error.message) : "Tidak diizinkan. Hanya Founder yang bisa mengatur tim.");
      });
    });
  };
})();
