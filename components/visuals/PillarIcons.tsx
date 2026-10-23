import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { PillarIcon as PillarIconName } from "@/lib/content";

/*
 * Bespoke 48px line icons for the product pillars.
 * Drawn on a 48-unit grid at 1.5px stroke, square caps, no fills except small accent cells.
 * Base strokes use currentColor; accent marks use the lime token via `text-lime` + currentColor.
 */

const ACCENT = "text-lime";

const icons: Record<PillarIconName, ReactNode> = {
  /* Behavioral coverage: a state grid, some cells reached, one trajectory through them. */
  coverage: (
    <>
      <rect x="6.75" y="6.75" width="34.5" height="34.5" />
      <path d="M18.25 6.75v34.5M29.75 6.75v34.5M6.75 18.25h34.5M6.75 29.75h34.5" strokeOpacity="0.4" />
      <g className={ACCENT}>
        <rect x="9" y="32" width="7" height="7" fill="currentColor" stroke="none" opacity="0.28" />
        <rect x="20.5" y="20.5" width="7" height="7" fill="currentColor" stroke="none" opacity="0.28" />
        <rect x="32" y="9" width="7" height="7" fill="currentColor" stroke="none" opacity="0.28" />
        <path d="M12.5 35.5 24 24l11.5-11.5" />
        <rect x="33.5" y="10.5" width="4" height="4" fill="currentColor" stroke="none" />
      </g>
    </>
  ),

  /* Stateful fault injection: a signal timeline with a pulse injected at one tick. */
  fault: (
    <>
      <path d="M4 30h13.5" />
      <path d="M30.5 30H44" />
      <path d="M8 33.5v-3.5M13 33.5v-3.5M35 33.5v-3.5M40 33.5v-3.5" strokeOpacity="0.45" />
      <g className={ACCENT}>
        <path d="M17.5 30l3-12 4 20 3-14 3 6" strokeLinejoin="miter" />
        <path d="M22.5 5v6.5" />
        <path d="M19.5 9l3 3 3-3" />
      </g>
    </>
  ),

  /* Deterministic replay: a recorded trace and its replay, overlaid exactly. */
  replay: (
    <>
      <path d="M6 36c6 0 7-21 15-21s8.5 13 13.5 13S40 20 42 14" />
      <path
        className={ACCENT}
        d="M6 36c6 0 7-21 15-21s8.5 13 13.5 13S40 20 42 14"
        strokeDasharray="2.5 3.5"
        transform="translate(0 -3.5)"
      />
      <circle cx="6" cy="36" r="2.25" />
      <rect className={ACCENT} x="39.75" y="8.25" width="4.5" height="4.5" fill="currentColor" stroke="none" />
      <path d="M4 43.25h40" strokeOpacity="0.4" />
    </>
  ),

  /* Failure minimization (ddmin): six faults in, the necessary set out. */
  minimize: (
    <>
      <path d="M5 16.75h38" strokeOpacity="0.4" />
      <g>
        <rect x="6" y="6" width="4.5" height="4.5" />
        <rect x="12.75" y="6" width="4.5" height="4.5" />
        <rect x="19.5" y="6" width="4.5" height="4.5" />
        <rect x="26.25" y="6" width="4.5" height="4.5" strokeOpacity="0.4" />
        <rect x="33" y="6" width="4.5" height="4.5" />
        <rect x="39.75" y="6" width="4.5" height="4.5" />
        <path d="M24.75 13.5l7.5-10.5" strokeOpacity="0.7" />
      </g>
      <path d="M8 20.5 19 33M40 20.5 29 33" />
      <g className={ACCENT}>
        <rect x="18.75" y="36" width="10.5" height="7" />
        <path d="M24 33v3" />
      </g>
    </>
  ),

  /* Regression generation: a stack of test rows, the newest one emitted on top. */
  regression: (
    <>
      <rect x="6.75" y="29.75" width="34.5" height="8.5" strokeOpacity="0.45" />
      <rect x="6.75" y="19.75" width="34.5" height="8.5" strokeOpacity="0.7" />
      <path d="M11 24h3M18 24h12" strokeOpacity="0.7" />
      <path d="M11 34h3M18 34h9" strokeOpacity="0.45" />
      <g className={ACCENT}>
        <rect x="6.75" y="7.75" width="34.5" height="8.5" />
        <path d="M10.5 12l1.75 1.75 3.25-3.5" />
        <path d="M19 12h11" />
      </g>
      <path d="M4 42.75h40" strokeOpacity="0.4" />
    </>
  ),

  /* Cross-component verification: components joined, one invariant checked across all of them. */
  cross: (
    <>
      <rect x="4.75" y="8.75" width="8.5" height="8.5" />
      <rect x="34.75" y="8.75" width="8.5" height="8.5" />
      <rect x="4.75" y="30.75" width="8.5" height="8.5" />
      <rect x="34.75" y="30.75" width="8.5" height="8.5" />
      <path d="M13.25 13h21.5M13.25 35h21.5M9 17.25v13.5M39 17.25v13.5" strokeOpacity="0.45" />
      <g className={ACCENT}>
        <path d="M13.25 17.25 20 20M34.75 17.25 28 20M13.25 30.75 20 28M34.75 30.75 28 28" />
        <circle cx="24" cy="24" r="5.25" />
        <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
      </g>
    </>
  ),
};

type PillarIconProps = {
  name: PillarIconName;
  className?: string;
};

/** Decorative 48px pillar icon (aria-hidden). Base color follows `currentColor`. */
export default function PillarIcon({ name, className }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {icons[name]}
    </svg>
  );
}
