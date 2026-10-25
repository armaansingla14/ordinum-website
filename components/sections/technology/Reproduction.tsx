import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { technology } from "@/lib/content";
import { SECTION_PAD, SectionIntro, mono, pad } from "./shared";

/** Section 5: reproduction (exact vs statistical), minimization and regression, each with its limit. */
export default function Reproduction() {
  const r = technology.reproduction;
  return (
    <Section id={r.id} aria-labelledby={`${r.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={r.kicker} title={r.title} titleMuted={r.titleMuted} titleId={`${r.id}-title`} />

      <Reveal as="ol" stagger={0.06} amount={0.05} className="hairline-grid mt-12 grid-cols-1 md:mt-16 lg:grid-cols-3">
        {r.items.map((it, i) => (
          <RevealItem as="li" key={it.title} className="flex flex-col bg-surface p-6 md:p-7">
            <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{pad(i + 1)}</span>
            <h3 className="mt-5 text-[20px] leading-[1.2] font-[550] tracking-[-0.03em] text-text">{it.title}</h3>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-muted">{it.body}</p>
            <div className="mt-auto pt-6">
              <p className="border-t border-line pt-4">
                <span className={cn(mono, "block text-subtle")}>Limit</span>
                <span className="mt-2 block text-[13.5px] leading-[1.65] text-subtle">{it.caveat}</span>
              </p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
