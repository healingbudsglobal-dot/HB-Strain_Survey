import { motion } from "framer-motion";
import heroFlower from "@/assets/hero-flower.jpg";

/**
 * Cinematic dark-emerald hero backdrop.
 * Layered: deep emerald base → macro flower image (low-key, emerald-graded) →
 * radial spotlight → emerald rim glows → controlled vignette + scrims.
 * Inspired by award-winning wellness landers (rich blacks, single emerald light source).
 */
const HeroBackdrop = () => (
  <motion.div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
  >
    {/* 1. Deep emerald base — never let pure black show through */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,hsl(165_55%_9%)_0%,hsl(172_50%_5%)_55%,hsl(180_40%_3%)_100%)]" />

    {/* 2. Macro flower image — heavily graded toward emerald, low brightness, soft Ken Burns */}
    <motion.img
      src={heroFlower}
      alt=""
      className="absolute top-1/2 left-1/2 w-[140vw] h-[140vh] max-w-none object-cover opacity-[0.55]"
      style={{
        transform: "translate(-50%, -50%)",
        filter: "saturate(1.4) contrast(1.35) brightness(0.42) hue-rotate(-8deg)",
        mixBlendMode: "screen",
      }}
      initial={{ scale: 1.18, x: "-50%", y: "-50%" }}
      animate={{ scale: 1.02, x: "-50%", y: "-50%" }}
      transition={{ duration: 32, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />

    {/* 3. Emerald multiply pass — unifies the frame to a single brand hue */}
    <div
      className="absolute inset-0 bg-[hsl(168_70%_10%_/_0.55)]"
      style={{ mixBlendMode: "multiply" }}
    />

    {/* 4. Off-center emerald spotlight — single dramatic light source */}
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,hsl(160_75%_28%_/_0.42)_0%,hsl(168_60%_15%_/_0.18)_28%,transparent_60%)]"
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
    />

    {/* 5. Bottom-corner emerald rim glows — depth without distraction */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_88%,hsl(150_70%_22%_/_0.18),transparent_38%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_82%,hsl(178_55%_20%_/_0.16),transparent_42%)]" />

    {/* 6. Controlled vignette — edges fall to near-black */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_85%_at_50%_50%,transparent_45%,hsl(180_45%_3%_/_0.55)_75%,hsl(180_50%_2%_/_0.92)_100%)]" />

    {/* 7. Top + bottom legibility scrims (form area) */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180_45%_3%_/_0.55)] via-transparent to-[hsl(180_50%_2%_/_0.85)]" />

    {/* 8. Subtle film grain — kills banding, adds editorial texture */}
    <div
      className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  </motion.div>
);

export default HeroBackdrop;
