import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { IconMenu2 as Menu, IconX as X } from "@tabler/icons-react";
import { SITE, whatsappLink } from "@/config/site";
import Logo from "./Logo";

const LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Valores", href: "#valores" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Scroll spy: destaca a seção visível.
      const sections = LINKS.map((l) => l.href.slice(1));
      let current = "#inicio";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = "#" + id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-forest-soft"
          : "bg-transparent"
      }`}
    >
      <nav
        className={`mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}
      >
        <a href="#inicio" aria-label={SITE.companyName}>
          <Logo />
        </a>

        {/* Desktop */}
        <ul className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                className={`relative px-3.5 py-2 text-sm rounded-lg transition-colors duration-200 ${
                  active === l.href ? "text-bio" : "text-muted-soft hover:text-white"
                }`}
              >
                {l.label}
              </a>
              {active === l.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-bio"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#14803C] hover:bg-[#22C55E] text-white text-sm font-semibold transition-colors duration-200"
          >
            Fale com a gente
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-white"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-navigation" className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-forest-soft">
          <ul className="px-5 py-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base transition-colors ${
                    active === l.href
                      ? "text-bio bg-[#0B3D2E]/40"
                      : "text-muted-soft hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 rounded-xl bg-[#14803C] hover:bg-[#22C55E] text-white font-semibold transition-colors"
              >
                Fale com a gente
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
