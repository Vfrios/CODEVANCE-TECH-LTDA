import { useEffect } from "react";

// ============================================================
// SISTEMA DE ANIMAÇÕES DE ROLAGEM — CodeVance Tech
// Hook único, montado uma vez no topo da página (Home).
// Controla: revelação (data-anim), parallax (data-parallax),
// contadores (data-count) e fade do Hero (data-hero-fade).
// Ajuste os valores em CONFIG abaixo.
// ============================================================
const CONFIG = {
  revealThreshold: 0.15, // fração visível para revelar o elemento
  revealRootMargin: "0px 0px -8% 0px",
  counterDuration: 1800, // duração dos contadores (ms)
  counterThreshold: 0.4,
  parallaxOnMobile: false, // parallax desligado no celular
};

export default function useScrollAnimations() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Marca que o JS está ativo — só assim o estado oculto do data-anim se aplica.
    root.classList.add("js");
    if (reduce) root.classList.add("reduce-motion");

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const cleanups = [];

    // ---------- 1. Revelação por data-anim (IntersectionObserver) ----------
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = e.target.getAttribute("data-delay");
            if (delay) e.target.style.transitionDelay = `${delay}ms`;
            e.target.classList.add("is-visible");
            revealIO.unobserve(e.target);
          }
        });
      },
      { threshold: CONFIG.revealThreshold, rootMargin: CONFIG.revealRootMargin }
    );

    const observeReveal = (el) => {
      if (reduce) {
        el.classList.add("is-visible");
        return;
      }
      revealIO.observe(el);
    };
    const scanReveal = (ctx) =>
      (ctx || document).querySelectorAll("[data-anim]").forEach(observeReveal);
    scanReveal();
    cleanups.push(() => revealIO.disconnect());

    // ---------- 2. Contadores (data-count) ----------
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCounter(e.target);
            counterIO.unobserve(e.target);
          }
        });
      },
      { threshold: CONFIG.counterThreshold }
    );

    const runCounter = (el) => {
      if (reduce) return; // mantém o valor final já no DOM
      const target = parseFloat(el.getAttribute("data-count")) || 0;
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      const dur = CONFIG.counterDuration;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic (desacelera no fim)
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(tick);
    };
    const scanCounters = (ctx) =>
      (ctx || document)
        .querySelectorAll("[data-count]")
        .forEach((el) => counterIO.observe(el));
    scanCounters();
    cleanups.push(() => counterIO.disconnect());

    // ---------- 3. Parallax (data-parallax) + fade do Hero (data-hero-fade) ----------
    const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
    const fadeEls = Array.from(document.querySelectorAll("[data-hero-fade]"));
    const parallaxActive =
      !reduce &&
      !(isMobile && !CONFIG.parallaxOnMobile) &&
      (parallaxEls.length || fadeEls.length);

    if (parallaxActive) {
      let ticking = false;
      const update = () => {
        const vh = window.innerHeight;
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.getAttribute("data-parallax")) || 0;
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const offset = (center - vh / 2) * speed * -1;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
        fadeEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const scrolled = Math.max(0, -rect.top);
          const p = Math.min(scrolled / (vh * 0.8), 1);
          el.style.opacity = (1 - p * 0.85).toFixed(3);
          el.style.transform = `translate3d(0, ${(-p * 40).toFixed(1)}px, 0)`;
        });
        ticking = false;
      };
      update();
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      });
    }

    // ---------- 4. MutationObserver: pega elementos adicionados depois ----------
    // (ex.: troca de abas nos planos) e os observa.
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.hasAttribute && node.hasAttribute("data-anim")) observeReveal(node);
          if (node.hasAttribute && node.hasAttribute("data-count")) counterIO.observe(node);
          if (node.querySelectorAll) {
            node.querySelectorAll("[data-anim]").forEach(observeReveal);
            node.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));
          }
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => mo.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
