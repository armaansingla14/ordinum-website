import Kicker from "@/components/ui/Kicker";
import Heading from "@/components/ui/Heading";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { FACT_SOURCE, technology } from "@/lib/content";
import { splitLabel } from "./shared";

/*
 * Simplified excerpt of the real interface in the product repo (src/ordinum/targets/contract.py
 * at the FACT_SOURCE commit): Target.spec/fingerprint/open and Session.run_episode/healthy/close,
 * with the spec's declared time model and determinism. Comments paraphrase the docstrings.
 * Requested move to lib/content.ts as technology.contract.excerpt.
 */
const EXCERPT_PATH = "src/ordinum/targets/contract.py";

type Line = { code: string; comment?: string; indent?: 0 | 1 | 2 };

const EXCERPT: readonly Line[] = [
  { code: "class Target:" },
  { code: "spec(cfg) -> TargetSpec", comment: "declares:", indent: 1 },
  { code: "time_model:  tick | sim_time | event", indent: 2 },
  { code: "determinism: deterministic | stochastic", indent: 2 },
  {
    code: "fingerprint() -> str",
    comment: "identity of the target build",
    indent: 1,
  },
  { code: "open(cfg) -> Session", indent: 1 },
  { code: "" },
  { code: "class Session:" },
  { code: "run_episode(scenario, exec_seed, deadline_s) -> Trace", indent: 1 },
  { code: "healthy() -> bool", indent: 1 },
  { code: "close() -> None", indent: 1 },
];

const INDENT = ["", "pl-[2ch]", "pl-[4ch]"] as const;

/** "What target-agnostic means here": the episode-level contract, with a real interface excerpt. */
export default function TargetContract() {
  const c = technology.contract;
  const [label, index] = splitLabel(c.kicker);

  return (
    <Section id="contract" variant="charcoal" aria-labelledby="contract-title">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-start lg:gap-14 xl:gap-20">
        <Reveal>
          <Kicker index={index}>{label}</Kicker>
          <Heading id="contract-title" className="mt-6 max-w-[16ch]">
            {c.title}
          </Heading>
          <div className="mt-8 grid max-w-[580px] gap-5 text-[16px] leading-[1.8] text-muted md:text-[17px]">
            {c.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 flex max-w-[580px] items-start gap-3 border-t border-line pt-5 text-[14px] leading-[1.65] text-text">
            <span
              aria-hidden="true"
              className="mt-[7px] h-px w-4 shrink-0 bg-lime"
            />
            {c.caveat}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <figure className="border border-[#3c4749] bg-window shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
              <p className="min-w-0 truncate font-mono text-[10px] tracking-[0.1em] text-[#a5b1ad] uppercase">
                Interface excerpt
              </p>
              <p className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">
                Simplified
              </p>
            </div>
            <pre
              tabIndex={0}
              aria-label="Simplified excerpt of the target contract interface"
              className="overflow-x-auto px-4 py-5 font-mono text-[12px] leading-[1.85] text-text sm:px-5 sm:text-[13px]"
            >
              <code>
                {EXCERPT.map((l, i) => {
                  const isClass = l.code.startsWith("class ");
                  const isField = (l.indent ?? 0) === 2;
                  return (
                    <span key={i} className={`block ${INDENT[l.indent ?? 0]}`}>
                      {l.code === "" ? (
                        " "
                      ) : isClass ? (
                        <>
                          <span className="text-subtle">class </span>
                          <span className="text-lime">{l.code.slice(6)}</span>
                        </>
                      ) : (
                        <span className={isField ? "text-muted" : undefined}>
                          {l.code}
                        </span>
                      )}
                      {l.comment && (
                        <span className="text-subtle">
                          {"  # " + l.comment}
                        </span>
                      )}
                    </span>
                  );
                })}
              </code>
            </pre>
            <figcaption className="border-t border-line px-4 py-3 font-mono text-[10px] leading-[1.6] tracking-[0.08em] text-subtle uppercase sm:px-5">
              Source <span aria-hidden="true">·</span>{" "}
              <span className="normal-case">{EXCERPT_PATH}</span>{" "}
              <span aria-hidden="true">@</span>
              <span className="sr-only">at commit</span>{" "}
              {FACT_SOURCE.commitShort}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
