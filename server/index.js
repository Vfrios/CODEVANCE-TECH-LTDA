// TODO: substituir por backend real
// Servidor placeholder (sem dependências, só Node) para que `pnpm dev` suba front + back.
// O Vite faz proxy de `/api/*` para cá (veja vite.config.js).
import { createServer } from 'node:http';

const PORT = Number(process.env.API_PORT) || 3001;

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && pathname === '/api/health') {
    return send(res, 200, { status: 'ok', time: new Date().toISOString() });
  }

  send(res, 404, { message: `Rota não implementada: ${req.method} ${pathname}` });
});

server.listen(PORT, () => {
  console.log(`[api] rodando em http://localhost:${PORT}`);
});
