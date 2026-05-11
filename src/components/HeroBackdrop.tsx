import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import heroEmeraldBud from "@/assets/hero-emerald-bud.jpg";

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
          /* Crystal-clear emerald-glass: sharp bud image, light tint, no blur */
          --tint-a: 0.12;
          --vignette-a: 0.30;
          --scrim-top-a: 0.16;
          --scrim-bot-a: 0.58;
          --img-contrast: 1.18;
          --img-brightness: 1.08;
          --img-saturate: 1.22;
        }
        @media (prefers-color-scheme: light) {
          .hero-backdrop {
            --tint-a: 0.18;
            --vignette-a: 0.38;
            --scrim-top-a: 0.22;
            --scrim-bot-a: 0.66;
            --img-brightness: 1.02;
          }
        }
        @media (prefers-contrast: more) {
          .hero-backdrop {
            --tint-a: 0.45;
            --vignette-a: 0.6;
            --scrim-top-a: 0.45;
            --scrim-bot-a: 0.86;
            --img-contrast: 1.22;
            --img-brightness: 0.92;
          }
        }
        @media (max-width: 640px) {
          .hero-backdrop {
            --tint-a: 0.14;
            --vignette-a: 0.34;
            --scrim-top-a: 0.18;
            --scrim-bot-a: 0.62;
          }
        }
      `}</style>

      <motion.img
        src={heroEmeraldBud}
        alt=""
        fetchPriority="high"
        decoding="async"
        width={1088}
        height={1920}
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{
          filter:
            "saturate(var(--img-saturate)) contrast(var(--img-contrast)) brightness(var(--img-brightness))",
        }}
        initial={{ scale: 1.05 }}
        animate={lite ? { scale: 1.02 } : { scale: 1.0 }}
        transition={
          lite
            ? { duration: 0 }
            : { duration: 36, ease: "linear", repeat: Infinity, repeatType: "reverse" }
        }
      />

      {/* Subtle mint bloom at center to lift trichomes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 42%, hsl(164 70% 55% / 0.10), transparent 70%)",
        }}
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
