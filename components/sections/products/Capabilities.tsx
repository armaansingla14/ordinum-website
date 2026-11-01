import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Caveat, MaturityChip, SECTION_PAD, SectionIntro } from "@/components/sections/technology/shared";
import { platform } from "@/lib/content";

/** /products#capabilities: the engine's commands at the stable checkpoint, each with its maturity label, and the CI status. */
export default function Capabilities() {
  const c = platform.capabilities;
  return (
    <Section id={c.id} aria-labelledby={`${c.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleMuted={c.titleMuted} titleId={`${c.id}-title`} lede={c.lede} />

      <Reveal as="ul" stagger={0.03} amount={0.03} className="mt-12 border-t border-line-2 md:mt-16">
        {c.items.map((it) => (
          <RevealItem
            key={it.name}
            as="li"
            className="grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,6fr)]"
          >
            <h3 className="text-[16.5px] leading-[1.35] font-semibold tracking-[-0.02em] text-text">
              {it.name}
              {"command" in it && it.command && (
                <span className="ml-2 font-mono text-[12px] font-normal tracking-[0.02em] text-[#b7c4bf]">ordinum {it.command}</span>
              )}
            </h3>
            <div>
              <MaturityChip maturity={it.maturity} note={"note" in it ? it.note : undefined} />
            </div>
            <p className="text-[14.5px] leading-[1.65] text-muted">{it.body}</p>
          </RevealItem>
        ))}
      </Reveal>

      <Caveat className="mt-8 max-w-[760px]">{c.ciStatus}</Caveat>
    </Section>
  );
}
