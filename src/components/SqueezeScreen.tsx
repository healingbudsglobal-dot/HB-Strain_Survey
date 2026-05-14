import { useState } from "react";
import { ArrowRight, Dna, Sparkles, Mail, MapPin, ChevronDown, Check, Lock } from "lucide-react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { validateEmail } from "@/lib/emailValidation";
import hbLogoWhite from "@/assets/hb-logo-white-full.svg";
import { BrandLogo } from "@/components/BrandLogo";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROVINCES = [
  "Western Cape", "Gauteng", "KwaZulu-Natal", "Eastern Cape",
  "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "N/A",
];

interface SqueezeScreenProps {
  onSubmit: (email: string, province: string, consent: { given: boolean; timestamp: string }) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

// Liquid form-up: droplets scatter, then merge into the card shape under an SVG goo filter
const formVariants = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 1.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const SqueezeScreen = ({ onSubmit }: SqueezeScreenProps) => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const disableAurora = reduceMotion || isMobile;
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const emailValid = validateEmail(email.trim()).valid;
  const emailFilled = email.length > 0;

  // Award-level cursor parallax — subtle tilt on the glass card
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotX = useSpring(useTransform(tiltY, [-0.5, 0.5], [2.2, -2.2]), { stiffness: 120, damping: 18, mass: 0.4 });
  const rotY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-2.6, 2.6]), { stiffness: 120, damping: 18, mass: 0.4 });
  const handleParallax = (e: React.PointerEvent<HTMLFormElement>) => {
    if (reduceMotion || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - r.left) / r.width - 0.5);
    tiltY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetParallax = () => { tiltX.set(0); tiltY.set(0); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const validation = validateEmail(trimmed);
    if (!validation.valid) {
      setError(validation.error || "Please enter a valid email address");
      return;
    }
    if (!province) {
      setError("Please select your province");
      return;
    }
    if (!agreed) {
      setError("Please confirm you're 18+ and agree to the Terms, Privacy Notice & disclaimer");
      return;
    }
    setError("");
    onSubmit(trimmed, province, { given: true, timestamp: new Date().toISOString() });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-10 text-center sm:px-8"
    >
      {/* Hero backdrop now lives at page root (Index.tsx) for true full-viewport coverage */}

      {/* Subtle green radial spotlight */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,hsl(var(--accent-green)_/_0.06)_0%,transparent_70%)]" />

      {/* Animated DNA helix accent — subtle floating element */}
      <motion.div
        className="pointer-events-none absolute top-[12%] right-[8%] opacity-[0.07]"
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Dna className="h-24 w-24 text-[hsl(var(--accent-green))]" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-[15%] left-[6%] opacity-[0.06]"
        animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Sparkles className="h-16 w-16 text-[hsl(var(--accent-green))]" />
      </motion.div>

      {/* Logo with nerve-signal shimmer (pink → pearl → green pulse across the mark) */}
      <motion.div variants={itemVariants} className="mb-8 relative">
        <div className="relative inline-block">
          <BrandLogo size="xl" vignette="strong" priority />

          {/* Nerve signal — masked to the logo silhouette so the pulse only paints the mark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
            style={{
              WebkitMaskImage: `url(${hbLogoWhite})`,
              maskImage: `url(${hbLogoWhite})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          >
            {/* Travelling synaptic gradient — pink ➜ pearl ➜ green, sweeping diagonally */}
            <div
              className="absolute -inset-x-1/2 inset-y-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 30%, hsl(330 90% 72% / 0.0) 36%, hsl(330 95% 72% / 0.95) 44%, hsl(0 0% 100% / 1) 50%, hsl(155 90% 62% / 0.95) 56%, hsl(155 90% 62% / 0) 64%, transparent 70%)",
                filter: "blur(0.4px)",
                mixBlendMode: "screen",
                animation: "nerveSweep 4.6s cubic-bezier(0.65,0.05,0.36,1) infinite",
              }}
            />
            {/* Trailing ember — slower, deeper green afterglow (desktop only) */}
            {!disableAurora && (
              <div
                className="absolute -inset-x-1/2 inset-y-0 opacity-70"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 42%, hsl(155 95% 55% / 0.55) 50%, transparent 58%)",
                  filter: "blur(2px)",
                  mixBlendMode: "screen",
                  animation: "nerveSweep 4.6s cubic-bezier(0.65,0.05,0.36,1) infinite",
                  animationDelay: "0.18s",
                }}
              />
            )}
            {/* Pink leading spark (desktop only) */}
            {!disableAurora && (
              <div
                className="absolute -inset-x-1/2 inset-y-0 opacity-80"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 38%, hsl(330 100% 78% / 0.7) 46%, transparent 54%)",
                  filter: "blur(2.5px)",
                  mixBlendMode: "screen",
                  animation: "nerveSweep 4.6s cubic-bezier(0.65,0.05,0.36,1) infinite",
                  animationDelay: "-0.15s",
                }}
              />
            )}
          </div>

          {/* Subtle synaptic flicker glow that pulses with the sweep (desktop only) */}
          {!disableAurora && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 50%, hsl(330 90% 65% / 0.18), transparent 55%), radial-gradient(ellipse at 80% 50%, hsl(155 90% 55% / 0.22), transparent 55%)",
                filter: "blur(28px)",
                transform: "scale(2)",
                animation: "nervePulse 4.6s ease-in-out infinite",
              }}
            />
          )}
        </div>
        <div
          className={`absolute inset-0 -z-10 rounded-full bg-[hsl(var(--accent-green)_/_0.18)] ${
            disableAurora ? "blur-2xl scale-[1.4]" : "blur-3xl scale-[2]"
          }`}
        />

        <style>{`
          @keyframes nerveSweep {
            0%   { transform: translateX(-65%); opacity: 0; }
            12%  { opacity: 1; }
            88%  { opacity: 1; }
            100% { transform: translateX(65%); opacity: 0; }
          }
          @keyframes nervePulse {
            0%, 100% { opacity: 0.35; }
            50%      { opacity: 0.85; }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="nerveSweep"], [style*="nervePulse"] { animation: none !important; }
          }
        `}</style>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="mb-4 font-display text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl text-etched-strong"
      >
        <span
          className="relative inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(160 25% 92%) 60%, hsl(164 35% 78%) 100%)",
            WebkitBackgroundClip: "text",
            // Embossed: top highlight + bottom shadow + soft outer glow
            filter: disableAurora
              ? "drop-shadow(0 -1px 0 hsl(164 60% 95% / 0.55)) drop-shadow(0 1px 0 hsl(180 60% 3% / 0.85))"
              : "drop-shadow(0 -1px 0 hsl(164 60% 95% / 0.55)) drop-shadow(0 1px 0 hsl(180 60% 3% / 0.85)) drop-shadow(0 2px 1px hsl(180 60% 3% / 0.55)) drop-shadow(0 0 22px hsl(164 60% 40% / 0.35))",
          }}
        >
          Discover your
        </span>
        <br />
        <span
          className="relative inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage: disableAurora
              ? "linear-gradient(180deg, hsl(164 75% 78%) 0%, hsl(164 85% 58%) 100%)"
              : "linear-gradient(110deg, hsl(164 55% 72%) 0%, hsl(164 85% 58%) 35%, hsl(180 75% 82%) 50%, hsl(164 85% 58%) 65%, hsl(164 55% 72%) 100%)",
            backgroundSize: disableAurora ? "100% 100%" : "200% 100%",
            animation: disableAurora ? "none" : "auroraShift 6s ease-in-out infinite",
            WebkitBackgroundClip: "text",
            filter: disableAurora
              ? "drop-shadow(0 -1px 0 hsl(164 80% 88% / 0.7)) drop-shadow(0 1px 0 hsl(180 70% 3% / 0.9))"
              : "drop-shadow(0 -1px 0 hsl(164 80% 88% / 0.7)) drop-shadow(0 1px 0 hsl(180 70% 3% / 0.9)) drop-shadow(0 2px 1px hsl(180 70% 3% / 0.6)) drop-shadow(0 0 28px hsl(164 80% 50% / 0.55))",
          }}
        >
          perfect match.
        </span>
        <style>{`
          @keyframes auroraShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes sheenSweep {
            0% { transform: translateX(-120%) skewX(-20deg); }
            100% { transform: translateX(220%) skewX(-20deg); }
          }
          @keyframes glassDrift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(8px, -6px) scale(1.04); }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-aurora], [data-sheen], [data-drift] { animation: none !important; }
          }
        `}</style>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-8 max-w-[22rem] text-[15px] leading-relaxed text-foreground/85 sm:text-base"
      >
        A 2-minute lifestyle quiz to explore botanical profiles tailored to you.
      </motion.p>

      {/* Form — cannabinoid molecules + neural pathways converge into the card */}
      <div className="relative w-full max-w-sm">
        {/* Cannabinoid + neural form-up overlay */}
        <motion.svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
          viewBox="0 0 400 480"
          preserveAspectRatio="none"
          aria-hidden
          initial="alive"
          animate="absorbed"
          variants={{
            alive: { opacity: 1 },
            absorbed: { opacity: 0, transition: { delay: 2.0, duration: 0.5 } },
          }}
        >
          <defs>
            {/* Glow blur — molecules and synaptic pulses bleed soft mint light */}
            <filter id="neural-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Cannabinoid molecule — hexagon with bond-tail (CBD/THC backbone vibe) */}
            <symbol id="cannabinoid" viewBox="-20 -20 40 40">
              <polygon
                points="14,0 7,12 -7,12 -14,0 -7,-12 7,-12"
                fill="none"
                stroke="hsl(164 80% 60%)"
                strokeWidth="1.6"
              />
              <circle cx="14" cy="0" r="2" fill="hsl(38 90% 60%)" />
              <circle cx="-14" cy="0" r="2" fill="hsl(164 70% 70%)" />
              <circle cx="7" cy="12" r="1.5" fill="hsl(180 60% 75%)" />
              <circle cx="-7" cy="-12" r="1.5" fill="hsl(180 60% 75%)" />
            </symbol>
            {/* Neural pulse gradient travelling along synaptic paths */}
            <linearGradient id="synapse-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(164 80% 60% / 0)" />
              <stop offset="50%" stopColor="hsl(164 90% 70% / 0.95)" />
              <stop offset="100%" stopColor="hsl(38 90% 65% / 0)" />
            </linearGradient>
          </defs>

          {/* Synaptic pathways — drawn first so molecules sit on top.
              Each path snakes from a molecule's incoming position toward an anchor point on the card outline. */}
          {[
            { d: "M -40,40   C 60,20  140,80  200,40", delay: 0.4 },
            { d: "M 440,60   C 340,40 260,100 200,60", delay: 0.5 },
            { d: "M -30,240  C 70,200 140,260 200,240", delay: 0.55 },
            { d: "M 430,260  C 330,220 260,280 200,260", delay: 0.6 },
            { d: "M -20,440  C 80,420 140,380 200,440", delay: 0.65 },
            { d: "M 420,420  C 320,400 260,360 200,420", delay: 0.7 },
            { d: "M 200,-30  C 200,80 200,180 200,240", delay: 0.45 },
            { d: "M 200,510  C 200,400 200,300 200,260", delay: 0.5 },
          ].map((p, i) => (
            <g key={i} filter="url(#neural-glow)">
              {/* Static dim trace */}
              <motion.path
                d={p.d}
                fill="none"
                stroke="hsl(164 60% 55%)"
                strokeWidth="1"
                strokeOpacity="0.45"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: p.delay, ease: [0.65, 0, 0.35, 1] }}
              />
              {/* Travelling pulse — bright dash sliding along path */}
              <motion.path
                d={p.d}
                fill="none"
                stroke="url(#synapse-pulse)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="40 600"
                initial={{ strokeDashoffset: 600, opacity: 0 }}
                animate={{ strokeDashoffset: -200, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.1,
                  delay: p.delay + 0.15,
                  ease: "easeOut",
                  times: [0, 0.2, 0.85, 1],
                }}
              />
            </g>
          ))}

          {/* Card outline — drawn by light, the "solid form" the network resolves into */}
          <motion.rect
            x="2"
            y="2"
            width="396"
            height="476"
            rx="28"
            ry="28"
            fill="none"
            stroke="hsl(164 85% 60%)"
            strokeWidth="1.4"
            filter="url(#neural-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0.6] }}
            transition={{ duration: 1.0, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Floating cannabinoid molecules — drift in, snap to anchor points, then fade as card materialises */}
          {[
            { from: { x: -60, y: 30 }, to: { x: 0, y: 40 }, delay: 0.05 },
            { from: { x: 460, y: 50 }, to: { x: 400, y: 40 }, delay: 0.1 },
            { from: { x: -50, y: 240 }, to: { x: 0, y: 240 }, delay: 0.15 },
            { from: { x: 450, y: 250 }, to: { x: 400, y: 260 }, delay: 0.2 },
            { from: { x: -40, y: 450 }, to: { x: 0, y: 440 }, delay: 0.25 },
            { from: { x: 440, y: 430 }, to: { x: 400, y: 420 }, delay: 0.3 },
            { from: { x: 200, y: -40 }, to: { x: 200, y: 0 }, delay: 0.0 },
            { from: { x: 200, y: 520 }, to: { x: 200, y: 480 }, delay: 0.35 },
          ].map((m, i) => (
            <motion.g
              key={i}
              initial={{ x: m.from.x, y: m.from.y, opacity: 0, scale: 0.4 }}
              animate={{
                x: [m.from.x, m.to.x, m.to.x],
                y: [m.from.y, m.to.y, m.to.y],
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1, 1.1, 0.6],
                rotate: [0, 60, 120],
              }}
              transition={{
                duration: 1.6,
                delay: m.delay,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.45, 0.85, 1],
              }}
            >
              <use href="#cannabinoid" filter="url(#neural-glow)" />
            </motion.g>
          ))}
        </motion.svg>

        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className={`relative z-10 flex w-full flex-col gap-3 overflow-hidden rounded-[28px] py-5 pr-5 pl-7 border transition-[border-color,box-shadow] duration-500 ${
            focused ? "border-[hsl(164_80%_60%_/_0.35)]" : "border-white/[0.10]"
          }`}
          onPointerMove={handleParallax}
          onPointerLeave={resetParallax}
          style={{
            background:
              "linear-gradient(155deg, hsl(180 30% 10% / 0.55) 0%, hsl(178 35% 7% / 0.65) 50%, hsl(170 40% 6% / 0.7) 100%)",
            backdropFilter: disableAurora ? "blur(12px) saturate(130%)" : "blur(24px) saturate(160%)",
            WebkitBackdropFilter: disableAurora ? "blur(12px) saturate(130%)" : "blur(24px) saturate(160%)",
            boxShadow: focused
              ? "0 40px 90px -20px hsl(180 40% 2% / 0.7), 0 0 0 1px hsl(164 80% 55% / 0.18), 0 0 60px -12px hsl(164 80% 55% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.10), inset 0 -1px 0 hsl(180 50% 5% / 0.4)"
              : "0 40px 90px -20px hsl(180 40% 2% / 0.7), inset 0 1px 0 hsl(0 0% 100% / 0.08), inset 0 -1px 0 hsl(180 50% 5% / 0.4)",
            animation: "liquidBreathe 7s ease-in-out infinite",
            transformPerspective: 1100,
            rotateX: rotX as unknown as number,
            rotateY: rotY as unknown as number,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Ambient drifting conic sheen — desktop only */}
          {!disableAurora && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0deg, hsl(164 80% 70% / 0.35) 60deg, transparent 120deg, transparent 240deg, hsl(180 70% 60% / 0.25) 300deg, transparent 360deg)",
                animation: "glassSheen 18s linear infinite",
                filter: "blur(40px)",
              }}
            />
          )}
          {/* Filmic grain — premium texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />
          {/* Focus ripple — radial pulse from center when input gains focus */}
          {focused && (
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(164 80% 60% / 0.5), transparent 70%)",
                animation: "liquidRipple 1.6s ease-out infinite",
              }}
            />
          )}
        {/* Chromatic blobs — soft mint + amber resin glow inside the glass */}
        <div
          aria-hidden
          data-drift
          className="pointer-events-none absolute -top-16 -left-12 h-44 w-44 rounded-full opacity-60 mix-blend-screen"
          style={{
            background: "radial-gradient(circle, hsl(164 85% 55% / 0.45) 0%, transparent 65%)",
            filter: disableAurora ? "blur(16px)" : "blur(28px)",
            animation: disableAurora ? "none" : "glassDrift 14s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          data-drift
          className="pointer-events-none absolute -bottom-20 -right-10 h-52 w-52 rounded-full opacity-50 mix-blend-screen"
          style={{
            background: "radial-gradient(circle, hsl(38 90% 60% / 0.35) 0%, transparent 65%)",
            filter: disableAurora ? "blur(18px)" : "blur(32px)",
            animation: disableAurora ? "none" : "glassDrift 18s ease-in-out infinite reverse",
          }}
        />
        {/* Top sheen — wet highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.35), transparent)",
          }}
        />

        {/* ====== AMBIENT NEURON WATERMARK — subtle dendrite tracery behind fields ====== */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-screen"
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <g fill="none" stroke="hsl(164 70% 65%)" strokeWidth="0.6">
            <path d="M 60 80 Q 120 140 90 220 T 130 380 Q 110 460 160 540" />
            <path d="M 340 60 Q 280 130 320 230 T 270 400 Q 300 480 250 560" />
            <path d="M 200 40 Q 180 120 220 200 T 180 360 Q 220 440 200 540" />
            <path d="M 90 220 L 140 240" /><path d="M 320 230 L 270 250" />
            <path d="M 130 380 L 180 360" /><path d="M 270 400 L 220 380" />
          </g>
          <g fill="hsl(164 80% 70%)">
            <circle cx="60" cy="80" r="2" /><circle cx="340" cy="60" r="2" />
            <circle cx="90" cy="220" r="1.6" /><circle cx="320" cy="230" r="1.6" />
            <circle cx="200" cy="40" r="1.8" /><circle cx="160" cy="540" r="2" />
            <circle cx="250" cy="560" r="2" /><circle cx="130" cy="380" r="1.6" />
            <circle cx="270" cy="400" r="1.6" />
          </g>
        </svg>

        {/* ====== SIGNAL RAIL — left-edge neural wire that lights up as fields complete ====== */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-1.5 top-6 bottom-24 w-3 z-[2]"
          viewBox="0 0 12 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="rail-pulse" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(164 90% 70% / 0)" />
              <stop offset="50%" stopColor="hsl(164 95% 75% / 1)" />
              <stop offset="100%" stopColor="hsl(38 90% 65% / 0)" />
            </linearGradient>
            <filter id="rail-glow" x="-100%" y="-50%" width="300%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Static dim rail */}
          <path d="M 6 10 L 6 390" stroke="hsl(164 50% 50% / 0.25)" strokeWidth="1" />
          {/* Lit segments per completed step */}
          <motion.path d="M 6 10 L 6 140" stroke="hsl(164 85% 60%)" strokeWidth="1.6" filter="url(#rail-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: emailValid ? 1 : 0, opacity: emailValid ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
          <motion.path d="M 6 140 L 6 270" stroke="hsl(164 85% 60%)" strokeWidth="1.6" filter="url(#rail-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: emailValid && province ? 1 : 0, opacity: emailValid && province ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
          <motion.path d="M 6 270 L 6 390" stroke="hsl(38 90% 65%)" strokeWidth="1.6" filter="url(#rail-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: agreed ? 1 : 0, opacity: agreed ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
          {/* Travelling pulse on most recent activation */}
          {(emailValid || province || agreed) && (
            <motion.circle
              key={`${emailValid}-${province}-${agreed}`}
              cx="6"
              r="2.5"
              fill="hsl(50 100% 85%)"
              filter="url(#rail-glow)"
              initial={{ cy: 10, opacity: 0 }}
              animate={{
                cy: agreed ? 390 : province ? 270 : emailValid ? 140 : 10,
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.15, 0.85, 1] }}
            />
          )}
          {/* Three nodes — one per field */}
          {[
            { cy: 10, lit: emailValid },
            { cy: 140, lit: emailValid },
            { cy: 270, lit: emailValid && !!province },
            { cy: 390, lit: agreed },
          ].map((n, i) => (
            <circle
              key={i}
              cx="6"
              cy={n.cy}
              r={n.lit ? 3.5 : 2.5}
              fill={n.lit ? (i === 3 ? "hsl(38 95% 70%)" : "hsl(164 90% 70%)") : "hsl(170 30% 35%)"}
              filter={n.lit ? "url(#rail-glow)" : undefined}
              style={{ transition: "fill 0.3s, r 0.3s" }}
            />
          ))}
        </svg>


        {/* ====== EMAIL — floating label, live mint icon ====== */}
        <div className="relative">
          <input
            id="email-field"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="peer w-full rounded-2xl border border-white/[0.08] bg-[hsl(180_25%_4%_/_0.55)] pl-12 pr-12 pt-6 pb-3 text-[17px] text-foreground placeholder-transparent focus:outline-none focus:ring-[3px] focus:ring-[hsl(164_80%_55%_/_0.25)] focus:border-[hsl(164_80%_55%_/_0.6)] transition-all backdrop-blur-md"
            style={{ boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06), inset 0 -1px 0 hsl(180 50% 5% / 0.4)" }}
            required
            aria-describedby="email-hint"
          />
          {/* floating label */}
          <label
            htmlFor="email-field"
            className={`pointer-events-none absolute left-12 transition-all duration-200 ${
              focused || emailFilled
                ? "top-2 text-[11px] font-medium text-[hsl(164_70%_65%)] tracking-wide uppercase"
                : "top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground"
            }`}
          >
            Your email
          </label>
          {/* left icon — pulses on focus, becomes check on valid */}
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center">
            <motion.div
              key={emailValid ? "check" : "mail"}
              initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {emailValid ? (
                <Check className="h-5 w-5 text-[hsl(164_80%_60%)]" strokeWidth={2.5} />
              ) : (
                <Mail className={`h-5 w-5 transition-colors ${focused ? "text-[hsl(164_70%_65%)]" : "text-muted-foreground/70"}`} />
              )}
            </motion.div>
            {focused && !emailValid && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(164 80% 60% / 0.35), transparent 70%)",
                  animation: "iconPulse 1.6s ease-in-out infinite",
                }}
              />
            )}
          </div>
          {/* progress underline */}
          <div className="absolute bottom-0 left-3 right-3 h-[2px] overflow-hidden rounded-full">
            <motion.div
              className="h-full"
              initial={false}
              animate={{ width: emailValid ? "100%" : emailFilled ? "40%" : "0%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "linear-gradient(90deg, hsl(164 80% 55%), hsl(170 70% 50%))" }}
            />
          </div>
          <p id="email-hint" className="sr-only">We'll send your match here.</p>
        </div>

        {/* ====== PROVINCE — pin + floating label + glass dropdown ====== */}
        <div className="relative">
          <Select value={province} onValueChange={setProvince}>
            <SelectTrigger
              className="w-full rounded-2xl border border-white/[0.08] bg-[hsl(180_25%_4%_/_0.55)] pl-12 pr-10 pt-6 pb-3 text-[16px] text-foreground focus:ring-[3px] focus:ring-[hsl(164_80%_55%_/_0.25)] focus:border-[hsl(164_80%_55%_/_0.6)] transition-all h-auto [&>span]:text-left [&>svg]:hidden backdrop-blur-md font-display font-medium"
              style={{ boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06), inset 0 -1px 0 hsl(180 50% 5% / 0.4)" }}
            >
              <SelectValue placeholder=" " />
            </SelectTrigger>
            <SelectContent className="z-50 rounded-2xl border border-[hsl(164_60%_40%_/_0.25)] bg-card/90 text-card-foreground shadow-2xl backdrop-blur-xl">
              {PROVINCES.map((p) => (
                <SelectItem
                  key={p}
                  value={p}
                  className="cursor-pointer rounded-lg focus:bg-[hsl(164_60%_40%_/_0.15)] focus:text-foreground"
                >
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label
            className={`pointer-events-none absolute left-12 transition-all duration-200 ${
              province
                ? "top-2 text-[11px] font-medium text-[hsl(164_70%_65%)] tracking-wide uppercase"
                : "top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground"
            }`}
          >
            Province
          </label>
          <MapPin
            className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
              province ? "text-[hsl(164_70%_65%)]" : "text-muted-foreground/70"
            }`}
          />
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}

        {/* ====== CONSENT — custom animated checkbox ====== */}
        <motion.label
          variants={itemVariants}
          htmlFor="consent-checkbox"
          className={`group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[12px] leading-snug cursor-pointer transition-all ${
            agreed
              ? "border-[hsl(164_70%_55%_/_0.5)] bg-[hsl(164_70%_45%_/_0.10)] shadow-[inset_0_0_24px_-8px_hsl(164_80%_55%_/_0.4)]"
              : "border-white/[0.08] bg-[hsl(180_25%_4%_/_0.4)] hover:border-[hsl(164_70%_55%_/_0.3)]"
          }`}
        >
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="sr-only"
            required
            aria-required="true"
          />
          <span
            aria-hidden
            className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
              agreed
                ? "border-[hsl(164_80%_55%)] bg-[hsl(164_80%_50%)]"
                : "border-white/30 bg-transparent group-hover:border-[hsl(164_70%_55%)]"
            }`}
          >
            <motion.svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              initial={false}
              animate={{ opacity: agreed ? 1 : 0 }}
            >
              <motion.path
                d="M3 8.5 L6.5 12 L13 4.5"
                fill="none"
                stroke="hsl(180 30% 8%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: agreed ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>
          </span>
          <span className="text-foreground/80">
            I'm <span className="font-semibold text-foreground">18+ in South Africa</span> and agree to the{" "}
            <a href="/legal" target="_blank" rel="noopener noreferrer" className="font-semibold text-[hsl(164_70%_65%)] underline underline-offset-2">
              Terms &amp; Privacy
            </a>.
          </span>
        </motion.label>

        {/* hairline divider */}
        <div
          aria-hidden
          className="h-px w-full"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(164 60% 50% / 0.25), transparent)",
          }}
        />

        {/* ====== CTA — chunky 3D press button with shelf, ripple & particle burst ====== */}
        <div className="relative pt-1 pb-2 select-none">
          {agreed && (
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-3 rounded-[32px]"
              style={{
                background: "radial-gradient(60% 60% at 50% 55%, hsl(164 80% 55% / 0.55), transparent 70%)",
                filter: disableAurora ? "blur(14px)" : "blur(22px)",
                animation: "ctaHalo 2.6s ease-in-out infinite",
              }}
            />
          )}
          <div
            className="relative rounded-[22px]"
            style={{
              background: agreed
                ? "linear-gradient(180deg, hsl(170 65% 22%) 0%, hsl(175 70% 14%) 100%)"
                : "linear-gradient(180deg, hsl(180 10% 14%) 0%, hsl(180 12% 9%) 100%)",
              boxShadow: agreed
                ? "0 16px 32px -10px hsl(164 80% 18% / 0.7), 0 2px 0 hsl(180 50% 4% / 0.6)"
                : "0 6px 16px -6px hsl(180 50% 3% / 0.5)",
              padding: "0 0 7px 0",
            }}
          >
            <motion.button
              type="submit"
              disabled={!agreed}
              whileHover={agreed ? { y: -1 } : undefined}
              whileTap={agreed ? { y: 6, transition: { type: "spring", stiffness: 900, damping: 30 } } : undefined}
              onClick={(e) => {
                if (!agreed) return;
                const btn = e.currentTarget;
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Hot ignition flash from click point
                const flash = document.createElement("span");
                flash.className = "cta-ignite";
                flash.style.left = `${x}px`;
                flash.style.top = `${y}px`;
                btn.appendChild(flash);
                setTimeout(() => flash.remove(), 600);

                // Fizzling match-head sparks — amber/neon trichome energy
                const fizzle = document.createElement("span");
                fizzle.className = "cta-fizzle-layer";
                fizzle.style.left = `${x}px`;
                fizzle.style.top = `${y}px`;
                const SPARK_COUNT = 28;
                for (let i = 0; i < SPARK_COUNT; i++) {
                  const s = document.createElement("span");
                  s.className = "cta-spark";
                  // Bias upward arc like a struck match
                  const angle = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.1;
                  const speed = 60 + Math.random() * 90;
                  const tx = Math.cos(angle) * speed;
                  const ty = Math.sin(angle) * speed;
                  // Gravity pulls them down at the end
                  const fy = ty + 50 + Math.random() * 40;
                  const dur = 600 + Math.random() * 500;
                  const size = 2 + Math.random() * 3;
                  // Color shift: hot white -> amber -> trichome mint flick
                  const hue = Math.random() < 0.7
                    ? 38 + Math.random() * 12          // amber
                    : 158 + Math.random() * 14;         // mint flick
                  s.style.setProperty("--tx", `${tx}px`);
                  s.style.setProperty("--ty", `${ty}px`);
                  s.style.setProperty("--fy", `${fy}px`);
                  s.style.setProperty("--dur", `${dur}ms`);
                  s.style.setProperty("--size", `${size}px`);
                  s.style.setProperty("--hue", `${hue}`);
                  s.style.animationDelay = `${Math.random() * 80}ms`;
                  fizzle.appendChild(s);
                }
                // Smoldering ember plume above ignition
                for (let i = 0; i < 4; i++) {
                  const e2 = document.createElement("span");
                  e2.className = "cta-ember";
                  e2.style.setProperty("--ex", `${(Math.random() - 0.5) * 30}px`);
                  e2.style.animationDelay = `${i * 80}ms`;
                  fizzle.appendChild(e2);
                }
                btn.appendChild(fizzle);
                setTimeout(() => fizzle.remove(), 1400);
              }}
              className="group relative w-full overflow-hidden rounded-[22px] py-5 font-display font-bold text-[18px] tracking-[-0.01em] transition-[background,box-shadow] duration-150 flex items-center justify-center gap-2.5 min-h-[64px] disabled:cursor-not-allowed will-change-transform"
              style={{
                backgroundImage: agreed
                  ? "linear-gradient(115deg, hsl(164 78% 68%) 0%, hsl(168 72% 50%) 35%, hsl(172 75% 42%) 65%, hsl(164 78% 68%) 100%)"
                  : "linear-gradient(180deg, hsl(180 10% 26%) 0%, hsl(180 10% 18%) 100%)",
                backgroundSize: agreed ? "220% 220%" : "100% 100%",
                animation: agreed ? "ctaGradientFlow 8s ease-in-out infinite" : undefined,
                boxShadow: agreed
                  ? "inset 0 2px 0 hsl(0 0% 100% / 0.55), inset 0 -3px 0 hsl(170 70% 22% / 0.6), inset 0 0 0 1px hsl(164 60% 40% / 0.4), 0 1px 2px hsl(180 50% 5% / 0.3)"
                  : "inset 0 1px 0 hsl(0 0% 100% / 0.06), inset 0 -1px 0 hsl(180 50% 3% / 0.4)",
                color: agreed ? "hsl(180 30% 8%)" : "hsl(180 8% 55%)",
                textShadow: agreed ? "0 1px 0 hsl(0 0% 100% / 0.25)" : "none",
              }}
            >
              {agreed && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[22px]"
                  style={{
                    background: "linear-gradient(180deg, hsl(0 0% 100% / 0.32) 0%, hsl(0 0% 100% / 0) 100%)",
                  }}
                />
              )}
              {agreed && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  style={{ animation: "sheenSweep 3s ease-in-out infinite", animationDelay: "1s" }}
                />
              )}

              {agreed ? (
                <>
                  <span className="relative z-10">Reveal My Match</span>
                  <motion.span
                    className="relative z-10 inline-flex"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-5 w-5" strokeWidth={2.75} />
                  </motion.span>
                </>
              ) : (
                <>
                  <Lock className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">Confirm 18+ to continue</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/80 mt-0.5 text-center">
          2 min · 100% private · lifestyle preference tool
        </p>
        </motion.form>
      </div>
      <style>{`
        @keyframes liquidBreathe {
          0%, 100% { border-radius: 28px 28px 28px 28px / 28px 28px 28px 28px; }
          25%      { border-radius: 32px 26px 30px 28px / 26px 30px 28px 32px; }
          50%      { border-radius: 28px 32px 26px 30px / 30px 28px 32px 26px; }
          75%      { border-radius: 26px 28px 32px 26px / 32px 26px 30px 28px; }
        }
        @keyframes liquidRipple {
          0%   { width: 8px; height: 8px; opacity: 0.7; }
          100% { width: 480px; height: 480px; opacity: 0; }
        }
        @keyframes iconPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.4); }
        }
        @keyframes ctaHalo {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.95; transform: scale(1.04); }
        }
        @keyframes sheenSweep {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(320%); }
          100% { transform: translateX(320%); }
        }
        @keyframes glassSheen {
          0%   { transform: rotate(0deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1.2); }
        }
        @keyframes ctaGradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        /* === Match-head ignition flash === */
        .cta-ignite {
          position: absolute;
          width: 10px; height: 10px;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, hsl(50 100% 90%) 0%, hsl(38 100% 60% / 0.9) 30%, hsl(20 100% 45% / 0.5) 55%, transparent 75%);
          filter: blur(0.5px);
          pointer-events: none;
          animation: ctaIgnite 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          z-index: 5;
          mix-blend-mode: screen;
        }
        @keyframes ctaIgnite {
          0%   { width: 8px;  height: 8px;  opacity: 1;   filter: blur(0.5px); }
          25%  { width: 90px; height: 90px; opacity: 0.95; filter: blur(2px); }
          100% { width: 220px; height: 220px; opacity: 0; filter: blur(8px); }
        }

        /* === Fizzle layer (origin = click point) === */
        .cta-fizzle-layer {
          position: absolute;
          left: 0; top: 0;
          width: 0; height: 0;
          pointer-events: none;
          z-index: 6;
          overflow: visible;
        }

        /* === Individual sparks: amber/mint trichome flecks === */
        .cta-spark {
          position: absolute;
          left: 0; top: 0;
          width: var(--size, 3px);
          height: var(--size, 3px);
          border-radius: 9999px;
          background: hsl(var(--hue, 40) 100% 75%);
          box-shadow:
            0 0 4px hsl(var(--hue, 40) 100% 65% / 0.95),
            0 0 10px hsl(var(--hue, 40) 100% 55% / 0.8),
            0 0 18px hsl(var(--hue, 40) 100% 50% / 0.5);
          transform: translate(-50%, -50%);
          animation: ctaSpark var(--dur, 800ms) cubic-bezier(0.22, 1, 0.36, 1) forwards;
          mix-blend-mode: screen;
        }
        @keyframes ctaSpark {
          0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0; }
          8%   { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          50%  { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0.95; }
          80%  { opacity: 0.7; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--fy))) scale(0.2); opacity: 0; }
        }

        /* === Smoldering ember plume drifting up === */
        .cta-ember {
          position: absolute;
          left: 0; top: 0;
          width: 14px; height: 14px;
          border-radius: 9999px;
          background: radial-gradient(circle, hsl(38 90% 65% / 0.7), transparent 70%);
          transform: translate(-50%, -50%);
          animation: ctaEmber 1.2s ease-out forwards;
          mix-blend-mode: screen;
          filter: blur(3px);
        }
        @keyframes ctaEmber {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          20%  { opacity: 0.9; }
          100% { transform: translate(calc(-50% + var(--ex, 0px)), -90px) scale(2.4); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="liquidBreathe"], [style*="liquidRipple"], [style*="iconPulse"], [style*="ctaHalo"], [style*="sheenSweep"], [style*="glassSheen"], [style*="ctaGradientFlow"] { animation: none !important; }
          .cta-ignite, .cta-spark, .cta-ember { animation: none !important; display: none; }
        }


      `}</style>
    </motion.div>
  );
};

export default SqueezeScreen;
