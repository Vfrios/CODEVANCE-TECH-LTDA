import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconBrandWhatsapp,
  IconMessageCircle,
  IconRobot,
  IconSend,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { SITE, PLANOS, whatsappLink } from "@/config/site";
import { getFallbackReply, getQuickReply } from "./chatbotFallback";

const MINIMUM_TYPING_TIME_MS = 1000;
const SOCKET_CONNECT_TIMEOUT_MS = 10000;

const waitForMinimumTypingTime = async (startedAt) => {
  const remaining = MINIMUM_TYPING_TIME_MS - (Date.now() - startedAt);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
};

const makeGreeting = () => ({
  id: "greeting",
  role: "assistant",
  text: `Oi! 👋 Sou o assistente virtual da ${SITE.companyName}. Posso tirar suas dúvidas sobre sites, sistemas, valores e prazos. Como posso ajudar?`,
  suggestions: [
    "Quais serviços vocês fazem?",
    "Quanto custa um projeto?",
    "Qual é o prazo?",
    "Quero falar com alguém",
  ],
});

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([makeGreeting()]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [show, setShow] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef([]);
  const socketRef = useRef(null);
  const pendingRequestRef = useRef(null);
  const socketCleanupRef = useRef(null);

  const connectSocket = useCallback(() => {
    const existingSocket = socketRef.current;
    if (
      existingSocket &&
      [WebSocket.CONNECTING, WebSocket.OPEN].includes(existingSocket.readyState)
    ) {
      return existingSocket;
    }

    let socket;
    try {
      const apiUrl = new URL(import.meta.env.VITE_API_URL || window.location.origin, window.location.href);
      apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
      apiUrl.pathname = "/api/chat";
      apiUrl.search = "";
      apiUrl.hash = "";
      socket = new WebSocket(apiUrl);
      socketRef.current = socket;
    } catch (error) {
      console.error("[chat] Não foi possível iniciar a conexão:", error);
      setSocketReady(false);
      return null;
    }

    const rejectPendingRequest = (message) => {
      const pending = pendingRequestRef.current;
      if (!pending) return;
      clearTimeout(pending.timeout);
      pendingRequestRef.current = null;
      pending.reject(new Error(message));
    };

    const onOpen = () => setSocketReady(true);
    const onMessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        rejectPendingRequest("Resposta inválida.");
        return;
      }

      const pending = pendingRequestRef.current;
      if (!pending || data.requestId !== pending.requestId) return;
      clearTimeout(pending.timeout);
      pendingRequestRef.current = null;
      if (data.type === "reply") pending.resolve(data);
      else pending.reject(new Error(data.message || "Assistente indisponível."));
    };
    const onError = () => {
      setSocketReady(false);
      rejectPendingRequest("Conexão indisponível.");
    };
    const onClose = () => {
      setSocketReady(false);
      rejectPendingRequest("Conexão encerrada.");
      if (socketRef.current === socket) socketRef.current = null;
    };
    const cleanup = () => {
      rejectPendingRequest("Conversa encerrada.");
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("error", onError);
      socket.removeEventListener("close", onClose);
      if (socketRef.current === socket) socketRef.current = null;
      socket.close();
    };

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);
    socket.addEventListener("error", onError);
    socket.addEventListener("close", onClose);
    socketCleanupRef.current = cleanup;
    return socket;
  }, []);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
    }
  }, [isOpen, messages, isSending]);

  useEffect(() => {
    if (!isOpen) return undefined;
    connectSocket();
    return () => {
      socketCleanupRef.current?.();
      socketCleanupRef.current = null;
      setSocketReady(false);
    };
  }, [connectSocket, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const requestAssistant = useCallback(async (contents) => {
    let socket = connectSocket();
    if (!socket) throw new Error("Conexão indisponível.");

    if (socket.readyState === WebSocket.CONNECTING) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error("Tempo limite para conectar."));
        }, SOCKET_CONNECT_TIMEOUT_MS);
        const onOpen = () => {
          cleanup();
          resolve();
        };
        const onFailure = () => {
          cleanup();
          reject(new Error("Conexão indisponível."));
        };
        const cleanup = () => {
          clearTimeout(timeout);
          socket.removeEventListener("open", onOpen);
          socket.removeEventListener("error", onFailure);
          socket.removeEventListener("close", onFailure);
        };
        socket.addEventListener("open", onOpen);
        socket.addEventListener("error", onFailure);
        socket.addEventListener("close", onFailure);
      });
      socket = socketRef.current;
    }

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error("Conexão indisponível.");
    }

    return new Promise((resolve, reject) => {
      const requestId = crypto.randomUUID();
      const timeout = setTimeout(() => {
        if (pendingRequestRef.current?.requestId !== requestId) return;
        pendingRequestRef.current = null;
        reject(new Error("O assistente demorou para responder."));
      }, 50_000);
      pendingRequestRef.current = { requestId, resolve, reject, timeout };

      try {
        socket.send(JSON.stringify({ requestId, contents }));
      } catch (error) {
        clearTimeout(timeout);
        pendingRequestRef.current = null;
        reject(error);
      }
    });
  }, [connectSocket]);

  const sendMessage = async (text = draft, { isQuickReply = false } = {}) => {
    const question = text.trim();
    if (!question || isSending) return;

    const startedAt = Date.now();
    const userMessage = { id: crypto.randomUUID(), role: "user", text: question };
    const nextConversation = isQuickReply
      ? conversationRef.current
      : [...conversationRef.current, { role: "user", parts: [{ text: question }] }].slice(-12);
    if (!isQuickReply) conversationRef.current = nextConversation;
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsSending(true);

    if (isQuickReply) {
      const { reply, suggestions } = getQuickReply(question, { SITE, PLANOS });
      await waitForMinimumTypingTime(startedAt);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", text: reply, suggestions },
      ]);
      setIsSending(false);
      inputRef.current?.focus();
      return;
    }

    try {
      const data = await requestAssistant(nextConversation);
      if (
        typeof data.reply !== "string" ||
        !data.reply.trim() ||
        !Array.isArray(data.suggestions) ||
        data.suggestions.length === 0
      ) {
        throw new Error("O assistente retornou uma resposta inválida.");
      }

      const reply = data.reply.trim();
      await waitForMinimumTypingTime(startedAt);
      conversationRef.current = [
        ...nextConversation,
        { role: "model", parts: [{ text: reply }] },
      ].slice(-12);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: reply,
          suggestions: data.suggestions,
        },
      ]);
    } catch (error) {
      console.error("[chat] Pergunta encaminhada para a resposta local:", error);
      const { reply, suggestions } = getFallbackReply(question, { SITE, PLANOS });
      await waitForMinimumTypingTime(startedAt);
      conversationRef.current = [
        ...nextConversation,
        { role: "model", parts: [{ text: reply }] },
      ].slice(-12);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: reply,
          suggestions,
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 transition-all duration-500 ${
        show
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-90 pointer-events-none"
      }`}
    >
      {isOpen && (
        <section
          id="codevance-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="codevance-chat-title"
          className="absolute bottom-[4.5rem] right-0 flex h-[min(620px,calc(100dvh-8rem))] w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101713] shadow-2xl shadow-black/60 sm:bottom-[5rem]"
        >
          <header className="flex items-center gap-3 bg-[#0B3D2E] px-4 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-green-300">
              <IconRobot size={25} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="codevance-chat-title" className="text-sm font-bold text-white">
                Assistente CodeVance
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-green-100/80">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                {socketReady ? "Assistente conectado" : "Conectando ao assistente..."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar conversa"
              className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <IconX size={20} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={messagesContainerRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-full flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <p
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#14803C] text-white"
                      : "rounded-bl-md border border-white/5 bg-[#1A211D] text-gray-100"
                    }`}
                  >
                    {message.text}
                  </p>
                  {message.role === "assistant" &&
                    message.suggestions?.length > 0 &&
                    message.id === messages.at(-1)?.id &&
                    !isSending && (
                      <div className="mt-3 flex w-full flex-wrap gap-2">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            disabled={isSending}
                            onClick={() => sendMessage(suggestion, { isQuickReply: true })}
                            className="min-h-10 min-w-0 max-w-full flex-[1_1_145px] whitespace-normal break-words rounded-2xl border border-green-400/25 bg-green-400/5 px-3 py-2 text-left text-xs font-medium leading-snug text-green-200 transition hover:bg-green-400/15 disabled:opacity-50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2" role="status" aria-label="Assistente digitando">
                <span className="rounded-2xl rounded-bl-md border border-white/5 bg-[#1A211D] px-4 py-3">
                  <span className="flex items-center gap-1">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="h-2 w-2 animate-bounce rounded-full bg-green-300"
                        style={{ animationDelay: `${dot * 150}ms` }}
                      />
                    ))}
                  </span>
                </span>
                <span className="sr-only">Assistente digitando...</span>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-white/10 px-3 pb-3 pt-3">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <label className="sr-only" htmlFor="codevance-chat-input">
                Escreva sua pergunta
              </label>
              <input
                id="codevance-chat-input"
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={1000}
                placeholder="Escreva sua pergunta..."
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#1A211D] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-green-500/60"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                aria-label="Enviar mensagem"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#14803C] text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconSend size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <IconSparkles size={14} aria-hidden="true" />
                Assistente virtual
              </span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-green-300 transition hover:text-green-200"
              >
                <IconBrandWhatsapp size={16} aria-hidden="true" />
                Falar com a equipe
              </a>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Fechar assistente virtual" : "Abrir assistente virtual"}
        aria-expanded={isOpen}
        aria-controls="codevance-chat-panel"
        className="group flex items-center gap-2.5 rounded-full bg-[#14803C] px-4 py-3.5 text-white shadow-lg transition hover:bg-bio glow-green-sm"
      >
        {isOpen ? (
          <IconX size={24} aria-hidden="true" />
        ) : (
          <>
            <IconMessageCircle size={26} aria-hidden="true" />
            <span className="text-sm font-semibold">Tire suas dúvidas</span>
          </>
        )}
      </button>
    </div>
  );
}
