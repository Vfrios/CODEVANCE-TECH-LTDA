import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const PORT = Number(process.env.PORT || process.env.API_PORT) || 3001;
const DIST_DIR = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const sendJson = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
};

async function serveFrontend(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendJson(res, 404, { message: `Rota não implementada: ${req.method} ${pathname}` });
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return sendJson(res, 400, { message: 'O caminho solicitado é inválido.' });
  }

  const requestedFile = path.resolve(DIST_DIR, `.${decodedPath}`);
  if (requestedFile !== DIST_DIR && !requestedFile.startsWith(`${DIST_DIR}${path.sep}`)) {
    return sendJson(res, 403, { message: 'Acesso negado.' });
  }

  const candidates = [requestedFile];
  if (decodedPath.endsWith('/') || !path.extname(decodedPath)) {
    candidates.push(path.join(DIST_DIR, 'index.html'));
  }

  let filePath;
  let fileInfo;
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) {
        filePath = candidate;
        fileInfo = info;
        break;
      }
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
    }
  }

  if (!filePath) return sendJson(res, 404, { message: 'Arquivo não encontrado.' });

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream',
    'Content-Length': fileInfo.size,
  });
  if (req.method === 'HEAD') return res.end();

  createReadStream(filePath)
    .on('error', (error) => {
      console.error('[server] Falha ao ler arquivo do frontend:', error);
      if (!res.headersSent) sendJson(res, 500, { message: 'Não foi possível carregar o site.' });
      else res.destroy(error);
    })
    .pipe(res);
}

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok', time: new Date().toISOString() });
  }
  if (pathname.startsWith('/api/')) {
    return sendJson(res, 404, { message: `Rota não implementada: ${req.method} ${pathname}` });
  }
  serveFrontend(req, res, pathname).catch((error) => {
    console.error('[server] Falha ao servir o frontend:', error);
    if (!res.headersSent) sendJson(res, 500, { message: 'Não foi possível carregar o site.' });
    else res.destroy(error);
  });
});

server.listen(PORT, () => {
  console.log(`[server] Site disponível em http://localhost:${PORT}`);
});
