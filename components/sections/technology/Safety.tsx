import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { technology } from "@/lib/content";
import { SECTION_PAD, SectionIntro, mono } from "./shared";

/** Section 6: resource isolation and safety, per target, with the honest gaps. */
export default function Safety() {
  const s = technology.safety;
  return (
    <Section id={s.id} variant="charcoal" aria-labelledby={`${s.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={s.kicker} title={s.title} titleId={`${s.id}-title`} lede={s.policy} />

      <Reveal className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-14">
        <ul className="divide-y divide-line border-y border-line">
          {s.items.map((it) => (
            <li key={it.target} className="grid gap-x-8 gap-y-1.5 py-5 sm:grid-cols-[190px_minmax(0,1fr)]">
              <h3 className="text-[15.5px] leading-[1.4] font-[550] tracking-[-0.02em] text-text">{it.target}</h3>
              <p className="text-[14.5px] leading-[1.7] text-muted">{it.text}</p>
            </li>
          ))}
        </ul>
        <div>
          <p className={cn(mono, "text-subtle")}>Known gaps</p>
          <ul className="mt-4 space-y-3">
            {s.caveats.map((c) => (
              <li key={c} className="flex gap-3 text-[14px] leading-[1.65] text-subtle">
                <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-line-2" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
