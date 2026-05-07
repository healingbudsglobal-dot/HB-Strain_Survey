import { useState, useEffect, useCallback } from "react";
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
        setTimeout(() => onVerified(), 700);
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
    <div className="relative z-10 flex flex-col items-center justify-center px-5 text-center max-w-sm w-full">
      <div className="mb-6">
        <img src={hbLogoWhite} alt="Healing Buds" className="h-12 w-auto sm:h-14" />
      </div>

      <div className="mb-3 flex flex-col items-center gap-3">
        <div
          className={`relative flex items-center justify-center h-14 w-14 rounded-2xl border bg-[hsl(var(--accent-green)_/_0.08)] transition-colors duration-200 ${verified ? "border-[hsl(var(--accent-green)_/_0.6)]" : "border-[hsl(var(--accent-green)_/_0.25)]"}`}
        >
          {verified ? (
            <CheckCircle2 className="h-7 w-7 text-[hsl(var(--accent-green))]" />
          ) : (
            <Mail className="h-6 w-6 text-[hsl(var(--accent-green))]" />
          )}
        </div>

        <h2 className="font-display text-[1.75rem] font-bold tracking-[-0.02em] sm:text-3xl text-foreground">
          {verified ? "Verified!" : "Verify Your Email"}
        </h2>
      </div>

      <p className="mb-1.5 text-sm text-muted-foreground leading-relaxed max-w-xs">
        We sent a 6-digit code to{" "}
        <span className="text-foreground font-medium">{email}</span>
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-xs text-[hsl(var(--accent-green))] hover:text-[hsl(var(--accent-green)_/_0.8)] transition-colors"
      >
        Wrong email?
      </button>

      <div className="rounded-2xl border border-white/[0.08] bg-[hsl(180_20%_5%_/_0.92)] p-6 w-full">
        <div className="flex justify-center mb-4">
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
                  className={`!h-16 !w-12 sm:!w-14 !border !rounded-xl !bg-[hsl(180_10%_6%_/_0.85)] text-foreground !text-2xl font-bold !ring-0 data-[active]:!ring-2 data-[active]:!ring-[hsl(164_90%_60%_/_0.7)] data-[active]:!border-[hsl(164_90%_60%)] data-[active]:!bg-[hsl(var(--accent-green)_/_0.12)] ${verified ? "!border-[hsl(var(--accent-green)_/_0.6)] !bg-[hsl(var(--accent-green)_/_0.12)]" : "!border-[hsl(var(--accent-green)_/_0.22)]"}`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <p className="text-sm text-destructive mb-3">{error}</p>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[hsl(var(--accent-green))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] px-4"
        >
          <RotateCw className="h-3.5 w-3.5" />
          {canResend ? "Resend code" : `Resend in ${cooldown}s`}
        </button>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-green)_/_0.2)] bg-[hsl(var(--accent-green)_/_0.04)] px-4 py-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-[hsl(var(--accent-green))]" />
        <span>POPIA Compliant · Secure verification</span>
      </div>
    </div>
  );
};

export default OtpVerification;
