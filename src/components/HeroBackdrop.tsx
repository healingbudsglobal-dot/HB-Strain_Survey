import { motion } from "framer-motion";
import heroFlower from "@/assets/hero-flower.jpg";

/**
 * Full-viewport cinematic hero backdrop.
 * Rendered at the page root (outside any transformed ancestor) so
 * `fixed inset-0` truly covers the entire viewport on every screen size.
 */
const HeroBackdrop = () => (
  <motion.div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
  >
    <motion.img
      src={heroFlower}
      alt=""
      className="absolute top-1/2 left-1/2 w-[130vw] h-[130vh] max-w-none object-cover"
      style={{
        transform: "translate(-50%, -50%)",
        // Pull warm magenta toward forest green; reduce saturation for editorial calm
        filter: "saturate(0.55) contrast(1.05) brightness(0.85) hue-rotate(60deg)",
      }}
      initial={{ scale: 1.12, x: "-50%", y: "-50%" }}
      animate={{ scale: 1.0, x: "-50%", y: "-50%" }}
      transition={{ duration: 28, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />
    {/* Deep forest tint — unifies image with brand */}
    <div className="absolute inset-0 bg-[hsl(178_55%_10%_/_0.65)]" style={{ mixBlendMode: "multiply" }} />
    {/* Strong vignette + bottom-anchored scrim so form sits on a calm dark plate */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180_15%_5%_/_0.55)] via-[hsl(180_15%_5%_/_0.25)] to-[hsl(180_15%_4%_/_0.92)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_55%,transparent_0%,hsl(180_15%_4%_/_0.55)_100%)]" />
    {/* Subtle warm green glow at center to lift focal area */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,hsl(var(--accent-green)_/_0.10),transparent_60%)]" />
  </motion.div>
);

export default HeroBackdrop;
