import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const AmbientParticles = () => {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3.5,
      duration: 18 + Math.random() * 25,
      delay: Math.random() * 10,
      opacity: 0.06 + Math.random() * 0.12,
      color: i % 4 === 0 ? "var(--accent-green)" : i % 4 === 1 ? "var(--primary)" : i % 4 === 2 ? "var(--deep-teal)" : "var(--brand-gold)",
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Green-dominant radial glows — cohesive with healingbuds.co.za */}
      <div className="absolute top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-[hsl(var(--accent-green)_/_0.04)] blur-[120px] animate-float" />
      <div className="absolute bottom-[15%] right-[10%] h-[400px] w-[400px] rounded-full bg-[hsl(var(--primary-green)_/_0.05)] blur-[100px]" style={{ animation: "orbFloat 20s ease-in-out infinite reverse" }} />
      <div className="absolute top-[60%] left-[60%] h-[300px] w-[300px] rounded-full bg-[hsl(var(--deep-teal)_/_0.04)] blur-[80px]" style={{ animation: "orbFloat 25s ease-in-out infinite" }} />
      <div className="absolute top-[30%] right-[30%] h-[350px] w-[350px] rounded-full bg-[hsl(var(--secondary-green)_/_0.035)] blur-[100px]" style={{ animation: "orbFloat 18s ease-in-out infinite" }} />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `hsl(${p.color})`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -60, -20, -90, 0],
            x: [0, 15, -10, 8, 0],
            opacity: [p.opacity, p.opacity * 1.4, p.opacity * 0.6, p.opacity * 1.1, p.opacity],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-green)_/_0.05)] to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default AmbientParticles;
