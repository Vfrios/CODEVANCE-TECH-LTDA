import React from "react";

// ============================================================
// Faixa de indicadores com contadores animados (data-count).
// Os números sobem de 0 até o valor final quando entram na tela.
// Edite os valores abaixo para atualizar a faixa inteira.
// ============================================================
const STATS = [
  { count: 50, prefix: "+", suffix: "", label: "Projetos entregues" },
  { count: 100, prefix: "", suffix: "%", label: "Atendimento presencial" },
  { count: 5, prefix: "", suffix: " anos", label: "De experiência" },
  { count: 24, prefix: "", suffix: "h", label: "Retorno no contato" },
];

export default function Stats() {
  return (
    <section className="relative bg-carbon py-14 sm:py-16 border-y border-forest-soft">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <div key={s.label} data-anim="fade-up" data-delay={i * 90} className="text-center">
            <p className="font-heading text-3xl sm:text-4xl font-bold text-bio">
              <span data-count={s.count} data-prefix={s.prefix} data-suffix={s.suffix}>
                {s.prefix}
                {s.count}
                {s.suffix}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
