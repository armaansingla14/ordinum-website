import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { demoPage, home, research } from "@/lib/content";
import { nav2SuccessMismatch as sm } from "@/lib/evidence";
import { DemoSectionHead, SourceLine } from "./parts";
import { demoSteps } from "./steps";
import WalkthroughStepper from "./WalkthroughStepper";

const wt = demoPage.walkthrough;

/** The seven steps of the real Nav2 success_mismatch run, then why it is classified as a harness artifact. */
export default function Walkthrough() {
  return (
    <Section id="walkthrough" aria-labelledby="walkthrough-title" className="pt-[64px] md:pt-[96px]">
      <DemoSectionHead
        id="walkthrough-title"
        kicker={demoPage.intro.kicker}
        title={demoPage.intro.title}
        lede={demoPage.intro.lede}
      />

      <div className="mt-12 md:mt-16">
        <WalkthroughStepper steps={demoSteps} />
      </div>

      {/* Classification: stated plainly, at full size, right after the steps. */}
      <div className="hairline-grid mt-14 grid-cols-1 md:mt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="bg-surface p-6 sm:p-8">
          <h3 className="text-[clamp(24px,2.4vw,32px)] font-semibold leading-[1.15] tracking-title text-balance text-text">
            {wt.classification.title}
          </h3>
          <p className="mt-5 max-w-[620px] text-[15.5px] leading-[1.75] text-muted">{wt.classification.body}</p>
          <Link
            href={`${home.demo.secondaryCta.href}#${research.nav2.id}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-lime uppercase underline decoration-lime/40 underline-offset-4 transition-colors hover:decoration-lime"
          >
            {home.demo.secondaryCta.label}
            <span aria-hidden="true">→</span>
          </Link>
          {/* Compact next step for a reader convinced by the walkthrough (the sage band is far below). */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
            <Button href={demoPage.midCta.primary.href} icon="→">
              {demoPage.midCta.primary.label}
            </Button>
            <a
              href={demoPage.midCta.call.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-muted uppercase underline decoration-line-2 underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
            >
              {demoPage.midCta.call.label}
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="bg-bg p-6 sm:p-8">
          <ul className="space-y-6">
            {/* One quote: the adversarial review adds information; the README line restates the box. */}
            {sm.labelJustification.filter((j) => j.source !== "docs/demo/README.md").map((j) => (
              <li key={j.source}>
                <blockquote className="border-l border-line-2 pl-4 text-[14px] leading-[1.7] text-[#d6dedb]">
                  “{j.quote}”
                </blockquote>
                <SourceLine kind="Quoted from" className="mt-2 pl-4">
                  {j.source}
                </SourceLine>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
