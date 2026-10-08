import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { IconMessageCircle as MessageCircle, IconUserShare as Handshake, IconFileText as FileText, IconCode as Code2, IconConfetti as PartyPopper } from "@tabler/icons-react";

const PASSOS = [
  {
    n: 1,
    icon: MessageCircle,
    titulo: "Contato inicial",
    desc: "Você fala com a gente pelo WhatsApp ou e-mail e nos conta o que precisa.",
  },
  {
    n: 2,
    icon: Handshake,
    titulo: "Encontro presencial",
    desc: "Alinhamos objetivos e escopo em uma conversa presencial para projetos de site.",
    destaque: true,
  },
  {
    n: 3,
    icon: FileText,
    titulo: "Proposta e orçamento",
    desc: "Apresentamos uma proposta com escopo, etapas e valores definidos.",
  },
  {
    n: 4,
    icon: Code2,
    titulo: "Desenvolvimento com acompanhamento",
    desc: "Construímos a solução mantendo você próximo do processo.",
  },
  {
    n: 5,
    icon: PartyPopper,
    titulo: "Entrega, treinamento e suporte",
    desc: "Entregamos pronto, treinamos sua equipe e damos suporte depois.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const sec = sectionRef.current;
      if (!sec) {
        ticking = false;
        return;
      }
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progresso da seção na viewport (0 = entrou, 1 = saiu).
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const progress = Math.max(0, Math.min(1, passed / total));

      // Preenchimento da linha conectora (desktop horizontal / mobile vertical).
      const fills = sec.querySelectorAll("[data-timeline-fill]");
      fills.forEach((el) => {
        const dir = el.getAttribute("data-timeline-fill");
        if (dir === "x") el.style.width = `${(progress * 100).toFixed(1)}%`;
        else el.style.height = `${(progress * 100).toFixed(1)}%`;
      });

      // Passo ativo: o último cujo topo cruzou 55% da viewport.
      const steps = sec.querySelectorAll("[data-step]");
      let idx = -1;
      steps.forEach((s, i) => {
        if (s.getBoundingClientRect().top < vh * 0.55) idx = i;
      });
      setActiveIdx(idx);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="relative bg-carbon py-24 sm:py-32 overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-[#0B3D2E]/20 blur-[140px]"
        data-parallax="0.12"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-bio text-sm font-semibold uppercase tracking-wider">
            Como funciona
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
            Um processo simples, do primeiro contato à entrega.
          </h2>
          <p className="mt-4 text-lg text-muted-soft">
            O processo começa entendendo o contexto e termina com uma solução
            entregue, explicada e pronta para uso.
          </p>
        </motion.div>

        <div className="mt-16 relative">
          {/* Linha base + preenchida — desktop (horizontal) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/20 to-transparent" />
          <div
            data-timeline-fill="x"
            className="hidden lg:block absolute top-12 left-0 h-px bg-gradient-to-r from-[#0B3D2E] to-[#22C55E]"
            style={{ width: "0%" }}
          />

          {/* Linha base + preenchida — mobile (vertical) */}
          <div className="lg:hidden absolute left-[46px] top-0 bottom-0 w-px bg-[#22C55E]/20" />
          <div
            data-timeline-fill="y"
            className="lg:hidden absolute left-[46px] top-0 w-px bg-gradient-to-b from-[#0B3D2E] to-[#22C55E]"
            style={{ height: "0%" }}
          />

          <div className="grid gap-6 lg:grid-cols-5">
            {PASSOS.map((p, i) => {
              const isActive = activeIdx === i;
              return (
                <div
                  key={p.n}
                  data-step
                  className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                    p.destaque
                      ? "bg-[#0B3D2E]/40 border-[#22C55E]/40"
                      : `bg-[#141414] border-forest-soft ${
                          isActive ? "border-[#22C55E]/50" : ""
                        }`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        p.destaque
                          ? "bg-[#22C55E] text-[#06130D] border border-[#86EFAC]"
                          : isActive
                          ? "bg-[#22C55E] text-[#06130D] border border-[#86EFAC]"
                          : "bg-[#0B3D2E] text-[#4ADE80] border border-[#22C55E]/60"
                      }`}
                    >
                      <p.icon size={20} />
                    </div>
                    <span
                      className={`font-heading text-3xl font-bold transition-colors duration-300 ${
                          isActive ? "text-[#86EFAC]/70" : "text-white/25"
                      }`}
                    >
                      0{p.n}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-muted-soft leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
