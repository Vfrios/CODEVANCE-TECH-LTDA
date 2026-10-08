import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconCheck as Check } from "@tabler/icons-react";
import { PLANOS } from "@/config/site";

const TABS = [
  { key: "sites", label: "Sites" },
  { key: "software", label: "Software" },
];

export default function Pricing() {
  const [tab, setTab] = useState("sites");
  const planos = PLANOS[tab];

  return (
    <section id="valores" className="relative bg-obsidian py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-bio text-sm font-semibold uppercase tracking-wider">
            Valores
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
            Valores para começar a conversa.
          </h2>
          <p className="mt-4 text-lg text-muted-soft">
            Confira os valores iniciais. A proposta final depende do escopo e
            do que sua empresa precisa.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="mt-10 flex justify-center">
          <div role="group" aria-label="Tipo de projeto" className="inline-flex p-1.5 rounded-2xl bg-[#111111] border border-forest-soft">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-7 py-3 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                  tab === t.key ? "text-white" : "text-muted-soft hover:text-white"
                }`}
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-xl bg-[#14803C]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {planos.map((p, i) => (
              <div
                key={p.nome}
                data-anim="fade-up"
                data-delay={i * 90}
                className="relative rounded-3xl border border-forest-soft bg-[#111111] p-7 flex flex-col"
              >
                <h3 className="text-xl font-semibold text-white">{p.nome}</h3>
                <p className="mt-3 text-2xl sm:text-3xl font-bold text-bio font-heading">
                  {p.preco}
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.itens.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-soft">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#14803C] flex items-center justify-center">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contato"
                  className="mt-7 inline-flex items-center justify-center rounded-xl border border-[#14803C]/60 px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-[#14803C]"
                >
                  Solicitar orçamento
                </a>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="mt-10 text-center text-sm text-muted-soft max-w-2xl mx-auto">
          Os valores são referências iniciais. O orçamento é definido depois
          de entendermos o escopo do projeto.
        </p>
      </div>
    </section>
  );
}
