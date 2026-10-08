import { useEffect, useRef, useState } from "react";
import {
  IconBrandWhatsapp,
  IconMessageCircle,
  IconRobot,
  IconSend,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { SITE, PLANOS } from "@/config/site";
import { createLocalReply } from "./chatbotResponses";

const MINIMUM_TYPING_TIME_MS = 1000;

const waitForMinimumTypingTime = async (startedAt) => {
  const remaining = MINIMUM_TYPING_TIME_MS - (Date.now() - startedAt);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
};

const createWhatsAppLink = (briefing) => {
  const fields = [
    ["Solução", briefing?.projectType],
    ["Negócio/público", briefing?.business],
    ["Objetivo", briefing?.goal],
    ["Recursos desejados", briefing?.features],
    ["Prazo desejado", briefing?.timeline],
  ].filter(([, value]) => value?.trim());
  const message = fields.length
    ? `Olá! Gostaria de conversar com a equipe da ${SITE.companyName} sobre um orçamento.\n\nResumo do projeto:\n${fields
        .map(([label, value]) => `• ${label}: ${value}`)
        .join("\n")}`
    : SITE.whatsappMessage;

  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const isContactSuggestion = (suggestion) =>
  /\b(whatsapp|atendente|humano|pessoa|falar com a equipe|conversar com a equipe|falar com algu[eé]m|conversar com algu[eé]m|contato)\b/i.test(suggestion);

/** @typedef {{ id: string, role: "user" | "assistant", text: string, suggestions?: string[] }} ChatMessage */

/** @returns {ChatMessage} */
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
  const [show, setShow] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const briefingRef = useRef(null);
  const currentWhatsAppLink = createWhatsAppLink(briefingRef.current);

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
    inputRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const sendMessage = async (text = draft) => {
    const question = text.trim();
    if (!question || isSending) return;

    if (isContactSuggestion(question)) {
      window.open(
        createWhatsAppLink(briefingRef.current),
        "_blank",
        "noopener,noreferrer"
      );
    }

    const startedAt = Date.now();
    /** @type {ChatMessage} */
    const userMessage = { id: crypto.randomUUID(), role: "user", text: question };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsSending(true);

    try {
      const result = createLocalReply(question, {
        SITE,
        PLANOS,
        briefing: briefingRef.current,
      });
      briefingRef.current = result.briefing;
      await waitForMinimumTypingTime(startedAt);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: result.reply,
          suggestions: result.suggestions,
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
                Atendimento inicial disponível
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
                            onClick={() => {
                              if (isContactSuggestion(suggestion)) {
                                window.open(
                                  createWhatsAppLink(briefingRef.current),
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                                return;
                              }
                              sendMessage(suggestion);
                            }}
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
                href={currentWhatsAppLink}
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
