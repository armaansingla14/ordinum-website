import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingProps = {
  /** Primary line. */
  children: ReactNode;
  /** Optional muted continuation, rendered after a line break (e.g. "Before reality does."). */
  muted?: ReactNode;
  as?: "h1" | "h2" | "h3";
  /** "md" = section H2 (default). "lg" = larger, e.g. CTA band. */
  size?: "md" | "lg";
  /** "dark" (default) for dark backgrounds, "sage" for the light CTA band. */
  tone?: "dark" | "sage";
  id?: string;
  className?: string;
};

/** Section heading: clamp(30px, 3.3vw, 46px), weight 600, tracking -0.06em, leading 1.1. */
export default function Heading({
  children,
  muted,
  as: Tag = "h2",
  size = "md",
  tone = "dark",
  id,
  className,
}: HeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-semibold tracking-display text-balance",
        // Line-height lives inside the font-size utility so tailwind-merge can never drop it.
        size === "md" ? "text-[clamp(30px,3.3vw,46px)]/[1.1]" : "text-[clamp(36px,4.4vw,60px)]/[1.05]",
        tone === "dark" ? "text-text" : "text-sage-ink",
        className,
      )}
    >
      {/* Own block so text-wrap: balance applies to the first line set, not an anonymous box. */}
      <span className="block text-balance">{children}</span>
      {muted && (
        <>
          {" "}
          <span className={cn("block text-balance", tone === "dark" ? "text-quiet" : "text-sage-muted")}>{muted}</span>
        </>
      )}
    </Tag>
  );
}
