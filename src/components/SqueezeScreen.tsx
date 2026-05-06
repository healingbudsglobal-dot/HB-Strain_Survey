import { useState } from "react";
import { ArrowRight, Shield, FlaskConical, Microscope, Dna, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { validateEmail } from "@/lib/emailValidation";
import hbLogoWhite from "@/assets/hb-logo-white-full.png";
import heroFlower from "@/assets/hero-flower.jpg";

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
      className="relative z-10 flex flex-col items-center justify-center px-5 text-center"
    >
      {/* Hero flower — TRUE full-bleed via fixed positioning, immune to parent width */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.img
          src={heroFlower}
          alt=""
          className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] max-w-none object-cover"
          style={{
            transform: "translate(-50%, -50%)",
            filter: "saturate(1.15) contrast(1.05) brightness(1.05) hue-rotate(-8deg)",
          }}
          initial={{ scale: 1.1, x: "-50%", y: "-50%" }}
          animate={{ scale: 1.0, x: "-50%", y: "-50%" }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
        {/* Brand-cohesive deep teal tint — pulls pink/red toward forest */}
        <div className="absolute inset-0 bg-[hsl(178_48%_15%_/_0.45)]" style={{ mixBlendMode: "multiply" }} />
        {/* Soft top + bottom legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180_8%_7%_/_0.55)] via-transparent to-[hsl(180_8%_7%_/_0.85)]" />
        {/* Subtle accent-green wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent-green)_/_0.08),transparent_70%)]" />
      </motion.div>

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
        className="pointer-events-none absolute bottom-[15%] left-[6%] opacity-[0.05]"
        animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Sparkles className="h-16 w-16 text-[hsl(var(--brand-gold))]" />
      </motion.div>

      {/* Logo */}
      <motion.div variants={itemVariants} className="mb-6 relative">
        <img src={hbLogoWhite} alt="Healing Buds" className="h-14 w-auto sm:h-16 drop-shadow-lg" />
        {/* Soft glow behind logo */}
        <div className="absolute inset-0 -z-10 blur-3xl bg-[hsl(var(--accent-green)_/_0.08)] rounded-full scale-[2.5]" />
      </motion.div>


      <motion.h1
        variants={itemVariants}
        className="font-display text-3xl font-extrabold leading-[1.1] tracking-[0.02em] text-foreground sm:text-4xl md:text-5xl mb-2 drop-shadow-md"
      >
        Discover Your
        <br />
        <span className="text-[hsl(var(--brand-gold))] italic font-serif tracking-tight">Perfect Match</span>
      </motion.h1>

      {/* Editorial divider — Aeriz / Garden Party inspiration */}
      <motion.div
        variants={itemVariants}
        className="mb-5 flex items-center gap-3"
      >
        <span className="h-px w-8 bg-[hsl(var(--brand-gold)_/_0.6)]" />
        <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Curated · Botanical</span>
        <span className="h-px w-8 bg-[hsl(var(--brand-gold)_/_0.6)]" />
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mb-7 max-w-xs text-sm leading-relaxed text-muted-foreground"
      >
        A quick lifestyle quiz to help you explore botanical profiles tailored to your preferences.
      </motion.p>

      {/* Form — refined editorial glass card */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3 rounded-3xl p-5 relative overflow-hidden border border-white/[0.06] bg-[hsl(175_6%_11%_/_0.55)] backdrop-blur-2xl"
        style={{ boxShadow: "var(--shadow-elegant), 0 0 100px -25px hsl(var(--accent-green) / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.04)" }}
      >
        {/* Green-to-gold shimmer line — fades at edges */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-green)), hsl(var(--brand-gold)), transparent)' }} />

        <div className={`relative rounded-2xl transition-all duration-300 ${focused ? 'shadow-[var(--shadow-glow-gold)]' : ''}`}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-2xl border border-border bg-[hsl(var(--surface-elevated)_/_0.8)] px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-gold)_/_0.4)] focus:border-[hsl(var(--brand-gold)_/_0.5)] transition-all text-[16px]"
            required
            aria-describedby="email-hint"
          />
        </div>
        <p id="email-hint" className="-mt-1 px-1 text-[11px] text-muted-foreground">
          Use a real address (e.g. <span className="font-mono text-foreground/80">name@domain.com</span>) — we'll send your match here.
        </p>

        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="w-full rounded-2xl border border-border bg-[hsl(var(--surface-elevated)_/_0.8)] px-5 py-4 text-[16px] text-foreground focus:ring-2 focus:ring-[hsl(var(--brand-gold)_/_0.4)] focus:border-[hsl(var(--brand-gold)_/_0.5)] transition-all h-auto [&>span]:text-left">
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

        {/* Single consolidated consent — friendly, not scary */}
        <motion.label
          variants={itemVariants}
          htmlFor="consent-checkbox"
          className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[11px] leading-snug cursor-pointer transition-colors ${
            agreed
              ? "border-[hsl(var(--brand-gold)_/_0.5)] bg-[hsl(var(--brand-gold)_/_0.06)]"
              : "border-border bg-[hsl(var(--surface-elevated)_/_0.5)] hover:border-[hsl(var(--brand-gold)_/_0.3)]"
          }`}
        >
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[hsl(var(--brand-gold))] cursor-pointer"
            required
            aria-required="true"
          />
          <span className="text-muted-foreground">
            I'm <span className="font-semibold text-foreground/90">18+ in South Africa</span> and agree to the{" "}
            <a href="/legal" target="_blank" rel="noopener noreferrer" className="font-semibold text-[hsl(var(--brand-gold))] underline underline-offset-2">
              Terms &amp; Privacy
            </a>.
          </span>
        </motion.label>

        <motion.button
          type="submit"
          disabled={!agreed}
          whileHover={agreed ? { scale: 1.02 } : undefined}
          whileTap={agreed ? { scale: 0.97 } : undefined}
          className="group w-full rounded-2xl gradient-accent py-4 font-display font-bold text-white text-base transition-all hover:brightness-110 animate-pulse-glow flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none disabled:hover:brightness-100"
        >
          Reveal My Match
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>

        <p className="text-[11px] text-muted-foreground/80 mt-0.5 text-center">
          2 min · 100% private · lifestyle preference tool
        </p>
      </motion.form>
    </motion.div>
  );
};

export default SqueezeScreen;
