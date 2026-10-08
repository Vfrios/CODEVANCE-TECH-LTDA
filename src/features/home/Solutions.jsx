import React from "react";
import { motion } from "motion/react";
import {
  IconCode as Code2,
  IconWorld as Globe,
  IconArrowRight as ArrowRight,
  IconSettings as Settings,
  IconRobot as Robot,
  IconUsers as Users,
  IconPlug as Plug,
  IconChartBar as ChartBar,
  IconDeviceLaptop as Laptop,
  IconShoppingCart as Cart,
  IconDeviceMobile as Mobile,
  IconSearch as Search,
  IconBrandWhatsapp as Whatsapp,
  IconRocket,
} from "@tabler/icons-react";

const BLOCOS = [
  {
    icon: Code2,
    titulo: "Software para empresas",
    subtitulo: "Ferramentas que se encaixam no seu processo.",
    descricao:
      "Sistemas de gestão, automações e ferramentas internas planejados a partir da rotina da sua equipe.",
    beneficios: [
      { icon: Settings, texto: "Sistemas de gestão sob medida" },
      { icon: Robot, texto: "Automação de tarefas repetitivas" },
      { icon: Users, texto: "Ferramentas internas para a equipe" },
      { icon: Plug, texto: "Integrações com o que você já usa" },
      { icon: ChartBar, texto: "Painéis e relatórios claros" },
      { icon: IconRocket, texto: "Melhorias em sistemas existentes" },
    ],
    cta: "Quero saber mais",
  },
  {
    icon: Globe,
    titulo: "Criação de sites",
    subtitulo: "Uma presença online clara e bem organizada.",
    descricao:
      "Sites institucionais, páginas de campanha e lojas virtuais com informações claras e caminhos simples para contato.",
    beneficios: [
      { icon: Laptop, texto: "Sites institucionais e landing pages" },
      { icon: Cart, texto: "Lojas virtuais prontas para vender" },
      { icon: Mobile, texto: "Design responsivo e moderno" },
      { icon: Search, texto: "Otimização para o Google" },
      { icon: Whatsapp, texto: "Integração com WhatsApp e redes" },
    ],
    cta: "Quero saber mais",
  },
];

export default function Solutions() {
  return (
    <section id="solucoes" className="relative bg-obsidian py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Cabeçalho da seção */}
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
            Como podemos ajudar sua empresa
          </h2>
          <p className="mt-4 text-muted-soft leading-relaxed">
            Trabalhamos com sites e sistemas. O primeiro passo é entender sua
            necessidade e combinar um escopo que faça sentido.
          </p>
        </motion.div>

        {/* Grid simétrico */}
        <div className="mt-14 grid lg:grid-cols-2 gap-6">
          {BLOCOS.map((b, i) => (
            <div key={b.titulo} className="h-full">
              <div
                data-anim="fade-up"
                data-delay={i * 100}
                className="group relative rounded-3xl border border-forest-soft bg-[#111111] p-7 sm:p-9 flex flex-col h-full overflow-hidden
                  hover:border-[#22C55E]/50
                  hover:shadow-[0_20px_60px_-20px_rgba(34,197,94,0.25)]
                  transition-colors duration-300"
              >
                <div className="relative flex items-center gap-3">
                  <b.icon size={26} className="text-bio" />
                </div>

                {/* Título + subtítulo */}
                <h3 className="relative mt-6 text-2xl sm:text-3xl font-bold text-white">
                  {b.titulo}
                </h3>
                <p className="relative mt-2 text-bio/90 text-sm font-medium">
                  {b.subtitulo}
                </p>
                <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#22C55E] to-transparent" />

                <p className="relative mt-4 text-muted-soft leading-relaxed">
                  {b.descricao}
                </p>

                {/* Lista de benefícios com ícones */}
                <ul className="relative mt-7 space-y-3 flex-1">
                  {b.beneficios.map((item) => (
                    <li
                      key={item.texto}
                      className="flex items-start gap-3 text-[15px] text-muted-soft"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                        <item.icon size={13} className="text-bio" />
                      </span>
                      <span className="pt-0.5">{item.texto}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA — neutro por padrão, forte no hover */}
                <a
                  href="#contato"
                  className="relative mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold
                    border border-[#14803C]/60 text-white
                    hover:bg-[#14803C] hover:border-[#14803C] hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.5)]
                    transition-all duration-200 group/cta"
                >
                  {b.cta}
                  <ArrowRight
                    size={18}
                    className="transition-colors duration-200"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}