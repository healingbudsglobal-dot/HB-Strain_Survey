import { motion } from "framer-motion";
import heroFlower from "@/assets/hero-flower.jpg";

/**
 * Crystal-clear hero image with a dark emerald-glass overlay.
 * Tint + scrim opacities are driven by CSS variables so they adapt to:
 *  - prefers-contrast: more         → darker, higher-contrast plate
 *  - prefers-color-scheme: light    → brighter ambient → darken plate to keep white text legible
 *  - dynamic-range: high (HDR/OLED) → slightly lighter plate so image still reads
 */
const HeroBackdrop = () => (
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
      /* Bright ambient (user prefers light UI) → darken plate so white text stays readable */
      @media (prefers-color-scheme: light) {
        .hero-backdrop {
          --tint-a: 0.72;
          --vignette-a: 0.7;
          --scrim-top-a: 0.55;
          --scrim-bot-a: 0.88;
          --img-brightness: 0.85;
        }
      }
      /* User explicitly wants more contrast → push everything harder */
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
      /* HDR / wide-gamut OLED → image punches harder, ease the plate slightly */
      @media (dynamic-range: high) {
        .hero-backdrop {
          --tint-a: 0.5;
          --vignette-a: 0.5;
        }
      }
      /* Small screens are usually held closer at high brightness → bump contrast a touch */
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
      animate={{ scale: 1.0, x: "-50%", y: "-50%" }}
      transition={{ duration: 32, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />

    {/* Dark emerald glass tint */}
    <div className="absolute inset-0" style={{ background: "hsl(165 55% 6% / var(--tint-a))" }} />

    {/* Radial vignette */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 85% at 50% 50%, transparent 35%, hsl(170 50% 3% / var(--vignette-a)) 80%, hsl(180 50% 2% / 0.9) 100%)",
      }}
    />

    {/* Top + bottom legibility scrims */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to bottom, hsl(180 45% 3% / var(--scrim-top-a)), transparent, hsl(180 50% 2% / var(--scrim-bot-a)))",
      }}
    />

    {/* Faint film grain — kills banding */}
    <div
      className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  </motion.div>
);

export default HeroBackdrop;
