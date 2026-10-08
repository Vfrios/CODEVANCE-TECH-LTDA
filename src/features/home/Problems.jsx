import React from "react";
import { motion } from "motion/react";
import { IconSearch as Search, IconClipboardList as ClipboardList, IconMapPinned as MapPinned, IconRepeat as Repeat, IconClock as Clock, IconTrendingDown as TrendingDown } from "@tabler/icons-react";

const PROBLEMS = [
  {
    icon: Search,
    problema: "As pessoas têm dificuldade para encontrar sua empresa",
    solucao:
      "Um site organizado ajuda clientes a conhecer seu trabalho e encontrar seus contatos.",
  },
  {
    icon: ClipboardList,
    problema: "Processos feitos à mão e planilhas confusas",
    solucao:
      "Mapeamos o processo com sua equipe e avaliamos o que pode ser automatizado.",
  },
  {
    icon: MapPinned,
    problema: "O primeiro contato com clientes é complicado",
    solucao:
      "Organizamos as informações e os caminhos de contato para facilitar a conversa.",
  },
  {
    icon: Repeat,
    problema: "Retrabalho e erros por falta de organização",
    solucao:
      "Um sistema pode reunir as informações importantes em um só lugar.",
  },
  {
    icon: Clock,
    problema: "Processos lentos que atrasam a sua equipe",
    solucao:
      "Ferramentas adequadas podem simplificar etapas que hoje tomam tempo da equipe.",
  },
  {
    icon: TrendingDown,
    problema: "Perda de vendas por falta de follow-up",
    solucao:
      "Um fluxo de acompanhamento ajuda sua equipe a manter cada conversa organizada.",
  },
];

export default function Problems() {
  return (
    <section className="relative bg-carbon py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-bio text-sm font-semibold uppercase tracking-wider">
            Onde a tecnologia pode ajudar
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
            O que está dificultando o dia a dia da sua empresa?
          </h2>
          <p className="mt-4 text-lg text-muted-soft">
            Cada empresa trabalha de um jeito. A conversa inicial ajuda a entender
            o contexto antes de sugerir qualquer solução.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map((p, i) => (
            <div
              key={p.problema}
              data-anim="fade-up"
              data-delay={(i % 3) * 90}
              className="group rounded-2xl border border-forest-soft bg-[#141414] p-6 hover:border-[#22C55E]/40 hover:bg-[#0B3D2E]/20 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/50 border border-forest-soft flex items-center justify-center text-bio group-hover:bg-[#14803C] group-hover:text-white transition-colors duration-300">
                <p.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white leading-snug">
                {p.problema}
              </h3>
              <p className="mt-3 text-muted-soft text-[15px] leading-relaxed">
                {p.solucao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
