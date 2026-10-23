import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { STATUS_LABELS, technology } from "@/lib/content";
import DomainExplorer from "./DomainExplorer";
import {
  STATUS_ORDER,
  SectionIntro,
  StatusMarker,
  countStatus,
  pad,
} from "./shared";

/**
 * Where the same layer could apply: one interactive card per system category, replacing the
 * robotics-only eight-layer stack. Only categories with an adapter in the product repo are
 * marked implemented; everything else is planned and tagged conceptual inside the card.
 */
export default function DomainCards() {
  const d = technology.domains;
  const adapters = d.cards.filter((c) => c.adapterExists).length;

  return (
    <Section id="domains" variant="charcoal" aria-labelledby="domains-title">
      <SectionIntro
        kicker={d.kicker}
        title={d.title}
        titleId="domains-title"
        lede={d.lede}
        aside={
          <dl className="grid grid-cols-2 border-t border-line">
            <div className="border-r border-line pt-4 pr-4">
              <dt className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                Adapters built
              </dt>
              <dd className="mt-2 font-mono text-[13px] text-lime">
                {pad(adapters)} / {pad(d.cards.length)} categories
              </dd>
            </div>
            <div className="pt-4 pl-4">
              <dt className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                Status
              </dt>
              <dd className="mt-2 grid gap-1.5">
                {STATUS_ORDER.filter((s) => countStatus(d.cards, s) > 0).map(
                  (s) => (
                    <span
                      key={s}
                      className="flex items-center gap-2 font-mono text-[12px] text-text"
                    >
                      <StatusMarker status={s} />
                      {pad(countStatus(d.cards, s))}{" "}
                      {STATUS_LABELS[s].toLowerCase()}
                    </span>
                  ),
                )}
              </dd>
            </div>
          </dl>
        }
      />

      <Reveal className="mt-14 md:mt-20" amount={0.05}>
        <DomainExplorer cards={d.cards} />
      </Reveal>
    </Section>
  );
}
