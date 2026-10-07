import React from "react";
import { motion } from "framer-motion";
import {
  IconCode as Code2,
  IconWorld as Globe,
  IconArrowRight as ArrowRight,
  IconMapPin as MapPin,
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
  IconClock as Clock,
  IconSparkles as Sparkles,
  IconRocket,
} from "@tabler/icons-react";
import TiltCard from "@/components/animations/TiltCard";

const BLOCOS = [
  {
    icon: Code2,
    tag: "// Software",
    badge: "Mais procurado",
    titulo: "Software para empresas",
    subtitulo: "Automatize, organize e escale sua operação.",
    descricao:
      "Sistemas de gestão, automações e ferramentas internas que organizam a sua operação e economizam tempo da equipe.",
    metrica: {
      valor: "-40%",
      label: "em tarefas manuais",
    },
    beneficios: [
      { icon: Settings, texto: "Sistemas de gestão sob medida" },
      { icon: Robot, texto: "Automação de tarefas repetitivas" },
      { icon: Users, texto: "Ferramentas internas para a equipe" },
      { icon: Plug, texto: "Integrações com o que você já usa" },
      { icon: ChartBar, texto: "Painéis e relatórios claros" },
      { icon: IconRocket, texto: "Melhora de Softwares já existentes" },
    ],
    entrega: "Entrega em 3–7 semanas",
    cta: "Quero saber mais",
  },
  {
    icon: Globe,
    tag: "// Web",
    badge: "Alta conversão",
    titulo: "Criação de sites",
    subtitulo: "Coloque sua empresa na internet e gere clientes.",
    descricao:
      "Sites institucionais, landing pages e lojas virtuais que colocam sua empresa na internet e geram novos clientes.",
    metrica: {
      valor: "3x",
      label: "mais leads qualificados",
    },
    beneficios: [
      { icon: Laptop, texto: "Sites institucionais e landing pages" },
      { icon: Cart, texto: "Lojas virtuais prontas para vender" },
      { icon: Mobile, texto: "Design responsivo e moderno" },
      { icon: Search, texto: "Otimização para o Google" },
      { icon: Whatsapp, texto: "Integração com WhatsApp e redes" },
    ],
    destaque:
      "Todo projeto começa com uma reunião presencial para entendermos exatamente o que você precisa.",
    entrega: "Entrega em 2–5 semanas",
    cta: "Quero saber mais",
  },
];

export default function Solutions() {
  return (
    <section id="solucoes" className="relative bg-obsidian py-24 sm:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30" />

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
            Duas formas de destravar o seu negócio.
          </h2>
          <p className="mt-4 text-muted-soft leading-relaxed">
            Escolha por onde começar. Nos dois caminhos, você sai com algo
            funcionando — não com um PowerPoint.
          </p>
        </motion.div>

        {/* Grid simétrico */}
        <div className="mt-14 grid lg:grid-cols-2 gap-6">
          {BLOCOS.map((b, i) => (
            <TiltCard key={b.titulo} className="h-full">
              <div
                data-anim="fade-up"
                data-delay={i * 100}
                className="group relative rounded-3xl border border-forest-soft bg-[#111111] p-7 sm:p-9 flex flex-col h-full overflow-hidden
                  hover:border-[#22C55E]/50 hover:-translate-y-1
                  hover:shadow-[0_20px_60px_-20px_rgba(34,197,94,0.25)]
                  transition-all duration-500 ease-out"
              >
                {/* Número gigante de fundo */}
                <div className="absolute -top-6 -right-2 text-[10rem] font-black text-[#22C55E]/[0.04] leading-none select-none pointer-events-none">
                  0{i + 1}
                </div>

                {/* Badge de destaque */}
                {b.badge && (
                  <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/40 text-bio text-[11px] font-semibold uppercase tracking-wider">
                    <Sparkles size={12} />
                    {b.badge}
                  </div>
                )}

                {/* Ícone solto + tag */}
                <div className="relative flex items-center gap-3">
                  <b.icon
                    size={26}
                    className="text-bio group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-bio/70 font-mono">
                    {b.tag}
                  </span>
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

                {/* Métrica em destaque */}
                {b.metrica && (
                  <div className="relative mt-6 flex items-baseline gap-3 p-4 rounded-2xl bg-[#0B3D2E]/30 border border-[#22C55E]/20">
                    <span className="text-3xl sm:text-4xl font-black text-bio leading-none">
                      {b.metrica.valor}
                    </span>
                    <span className="text-sm text-muted-soft">
                      {b.metrica.label}
                    </span>
                  </div>
                )}

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

                {/* Destaque opcional */}
                {b.destaque && (
                  <div className="relative mt-6 flex items-start gap-3 p-4 rounded-xl bg-[#0B3D2E]/40 border border-[#22C55E]/30">
                    <MapPin
                      size={18}
                      className="text-bio flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-white leading-relaxed">
                      <span className="font-semibold text-bio">
                        Diferencial:{" "}
                      </span>
                      {b.destaque}
                    </p>
                  </div>
                )}

                {/* Tempo de entrega */}
                {b.entrega && (
                  <div className="relative mt-6 flex items-center gap-2 text-xs text-muted-soft/80">
                    <Clock size={14} className="text-bio/70" />
                    {b.entrega}
                  </div>
                )}

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
                    className="group-hover/cta:translate-x-1 transition-transform duration-200"
                  />
                </a>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}