import { useEffect } from "react";
import { sfx } from "@/lib/utils/sfx";

export function GlobalEffects() {
  useEffect(() => {
    // Initialize Audio Context cleanly on FIRST user interaction
    const initAudio = () => {
      sfx.init();
      const ctx = (sfx as any).getCtx?.();
      if (ctx && ctx.state === "suspended") ctx.resume();

      document.removeEventListener("mousedown", initAudio);
      document.removeEventListener("keydown", initAudio);
      document.removeEventListener("touchstart", initAudio);
    };

    document.addEventListener("mousedown", initAudio, { once: true });
    document.addEventListener("keydown", initAudio, { once: true });
    document.addEventListener("touchstart", initAudio, { once: true });

    const now = performance.now();
    console.log(`[AQ-DEBUG] GlobalEffects Active at: ${now.toFixed(2)}ms`);

    return () => {
      document.removeEventListener("mousedown", initAudio);
      document.removeEventListener("keydown", initAudio);
      document.removeEventListener("touchstart", initAudio);
    };
  }, []);

  return null;
}
