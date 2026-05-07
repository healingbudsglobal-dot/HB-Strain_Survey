/**
 * BudAmbient
 * Soft, blurred macro-bud imagery layered as cinematic backdrop.
 * Sits beneath NeuronAmbient. No humans. Pure botanical texture.
 */
import budMacro from "@/assets/bud-macro.jpg";

const BudAmbient = ({ intensity = 1 }: { intensity?: number }) => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      style={{ opacity: 0.32 * intensity, transform: "translateZ(0)", willChange: "opacity", backfaceVisibility: "hidden" }}
    >
      {/* Top-left bud */}
      <div
        className="absolute -top-24 -left-24 h-[55vmax] w-[55vmax] rounded-full"
        style={{
          backgroundImage: `url(${budMacro})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(36px) saturate(1.15) hue-rotate(-8deg)",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 72%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Bottom-right bud, mirrored */}
      <div
        className="absolute -bottom-32 -right-32 h-[60vmax] w-[60vmax] rounded-full"
        style={{
          backgroundImage: `url(${budMacro})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scaleX(-1)",
          filter: "blur(44px) saturate(1.2) hue-rotate(6deg)",
          maskImage: "radial-gradient(circle at center, black 28%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 28%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Deep emerald wash to keep contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(178 48% 8% / 0.78) 0%, hsl(176 50% 5% / 0.82) 60%, hsl(180 60% 4% / 0.92) 100%)",
        }}
      />
    </div>
  );
};

export default BudAmbient;
