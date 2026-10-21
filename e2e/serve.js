#!/usr/bin/env node
// Minimal static server for the exported site in out/, mimicking Cloudflare Pages:
// /foo serves foo.html or foo/index.html, unknown paths get 404.html with status 404.
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'out');
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};

const isFile = (file) => file.startsWith(ROOT) && fs.existsSync(file) && fs.statSync(file).isFile();

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/';
  const base = path.join(ROOT, clean);
  return [base, `${base}.html`, path.join(base, 'index.html')].find(isFile);
}

http.createServer((req, res) => {
  const file = resolve(req.url || '/');
  const target = file || path.join(ROOT, '404.html');
  res.writeHead(file ? 200 : 404, {
    'content-type': TYPES[path.extname(target)] || 'application/octet-stream',
  });
  fs.createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`serving ${ROOT} on http://127.0.0.1:${PORT}`));
