import { motion } from "framer-motion";
import heroFlower from "@/assets/hero-flower.jpg";

/**
 * Crystal-clear hero image with a dark emerald-glass overlay.
 * Image stays sharp and unfiltered; depth comes from the tinted glass plate above it.
 */
const HeroBackdrop = () => (
  <motion.div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
  >
    {/* 1. Flower image — soft blur + saturation lift, like looking through a rain-flecked window */}
    <motion.img
      src={heroFlower}
      alt=""
      className="absolute top-1/2 left-1/2 w-[145vw] h-[145vh] max-w-none object-cover"
      style={{
        transform: "translate(-50%, -50%)",
        filter: "saturate(1.15) contrast(1.18) brightness(0.95)",
      }}
      initial={{ scale: 1.12, x: "-50%", y: "-50%" }}
      animate={{ scale: 1.0, x: "-50%", y: "-50%" }}
      transition={{ duration: 32, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />

    {/* 2. Dark emerald glass tint — light enough to keep image crisp and visible */}
    <div className="absolute inset-0 bg-[hsl(165_55%_6%_/_0.55)]" />

    {/* 3. Subtle radial vignette — keeps center slightly clearer, edges fall to near-black */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_85%_at_50%_50%,transparent_35%,hsl(170_50%_3%_/_0.55)_80%,hsl(180_50%_2%_/_0.9)_100%)]" />

    {/* 4. Top + bottom legibility scrims */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180_45%_3%_/_0.45)] via-transparent to-[hsl(180_50%_2%_/_0.78)]" />

    {/* 5. Faint film grain — kills banding */}
    <div
      className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  </motion.div>
);

export default HeroBackdrop;
