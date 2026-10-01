import React from "react";
import { motion } from "motion/react";
import { IconEye as Eye, IconUserShare as Handshake, IconTarget as Target } from "@tabler/icons-react";

const PILARES = [
  {
    icon: Target,
    titulo: "Transparência",
    desc: "Escopo claro, sem surpresas. Você sabe exatamente o que está pagando e recebendo.",
  },
  {
    icon: Handshake,
    titulo: "Proximidade",
    desc: "Atendimento humano e presencial. Falamos a sua língua, não a língua da tecnologia.",
  },
  {
    icon: Eye,
    titulo: "Resultado",
    desc: "Medimos o sucesso pelo problema que resolvemos, não pelo código que escrevemos.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="relative bg-carbon py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-bio text-sm font-semibold uppercase tracking-wider">
              Sobre
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
              Tecnologia a serviço do seu negócio.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-muted-soft leading-relaxed">
              <p>
                Nascemos para resolver problemas reais de empresas reais. Não
                acreditamos em soluções genéricas — cada negócio tem sua própria
                forma de trabalhar, e a tecnologia precisa se adaptar a ela, e
                não o contrário.
              </p>
              <p>
                Nossa missão é simples: entender de perto o que atrapalha o seu
                crescimento e construir a ferramenta certa para destravar isso.
                Por isso todo projeto de site começa com um encontro presencial.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-1 gap-5">
            {PILARES.map((p, i) => (
              <div
                key={p.titulo}
                data-anim="fade-right"
                data-delay={i * 100}
                className="group flex gap-5 rounded-2xl border border-forest-soft bg-[#141414] p-6 hover:border-[#22C55E]/40 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#0B3D2E]/50 border border-forest-soft flex items-center justify-center text-bio group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                  <p.icon size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{p.titulo}</h3>
                  <p className="mt-1.5 text-muted-soft leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
