import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import heroFlower from "@/assets/hero-flower.jpg";

/**
 * Crystal-clear hero image with a dark emerald-glass overlay.
 * Adapts to runtime FPS — when frames drop below ~45fps for ~1s we shed:
 *   - the grain layer (mix-blend-overlay, expensive on cheap GPUs)
 *   - the slow scale animation on the image (keeps it static)
 * If FPS recovers above ~55fps we re-enable. Also respects prefers-reduced-motion.
 */
const HeroBackdrop = () => {
  const reduceMotion = useReducedMotion();
  const [lite, setLite] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setLite(true);
      return;
    }
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    let slowWindows = 0;
    let fastWindows = 0;
    let stopped = false;

    const tick = (now: number) => {
      frames++;
      const elapsed = now - last;
      if (elapsed >= 1000) {
        const fps = (frames * 1000) / elapsed;
        frames = 0;
        last = now;
        if (fps < 45) {
          slowWindows++;
          fastWindows = 0;
          if (slowWindows >= 1) setLite(true);
        } else if (fps > 55) {
          fastWindows++;
          slowWindows = 0;
          if (fastWindows >= 3) setLite(false);
        }
      }
      if (!stopped) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <motion.div
      aria-hidden
      className="hero-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <style>{`
        .hero-backdrop {
          --tint-a: 0.55;
          --vignette-a: 0.55;
          --scrim-top-a: 0.45;
          --scrim-bot-a: 0.78;
          --img-contrast: 1.18;
          --img-brightness: 0.95;
        }
        @media (prefers-color-scheme: light) {
          .hero-backdrop {
            --tint-a: 0.72;
            --vignette-a: 0.7;
            --scrim-top-a: 0.55;
            --scrim-bot-a: 0.88;
            --img-brightness: 0.85;
          }
        }
        @media (prefers-contrast: more) {
          .hero-backdrop {
            --tint-a: 0.78;
            --vignette-a: 0.78;
            --scrim-top-a: 0.6;
            --scrim-bot-a: 0.92;
            --img-contrast: 1.28;
            --img-brightness: 0.8;
          }
        }
        @media (dynamic-range: high) {
          .hero-backdrop {
            --tint-a: 0.5;
            --vignette-a: 0.5;
          }
        }
        @media (max-width: 640px) {
          .hero-backdrop {
            --tint-a: calc(var(--tint-a) + 0.05);
            --img-contrast: 1.22;
          }
        }
      `}</style>

      <motion.img
        src={heroFlower}
        alt=""
        className="absolute top-1/2 left-1/2 w-[145vw] h-[145vh] max-w-none object-cover"
        style={{
          transform: "translate(-50%, -50%)",
          filter: "saturate(1.15) contrast(var(--img-contrast)) brightness(var(--img-brightness))",
        }}
        initial={{ scale: 1.12, x: "-50%", y: "-50%" }}
        animate={lite ? { scale: 1.05, x: "-50%", y: "-50%" } : { scale: 1.0, x: "-50%", y: "-50%" }}
        transition={
          lite
            ? { duration: 0 }
            : { duration: 32, ease: "linear", repeat: Infinity, repeatType: "reverse" }
        }
      />

      <div className="absolute inset-0" style={{ background: "hsl(165 55% 6% / var(--tint-a))" }} />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 85% at 50% 50%, transparent 35%, hsl(170 50% 3% / var(--vignette-a)) 80%, hsl(180 50% 2% / 0.9) 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(180 45% 3% / var(--scrim-top-a)), transparent, hsl(180 50% 2% / var(--scrim-bot-a)))",
        }}
      />

      {/* Film grain — dropped in lite mode (mix-blend-overlay is expensive on low-end GPUs) */}
      {!lite && (
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      )}
    </motion.div>
  );
};

export default HeroBackdrop;
