// Server lokal tanpa install apa-apa, meniru aturan Cloudflare Pages (_redirects + functions/).
// Jalankan:  node dev-server.js   lalu buka http://localhost:8788
// Port lain: node dev-server.js 3000
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = __dirname, PORT = Number(process.argv[2]) || 8788;
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".woff2": "font/woff2" };
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };
const send = (res, code, file) => {
  res.writeHead(code, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch (e) { res.writeHead(400); return res.end("Bad request"); }
  const clean = p.replace(/\/+$/, "") || "/";

  // alamat lama -> alamat baru (sama dengan _redirects)
  const m = clean.match(/^\/(akun|admin)\/(dashboard|masuk|nexora-admin|nexora-admin-access)(\.html)?$/);
  if (m) { res.writeHead(301, { Location: "/" + m[2] }); return res.end(); }

  // menu dashboard: /dashboard/ticket, /nexora-admin/tagihan, dst -> halaman yang sama, URL tidak berubah
  if (/^\/dashboard\//.test(clean + "/") && clean !== "/dashboard") return send(res, 200, path.join(ROOT, "dashboard.html"));
  if (/^\/nexora-admin\//.test(clean + "/") && clean !== "/nexora-admin") return send(res, 200, path.join(ROOT, "nexora-admin.html"));

  // file biasa, lalu alamat tanpa .html (pretty URL seperti Cloudflare Pages)
  const abs = path.normalize(path.join(ROOT, clean));
  if (!abs.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  if (isFile(abs)) return send(res, 200, abs);
  if (isFile(abs + ".html")) return send(res, 200, abs + ".html");
  if (isFile(path.join(abs, "index.html"))) return send(res, 200, path.join(abs, "index.html"));

  const nf = path.join(ROOT, "404.html");
  if (isFile(nf)) return send(res, 404, nf);
  res.writeHead(404); res.end("Not found");
}).listen(PORT, () => console.log("NEXORA lokal jalan di http://localhost:" + PORT));
