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

/** Section heading: clamp(39px, 4.1vw, 60px), weight 600, tracking -0.06em, leading 1.08. */
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
        size === "md" ? "text-[clamp(39px,4.1vw,60px)]/[1.08]" : "text-[clamp(44px,6vw,82px)]/[1.03]",
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
