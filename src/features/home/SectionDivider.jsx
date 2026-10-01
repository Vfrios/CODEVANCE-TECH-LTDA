import React from "react";

// Divisor entre seções: linha fina de brilho verde que se revela na rolagem.
// Substitui cortes retos por uma transição orgânica e luminosa.
export default function SectionDivider() {
  return (
    <div className="relative z-10" aria-hidden="true">
      <div data-anim="fade-right" className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#22C55E]/30 to-transparent" />
      </div>
    </div>
  );
}
