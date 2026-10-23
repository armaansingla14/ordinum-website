import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import EvidenceReport from "@/components/visuals/EvidenceReport";
import { product, type Status } from "@/lib/content";
import { SectionIntro, StatusChip, pad } from "./shared";

/**
 * Every output listed in product.outputs is produced by the current research engine today
 * (see product.outputs.note). If content ever adds a planned output, give items a `status`
 * field and this falls through to it.
 */
function outputStatus(item: object): Status {
  return "status" in item && typeof item.status === "string" ? (item.status as Status) : "implemented";
}

/**
 * What an engineer receives: a real report preview (EvidenceReport, owned by the research
 * section) as the centerpiece, then the seven outputs as an annotated, numbered grid.
 */
export default function EngineerOutputs() {
  const { outputs } = product;
  const total = outputs.items.length;

  return (
    <Section id="engineer-outputs" aria-labelledby="engineer-outputs-title">
      <SectionIntro
        kicker={outputs.kicker}
        title={outputs.title}
        titleId="engineer-outputs-title"
        lede={outputs.lede}
      />

      <Reveal className="mt-14 md:mt-20" amount={0.1}>
        <EvidenceReport />
      </Reveal>

      <Reveal
        as="ol"
        stagger={0.06}
        amount={0.05}
        className="hairline-grid mt-10 grid-cols-1 sm:grid-cols-2 md:mt-14 xl:grid-cols-4"
      >
        {outputs.items.map((item, i) => (
          <RevealItem as="li" key={item.title} className="flex flex-col bg-surface p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] tracking-[0.08em] text-quiet">
                <span className="text-lime">{pad(i + 1)}</span>
                <span aria-hidden="true"> / {pad(total)}</span>
              </span>
              <StatusChip status={outputStatus(item)} />
            </div>
            <h3 className="mt-7 text-[18px] leading-[1.3] font-[550] tracking-[-0.03em] text-text">{item.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.75] text-muted">{item.body}</p>
          </RevealItem>
        ))}
        {/* Eighth cell closes the 4x2 / 2x4 grid with the scope note. */}
        <RevealItem as="li" className="flex flex-col justify-end bg-window p-6 sm:p-7">
          <p className="font-mono text-[10px] tracking-[0.13em] text-subtle uppercase">Scope</p>
          <p className="mt-3 text-[14px] leading-[1.75] text-muted">{outputs.note}</p>
        </RevealItem>
      </Reveal>
    </Section>
  );
}
