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

      {/* Form — wet glass card with chromatic resin blobs */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className={`relative flex w-full max-w-sm flex-col gap-3 overflow-hidden rounded-[28px] p-5 border transition-all duration-500 ${
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
        }}
      >
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
    </motion.div>
  );
};

export default SqueezeScreen;
