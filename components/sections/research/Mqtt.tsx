import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { FACT_SOURCE, integration, research } from "@/lib/content";
import { Provenance } from "./badges";
import { Bullets, MaturityMark, ResultList, SectionHead, SubHead, TargetAside } from "./shared";

const m = research.mqtt;
const bridge = integration("nanomq");

/** MQTT integration: one 12-scenario exploratory campaign against Eclipse Mosquitto, every outcome labeled. */
export default function Mqtt() {
  return (
    <Section id={m.id} aria-labelledby="mqtt-title">
      <SectionHead id="mqtt-title" kicker={m.kicker} title={m.title} titleMuted={m.titleMuted} lede={m.lede} aside={<TargetAside id="mqtt" />} />

      <div className="mt-14 md:mt-20">
        <SubHead id="mqtt-results">Campaign outcomes</SubHead>
        <ResultList id="mqtt-results" results={m.results} />
        <Reveal>
          <p className="mt-8 max-w-[820px] border-l border-lime/70 pl-5 text-[16px] leading-[1.75] text-[#c9d1ce]">{m.conclusion}</p>
        </Reveal>
      </div>

      <Reveal className="mt-12 grid gap-8 border border-line bg-surface p-6 sm:p-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <h3 className="label-mono text-text">Limits of this result</h3>
          <Bullets items={m.limits} mark="dashed" className="mt-5" />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-4 lg:border-l lg:border-line lg:pl-8">
          <p className="text-[14px] font-semibold tracking-[-0.01em] text-text">{bridge.name}</p>
          <MaturityMark maturity={bridge.maturity} note={bridge.maturityNote} />
          <p className="text-[13.5px] leading-[1.6] text-muted">{bridge.summary}</p>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <Provenance kind="Source">
          docs/research/MQTT_TARGET.md (outcome classification); commit c001bb1 · checked at {FACT_SOURCE.commitShort}
        </Provenance>
      </Reveal>
    </Section>
  );
}
