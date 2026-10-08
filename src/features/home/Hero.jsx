import React from "react";
import { motion } from "motion/react";
import { IconMessageCircle as MessageCircle, IconArrowRight as ArrowRight, IconMapPin as MapPin, IconStack2 as Layers, IconLifebuoy as LifeBuoy } from "@tabler/icons-react";
import { whatsappLink } from "@/config/site";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const TRUST = [
  { icon: MapPin, label: "Atendimento presencial" },
  { icon: Layers, label: "Projetos sob medida" },
  { icon: LifeBuoy, label: "Suporte pós-entrega" },
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-obsidian"
    >
      <div data-hero-fade className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-28 pb-20 w-full">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            variants={fade}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 text-sm font-medium text-bio"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-bio" />
            Sites e sistemas para empresas
          </motion.span>

          <motion.h1
            variants={fade}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white"
          >
            Tecnologia feita para a rotina da sua empresa.
          </motion.h1>

          <motion.p
            variants={fade}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-6 mx-auto max-w-3xl text-lg sm:text-xl text-muted-soft leading-relaxed"
          >
            Desenvolvemos sites, sistemas e automações a partir de uma conversa
            sobre o que sua empresa precisa. Primeiro entendemos a rotina; depois,
            definimos juntos o que faz sentido construir.
          </motion.p>

          <motion.div
            variants={fade}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col sm:flex-row justify-center gap-4"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#14803C] hover:bg-[#22C55E] text-white font-semibold text-base transition-all duration-200 glow-green"
            >
              <MessageCircle size={20} />
              Conversar sobre meu projeto
            </a>
            <a
              href="#solucoes"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl border border-[#14803C]/60 hover:border-bio hover:bg-[#0B3D2E]/30 text-white font-semibold text-base transition-all duration-200"
            >
              Conhecer soluções
              <ArrowRight size={20} />
            </a>
          </motion.div>

          {/* Indicadores de confiança */}
          <motion.div
            variants={fade}
            custom={4}
            initial="hidden"
            animate="show"
            className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4"
          >
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-2.5 text-sm text-muted-soft">
                <t.icon size={18} className="text-bio" />
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
