import React, { useEffect, useState } from "react";
import { IconMessageCircle as MessageCircle } from "@tabler/icons-react";
import { whatsappLink } from "@/config/site";

// Botão flutuante do WhatsApp: aparece só depois de rolar ~300px,
// mantendo o pulso leve já existente.
export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 group transition-all duration-500 ${
        show
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-90 pointer-events-none"
      }`}
    >
      <span className="relative flex items-center">
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
        <span className="relative flex items-center gap-2.5 pl-3.5 pr-4 py-3.5 rounded-full bg-[#14803C] group-hover:bg-bio text-white shadow-lg transition-all duration-200 glow-green-sm">
          <MessageCircle size={26} className="flex-shrink-0" />
          <span className="hidden sm:block text-sm font-semibold whitespace-nowrap max-w-0 group-hover:max-w-[200px] overflow-hidden transition-all duration-300">
            Fale conosco
          </span>
        </span>
      </span>
    </a>
  );
}
