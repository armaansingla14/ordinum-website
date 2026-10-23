import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type KickerProps = {
  /** Label text, e.g. "The problem". Rendered uppercase. */
  children: ReactNode;
  /** Optional section number, e.g. "001" -> "THE PROBLEM / 001". */
  index?: string;
  /** Glowing lime dot before the label. */
  dot?: boolean;
  /** "lime" (default, dark backgrounds) or "sage" (for the light CTA band). */
  tone?: "lime" | "sage";
  as?: "p" | "span" | "div";
  className?: string;
};

/** Mono uppercase section label: "THE PROBLEM / 001". */
export default function Kicker({ children, index, dot = false, tone = "lime", as: Tag = "p", className }: KickerProps) {
  return (
    <Tag
      className={cn(
        "label-mono inline-flex items-center",
        tone === "lime" ? "text-lime" : "text-sage-accent",
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "mr-2.5 inline-block size-[7px] rounded-full",
            tone === "lime" ? "bg-lime shadow-[0_0_18px_var(--color-lime)]" : "bg-sage-accent",
          )}
        />
      )}
      <span>
        {children}
        {index && (
          <>
            <span aria-hidden="true"> / </span>
            <span className="sr-only">, section </span>
            {index}
          </>
        )}
      </span>
    </Tag>
  );
}
