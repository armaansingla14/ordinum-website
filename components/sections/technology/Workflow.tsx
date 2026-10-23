import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { technology } from "@/lib/content";
import { SectionIntro, pad } from "./shared";

/* Local labels (requested move to lib/content.ts as technology.workflow.labels). */
const LABELS = { today: "Today", limit: "Limit" } as const;

/**
 * How each stage works: six hairline-joined cards (execution, feedback, oracles, reproduction,
 * minimization, regression). Every card states what exists today and its limit, so the
 * caveat is never hidden behind an interaction or a breakpoint.
 */
export default function Workflow() {
  const w = technology.workflow;

  return (
    <Section id="workflow" variant="charcoal" aria-labelledby="workflow-title">
      <SectionIntro
        kicker={w.kicker}
        title={w.title}
        titleMuted={w.titleMuted}
        titleId="workflow-title"
      />

      <Reveal
        as="ol"
        stagger={0.06}
        amount={0.05}
        className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:mt-16 md:grid-cols-2 xl:grid-cols-3"
      >
        {w.items.map((item, i) => (
          <RevealItem
            as="li"
            key={item.id}
            className="flex flex-col bg-surface p-6 sm:p-8"
          >
            <article
              aria-labelledby={`workflow-${item.id}`}
              className="flex h-full flex-col"
            >
              <p
                aria-hidden="true"
                className="font-mono text-[11px] tracking-[0.08em] text-lime"
              >
                {pad(i + 1)}
              </p>
              <h3
                id={`workflow-${item.id}`}
                className="mt-4 text-[22px] leading-[1.2] font-[550] tracking-title text-text md:text-[24px]"
              >
                {item.title}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.75] text-muted">
                {item.body}
              </p>

              <dl className="mt-auto grid gap-5 pt-7">
                <div className="border-t border-line pt-5">
                  <dt className="flex items-center gap-2 font-mono text-[10px] tracking-[0.13em] text-lime uppercase">
                    <span aria-hidden="true" className="size-[6px] bg-lime" />
                    {LABELS.today}
                  </dt>
                  <dd className="mt-2.5 text-[14px] leading-[1.7] text-text">
                    {item.today}
                  </dd>
                </div>
                <div className="border-l border-line-2 pl-4">
                  <dt className="font-mono text-[10px] tracking-[0.13em] text-quiet uppercase">
                    {LABELS.limit}
                  </dt>
                  <dd className="mt-2 text-[14px] leading-[1.7] text-muted">
                    {item.caveat}
                  </dd>
                </div>
              </dl>
            </article>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
