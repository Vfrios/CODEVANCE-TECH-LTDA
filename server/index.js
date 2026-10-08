import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';
import { SITE, PLANOS } from '../src/config/site.js';

const MAX_BODY_BYTES = 16_000;
const MAX_HISTORY_ITEMS = 12;
const MAX_MESSAGE_LENGTH = 4_000;

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

const systemInstruction = `Você é o assistente virtual da ${SITE.companyName}, empresa de Belo Horizonte que cria sites, lojas virtuais, sistemas sob medida, automações e integrações.
Responda sempre em português brasileiro, com cordialidade, clareza e objetividade. Ajude com dúvidas sobre serviços, orçamento, prazos e o processo de trabalho. Use somente as informações fornecidas abaixo; não invente funcionalidades, garantias, prazos, políticas ou preços. Quando faltarem informações, explique que o orçamento depende de uma conversa com a equipe. Não prometa que é uma pessoa. Se a pergunta estiver fora do escopo, diga isso com gentileza e ofereça encaminhamento para a equipe no WhatsApp (${SITE.whatsappNumber}).

Serviços, planos e preços atuais:
${JSON.stringify(PLANOS)}

Fluxo de trabalho: ${SITE.companyName} entende os objetivos do cliente, define escopo e orçamento, desenvolve e acompanha o projeto. A cidade informada é ${SITE.city}.

Retorne somente um objeto JSON com "reply" (resposta ao cliente em texto) e "suggestions" (exatamente três opções curtas de próxima pergunta ou ação, relevantes à resposta e distintas entre si). Não use markdown nem inclua propriedades adicionais.`;

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

const sendSocketMessage = (socket, message) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
};

function validateContents(contents) {
  if (!Array.isArray(contents) || contents.length === 0 || contents.length > MAX_HISTORY_ITEMS) {
    return false;
  }

  return contents.every(
    (item) =>
      item &&
      ['user', 'model'].includes(item.role) &&
      Array.isArray(item.parts) &&
      item.parts.length === 1 &&
      typeof item.parts[0]?.text === 'string' &&
      item.parts[0].text.trim().length > 0 &&
      item.parts[0].text.length <= MAX_MESSAGE_LENGTH
  );
}

async function generateReply(contents) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('O assistente inteligente está temporariamente indisponível.');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  if (!/^gemini-[a-zA-Z0-9._-]+$/.test(model)) {
    throw new Error('O assistente inteligente está temporariamente indisponível.');
  }

  let upstream;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 900,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                reply: { type: 'STRING' },
                suggestions: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                },
              },
              required: ['reply', 'suggestions'],
            },
          },
        }),
        signal: AbortSignal.timeout(15_000),
      }
    );
  } catch (error) {
    console.error('[api/chat] Falha ao conectar ao Gemini:', error.message);
    throw new Error('Não foi possível conectar ao assistente inteligente.');
  }

  if (!upstream.ok) {
    let providerError = '';
    try {
      const errorData = await upstream.json();
      providerError = errorData.error?.message || '';
    } catch {
      providerError = 'resposta de erro inválida';
    }
    console.error(
      `[api/chat] Gemini respondeu com status ${upstream.status}: ${providerError || 'sem detalhes'}.`
    );
    throw new Error('O assistente inteligente não conseguiu responder agora.');
  }

  let data;
  try {
    data = await upstream.json();
  } catch {
    console.error('[api/chat] O Gemini retornou uma resposta inválida.');
    throw new Error('O assistente inteligente retornou uma resposta inválida.');
  }

  const rawReply = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();
  if (!rawReply) {
    console.error('[api/chat] O Gemini não retornou texto.');
    throw new Error('O assistente inteligente não retornou uma resposta.');
  }

  let result;
  try {
    result = JSON.parse(rawReply);
  } catch {
    console.error('[api/chat] O Gemini retornou JSON inválido.');
    throw new Error('O assistente inteligente retornou uma resposta inválida.');
  }

  const reply = typeof result.reply === 'string' ? result.reply.trim() : '';
  const suggestions = Array.isArray(result.suggestions)
    ? result.suggestions
        .filter((suggestion) => typeof suggestion === 'string')
        .map((suggestion) => suggestion.trim())
        .filter((suggestion) => suggestion.length > 0 && suggestion.length <= 80)
        .slice(0, 3)
    : [];

  if (!reply || suggestions.length !== 3) {
    console.error('[api/chat] O Gemini retornou dados de resposta fora do formato esperado.');
    throw new Error('O assistente inteligente retornou uma resposta inválida.');
  }

  return { reply, suggestions };
}

async function handleSocketMessage(socket, raw, isBinary) {
  let requestId;
  try {
    if (isBinary || raw.length > MAX_BODY_BYTES) {
      throw new Error('A mensagem enviada é inválida ou excede o limite.');
    }

    const body = JSON.parse(raw.toString());
    requestId = body?.requestId;
    if (
      typeof requestId !== 'string' ||
      requestId.length > 64 ||
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body) ||
      !validateContents(body.contents)
    ) {
      throw new Error('A conversa enviada é inválida ou excede os limites.');
    }

    const contents = body.contents.slice(-MAX_HISTORY_ITEMS);
    while (contents[0]?.role === 'model') contents.shift();
    if (contents.length === 0 || contents.at(-1)?.role !== 'user') {
      throw new Error('Envie uma pergunta para iniciar a conversa.');
    }

    const result = await generateReply(contents);
    sendSocketMessage(socket, { type: 'reply', requestId, ...result });
  } catch (error) {
    if (error.message.includes('Gemini') || error.message.includes('assistente inteligente')) {
      console.error('[api/chat]', error.message);
    }
    sendSocketMessage(socket, {
      type: 'error',
      requestId,
      message: error.message || 'Não foi possível processar sua mensagem.',
    });
  }
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

const websocketServer = new WebSocketServer({
  noServer: true,
  maxPayload: MAX_BODY_BYTES,
});

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (pathname !== '/api/chat') {
    socket.write('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
    socket.destroy();
    return;
  }

  websocketServer.handleUpgrade(request, socket, head, (websocket) => {
    websocketServer.emit('connection', websocket, request);
  });
});

websocketServer.on('connection', (socket) => {
  let isProcessing = false;
  socket.on('message', async (raw, isBinary) => {
    if (isProcessing) {
      sendSocketMessage(socket, {
        type: 'error',
        message: 'Aguarde a resposta anterior antes de enviar outra mensagem.',
      });
      return;
    }

    isProcessing = true;
    try {
      await handleSocketMessage(socket, raw, isBinary);
    } finally {
      isProcessing = false;
    }
  });
});

server.listen(PORT, () => {
  console.log(`[api] rodando em http://localhost:${PORT}`);
  console.log('[api] WebSocket do chat disponível em /api/chat');
});
