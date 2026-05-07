import { useState } from "react";
import { ArrowRight, Dna, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { validateEmail } from "@/lib/emailValidation";
import hbLogoWhite from "@/assets/hb-logo-white-full.png";


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
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

      {/* Logo */}
      <motion.div variants={itemVariants} className="mb-8 relative">
        <img src={hbLogoWhite} alt="Healing Buds" className="h-16 w-auto sm:h-20" />
        <div className="absolute inset-0 -z-10 blur-3xl bg-[hsl(var(--accent-green)_/_0.18)] rounded-full scale-[2]" />
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="mb-4 font-display text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl"
      >
        <span
          className="relative inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(160 25% 92%) 60%, hsl(164 35% 78%) 100%)",
            WebkitBackgroundClip: "text",
            filter:
              "drop-shadow(0 1px 0 hsl(180 50% 4% / 0.55)) drop-shadow(0 0 22px hsl(164 60% 40% / 0.35))",
          }}
        >
          Discover your
        </span>
        <br />
        <span
          className="relative inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(110deg, hsl(164 55% 72%) 0%, hsl(164 85% 58%) 35%, hsl(180 75% 82%) 50%, hsl(164 85% 58%) 65%, hsl(164 55% 72%) 100%)",
            backgroundSize: "200% 100%",
            animation: "auroraShift 6s ease-in-out infinite",
            WebkitBackgroundClip: "text",
            filter:
              "drop-shadow(0 1px 0 hsl(180 50% 4% / 0.5)) drop-shadow(0 0 28px hsl(164 80% 50% / 0.45))",
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
          className={`relative z-10 flex w-full flex-col gap-3 overflow-hidden rounded-[28px] p-5 border transition-[border-color,box-shadow] duration-500 ${
            focused ? "border-[hsl(164_80%_60%_/_0.35)]" : "border-white/[0.10]"
          }`}
          style={{
            background:
              "linear-gradient(155deg, hsl(180 30% 10% / 0.55) 0%, hsl(178 35% 7% / 0.65) 50%, hsl(170 40% 6% / 0.7) 100%)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            boxShadow: focused
              ? "0 40px 90px -20px hsl(180 40% 2% / 0.7), 0 0 0 1px hsl(164 80% 55% / 0.18), 0 0 60px -12px hsl(164 80% 55% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.10), inset 0 -1px 0 hsl(180 50% 5% / 0.4)"
              : "0 40px 90px -20px hsl(180 40% 2% / 0.7), inset 0 1px 0 hsl(0 0% 100% / 0.08), inset 0 -1px 0 hsl(180 50% 5% / 0.4)",
            animation: "liquidBreathe 7s ease-in-out infinite",
          }}
        >
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
            filter: "blur(28px)",
            animation: "glassDrift 14s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          data-drift
          className="pointer-events-none absolute -bottom-20 -right-10 h-52 w-52 rounded-full opacity-50 mix-blend-screen"
          style={{
            background: "radial-gradient(circle, hsl(38 90% 60% / 0.35) 0%, transparent 65%)",
            filter: "blur(32px)",
            animation: "glassDrift 18s ease-in-out infinite reverse",
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

        <div className="relative rounded-2xl">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-2xl border border-white/[0.08] bg-[hsl(180_25%_4%_/_0.55)] px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-green)_/_0.5)] focus:border-[hsl(var(--accent-green)_/_0.6)] transition-all text-[16px] backdrop-blur-md"
            style={{ boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06), inset 0 -1px 0 hsl(180 50% 5% / 0.4)" }}
            required
            aria-describedby="email-hint"
          />
        </div>
        <p id="email-hint" className="-mt-1 px-1 text-[11px] text-muted-foreground relative">
          Use a real address (e.g. <span className="font-mono text-foreground/80">name@domain.com</span>) — we'll send your match here.
        </p>

        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger
            className="w-full rounded-2xl border border-white/[0.08] bg-[hsl(180_25%_4%_/_0.55)] px-5 py-4 text-[16px] text-foreground focus:ring-2 focus:ring-[hsl(var(--accent-green)_/_0.5)] focus:border-[hsl(var(--accent-green)_/_0.6)] transition-all h-auto [&>span]:text-left backdrop-blur-md"
            style={{ boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06), inset 0 -1px 0 hsl(180 50% 5% / 0.4)" }}
          >
            <SelectValue placeholder="Select your province" />
          </SelectTrigger>
          <SelectContent className="z-50 rounded-xl border border-border bg-card text-card-foreground shadow-lg">
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p} className="cursor-pointer">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}

        {/* Single consolidated consent — emerald accent for cohesion */}
        <motion.label
          variants={itemVariants}
          htmlFor="consent-checkbox"
          className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[11px] leading-snug cursor-pointer transition-colors ${
            agreed
              ? "border-[hsl(var(--accent-green)_/_0.5)] bg-[hsl(var(--accent-green)_/_0.07)]"
              : "border-border bg-[hsl(var(--surface-elevated)_/_0.5)] hover:border-[hsl(var(--accent-green)_/_0.3)]"
          }`}
        >
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[hsl(var(--accent-green))] cursor-pointer"
            required
            aria-required="true"
          />
          <span className="text-foreground/75">
            I'm <span className="font-semibold text-foreground/95">18+ in South Africa</span> and agree to the{" "}
            <a href="/legal" target="_blank" rel="noopener noreferrer" className="font-semibold text-[hsl(var(--accent-green))] underline underline-offset-2">
              Terms &amp; Privacy
            </a>.
          </span>
        </motion.label>

        <motion.button
          type="submit"
          disabled={!agreed}
          whileHover={agreed ? { scale: 1.01 } : undefined}
          whileTap={agreed ? { scale: 0.98 } : undefined}
          className="group relative w-full overflow-hidden rounded-2xl py-4 font-display font-semibold text-[hsl(180_25%_6%)] text-base transition-all flex items-center justify-center gap-2 min-h-[54px] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundImage:
              "linear-gradient(135deg, hsl(164 70% 62%) 0%, hsl(164 60% 48%) 50%, hsl(170 65% 42%) 100%)",
            boxShadow:
              "0 12px 32px -8px hsl(164 80% 35% / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.25), inset 0 -1px 0 hsl(180 50% 5% / 0.25)",
          }}
        >
          {/* Sheen sweep — runs once on mount, again on hover */}
          {agreed && (
            <span
              data-sheen
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ animation: "sheenSweep 2.4s ease-in-out infinite" }}
            />
          )}
          <span className="relative z-10">Reveal My Match</span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>

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
        @media (prefers-reduced-motion: reduce) {
          [style*="liquidBreathe"], [style*="liquidRipple"] { animation: none !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default SqueezeScreen;
