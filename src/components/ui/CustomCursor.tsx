import { useEffect } from "react";
import { sfx } from "@/lib/utils/sfx";

export function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const style = document.createElement("style");
    style.id = "aq-custom-cursor-style";
    style.textContent = `
      body, html, *, *::before, *::after { cursor: none !important; }

      .aq-cursor-element {
        position: fixed;
        top: 0; left: 0;
        z-index: 999999;
        pointer-events: none;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate3d(-50%, -50%, 0);
        opacity: 0;
        mix-blend-mode: difference;
      }

      #aq-cursor-ring {
        width: 38px;
        height: 38px;
        background: transparent;
        border: 2px solid rgba(255, 255, 255, 0.8);
        transition: width 0.22s ease, height 0.22s ease, border 0.22s ease, opacity 0.3s ease;
      }

      #aq-cursor-dot {
        border-radius: 50%;
        width: 6px;
        height: 6px;
        background: white;
      }
      
      .aq-cursor-trail {
        width: 14px;
        height: 14px;
        background: rgba(255, 255, 255, 0.3);
      }

      #aq-cursor-ring.visible { opacity: 1; }
      .aq-cursor-trail.visible { opacity: 1; }

      #aq-cursor-ring.hovered {
        width: 60px;
        height: 60px;
        border-color: rgba(255, 255, 255, 1);
        border-width: 1px;
      }

      #aq-cursor-ring.clicking {
        width: 30px;
        height: 30px;
        background: rgba(255, 255, 255, 0.2);
      }
    `;
    document.head.appendChild(style);

    const ring = document.createElement("div");
    ring.id = "aq-cursor-ring";
    ring.className = "aq-cursor-element";
    const dot = document.createElement("div");
    dot.id = "aq-cursor-dot";
    ring.appendChild(dot);
    document.body.appendChild(ring);

    const trailDots: HTMLDivElement[] = [];
    const TRAIL_COUNT = 4;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const tDot = document.createElement("div");
      tDot.className = "aq-cursor-element aq-cursor-trail";
      tDot.style.opacity = "0";
      tDot.style.transform = `scale(${1 - i * 0.18})`;
      document.body.appendChild(tDot);
      trailDots.push(tDot);
    }

    let raf: number;
    let mx = -200,
      my = -200;
    const positions = Array(TRAIL_COUNT).fill({ x: -200, y: -200 });

    let lastMx = -200,
      lastMy = -200;
    let lastTime = performance.now();

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      ring.classList.add("visible");
      trailDots.forEach((t) => t.classList.add("visible"));
    };

    const animate = () => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);

      const dx = mx - lastMx;
      const dy = my - lastMy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const velocity = dist / dt;

      const stretch = Math.min(velocity * 0.5, 1.8);
      const scaleX = 1 + stretch;
      const scaleY = Math.max(1 - stretch * 0.5, 0.3);
      const angle = Math.atan2(dy, dx);
      const finalRotate = velocity > 0.05 ? angle : 0;

      ring.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) rotate(${finalRotate}rad) scaleX(${velocity > 0.05 ? scaleX : 1}) scaleY(${velocity > 0.05 ? scaleY : 1})`;

      if (dt > 16) {
        if (velocity > 0.8) {
          sfx.playSwoosh(Math.min(velocity / 4, 1.0));
        }
        lastMx = mx;
        lastMy = my;
        lastTime = now;
      }

      let currentX = mx;
      let currentY = my;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const pos = positions[i];
        // Increased "fluidity" (lower lerp)
        pos.x += (currentX - pos.x) * 0.25;
        pos.y += (currentY - pos.y) * 0.25;
        trailDots[i].style.transform =
          `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${1 - i * 0.15})`;
        trailDots[i].style.opacity = `${0.6 - i * 0.12}`;
        currentX = pos.x;
        currentY = pos.y;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [role='button']"))
        ring.classList.add("hovered");
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [role='button']"))
        ring.classList.remove("hovered");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", () => ring.classList.add("clicking"));
    document.addEventListener("mouseup", () => ring.classList.remove("clicking"));

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      ring.remove();
      trailDots.forEach((t) => t.remove());
      style.remove();
    };
  }, []);

  return null;
}
