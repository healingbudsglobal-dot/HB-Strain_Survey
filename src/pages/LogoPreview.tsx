import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import budMacro from "@/assets/hero-emerald-bud.jpg";
import { cn } from "@/lib/utils";

type Vignette = "none" | "subtle" | "strong";
type Size = "sm" | "md" | "lg" | "xl";

const NOISE_BG = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.55'/></svg>`
)}")`;

const TILES: { name: string; css: string; background: string }[] = [
  {
    name: "Solid primary green",
    css: "hsl(178 48% 21%)",
    background: "hsl(178 48% 21%)",
  },
  {
    name: "Gradient: teal midnight",
    css: "linear-gradient(135deg, hsl(178 48% 33%), hsl(178 48% 21%))",
    background: "linear-gradient(135deg, hsl(178 48% 33%), hsl(178 48% 21%))",
  },
  {
    name: "Gradient: sage radial",
    css: "radial-gradient(ellipse at center top, hsl(171 12% 92%) 0%, hsl(171 12% 85%) 25%, hsl(178 48% 40%) 60%, hsl(178 48% 33%) 100%)",
    background:
      "radial-gradient(ellipse at center top, hsl(171 12% 92%) 0%, hsl(171 12% 85%) 25%, hsl(178 48% 40%) 60%, hsl(178 48% 33%) 100%)",
  },
  {
    name: "Hero gradient over off-white",
    css: "linear-gradient(180deg, rgba(77,191,161,0.2), rgba(44,125,122,0.15)) over #F4F7F4",
    background:
      "linear-gradient(180deg, rgba(77,191,161,0.2), rgba(44,125,122,0.15)), hsl(150 12% 97%)",
  },
  {
    name: "Bud photo",
    css: "url(hero-emerald-bud.jpg) cover",
    background: `center/cover no-repeat url(${budMacro})`,
  },
  {
    name: "Noisy textured deep teal",
    css: "turbulence overlay on deep teal",
    background: `${NOISE_BG}, hsl(178 48% 21%)`,
  },
];

const SIZES: Size[] = ["sm", "md", "lg", "xl"];
const VIGNETTES: Vignette[] = ["none", "subtle", "strong"];

export default function LogoPreview() {
  const [vignette, setVignette] = useState<Vignette>("subtle");
  const [size, setSize] = useState<Size>("lg");
  const [density, setDensity] = useState(1);
  const [darkChrome, setDarkChrome] = useState(true);

  return (
    <div
      className={cn(
        "min-h-screen p-6",
        darkChrome ? "bg-[hsl(180_10%_8%)] text-white" : "bg-[hsl(150_12%_97%)] text-[hsl(178_48%_21%)]"
      )}
    >
      <header className="mb-6 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">BrandLogo Preview</h1>
        <p className="text-sm opacity-70">
          Internal tool. Compare the etched logo across backdrops and confirm the white wordmark
          reads at least as well as the 60% white swatch in the contrast strip.
        </p>

        <div className="flex flex-wrap items-end gap-6 rounded-lg border border-white/10 bg-black/20 p-4">
          <ControlGroup label="Vignette">
            {VIGNETTES.map((v) => (
              <Pill key={v} active={vignette === v} onClick={() => setVignette(v)}>
                {v}
              </Pill>
            ))}
          </ControlGroup>

          <ControlGroup label="Size">
            {SIZES.map((s) => (
              <Pill key={s} active={size === s} onClick={() => setSize(s)}>
                {s}
              </Pill>
            ))}
          </ControlGroup>

          <ControlGroup label={`Pattern density: ${density.toFixed(2)}`}>
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.05}
              value={density}
              onChange={(e) => setDensity(parseFloat(e.target.value))}
              className="w-48"
            />
          </ControlGroup>

          <ControlGroup label="Page chrome">
            <Pill active={darkChrome} onClick={() => setDarkChrome(true)}>
              dark
            </Pill>
            <Pill active={!darkChrome} onClick={() => setDarkChrome(false)}>
              light
            </Pill>
          </ControlGroup>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {TILES.map((t) => (
          <Tile
            key={t.name}
            name={t.name}
            css={t.css}
            background={t.background}
            vignette={vignette}
            size={size}
            density={density}
          />
        ))}
      </main>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wider opacity-60">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-white bg-white text-black"
          : "border-white/30 bg-transparent text-current hover:border-white/60"
      )}
    >
      {children}
    </button>
  );
}

function Tile({
  name,
  css,
  background,
  vignette,
  size,
  density,
}: {
  name: string;
  css: string;
  background: string;
  vignette: Vignette;
  size: Size;
  density: number;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-white/10 shadow-lg">
      <div
        className="relative flex aspect-[4/3] items-center justify-center"
        style={{ background }}
      >
        <BrandLogo size={size} vignette={vignette} fiberDensity={density} priority />

        {/* Contrast guide strip: pure white at 100/80/60/40/20% */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-md bg-black/30 p-1.5 backdrop-blur-sm">
          <span className="text-[10px] uppercase tracking-wider text-white/80">white @</span>
          {[1, 0.8, 0.6, 0.4, 0.2].map((o) => (
            <div key={o} className="flex flex-1 flex-col items-center gap-0.5">
              <div
                className="h-3 w-full rounded-sm"
                style={{ backgroundColor: `rgba(255,255,255,${o})` }}
              />
              <span className="text-[9px] text-white/70">{Math.round(o * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="space-y-0.5 bg-black/40 px-3 py-2 text-white">
        <div className="text-sm font-medium">{name}</div>
        <code className="block truncate text-[10px] opacity-60">{css}</code>
      </figcaption>
    </figure>
  );
}
