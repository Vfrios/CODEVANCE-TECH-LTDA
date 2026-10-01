import React from "react";
import { motion } from "motion/react";
import { Search, ClipboardList, MapPinned, Repeat, Clock, TrendingDown } from "lucide-react";

const PROBLEMS = [
  {
    icon: Search,
    problema: "Sua empresa não aparece no Google",
    solucao:
      "Criamos um site otimizado para que clientes te encontrem facilmente na internet.",
  },
  {
    icon: ClipboardList,
    problema: "Processos feitos à mão e planilhas confusas",
    solucao:
      "Automatizamos tarefas repetitivas com um sistema feito sob medida para o seu fluxo.",
  },
  {
    icon: MapPinned,
    problema: "Clientes que não conseguem te encontrar ou contratar online",
    solucao:
      "Colocamos seu negócio na internet com formas simples de contato e contratação.",
  },
  {
    icon: Repeat,
    problema: "Retrabalho e erros por falta de organização",
    solucao:
      "Centralizamos suas informações em um sistema que organiza tudo em um só lugar.",
  },
  {
    icon: Clock,
    problema: "Processos lentos que atrasam a sua equipe",
    solucao:
      "Agilizamos o dia a dia com ferramentas que economizam tempo e reduzem o erro.",
  },
  {
    icon: TrendingDown,
    problema: "Perda de vendas por falta de follow-up",
    solucao:
      "Criamos ferramentas que ajudam sua equipe a não perder nenhuma oportunidade.",
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
            Problemas que resolvemos
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
            Dores reais do seu negócio, soluções diretas.
          </h2>
          <p className="mt-4 text-lg text-muted-soft">
            Não vendemos tecnologia por vender. Entendemos o problema e
            construímos a solução certa para ele.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map((p, i) => (
            <div
              key={p.problema}
              data-anim="fade-up"
              data-delay={(i % 3) * 90}
              className="group rounded-2xl border border-forest-soft bg-[#141414] p-6 hover:border-[#22C55E]/40 hover:bg-[#0B3D2E]/20 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/50 border border-forest-soft flex items-center justify-center text-bio group-hover:bg-[#14803C] group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                <p.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white leading-snug">
                {p.problema}
              </h3>
              <p className="mt-3 text-muted-soft text-[15px] leading-relaxed">
                <span className="text-bio font-medium">Solução: </span>
                {p.solucao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
