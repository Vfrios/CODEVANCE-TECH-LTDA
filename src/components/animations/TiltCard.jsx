// @ts-ignore
import React, { useRef } from "react";

// Inclinação 3D sutil que segue o mouse (tilt).
// Desativada em telas de toque (sem hover/pointer fino) e com prefers-reduced-motion.
// @ts-ignore
export default function TiltCard({ children, className = "", max = 5 }) {
  const ref = useRef(null);
  const enabled =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // @ts-ignore
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    // @ts-ignore
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -2 * max;
    const ry = (px - 0.5) * 2 * max;
    // @ts-ignore
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const reset = () => {
    if (ref.current)
      // @ts-ignore
      ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={enabled ? onMove : undefined}
      onMouseLeave={enabled ? reset : undefined}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
