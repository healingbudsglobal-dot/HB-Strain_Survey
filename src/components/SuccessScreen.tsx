import { useState } from "react";
import { Mail, RotateCcw, Leaf, Share2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CinematicMatchReveal from "./CinematicMatchReveal";
import { Badge } from "@/components/ui/badge";

import type { StrainMatch } from "@/lib/strainMatcher";

const strainTypeConfig = {
  indica: { label: "Indica", className: "bg-primary/15 text-primary border-primary/25", overlay: "from-[hsl(var(--primary-green)_/_0.6)]" },
  sativa: { label: "Sativa", className: "bg-[hsl(var(--lime-green)_/_0.15)] text-[hsl(var(--lime-green))] border-[hsl(var(--lime-green)_/_0.25)]", overlay: "from-[hsl(var(--lime-green)_/_0.4)]" },
  hybrid: { label: "Hybrid", className: "bg-[hsl(var(--accent-green)_/_0.15)] text-[hsl(var(--accent-green))] border-[hsl(var(--accent-green)_/_0.25)]", overlay: "from-[hsl(var(--accent-green)_/_0.5)]" },
};

interface SuccessScreenProps {
  result: StrainMatch | null;
  waLink?: string;
  customerWaLink?: string;
  userEmail?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

const SuccessScreen = ({ result, waLink, customerWaLink, userEmail }: SuccessScreenProps) => {
  const strain = result?.strain;
  const [tracking, setTracking] = useState<string | null>(null);

  const handleShare = async () => {
    const text = `I just got matched with ${strain?.name} on Healing Buds! 🌿`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Strain Match", text, url: window.location.href });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text + " " + window.location.href);
    }
  };

  const handleWaClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string | undefined,
    recipient: "customer" | "budstacks"
  ) => {
    e.preventDefault();
    if (!href || tracking) return;

    setTracking(recipient);

    const { trackEvent } = await import("@/lib/trackEvent");
    await trackEvent("whatsapp_click", {
      email: userEmail,
      payload: {
        surface: "success_screen",
        recipient,
        strain: strain?.name,
        compatibility: result?.compatibility,
      },
    });

    window.open(href, "_blank", "noopener,noreferrer");
    setTracking(null);
  };

  const isDisabled = (recipient: "customer" | "budstacks") =>
    tracking !== null && tracking !== recipient;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex flex-col items-center justify-center px-5 text-center max-w-md w-full"
    >
      {/* Soft static glow — no animated confetti (caused mobile strobing) */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-40 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--accent-green) / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Cinematic strain reveal — count-up, ring, glow, typewriter */}
      {strain && (
        <motion.div variants={itemVariants} className="mb-2 w-full">
          <CinematicMatchReveal
            value={result.compatibility}
            strainName={strain.name}
            startDelay={0.2}
          />
        </motion.div>
      )}

      <motion.h2
        variants={itemVariants}
        className="font-display text-lg font-semibold tracking-[0.02em] text-muted-foreground sm:text-xl mb-4"
      >
        Your precision-matched strain
      </motion.h2>

      {strain && (
        <>
          {/* Strain card with bud image */}
          <motion.div
            variants={itemVariants}
            className="mt-4 w-full rounded-2xl border border-[hsl(170_8%_25%)] bg-[hsl(175_6%_16%)] text-left shadow-elegant relative overflow-hidden"
          >
            {/* Strain bud image — cinematic hero */}
            {strain.imageUrl && (
              <motion.div
                className="relative h-56 w-full overflow-hidden rounded-t-2xl"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={strain.imageUrl}
                  alt={`${strain.name} cannabis bud`}
                  className="h-full w-full object-cover"
                />
                {/* Strain type colored overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${strainTypeConfig[strain.type].overlay} to-transparent opacity-40`} />
                {/* Cinematic vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(175_6%_16%_/_0.7)_100%)]" />
                {/* Bottom fade into card */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[hsl(175_6%_16%)] to-transparent" />
              </motion.div>
            )}

            <div className="p-5 relative">
              

              <div className="flex items-start justify-between mb-3 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="h-4 w-4 text-[hsl(var(--accent-green))]" />
                    <span className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                      Your #1 Match
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {strain.name}
                  </h3>
                  {strain.type && (
                    <Badge className={`mt-1 text-[10px] uppercase tracking-wider border ${strainTypeConfig[strain.type].className}`}>
                      {strainTypeConfig[strain.type].label}
                    </Badge>
                  )}
                </div>
                <motion.div
                  className="flex flex-col items-end gap-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 250 }}
                >
                  <span className="text-2xl font-bold text-[hsl(var(--brand-gold))]">
                    {result.compatibility}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Match
                  </span>
                </motion.div>
              </div>

              {/* THC / CBD */}
              <motion.div
                className="flex gap-3 mb-3 relative z-10"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="rounded-lg border border-border bg-[hsl(var(--surface))] px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">THC </span>
                  <span className="font-bold text-foreground">{strain.thc}%</span>
                </div>
                <div className="rounded-lg border border-border bg-[hsl(var(--surface))] px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">CBD </span>
                  <span className="font-bold text-foreground">{strain.cbd}%</span>
                </div>
              </motion.div>

              {/* Effects — green badges */}
              <motion.div
                className="mb-2 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Effects</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {strain.effects.map((e, i) => (
                    <motion.div
                      key={e}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.65 + i * 0.05 }}
                    >
                      <Badge variant="secondary" className="text-xs bg-[hsl(var(--accent-green)_/_0.1)] text-[hsl(var(--accent-green))] border-[hsl(var(--accent-green)_/_0.2)]">
                        {e}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Flavours */}
              <motion.div
                className="mb-3 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Flavours</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {strain.flavours.map((f) => (
                    <Badge key={f} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Price + availability */}
              <motion.div
                className="flex items-center justify-between relative z-10 pt-2 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
              >
                <span className="text-xs text-muted-foreground italic">Pricing on private enquiry</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Members only
                </span>
              </motion.div>
            </div>
          </motion.div>

          {(waLink || customerWaLink) && (
            <motion.div variants={itemVariants} className="mt-4 w-full flex flex-col gap-3">
              {customerWaLink && (
                <motion.a
                  href={customerWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    import("@/lib/trackEvent").then(({ trackEvent }) => {
                      trackEvent("whatsapp_click", {
                        email: userEmail,
                        payload: {
                          surface: "success_screen",
                          recipient: "customer",
                          strain: strain?.name,
                          compatibility: result?.compatibility,
                        },
                      });
                    });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="group w-full rounded-2xl py-4 font-display font-bold text-white text-base transition-all flex items-center justify-center gap-2 min-h-[52px]"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    boxShadow: "0 12px 32px -8px rgba(37,211,102,0.5)",
                  }}
                >
                  <Share2 className="h-5 w-5" />
                  Send My Match To Me
                </motion.a>
              )}
              {waLink && (
                <motion.a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    import("@/lib/trackEvent").then(({ trackEvent }) => {
                      trackEvent("whatsapp_click", {
                        email: userEmail,
                        payload: {
                          surface: "success_screen",
                          recipient: "budstacks",
                          strain: strain?.name,
                          compatibility: result?.compatibility,
                        },
                      });
                    });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="group w-full rounded-2xl py-4 font-display font-bold text-white text-base transition-all flex items-center justify-center gap-2 min-h-[52px] border border-white/15"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(var(--primary-green)) 0%, hsl(var(--secondary-green)) 100%)",
                    boxShadow: "0 12px 32px -8px hsl(var(--primary-green) / 0.5)",
                  }}
                >
                  <Share2 className="h-5 w-5" />
                  Send Order To BudStacks
                </motion.a>
              )}
            </motion.div>
          )}

          {/* Enquiry CTA — no direct shop link, SA ad-policy safe */}
          <motion.a
            variants={itemVariants}
            href="mailto:info@healingbuds.co.za?subject=Private%20Enquiry%20-%20Lifestyle%20Match"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 group w-full rounded-2xl gradient-accent py-4 font-display font-bold text-white text-base transition-all hover:brightness-110 flex items-center justify-center gap-2 min-h-[52px] shadow-glow"
          >
            Enquire Privately
            <Mail className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground text-center">
            Private adult enquiry · Not for sale or advertisement · SA 18+
          </p>

          {/* Share + Email row */}
          <motion.div
            variants={itemVariants}
            className="mt-3 flex w-full gap-3"
          >
            <a
              href="mailto:info@healingbuds.co.za?subject=Strain%20Recommendation%20Query"
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border bg-[hsl(var(--surface-elevated))] py-3 text-sm font-medium text-foreground hover:bg-[hsl(var(--accent-green)_/_0.08)] transition-all min-h-[48px]"
            >
              <Mail className="h-4 w-4 text-[hsl(var(--accent-green))]" />
              Speak to a Consultant
            </a>
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-[hsl(var(--surface-elevated))] px-4 py-3 text-sm font-medium text-foreground hover:bg-[hsl(var(--accent-green)_/_0.08)] transition-all min-h-[48px]"
            >
              <Share2 className="h-4 w-4 text-[hsl(var(--accent-green))]" />
            </motion.button>
          </motion.div>
        </>
      )}

      {/* Email note */}
      <motion.div
        variants={itemVariants}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-[hsl(var(--surface-elevated))] px-4 py-2 text-xs text-muted-foreground"
      >
        <Mail className="h-3.5 w-3.5 text-[hsl(var(--accent-green))]" />
        Full results sent to your email
      </motion.div>

      {/* Back */}
      <motion.button
        variants={itemVariants}
        onClick={() => window.location.reload()}
        whileHover={{ x: -3 }}
        className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[48px]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Start Over
      </motion.button>
    </motion.div>
  );
};

export default SuccessScreen;
