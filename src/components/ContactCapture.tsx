import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, User, MessageCircle, Mail, Lock } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import hbLogoWhite from "@/assets/hb-logo-white-full.png";
import heroFlower from "@/assets/hero-flower.jpg";

interface ContactCaptureProps {
  onSubmit: (name: string, whatsappE164?: string, optIn?: boolean) => void;
  onSkip: () => void;
  strainName?: string;
  userEmail?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const ContactCapture = ({ onSubmit, onSkip, strainName, userEmail }: ContactCaptureProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState<string | undefined>(undefined);
  const [optIn, setOptIn] = useState(true);
  const [error, setError] = useState("");

  const hasValidWa = !!whatsapp && isValidPhoneNumber(whatsapp);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (whatsapp && !isValidPhoneNumber(whatsapp)) {
      setError("Please enter a valid WhatsApp number");
      return;
    }
    setError("");
    // Only pass the number if user opted in AND it's valid
    const finalNumber = hasValidWa && optIn ? whatsapp : undefined;
    onSubmit(name.trim(), finalNumber, !!finalNumber);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex flex-col items-center justify-center px-5 text-center max-w-sm w-full"
    >
      {/* Cinematic flower backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <img
          src={heroFlower}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07]"
          style={{ filter: "blur(25px) saturate(1.2)", mixBlendMode: "soft-light" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,hsl(180_8%_7%_/_0.9)_75%)]" />
        <div className="absolute inset-0 bg-[hsl(var(--primary-green)_/_0.12)]" style={{ mixBlendMode: "overlay" }} />
      </div>

      <motion.div variants={itemVariants} className="mb-6">
        <img src={hbLogoWhite} alt="Healing Buds" className="h-10 w-auto" />
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="font-display text-2xl font-bold tracking-[0.02em] text-foreground sm:text-3xl mb-2"
      >
        Your Strain Match Is <span className="text-[hsl(var(--brand-gold))]">Ready</span>
      </motion.h2>

      {strainName && (
        <motion.div
          variants={itemVariants}
          className="mb-4 w-full rounded-xl border border-[hsl(var(--accent-green)_/_0.3)] bg-[hsl(175_6%_16%_/_0.8)] backdrop-blur-xl p-4 relative overflow-hidden"
        >
          <motion.img
            src={heroFlower}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(12px) saturate(1.4)", mixBlendMode: "luminosity" }}
            animate={{ opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[hsl(175_6%_16%_/_0.7)]" />
          <div className="flex items-center justify-center gap-2 relative z-10">
            <motion.div
              className="relative"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 h-8 w-8 rounded-full border border-[hsl(var(--accent-green)_/_0.15)] scale-150" />
              <Lock className="h-4 w-4 text-[hsl(var(--accent-green))] relative z-10" />
            </motion.div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your #1 Match</span>
          </div>
          <p className="mt-2 font-display text-lg font-bold text-foreground blur-[6px] select-none relative z-10">
            {strainName}
          </p>
        </motion.div>
      )}

      <motion.p
        variants={itemVariants}
        className="mb-5 text-sm text-muted-foreground leading-relaxed max-w-xs"
      >
        Get your match instantly on WhatsApp <span className="text-[hsl(var(--accent-green))]">📱</span>
      </motion.p>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 glass-card-elevated rounded-2xl p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, hsl(var(--accent-green)), hsl(var(--brand-gold)))' }} />

        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <input
            type="text"
            placeholder="Your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-border bg-[hsl(var(--surface-elevated))] pl-11 pr-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-gold)_/_0.4)] focus:border-[hsl(var(--brand-gold)_/_0.5)] transition-all text-[16px]"
          />
        </div>

        {/* WhatsApp number — primary delivery channel */}
        <div className="relative">
          <div className="mb-1.5 flex items-center gap-1.5 px-1">
            <MessageCircle className="h-3.5 w-3.5 text-[hsl(var(--accent-green))]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--accent-green))]">
              Recommended · 98% open rate
            </span>
          </div>
          <div className="hb-phone-wrap rounded-2xl border-2 border-[hsl(var(--accent-green)_/_0.3)] bg-[hsl(var(--accent-green)_/_0.04)] px-4 py-3 focus-within:ring-2 focus-within:ring-[hsl(var(--accent-green)_/_0.5)] focus-within:border-[hsl(var(--accent-green))] transition-all">
            <PhoneInput
              international
              defaultCountry="ZA"
              countryCallingCodeEditable={false}
              placeholder="Your WhatsApp number"
              value={whatsapp}
              onChange={setWhatsapp}
              className="text-foreground"
            />
          </div>
        </div>

        {/* POPIA opt-in */}
        {whatsapp && (
          <motion.label
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 text-left cursor-pointer px-1"
          >
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border accent-[hsl(var(--accent-green))]"
            />
            <span className="text-[11px] leading-snug text-muted-foreground">
              Send my strain match and follow-up via WhatsApp. POPIA-compliant — opt out anytime.
            </span>
          </motion.label>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}

        {/* Primary CTA — adapts based on whether WA is filled */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`group w-full rounded-2xl py-4 font-display font-bold text-white text-base transition-all hover:brightness-110 animate-pulse-glow flex items-center justify-center gap-2 min-h-[52px] ${
            hasValidWa && optIn
              ? 'bg-[#25D366] shadow-[0_8px_24px_-6px_rgba(37,211,102,0.4)]'
              : 'gradient-accent'
          }`}
        >
          {hasValidWa && optIn ? (
            <>
              <MessageCircle className="h-5 w-5" />
              Send My Match on WhatsApp
            </>
          ) : (
            <>
              Reveal My Match
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>

        {/* Secondary: email-only fallback */}
        <motion.button
          type="button"
          onClick={onSkip}
          whileHover={{ x: 4 }}
          className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 min-h-[44px] px-4"
        >
          <Mail className="h-3.5 w-3.5" />
          Email me instead
        </motion.button>

        {userEmail && (
          <p className="text-[11px] text-muted-foreground text-center">
            Results also sent to <span className="text-foreground">{userEmail}</span>
          </p>
        )}
      </motion.form>

      <motion.div
        variants={itemVariants}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-green)_/_0.2)] bg-[hsl(var(--accent-green)_/_0.04)] px-4 py-2 text-xs text-muted-foreground"
      >
        <Shield className="h-3.5 w-3.5 text-[hsl(var(--accent-green))]" />
        <span>POPIA Compliant · Secure medical data</span>
      </motion.div>
    </motion.div>
  );
};

export default ContactCapture;
