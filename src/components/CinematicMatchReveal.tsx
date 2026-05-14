import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, animate, useTransform } from "framer-motion";

interface CinematicMatchRevealProps {
  /** Final compatibility 0-100 */
  value: number;
  /** Strain name typed under the ring */
  strainName: string;
  /** Delay before the reveal starts (s) */
  startDelay?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const RADIUS = 58;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Cinematic strain-match moment:
 *  - mint glow bloom
 *  - dual ring stroke (track + gradient progress)
 *  - count-up percentage
 *  - strain name typewriter
 *  - subtle lift on settle
 */
const CinematicMatchReveal = ({ value, strainName, startDelay = 0.1 }: CinematicMatchRevealProps) => {
  const reduced = useReducedMotion();
  const target = Math.max(0, Math.min(100, Math.round(value)));

  // Animated count
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  // Animated ring offset
  const offset = useMotionValue(CIRC);
  const [offsetState, setOffsetState] = useState(CIRC);

  // Typewriter
  const [typed, setTyped] = useState(reduced ? strainName : "");

  useEffect(() => {
    const unsubCount = rounded.on("change", (v) => setDisplay(v));
    const unsubOff = offset.on("change", (v) => setOffsetState(v));
    return () => { unsubCount(); unsubOff(); };
  }, [rounded, offset]);

  useEffect(() => {
    if (reduced) {
      setDisplay(target);
      setOffsetState(CIRC * (1 - target / 100));
      return;
    }
    const ringAnim = animate(offset, CIRC * (1 - target / 100), {
      duration: 1.6, delay: startDelay, ease: EASE,
    });
    const numAnim = animate(count, target, {
      duration: 1.5, delay: startDelay + 0.05, ease: EASE,
    });
    return () => { ringAnim.stop(); numAnim.stop(); };
  }, [target, startDelay, reduced, count, offset]);

  // Typewriter effect for strain name
  const typeStartRef = useRef<number | null>(null);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const totalMs = Math.max(420, strainName.length * 55);
    const begin = (startDelay + 1.0) * 1000;
    const tick = (now: number) => {
      if (typeStartRef.current === null) typeStartRef.current = now;
      const elapsed = now - typeStartRef.current - begin;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const ratio = Math.min(1, elapsed / totalMs);
      const chars = Math.round(strainName.length * ratio);
      setTyped(strainName.slice(0, chars));
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [strainName, startDelay, reduced]);

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: startDelay }}
      className="relative flex flex-col items-center justify-center py-2"
    >
      {/* Mint glow bloom */}
      <motion.div
        aria-hidden
        initial={reduced ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.85, 0.45], scale: [0.6, 1.4, 1.15] }}
        transition={{ duration: 1.8, delay: startDelay + 0.2, ease: EASE, times: [0, 0.55, 1] }}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--accent-green) / 0.55) 0%, hsl(var(--accent-green) / 0.18) 35%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      {/* Ring + number */}
      <div className="relative h-[160px] w-[160px]">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="cmr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent-green))" />
              <stop offset="100%" stopColor="hsl(var(--lime-green))" />
            </linearGradient>
            <filter id="cmr-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle cx="70" cy="70" r={RADIUS} fill="none"
            stroke="hsl(var(--accent-green) / 0.15)" strokeWidth="6" />
          {/* Progress */}
          <circle cx="70" cy="70" r={RADIUS} fill="none"
            stroke="url(#cmr-grad)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={offsetState}
            filter="url(#cmr-glow)" />
        </svg>
        {/* Centered count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: startDelay + 0.1, ease: EASE }}
            className="font-display text-5xl font-extrabold leading-none text-foreground tabular-nums tracking-tight text-etched-strong"
            style={{ textShadow: "0 0 24px hsl(var(--accent-green) / 0.45)" }}
          >
            {display}
            <span className="ml-0.5 text-2xl font-bold text-[hsl(var(--accent-green))] align-top">%</span>
          </motion.span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Bio-Match
          </span>
        </div>
      </div>

      {/* Strain name typewriter */}
      <motion.div
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: startDelay + 0.95, ease: EASE }}
        className="mt-3 flex items-baseline justify-center"
      >
        <span className="font-display text-xl font-bold text-foreground">
          {typed}
          {!reduced && typed.length < strainName.length && (
            <span className="ml-0.5 inline-block h-[0.9em] w-[2px] -mb-0.5 bg-[hsl(var(--accent-green))] animate-pulse align-middle" />
          )}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default CinematicMatchReveal;
