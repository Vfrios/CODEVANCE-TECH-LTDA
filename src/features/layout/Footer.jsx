import React from "react";
import { IconMessageCircle as MessageCircle, IconMail as Mail, IconBrandInstagram as Instagram, IconMapPin as MapPin } from "@tabler/icons-react";
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

export default function Footer() {
  return (
    <footer className="bg-[#070707] border-t border-forest-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a href="#inicio" aria-label={SITE.companyName}>
              <Logo variant="footer" />
            </a>
            <p className="mt-4 text-sm text-muted-soft max-w-xs leading-relaxed">
              Sites e sistemas desenvolvidos a partir da rotina de cada empresa.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Links rápidos
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-soft hover:text-bio transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contato
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-soft hover:text-bio transition-colors">
                  <MessageCircle size={16} className="text-bio" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 text-sm text-muted-soft hover:text-bio transition-colors">
                  <Mail size={16} className="text-bio" /> {SITE.email}
                </a>
              </li>
              <li>
                <a href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-soft hover:text-bio transition-colors">
                  <Instagram size={16} className="text-bio" /> @{SITE.instagram}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-soft">
                <MapPin size={16} className="text-bio" /> {SITE.city}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-forest-soft text-center">
          <p className="text-sm text-muted-soft">
            © {SITE.year} {SITE.companyName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
