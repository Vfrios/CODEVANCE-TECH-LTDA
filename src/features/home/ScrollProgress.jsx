import React, { useEffect, useRef } from "react";

// Barra de progresso de rolagem fixa no topo, com gradiente verde.
// A largura cresce de 0% a 100% conforme a rolagem (via transform scaleX).
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      el.style.transform = `scaleX(${Math.min(Math.max(p, 0), 1)})`;
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
    <div className="fixed top-0 inset-x-0 z-[60] pointer-events-none" aria-hidden="true">
      <div ref={ref} className="scroll-progress w-full" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
