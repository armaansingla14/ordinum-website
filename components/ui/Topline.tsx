import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import Container from "./Container";

type ToplineProps = {
  /** Lime index, e.g. "01". Rendered as "01 /". */
  index: string;
  /** Uppercase label, e.g. "Systems are not their components". */
  children: ReactNode;
  /** Wrap in <Container>. Default true. */
  contained?: boolean;
  className?: string;
};

/** Mono hairline divider: "01 / SYSTEMS ARE NOT THEIR COMPONENTS". */
export default function Topline({ index, children, contained = true, className }: ToplineProps) {
  const inner = (
    <p className="flex items-center gap-[13px] py-[17px] font-mono text-[10px] uppercase tracking-[0.13em] text-[#a0aba7]">
      <span className="text-lime">{index} /</span>
      <span>{children}</span>
    </p>
  );
  return (
    <div className={cn("border-b border-line", className)}>
      {contained ? <Container>{inner}</Container> : inner}
    </div>
  );
}
