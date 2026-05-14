import { useState, useEffect, useCallback, useRef } from "react";
import { Shield, RotateCw, Mail, CheckCircle2, Clock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { BrandLogo } from "@/components/BrandLogo";
import { verifyOtp } from "@/lib/webhook";
import { markOtpReady } from "@/lib/perf";

const LOCKOUT_SECONDS = 60;

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
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const otpContainerRef = useRef<HTMLDivElement>(null);

  const focusOtpInput = useCallback(() => {
    const el = otpContainerRef.current?.querySelector<HTMLInputElement>("input");
    el?.focus();
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      markOtpReady();
      focusOtpInput();
    });
    return () => cancelAnimationFrame(id);
  }, [focusOtpInput]);

  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setTimeout(() => setLockoutSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [lockoutSeconds]);

  const handleComplete = useCallback(
    async (val: string) => {
      if (lockoutSeconds > 0) return;
      setVerifying(true);
      setError("");
      const result = await verifyOtp(email, val);
      setVerifying(false);
      if (result.ok === true) {
        setVerified(true);
        setTimeout(() => onVerified(), 700);
        return;
      }
      const reason = (result as { ok: false; reason: string }).reason;
      const msg: Record<string, string> = {
        invalid_code: "Incorrect code. Please try again.",
        expired: "This code has expired. Tap Resend to get a new one.",
        already_used: "This code was already used. Tap Resend for a new one.",
        no_code: "No code found. Tap Resend to get a new one.",
        too_many_attempts: "Too many attempts. Please wait before trying again.",
        invalid_input: "Please enter all 6 digits.",
        server_error: "Verification service unavailable. Please try again.",
        network_error: "Network error. Check your connection and retry.",
      };
      setError(msg[reason] ?? "Incorrect or expired code. Please try again.");
      setValue("");
      if (reason === "too_many_attempts") {
        setLockoutSeconds(LOCKOUT_SECONDS);
      } else {
        // Re-focus input for quick retry
        setTimeout(() => focusOtpInput(), 50);
      }
      if (["expired", "already_used", "no_code"].includes(reason)) {
        setCanResend(true);
        setCooldown(0);
      }
    },
    [email, onVerified, lockoutSeconds, focusOtpInput]
  );

  const handleResend = useCallback(() => {
    if (!canResend || lockoutSeconds > 0) return;
    setCanResend(false);
    setCooldown(30);
    setValue("");
    setError("");
    onResend();
    setTimeout(() => focusOtpInput(), 50);
  }, [canResend, lockoutSeconds, onResend, focusOtpInput]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-5 text-center max-w-sm w-full">
      <div className="mb-6">
        <BrandLogo size="md" vignette="subtle" priority />
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

        <h2 className="font-display text-[1.75rem] font-bold tracking-[-0.02em] sm:text-3xl text-foreground text-etched">
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
        <div ref={otpContainerRef} className="flex justify-center mb-4">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={setValue}
            onComplete={handleComplete}
            disabled={verified || verifying || lockoutSeconds > 0}
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

        {lockoutSeconds > 0 ? (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--accent-green)_/_0.2)] bg-[hsl(var(--accent-green)_/_0.06)] px-3 py-2.5 text-sm text-foreground">
            <Clock className="h-4 w-4 text-[hsl(var(--accent-green))]" />
            <span>
              Too many attempts — try again in{" "}
              <span className="font-semibold text-[hsl(var(--accent-green))]">{lockoutSeconds}s</span>
            </span>
          </div>
        ) : (
          error && <p className="text-sm text-destructive mb-3" role="alert">{error}</p>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || lockoutSeconds > 0}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[hsl(var(--accent-green))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] px-4"
        >
          <RotateCw className="h-3.5 w-3.5" />
          {lockoutSeconds > 0
            ? `Locked (${lockoutSeconds}s)`
            : canResend
            ? "Resend code"
            : `Resend in ${cooldown}s`}
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
