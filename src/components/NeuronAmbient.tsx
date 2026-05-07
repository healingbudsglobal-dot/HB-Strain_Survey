/**
 * NeuronAmbient
 * Pure SVG/CSS neural-signal background. No video, no humans.
 */
const PATHS = [
  "M -40 120 C 120 60, 240 220, 380 140 S 620 80, 780 200",
  "M 0 360 C 160 300, 300 460, 480 380 S 720 320, 900 420",
  "M 60 600 C 200 540, 360 700, 520 620 S 740 560, 920 660",
  "M 80 -20 C 220 100, 360 40, 500 160 S 700 240, 880 180",
  "M -20 780 C 160 700, 320 860, 500 780 S 720 720, 900 820",
];

const NODES = [
  { cx: 120, cy: 110, r: 2.6, d: 0 },
  { cx: 320, cy: 180, r: 1.8, d: 1.2 },
  { cx: 540, cy: 90, r: 2.2, d: 2.4 },
  { cx: 760, cy: 200, r: 2.8, d: 0.6 },
  { cx: 180, cy: 350, r: 2.0, d: 3.1 },
  { cx: 460, cy: 410, r: 2.6, d: 1.8 },
  { cx: 720, cy: 380, r: 1.6, d: 4.0 },
  { cx: 240, cy: 600, r: 2.4, d: 2.0 },
  { cx: 520, cy: 620, r: 2.0, d: 3.5 },
  { cx: 800, cy: 660, r: 2.8, d: 0.9 },
];

import { useReducedMotion } from "framer-motion";

const NeuronAmbient = ({ intensity = 1 }: { intensity?: number }) => {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: 0.55 * intensity }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, hsl(180 40% 6% / 0) 0%, hsl(180 40% 5% / 0.55) 70%, hsl(180 50% 3% / 0.85) 100%)",
        }}
      />
      <svg
        viewBox="0 0 900 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ mixBlendMode: "screen" }}
      >
        <defs>
          <linearGradient id="nrvGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(330 95% 72%)" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(330 95% 72%)" stopOpacity="0.95" />
            <stop offset="50%" stopColor="hsl(0 0% 100%)" stopOpacity="1" />
            <stop offset="80%" stopColor="hsl(155 90% 60%)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(155 90% 60%)" stopOpacity="0" />
          </linearGradient>
          <filter id="nrvGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="hsl(155 95% 75%)" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(180 80% 60%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(180 80% 60%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g
          stroke="hsl(165 60% 55%)"
          strokeOpacity="0.18"
          strokeWidth="1"
          fill="none"
          filter="url(#nrvGlow)"
        >
          {PATHS.map((d, i) => (
            <path key={`base-${i}`} d={d} />
          ))}
        </g>

        <g fill="none" strokeWidth="2.2" filter="url(#nrvGlow)">
          {PATHS.map((d, i) => (
            <path
              key={`pulse-${i}`}
              d={d}
              stroke="url(#nrvGrad)"
              strokeDasharray="120 1400"
              strokeLinecap="round"
              style={{
                animation: `nrvDash ${9 + i * 1.4}s cubic-bezier(0.65,0.05,0.36,1) ${i * 1.1}s infinite`,
              }}
            />
          ))}
        </g>

        <g>
          {NODES.map((n, i) => (
            <g key={`n-${i}`} style={{ animation: `nrvNode 5.5s ease-in-out ${n.d}s infinite`, transformOrigin: `${n.cx}px ${n.cy}px` }}>
              <circle cx={n.cx} cy={n.cy} r={n.r * 6} fill="url(#nodeGlow)" opacity="0.55" />
              <circle cx={n.cx} cy={n.cy} r={n.r} fill="hsl(160 90% 80%)" />
            </g>
          ))}
        </g>
      </svg>

      <style>{`
        @keyframes nrvDash {
          0%   { stroke-dashoffset: 1400; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { stroke-dashoffset: -120; opacity: 0; }
        }
        @keyframes nrvNode {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50%      { opacity: 1;    transform: scale(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="nrvDash"], [style*="nrvNode"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default NeuronAmbient;
