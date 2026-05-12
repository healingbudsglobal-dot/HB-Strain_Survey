import hbLogoWhite from "@/assets/hb-logo-white-full.svg";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * BrandLogo
 * Single source of truth for the Healing Buds wordmark on dark-green surfaces.
 * - Etched filter: crisp 1px white top highlight + 1px deep-teal bottom shadow,
 *   tightened contact shadow + softer ambient lift. Stays readable on bright bud
 *   highlights, uniform deep-teal, and noisy vignette gradients.
 * - Optional vignette: aria-hidden radial gradient placed behind the mark to
 *   guarantee local contrast on busy backdrops.
 */

type Size = "sm" | "md" | "lg" | "xl";
type Vignette = "none" | "subtle" | "strong";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-10 w-auto",
  md: "h-12 w-auto sm:h-14",
  lg: "h-14 w-auto sm:h-16",
  xl: "h-28 w-auto sm:h-36 md:h-40",
};

const ETCH_FILTER_FULL =
  "drop-shadow(0 -0.5px 0 hsl(0 0% 100% / 0.85)) " +
  "drop-shadow(0 1px 0 hsl(180 65% 4% / 0.95)) " +
  "drop-shadow(0 2px 3px hsl(180 60% 3% / 0.55)) " +
  "drop-shadow(0 8px 18px hsl(180 60% 3% / 0.45))";

/** Mobile path: keep top highlight + crisp 1px bottom shadow only. */
const ETCH_FILTER_LITE =
  "drop-shadow(0 -0.5px 0 hsl(0 0% 100% / 0.85)) " +
  "drop-shadow(0 1px 0 hsl(180 65% 4% / 0.95))";

/**
 * Inline SVG: low-amplitude turbulence + a handful of hair-thin diagonal
 * fibers. Encoded as a data URI so it scales crisply, costs no network, and
 * inherits no external dependency. Stroke uses currentColor (white) so the
 * texture stays theme-friendly via the wrapper's color.
 */
const FIBER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='120' viewBox='0 0 220 120'>
  <defs>
    <filter id='g'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4'/>
      <feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/>
    </filter>
  </defs>
  <rect width='100%' height='100%' filter='url(#g)' opacity='0.6'/>
  <g stroke='white' stroke-width='0.4' stroke-linecap='round' opacity='0.55'>
    <line x1='-10' y1='10' x2='230' y2='70' transform='rotate(-4 110 60)'/>
    <line x1='-10' y1='28' x2='230' y2='84'/>
    <line x1='-10' y1='46' x2='230' y2='100' transform='rotate(2 110 60)'/>
    <line x1='-10' y1='64' x2='230' y2='118'/>
    <line x1='-10' y1='80' x2='230' y2='30' transform='rotate(-3 110 60)'/>
    <line x1='-10' y1='96' x2='230' y2='46'/>
    <line x1='40' y1='-10' x2='80' y2='130' transform='rotate(8 60 60)'/>
    <line x1='150' y1='-10' x2='180' y2='130' transform='rotate(-6 165 60)'/>
  </g>
</svg>`;
const FIBER_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(FIBER_SVG)}")`;
const FIBER_MASK =
  "radial-gradient(ellipse at center, hsl(0 0% 0%) 35%, hsl(0 0% 0% / 0.6) 60%, transparent 80%)";

interface BrandLogoProps {
  size?: Size;
  vignette?: Vignette;
  className?: string;
  priority?: boolean;
  /** Optional ref-like className for the inner <img>, e.g. extra z-index. */
  imgClassName?: string;
}

export function BrandLogo({
  size = "md",
  vignette = "subtle",
  className,
  priority = false,
  imgClassName,
}: BrandLogoProps) {
  const isMobile = useIsMobile();
  const lite = isMobile;
  return (
    <div className={cn("relative inline-block", className)}>
      {vignette !== "none" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -z-0 rounded-[40%]",
            vignette === "strong"
              ? "-inset-x-10 -inset-y-6"
              : "-inset-x-6 -inset-y-4"
          )}
          style={{
            background:
              vignette === "strong"
                ? "radial-gradient(ellipse at center, hsl(180 50% 4% / 0.78) 0%, hsl(180 50% 4% / 0.55) 35%, hsl(180 50% 4% / 0.18) 65%, transparent 85%)"
                : "radial-gradient(ellipse at center, hsl(180 50% 4% / 0.35) 0%, hsl(180 50% 4% / 0.20) 45%, transparent 78%)",
            filter: vignette === "strong" ? "blur(8px)" : "blur(6px)",
          }}
        />
      )}
      {vignette !== "none" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-[1] rounded-[40%]",
            vignette === "strong"
              ? "-inset-x-8 -inset-y-5"
              : "-inset-x-5 -inset-y-3"
          )}
          style={{
            backgroundImage: FIBER_URL,
            backgroundSize: "220px 120px",
            backgroundRepeat: "repeat",
            opacity: vignette === "strong" ? 0.18 : 0.12,
            mixBlendMode: "soft-light",
            WebkitMaskImage: FIBER_MASK,
            maskImage: FIBER_MASK,
          }}
        />
      )}
      <img
        src={hbLogoWhite}
        alt="Healing Buds"
        draggable={false}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        className={cn(SIZE_CLASSES[size], "relative z-10", imgClassName)}
        style={{ filter: ETCH_FILTER }}
      />
    </div>
  );
}

export default BrandLogo;
