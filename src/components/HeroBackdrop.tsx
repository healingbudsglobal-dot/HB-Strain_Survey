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
      className="absolute top-1/2 left-1/2 w-[140vw] h-[140vh] max-w-none object-cover"
      style={{
        transform: "translate(-50%, -50%)",
        filter: "saturate(1.05) contrast(1.15) brightness(0.65)",
      }}
      initial={{ scale: 1.15, x: "-50%", y: "-50%" }}
      animate={{ scale: 1.0, x: "-50%", y: "-50%" }}
      transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />
    {/* Forest tint — subtle brand cohesion */}
    <div className="absolute inset-0 bg-[hsl(178_60%_8%_/_0.55)]" style={{ mixBlendMode: "multiply" }} />
    {/* Heavy radial vignette — form sits on near-black, edges keep texture */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_55%,hsl(180_20%_3%_/_0.85)_0%,hsl(180_20%_3%_/_0.55)_45%,transparent_100%)]" />
    {/* Top + bottom legibility scrims */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180_20%_3%_/_0.6)] via-transparent to-[hsl(180_20%_3%_/_0.95)]" />
    {/* Faint accent glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(var(--accent-green)_/_0.08),transparent_55%)]" />
  </motion.div>
);

export default HeroBackdrop;
