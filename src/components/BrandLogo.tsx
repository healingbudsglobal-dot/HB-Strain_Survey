import hbLogoWhite from "@/assets/hb-logo-white-full.svg";
import { cn } from "@/lib/utils";

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

const ETCH_FILTER =
  "drop-shadow(0 -0.5px 0 hsl(0 0% 100% / 0.85)) " +
  "drop-shadow(0 1px 0 hsl(180 65% 4% / 0.95)) " +
  "drop-shadow(0 2px 3px hsl(180 60% 3% / 0.55)) " +
  "drop-shadow(0 8px 18px hsl(180 60% 3% / 0.45))";

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
