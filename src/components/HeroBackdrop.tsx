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
        filter: "blur(2.5px) saturate(1.18) contrast(1.05)",
      }}
      initial={{ scale: 1.12, x: "-50%", y: "-50%" }}
      animate={{ scale: 1.0, x: "-50%", y: "-50%" }}
      transition={{ duration: 32, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />

    {/* 1b. Condensation droplets — SVG turbulence beading across the glass */}
    <div
      className="absolute inset-0 opacity-[0.18] mix-blend-screen"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='d'><feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 18 -7'/><feGaussianBlur stdDeviation='1.2'/></filter><rect width='100%' height='100%' filter='url(%23d)'/></svg>\")",
        backgroundSize: "700px 700px",
      }}
    />

    {/* 1c. Streaks running down — vertical wet trails */}
    <div
      className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='800'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.6 0.008' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.5 -0.4'/></filter><rect width='100%' height='100%' filter='url(%23s)'/></svg>\")",
        backgroundSize: "500px 1000px",
      }}
    />

    {/* 2. Dark emerald glass plate — almost black, deep brand tint */}
    <div className="absolute inset-0 bg-[hsl(165_55%_6%_/_0.72)]" />

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
