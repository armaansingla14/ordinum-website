import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import FailureCards from "@/components/visuals/FailureCards";
import { problem, topline } from "@/lib/content";

/** "THE PROBLEM / 001" -> ["THE PROBLEM", "001"] */
function splitLabel(s: string): [string, string] {
  const i = s.lastIndexOf(" / ");
  return i === -1 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)];
}

export default function Problem() {
  const [kicker, kickerIndex] = splitLabel(problem.kicker);
  const [lineIndex, lineLabel] = topline[0].split(" / ");

  return (
    <Section id="problem" aria-labelledby="problem-title" className="pt-0 md:pt-0">
      <Topline index={lineIndex} contained={false}>
        {lineLabel}
      </Topline>

      <div className="mt-[64px] md:mt-[100px]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Narrative */}
          <Reveal className="lg:sticky lg:top-[120px] lg:col-span-5 lg:self-start">
            <Kicker index={kickerIndex}>{kicker}</Kicker>
            <Heading
              id="problem-title"
              muted={problem.titleMuted}
              className="mt-6 text-[clamp(36px,3.2vw,46px)]/[1.06]"
            >
              {problem.title}
            </Heading>
            <div className="mt-7 max-w-[540px] space-y-5 text-[16px] leading-[1.8] text-muted">
              {problem.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <ul
              aria-label="Diagram legend"
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-subtle sm:text-[10px]"
            >
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-px w-5 bg-lime" />
                Signal path
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="w-5 border-t border-dashed border-line-2" />
                Boundary / expected
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-[7px] rounded-full bg-orange" />
                Failure
              </li>
            </ul>
          </Reveal>

          {/* Failure patterns */}
          <Reveal className="lg:col-span-7" delay={0.08} amount={0.1}>
            <p className="label-mono mb-4 flex items-center justify-between gap-4 text-subtle">
              <span>Cross-layer failure patterns</span>
              <span className="text-[10px]">Schematic / illustrative</span>
            </p>
            <FailureCards cards={problem.cards} />
          </Reveal>
        </div>

        {/* Contrast */}
        <Reveal className="mt-20 md:mt-28">
          <div className="hairline-grid grid-cols-1 md:grid-cols-2">
            <div className="bg-bg p-6 sm:p-8 md:p-10">
              <p className="label-mono text-subtle">Traditional testing</p>
              <p className="mt-5 text-[clamp(26px,2.8vw,40px)] font-semibold leading-[1.12] tracking-display text-quiet text-balance">
                {problem.contrast.traditional}
              </p>
            </div>
            <div className="relative bg-surface p-6 sm:p-8 md:p-10">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-lime" />
              <p className="label-mono flex items-center gap-2.5 text-lime">
                <span aria-hidden="true" className="inline-block size-[7px] rounded-full bg-lime shadow-[0_0_14px_var(--color-lime)]" />
                Ordinum
              </p>
              <p className="mt-5 text-[clamp(26px,2.8vw,40px)] font-semibold leading-[1.12] tracking-display text-text text-balance">
                {problem.contrast.ordinum}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
