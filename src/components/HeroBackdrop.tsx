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
      className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] max-w-none object-cover"
      style={{
        transform: "translate(-50%, -50%)",
        filter: "saturate(1.15) contrast(1.05) brightness(1.05) hue-rotate(-8deg)",
      }}
      initial={{ scale: 1.1, x: "-50%", y: "-50%" }}
      animate={{ scale: 1.0, x: "-50%", y: "-50%" }}
      transition={{ duration: 24, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />
    {/* Brand-cohesive deep teal tint — pulls the image toward forest */}
    <div className="absolute inset-0 bg-[hsl(178_48%_15%_/_0.45)]" style={{ mixBlendMode: "multiply" }} />
    {/* Soft top + bottom legibility gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180_8%_7%_/_0.55)] via-transparent to-[hsl(180_8%_7%_/_0.85)]" />
    {/* Subtle accent-green spotlight */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent-green)_/_0.08),transparent_70%)]" />
  </motion.div>
);

export default HeroBackdrop;
