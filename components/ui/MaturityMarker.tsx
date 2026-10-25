import { cn } from "@/lib/cn";
import type { Maturity } from "@/lib/content";

/*
 * The one site-wide maturity marker (lib/content.ts MATURITY_LABELS):
 *   validated    "Built & validated"   solid lime square
 *   experimental "Built, experimental" lime outline with a lime core
 *   in-progress  "In progress"         dashed lime outline, half filled
 *   planned      "Planned"             dashed steel outline
 * Shape differs per level, so status never relies on colour alone; always render the label
 * text next to it. No hooks: safe in server and client components.
 */

/** Square maturity marker (SVG so dashes render reliably at small sizes). Decorative. Size via className. */
export function MaturityMarker({ maturity, className }: { maturity: Maturity; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 9 9" className={cn("size-[9px] shrink-0", className)}>
      {maturity === "validated" && <rect x="0" y="0" width="9" height="9" className="fill-lime" />}
      {maturity === "experimental" && (
        <>
          <rect x="0.5" y="0.5" width="8" height="8" fill="none" className="stroke-lime" strokeWidth="1" />
          <rect x="3" y="3" width="3" height="3" className="fill-lime" />
        </>
      )}
      {maturity === "in-progress" && (
        <>
          <rect
            x="0.5"
            y="0.5"
            width="8"
            height="8"
            fill="none"
            className="stroke-lime"
            strokeWidth="1"
            strokeDasharray="2 1.5"
          />
          <rect x="0.5" y="4.5" width="8" height="4" className="fill-lime/70" />
        </>
      )}
      {maturity === "planned" && (
        <rect
          x="0.5"
          y="0.5"
          width="8"
          height="8"
          fill="none"
          className="stroke-subtle"
          strokeWidth="1"
          strokeDasharray="2 1.5"
        />
      )}
    </svg>
  );
}

