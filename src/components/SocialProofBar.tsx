import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users } from "lucide-react";

const TESTIMONIALS = [
  { name: "Thandi · Cape Town", quote: "Best match I've ever had. Sleep is incredible." },
  { name: "Jaco · Joburg", quote: "Took 2 minutes. Found my daily strain. 10/10." },
  { name: "Lerato · Durban", quote: "Finally — a quiz that actually understands my body." },
];

interface SocialProofBarProps {
  /** Total number to display in the live counter. Defaults to 12,847. */
  count?: number;
}

const SocialProofBar = ({ count = 12847 }: SocialProofBarProps) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-5 flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-[hsl(170_8%_25%_/_0.5)] bg-[hsl(175_6%_11%_/_0.55)] backdrop-blur-xl px-4 py-3"
    >
      {/* Live counter */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--accent-green))]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--accent-green))] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--accent-green))]" />
          </span>
          <Users className="h-3 w-3" />
          {count.toLocaleString()} matched
        </span>
        <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]" />
          ))}
          <span className="ml-1 font-semibold text-foreground">4.9</span>
        </span>
      </div>

      {/* Rotating testimonial */}
      <div className="min-h-[36px] text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-[12px] italic leading-snug text-muted-foreground">
              "{t.quote}"
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-[hsl(var(--accent-green))]">
              — {t.name}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SocialProofBar;
