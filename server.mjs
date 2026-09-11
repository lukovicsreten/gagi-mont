/**
 * Mini statički server za lokalni pregled sajta — bez ijedne zavisnosti.
 * Pokretanje:  node server.mjs        →  http://localhost:5173
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.join(ROOT, url === '/' ? 'index.html' : url);

  // Ne dozvoljavamo izlazak izvan foldera projekta.
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    // Isto ponašanje kao na Vercelu: nepostojeća putanja dobija 404.html sa
    // korena sajta (Vercel to radi automatski za staticke sajtove).
    const custom404 = path.join(ROOT, '404.html');
    if (fs.existsSync(custom404)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(custom404).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
         .end('<h1>404</h1><p>Stranica nije pronađena.</p>');
    }
    return;
  }

  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`GAGI MONT — sajt radi na http://localhost:${PORT}`);
});
