import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home } from "@/lib/content";
import CausalSequence from "./home/CausalSequence";
import { SectionIntro } from "./home/shared";

const { problem } = home;

/**
 * Home section 2: one concrete, CONCEPTUAL cross-component failure, why component tests can
 * miss it, and (as a footnote) a public example of the class that Ordinum did not find.
 */
export default function Problem() {
  return (
    <Section id="problem" aria-labelledby="problem-title">
      <SectionIntro
        kicker={problem.kicker}
        title={problem.title}
        titleMuted={problem.titleMuted}
        titleId="problem-title"
        lede={problem.body}
      />

      <Reveal className="mt-12 md:mt-16" amount={0.15}>
        <CausalSequence
          tag={problem.example.tag}
          ariaLabel={problem.example.ariaLabel}
          steps={problem.example.steps}
          caption={problem.example.caption}
        />
      </Reveal>

      <p className="mt-5 max-w-[860px] text-[12.5px] leading-[1.7] text-subtle">
        {problem.precedent.text}{" "}
        <a
          href={problem.precedent.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 whitespace-nowrap text-muted underline decoration-line-2 underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
        >
          {problem.precedent.label}
          <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </Section>
  );
}
