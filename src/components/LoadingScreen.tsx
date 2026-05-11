import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, RotateCw, ArrowRight } from "lucide-react";
import hbLogoJar from "@/assets/hb-logo-jar.png";
import { Button } from "@/components/ui/button";

const STATUS_MESSAGES = [
  "Comparing your answers to our strain library…",
  "Analysing terpene compatibility…",
  "Matching cannabinoid ratios to your profile…",
  "Checking strain availability…",
  "Building your personalised result…",
  "Done.",
];

type LoadingStatus = "loading" | "slow" | "error" | "success";

interface LoadingScreenProps {
  status?: LoadingStatus;
  errorReason?: string;
  onRetry?: () => void;
  onContinue?: () => void;
}

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
            <motion.div
              className="absolute h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent-green))]"
              style={{ left: x1 - 5 }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.1, 0.7] }}
              transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-2 w-2 rounded-full bg-[hsl(var(--brand-gold))]"
              style={{ left: x2 - 4 }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, delay: delay + 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
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

const LoadingScreen = ({
  status = "loading",
  errorReason,
  onRetry,
  onContinue,
}: LoadingScreenProps) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const reduce = useReducedMotion();

  const isError = status === "error";
  const isSuccess = status === "success";
  const isSlow = status === "slow";
  const isAnimating = !isError && !isSuccess;

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, STATUS_MESSAGES.length - 2));
    }, 500);
    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(isSlow ? 80 : 95), 100);
    return () => clearTimeout(timer);
  }, [isSlow]);

  const headline = isError
    ? "We couldn't save your results"
    : isSuccess
    ? "All set"
    : isSlow
    ? "Taking a little longer than usual…"
    : "Finding Your Match…";

  const subline = isSlow
    ? "Hang tight, we're still working on it."
    : isError
    ? errorReason || "Something went wrong on our side."
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Crisp backdrop */}
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

      {/* Visual area: helix while working, icon on terminal states */}
      {isAnimating && (
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="absolute -inset-4 rounded-full border border-[hsl(var(--accent-green)_/_0.15)]"
            style={{ animation: reduce ? undefined : "spin 8s linear infinite" }}
          />
          <DnaHelix />
          <span className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src={hbLogoJar}
              alt="HB"
              className="h-8 w-auto drop-shadow-lg"
              animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      )}

      {isError && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10"
        >
          <AlertTriangle className="h-9 w-9 text-destructive" />
        </motion.div>
      )}

      {isSuccess && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[hsl(var(--accent-green)_/_0.4)] bg-[hsl(var(--accent-green)_/_0.15)]"
        >
          <Check className="h-9 w-9 text-[hsl(var(--accent-green))]" />
        </motion.div>
      )}

      <h2
        className={`font-display text-xl font-bold tracking-[0.02em] mb-2 sm:text-2xl ${
          isError ? "text-destructive" : "text-foreground text-glow"
        }`}
      >
        {headline}
      </h2>

      {subline && (
        <p className="max-w-xs text-sm text-muted-foreground mb-2">{subline}</p>
      )}

      {/* Cycling status messages — only while animating */}
      {isAnimating && (
        <div className="h-12 relative w-full max-w-xs mt-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={isSlow ? "slow" : msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm absolute inset-x-0 text-muted-foreground"
            >
              {isSlow ? "Still finalising your match…" : STATUS_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}

      {/* Progress bar — only while animating */}
      {isAnimating && (
        <div className="mt-4 w-56 h-1.5 rounded-full bg-[hsl(var(--surface-elevated))] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-[3000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: `${progressWidth}%`,
              background:
                "linear-gradient(90deg, hsl(var(--primary-green)), hsl(var(--accent-green)), hsl(var(--brand-gold)))",
            }}
          />
        </div>
      )}

      {/* Error actions */}
      {isError && (
        <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="w-full min-h-[48px] gap-2 font-display font-semibold"
            >
              <RotateCw className="h-4 w-4" />
              Retry
            </Button>
          )}
          {onContinue && (
            <Button
              variant="outline"
              onClick={onContinue}
              className="w-full min-h-[48px] gap-2 font-display"
            >
              Continue anyway
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Your match is safe — we'll keep trying to deliver it to your inbox.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LoadingScreen;
