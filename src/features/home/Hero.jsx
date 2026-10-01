import React from "react";
import { motion } from "motion/react";
import { MessageCircle, ArrowRight, MapPin, Layers, LifeBuoy } from "lucide-react";
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
      {/* Fundo: grade + gradientes */}
      <div className="absolute inset-0 grid-pattern opacity-60" data-parallax="0.12" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]" />
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-[#0B3D2E]/40 blur-[120px]" data-parallax="0.25" />
      <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-[#14803C]/20 blur-[120px]" data-parallax="0.3" />

      <div data-hero-fade className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-20 grid lg:grid-cols-2 gap-12 lg:gap-10 items-center w-full">
        {/* Texto */}
        <div>
          <motion.span
            variants={fade}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-forest-soft bg-[#0B3D2E]/30 text-bio text-xs sm:text-sm font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-bio animate-pulse" />
            Resolução de problemas da sua empresa
          </motion.span>

          <motion.h1
            variants={fade}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white"
          >
            Qual problema da sua{" "}
            <span className="hero-highlight">empresa</span> podemos resolver hoje?
          </motion.h1>

          <motion.p
            variants={fade}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-6 text-lg sm:text-xl text-muted-soft max-w-xl leading-relaxed"
          >
            Criamos softwares e sites sob medida para destravar o crescimento do
            seu negócio. Sem jargões, sem promessas vazias — só soluções para
            dores reais.
          </motion.p>

          <motion.div
            variants={fade}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col sm:flex-row gap-4"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#14803C] hover:bg-[#22C55E] text-white font-semibold text-base transition-all duration-200 glow-green"
            >
              <MessageCircle size={20} />
              Falar no WhatsApp
            </a>
            <a
              href="#solucoes"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl border border-[#14803C]/60 hover:border-bio hover:bg-[#0B3D2E]/30 text-white font-semibold text-base transition-all duration-200"
            >
              Ver soluções
              <ArrowRight size={20} />
            </a>
          </motion.div>

          {/* Indicadores de confiança */}
          <motion.div
            variants={fade}
            custom={4}
            initial="hidden"
            animate="show"
            className="mt-12 flex flex-wrap gap-x-8 gap-y-4"
          >
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-2.5 text-sm text-muted-soft">
                <t.icon size={18} className="text-bio" />
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual SVG: rede de nós pulsante */}
        <motion.div
          variants={fade}
          custom={3}
          initial="hidden"
          animate="show"
          className="relative hidden lg:block"
        >
          <div className="relative aspect-square max-w-lg ml-auto">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full"
              role="img"
              aria-label="Diagrama abstrato representando a conexão entre problemas e soluções"
            >
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0B3D2E" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* anéis */}
              {[60, 110, 160].map((r, i) => (
                <circle
                  key={r}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke="#22C55E"
                  strokeOpacity={0.12}
                  strokeWidth="1"
                />
              ))}

              {/* linhas conectando nós */}
              {[
                [200, 40, 200, 200],
                [200, 200, 360, 200],
                [200, 200, 80, 320],
                [200, 200, 320, 300],
                [200, 200, 120, 120],
                [200, 200, 300, 100],
              ].map((l, i) => (
                <line
                  key={i}
                  x1={l[0]}
                  y1={l[1]}
                  x2={l[2]}
                  y2={l[3]}
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                />
              ))}

              {/* nós */}
              {[
                [200, 40],
                [360, 200],
                [80, 320],
                [320, 300],
                [120, 120],
                [300, 100],
                [200, 200],
              ].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="22" fill="url(#nodeGlow)" />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={i === 6 ? 7 : 4}
                    fill="#22C55E"
                    className="animate-float-slow"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                </g>
              ))}
            </svg>
            <div className="absolute inset-0 rounded-full bg-[#0B3D2E]/10 blur-3xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
