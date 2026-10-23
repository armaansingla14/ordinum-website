import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** "TOY BENCHMARK / 002" -> ["TOY BENCHMARK", "002"] */
export function splitKicker(s: string): [string, string | undefined] {
  const i = s.lastIndexOf(" / ");
  return i === -1 ? [s, undefined] : [s.slice(0, i), s.slice(i + 3)];
}

/** Numbered section head: mono kicker, h2 with muted continuation, optional lede and aside. */
export function SectionHead({
  kicker,
  title,
  titleMuted,
  lede,
  id,
  aside,
  immediate,
}: {
  kicker: string;
  title: string;
  titleMuted?: string;
  lede?: ReactNode;
  /** id of the h2, for aria-labelledby on the section. */
  id: string;
  aside?: ReactNode;
  /** Server-render visible (first section on the page). */
  immediate?: boolean;
}) {
  const [label, index] = splitKicker(kicker);
  return (
    <Reveal immediate={immediate} className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div className={cn(aside ? "lg:col-span-7" : "lg:col-span-9")}>
        <Kicker index={index}>{label}</Kicker>
        <Heading id={id} muted={titleMuted} className="mt-6">
          {title}
        </Heading>
        {lede && <p className="mt-7 max-w-[680px] text-[16px] leading-[1.75] text-muted md:text-[17px]">{lede}</p>}
      </div>
      {aside && <div className="lg:col-span-5">{aside}</div>}
    </Reveal>
  );
}
