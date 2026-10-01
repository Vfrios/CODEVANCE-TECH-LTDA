import React from "react";
import { motion } from "motion/react";
import { IconCheck as Check, IconCode as Code2, IconWorld as Globe, IconArrowRight as ArrowRight, IconMapPin as MapPin } from "@tabler/icons-react";
import TiltCard from "@/components/animations/TiltCard";

const BLOCOS = [
  {
    icon: Code2,
    titulo: "Software para empresas",
    descricao:
      "Sistemas de gestão, automações e ferramentas internas que organizam a sua operação e economizam tempo da equipe.",
    beneficios: [
      "Sistemas de gestão sob medida",
      "Automação de tarefas repetitivas",
      "Ferramentas internas para a equipe",
      "Integrações com o que você já usa",
      "Painéis e relatórios claros",
    ],
    cta: "Quero saber mais",
  },
  {
    icon: Globe,
    titulo: "Criação de sites",
    descricao:
      "Sites institucionais, landing pages e lojas virtuais que colocam sua empresa na internet e geram novos clientes.",
    beneficios: [
      "Sites institucionais e landing pages",
      "Lojas virtuais prontas para vender",
      "Design responsivo e moderno",
      "Otimização para o Google",
      "Integração com WhatsApp e redes",
    ],
    destaque:
      "Todo projeto começa com uma reunião presencial para entendermos exatamente o que você precisa.",
    cta: "Quero saber mais",
  },
];

export default function Solutions() {
  return (
    <section id="solucoes" className="relative bg-obsidian py-24 sm:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-bio text-sm font-semibold uppercase tracking-wider">
            Soluções
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
            Duas formas de destravar o seu negócio.
          </h2>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-2 gap-6">
          {BLOCOS.map((b, i) => (
            <TiltCard key={b.titulo} className="h-full">
            <div
              data-anim="fade-up"
              data-delay={i * 100}
              className="group relative rounded-3xl border border-forest-soft bg-[#111111] p-7 sm:p-9 flex flex-col h-full hover:border-[#22C55E]/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0B3D2E]/50 border border-forest-soft flex items-center justify-center text-bio group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <b.icon size={26} />
              </div>
              <h3 className="mt-6 text-2xl sm:text-3xl font-bold text-white">
                {b.titulo}
              </h3>
              <p className="mt-3 text-muted-soft leading-relaxed">
                {b.descricao}
              </p>

              <ul className="mt-7 space-y-3 flex-1">
                {b.beneficios.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-muted-soft">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#14803C] flex items-center justify-center">
                      <Check size={13} className="text-white" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {b.destaque && (
                <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-[#0B3D2E]/40 border border-[#22C55E]/30">
                  <MapPin size={18} className="text-bio flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white leading-relaxed">
                    <span className="font-semibold text-bio">Diferencial: </span>
                    {b.destaque}
                  </p>
                </div>
              )}

              <a
                href="#contato"
                className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#14803C]/60 hover:bg-[#14803C] hover:border-[#14803C] text-white font-semibold transition-all duration-200"
              >
                {b.cta}
                <ArrowRight size={18} />
              </a>
            </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
