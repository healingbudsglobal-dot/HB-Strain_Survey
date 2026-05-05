import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SqueezeScreen from "@/components/SqueezeScreen";
import SurveyFlow from "@/components/SurveyFlow";
import ContactCapture from "@/components/ContactCapture";
import LoadingScreen from "@/components/LoadingScreen";
import SuccessScreen from "@/components/SuccessScreen";
import OtpVerification from "@/components/OtpVerification";
import AmbientParticles from "@/components/AmbientParticles";
import StepProgress from "@/components/StepProgress";
import { surveyQuestions } from "@/data/surveyQuestions";
import { matchStrain, type StrainMatch } from "@/lib/strainMatcher";
import { sendOtpEmail, submitResults, postSurveyAnswersWebhook } from "@/lib/webhook";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useUtmTracking, utmToPayload } from "@/hooks/useUtmTracking";

type Screen = "squeeze" | "otp" | "survey" | "contact" | "loading" | "success";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Cinematic screen transition variants
const screenVariants = {
  initial: { opacity: 0, y: 40, scale: 0.97, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, scale: 1.02, filter: "blur(4px)" },
};

const screenTransition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1] as const,
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("squeeze");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [strainResult, setStrainResult] = useState<StrainMatch | null>(null);
  const { toast } = useToast();
  const utm = useUtmTracking();

  const stepIndex = useMemo(() => {
    const map: Record<Screen, number> = {
      squeeze: 0, otp: 1, survey: 2, contact: 3, loading: 4, success: 4,
    };
    return map[screen];
  }, [screen]);

  const handleEmailSubmit = useCallback(async (submittedEmail: string, submittedProvince: string) => {
    setEmail(submittedEmail);
    setProvince(submittedProvince);
    const code = generateOtp();
    setOtpCode(code);
    setScreen("otp");
    const success = await sendOtpEmail(submittedEmail, code);
    if (!success) {
      toast({
        title: "Email delivery issue",
        description: "Your verification code was sent via our backup system. Please check your inbox and spam folder.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleOtpVerified = useCallback(() => {
    setScreen("survey");
  }, []);

  const handleOtpBack = useCallback(() => {
    setScreen("squeeze");
  }, []);

  const handleOtpResend = useCallback(async () => {
    const code = generateOtp();
    setOtpCode(code);
    const success = await sendOtpEmail(email, code);
    if (!success) {
      toast({
        title: "Email delivery issue",
        description: "We had trouble sending your code. Please try again in a moment.",
        variant: "destructive",
      });
    }
  }, [email, toast]);

  const handleSurveyComplete = useCallback((answers: Record<string, string>) => {
    const result = matchStrain(answers);
    setStrainResult(result);
    setSurveyAnswers(answers);
    setScreen("contact");
  }, []);

  const handleSendResults = useCallback(
    async (contactName?: string, whatsappE164?: string, optIn?: boolean) => {
      if (!strainResult) return;

      setScreen("loading");

      const payload: Record<string, string> = {
        email,
        province,
        matched_strain: strainResult.strain.name,
        compatibility: `${strainResult.compatibility}%`,
        strain_effects: strainResult.strain.effects.join(", "),
        strain_flavours: strainResult.strain.flavours.join(", "),
        strain_thc: `${strainResult.strain.thc}%`,
        strain_cbd: `${strainResult.strain.cbd}%`,
        strain_price: strainResult.strain.price,
        strain_shop_url: strainResult.strain.shopUrl,
      };

      if (contactName) payload.name = contactName;
      if (whatsappE164) {
        payload.whatsapp = whatsappE164;
        payload.whatsapp_e164 = whatsappE164;
        payload.whatsapp_opt_in = optIn ? "true" : "false";
      }

      surveyQuestions.forEach((q) => {
        payload[q.id] = surveyAnswers[q.id] || "";
      });

      // Attach UTM / attribution
      Object.assign(payload, utmToPayload(utm));

      // Build the 15-answer map (one entry per survey question, in order)
      const answersMap: Record<string, string> = {};
      surveyQuestions.forEach((q) => {
        answersMap[q.id] = surveyAnswers[q.id] || "";
      });

      const [resultsOk, webhookRes] = await Promise.all([
        submitResults(payload),
        postSurveyAnswersWebhook(email, answersMap),
      ]);

      if (!resultsOk) {
        toast({
          title: "Results delivery issue",
          description: "Your results were sent via our backup system. Check your inbox shortly.",
          variant: "destructive",
        });
      }

      if (!webhookRes.ok) {
        toast({
          title: "We couldn't save your answers",
          description:
            webhookRes.status === 0
              ? "Network hiccup. Please check your connection and tap Retry."
              : `Server returned ${webhookRes.status}. Please tap Retry in a moment.`,
          variant: "destructive",
          action: (
            <ToastAction
              altText="Retry sending answers"
              onClick={() => {
                postSurveyAnswersWebhook(email, answersMap).then((r) => {
                  if (r.ok) {
                    toast({ title: "Answers sent", description: "Thanks — we got them this time." });
                  } else {
                    toast({
                      title: "Still having trouble",
                      description: "Please try again shortly or contact support.",
                      variant: "destructive",
                    });
                  }
                });
              }}
            >
              Retry
            </ToastAction>
          ),
        });
      }

      setTimeout(() => setScreen("success"), 3000);
    },
    [email, province, strainResult, surveyAnswers, utm, toast]
  );

  const handleContactSubmit = useCallback(
    (name: string, whatsappE164?: string, optIn?: boolean) => {
      handleSendResults(name, whatsappE164, optIn);
    },
    [handleSendResults]
  );

  const handleContactSkip = useCallback(() => {
    handleSendResults();
  }, [handleSendResults]);

  return (
    <div className="leaf-pattern relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden pb-[env(safe-area-inset-bottom)]">
      <AmbientParticles />

      {/* Step Progress - fixed at top, hidden on squeeze screen */}
      {screen !== "squeeze" && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 pt-[calc(env(safe-area-inset-top)+12px)] pb-3 px-6 backdrop-blur-md bg-[hsl(180_8%_7%_/_0.5)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StepProgress currentStep={stepIndex} />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          className="flex w-full items-center justify-center pt-20"
        >
          {screen === "squeeze" && <SqueezeScreen onSubmit={handleEmailSubmit} />}
          {screen === "otp" && (
            <OtpVerification
              email={email}
              otpCode={otpCode}
              onVerified={handleOtpVerified}
              onResend={handleOtpResend}
              onBack={handleOtpBack}
            />
          )}
          {screen === "survey" && <SurveyFlow onComplete={handleSurveyComplete} />}
          {screen === "contact" && (
            <ContactCapture
              onSubmit={handleContactSubmit}
              onSkip={handleContactSkip}
              strainName={strainResult?.strain.name}
              userEmail={email}
            />
          )}
          {screen === "loading" && <LoadingScreen />}
          {screen === "success" && <SuccessScreen result={strainResult} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
