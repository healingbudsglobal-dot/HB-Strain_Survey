import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, RotateCw, Mail, CheckCircle2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import hbLogoWhite from "@/assets/hb-logo-white-full.svg";
import { verifyOtp } from "@/lib/webhook";

interface OtpVerificationProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
  onBack: () => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const OtpVerification = ({ email, onVerified, onResend, onBack }: OtpVerificationProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleComplete = useCallback(
    async (val: string) => {
      setVerifying(true);
      setError("");
      const ok = await verifyOtp(email, val);
      setVerifying(false);
      if (ok) {
        setVerified(true);
        setTimeout(() => onVerified(), 1200);
      } else {
        setError("Incorrect or expired code. Please try again.");
        setValue("");
      }
    },
    [email, onVerified]
  );

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setCanResend(false);
    setCooldown(30);
    setValue("");
    setError("");
    onResend();
  }, [canResend, onResend]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex flex-col items-center justify-center px-5 text-center max-w-sm w-full"
    >
      {/* Cinematic backdrop — crisp tint + film grain + emerald orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,hsl(180_8%_7%_/_0.9)_75%)]" />
        <div className="absolute inset-0 bg-[hsl(var(--primary-green)_/_0.12)]" style={{ mixBlendMode: "overlay" }} />
        <motion.div
          className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,hsl(164_80%_45%/0.18)_0%,transparent_65%)]"
          animate={{ y: [0, 20, 0], x: [0, 14, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,hsl(180_70%_50%/0.14)_0%,transparent_65%)]"
          animate={{ y: [0, -18, 0], x: [0, -12, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      <motion.div variants={itemVariants} className="mb-6">
        <img src={hbLogoWhite} alt="Healing Buds" className="h-12 w-auto sm:h-14" />
      </motion.div>

      {/* Animated mail icon with gentle breathing pulse */}
      <motion.div variants={itemVariants} className="mb-3 flex flex-col items-center gap-3">
        <motion.div
          className="relative flex items-center justify-center h-14 w-14 rounded-2xl border border-[hsl(var(--accent-green)_/_0.25)] bg-[hsl(var(--accent-green)_/_0.08)] backdrop-blur-sm"
          animate={verified
            ? { scale: [1, 1.2, 1], borderColor: "hsl(164 48% 53% / 0.6)" }
            : { scale: [1, 1.05, 1] }
          }
          transition={verified
            ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <div className="absolute inset-0 rounded-2xl bg-[hsl(var(--accent-green)_/_0.1)] blur-md" />
          <AnimatePresence mode="wait">
            {verified ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <CheckCircle2 className="h-7 w-7 text-[hsl(var(--accent-green))]" />
              </motion.div>
            ) : (
              <motion.div
                key="mail"
                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <Mail className="h-6 w-6 text-[hsl(var(--accent-green))]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.h2
            key={verified ? "verified" : "verify"}
            initial={verified ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-[1.75rem] font-bold tracking-[-0.02em] sm:text-3xl"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: verified
                  ? "linear-gradient(110deg, hsl(164 60% 75%) 0%, hsl(164 90% 60%) 50%, hsl(180 75% 82%) 100%)"
                  : "linear-gradient(110deg, hsl(164 55% 72%) 0%, hsl(164 85% 58%) 35%, hsl(180 75% 82%) 50%, hsl(164 85% 58%) 65%, hsl(164 55% 72%) 100%)",
                backgroundSize: "200% 100%",
                animation: "auroraShift 6s ease-in-out infinite",
                WebkitBackgroundClip: "text",
                filter:
                  "drop-shadow(0 -1px 0 hsl(164 80% 88% / 0.65)) drop-shadow(0 1px 0 hsl(180 70% 3% / 0.9)) drop-shadow(0 2px 1px hsl(180 70% 3% / 0.55)) drop-shadow(0 0 28px hsl(164 80% 50% / 0.5))",
              }}
            >
              {verified ? "Verified!" : "Verify Your Email"}
            </span>
          </motion.h2>
        </AnimatePresence>
      </motion.div>
      <style>{`
        @keyframes auroraShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <motion.p variants={itemVariants} className="mb-1.5 text-sm text-muted-foreground leading-relaxed max-w-xs">
        We sent a 6-digit code to{" "}
        <span className="text-foreground font-medium">{email}</span>
      </motion.p>

      <motion.button
        variants={itemVariants}
        type="button"
        onClick={onBack}
        className="mb-5 text-xs text-[hsl(var(--accent-green))] hover:text-[hsl(var(--accent-green)_/_0.8)] transition-colors"
      >
        Wrong email?
      </motion.button>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-white/[0.08] bg-[hsl(180_20%_5%_/_0.88)] backdrop-blur-xl p-6 w-full relative overflow-hidden"
        style={{
          boxShadow:
            "0 30px 80px -20px hsl(180 30% 2% / 0.6), 0 0 0 1px hsl(164 80% 55% / 0.1), 0 0 40px -10px hsl(164 80% 55% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
        }}
      >
        {/* Aurora accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(164 70% 60%), hsl(180 70% 75%), hsl(164 70% 60%), transparent)",
            backgroundSize: "200% 100%",
            animation: "auroraShift 6s ease-in-out infinite",
          }}
        />

        {/* Inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,hsl(var(--accent-green)_/_0.06)_0%,transparent_60%)]" />

        <div className="flex justify-center mb-4 relative z-10">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={setValue}
            onComplete={handleComplete}
            disabled={verified || verifying}
          >
            <InputOTPGroup className="gap-2.5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={`!h-16 !w-12 sm:!w-14 !border !rounded-xl !bg-[hsl(180_10%_6%_/_0.85)] text-foreground !text-2xl font-bold backdrop-blur-sm transition-all duration-300 !ring-0 data-[active]:!ring-2 data-[active]:!ring-[hsl(164_90%_60%_/_0.7)] data-[active]:!border-[hsl(164_90%_60%)] data-[active]:!bg-[hsl(var(--accent-green)_/_0.12)] data-[active]:shadow-[0_0_0_4px_hsl(164_80%_55%_/_0.15),0_0_24px_-2px_hsl(164_90%_60%_/_0.55)] ${verified ? "!border-[hsl(var(--accent-green)_/_0.6)] !bg-[hsl(var(--accent-green)_/_0.12)] shadow-[0_0_18px_-2px_hsl(164_90%_60%_/_0.5)]" : "!border-[hsl(var(--accent-green)_/_0.22)]"}`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Success glow overlay */}
        <AnimatePresence>
          {verified && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,hsl(var(--accent-green)_/_0.08)_0%,transparent_70%)] pointer-events-none z-20"
            />
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive mb-3 relative z-10"
          >
            {error}
          </motion.p>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className="relative z-10 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[hsl(var(--accent-green))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] px-4"
        >
          <RotateCw className="h-3.5 w-3.5" />
          {canResend ? "Resend code" : `Resend in ${cooldown}s`}
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-green)_/_0.2)] bg-[hsl(var(--accent-green)_/_0.04)] px-4 py-2 text-xs text-muted-foreground"
      >
        <Shield className="h-3.5 w-3.5 text-[hsl(var(--accent-green))]" />
        <span>POPIA Compliant · Secure verification</span>
      </motion.div>
    </motion.div>
  );
};

export default OtpVerification;
