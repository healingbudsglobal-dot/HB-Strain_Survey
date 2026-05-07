import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hbLogoJar from "@/assets/hb-logo-jar.png";
import heroFlower from "@/assets/hero-flower.jpg";

const STATUS_MESSAGES = [
  "Comparing your answers to our strain library…",
  "Analysing terpene compatibility…",
  "Matching cannabinoid ratios to your profile…",
  "Checking strain availability…",
  "Building your personalised result…",
  "Done.",
];

// DNA Helix component — geometric green dots spinning
const DnaHelix = () => {
  const dots = 12;
  return (
    <div className="relative h-32 w-16 mx-auto">
      {Array.from({ length: dots }).map((_, i) => {
        const progress = i / dots;
        const angle = progress * Math.PI * 3;
        const x1 = Math.sin(angle) * 24;
        const x2 = Math.sin(angle + Math.PI) * 24;
        const y = progress * 128;
        const delay = i * 0.08;
        return (
          <motion.div key={i} className="absolute left-1/2" style={{ top: y }}>
            {/* Strand 1 */}
            <motion.div
              className="absolute h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent-green))]"
              style={{ left: x1 - 5 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.7, 1.1, 0.7],
              }}
              transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Strand 2 */}
            <motion.div
              className="absolute h-2 w-2 rounded-full bg-[hsl(var(--brand-gold))]"
              style={{ left: x2 - 4 }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.6, 1, 0.6],
              }}
              transition={{ duration: 1.8, delay: delay + 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Connector line */}
            <motion.div
              className="absolute h-px top-1"
              style={{
                left: Math.min(x1, x2) - 4,
                width: Math.abs(x1 - x2) + 8,
                background: `linear-gradient(90deg, hsl(var(--accent-green) / 0.3), hsl(var(--brand-gold) / 0.2))`,
              }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

const LoadingScreen = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(95), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Crisp backdrop — tint + film grain (no blur) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,hsl(180_8%_7%_/_0.85)_80%)]" />
        <div className="absolute inset-0 bg-[hsl(var(--primary-green)_/_0.15)]" style={{ mixBlendMode: "overlay" }} />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      {/* DNA Helix animation */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Outer spinning ring */}
        <div className="absolute -inset-4 rounded-full border border-[hsl(var(--accent-green)_/_0.15)]" style={{ animation: "spin 8s linear infinite" }} />
        <DnaHelix />
        {/* Logo centered over helix */}
        <span className="absolute inset-0 flex items-center justify-center">
          <motion.img
            src={hbLogoJar}
            alt="HB"
            className="h-8 w-auto drop-shadow-lg"
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>

      <h2 className="font-display text-xl font-bold tracking-[0.02em] text-foreground mb-4 text-glow sm:text-2xl">
        Finding Your Match…
      </h2>

      {/* Cycling status messages */}
      <div className="h-12 relative w-full max-w-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`text-sm absolute inset-x-0 ${
              msgIndex === STATUS_MESSAGES.length - 1
                ? "font-bold text-[hsl(var(--accent-green))]"
                : "text-muted-foreground"
            }`}
          >
            {STATUS_MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-56 h-1.5 rounded-full bg-[hsl(var(--surface-elevated))] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[3000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: `${progressWidth}%`,
            background: "linear-gradient(90deg, hsl(var(--primary-green)), hsl(var(--accent-green)), hsl(var(--brand-gold)))",
          }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
