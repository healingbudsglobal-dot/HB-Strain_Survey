import OtpVerification from "@/components/OtpVerification";

declare global {
  interface Window {
    __otpVerified?: boolean;
    __otpResent?: number;
    __otpBack?: boolean;
  }
}

const OtpTestHarness = () => {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-10">
      <OtpVerification
        email="e2e-test@example.com"
        onVerified={() => {
          window.__otpVerified = true;
        }}
        onResend={() => {
          window.__otpResent = (window.__otpResent ?? 0) + 1;
        }}
        onBack={() => {
          window.__otpBack = true;
        }}
      />
    </div>
  );
};

export default OtpTestHarness;
