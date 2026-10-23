import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import Container from "./Container";

export type SectionVariant = "default" | "charcoal" | "sage";

type SectionProps = {
  id: string;
  variant?: SectionVariant;
  /** Wrap children in <Container>. Default true. */
  contained?: boolean;
  containerClassName?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "id" | "children">;

/**
 * Page section: 79px vertical padding on mobile, 125px from md up.
 * Variants: "default" (page bg), "charcoal" (#101517 band with hairline top/bottom),
 * "sage" (light CTA band; also switches focus rings to dark ink).
 */
export default function Section({
  id,
  variant = "default",
  contained = true,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-[79px] md:py-[125px]",
        variant === "charcoal" && "border-y border-line bg-charcoal",
        variant === "sage" && "on-sage bg-sage text-sage-ink",
        className,
      )}
      {...props}
    >
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}
