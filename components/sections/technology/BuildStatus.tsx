import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { technology, type Status } from "@/lib/content";
import { SectionIntro, StatusChip, StatusMarker, pad } from "./shared";

type GroupId = (typeof technology.status.groups)[number]["id"];

/** "Next on the roadmap" is planned work (not in development): it gets the planned treatment. */
const GROUP_STATUS: Record<GroupId, Status> = {
  built: "implemented",
  next: "planned",
  planned: "planned",
};

/** Built today / next on the roadmap / planned, as three hairline-joined columns. */
export default function BuildStatus() {
  const s = technology.status;

  return (
    <Section id="status" aria-labelledby="status-title">
      <SectionIntro
        kicker={s.kicker}
        title={s.title}
        titleId="status-title"
        lede={s.note}
      />

      <Reveal
        as="ol"
        stagger={0.08}
        amount={0.1}
        className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:mt-16 lg:grid-cols-3"
      >
        {s.groups.map((g, gi) => {
          const status = GROUP_STATUS[g.id];
          const built = status === "implemented";
          return (
            <RevealItem
              as="li"
              key={g.id}
              className={cn(
                "relative flex flex-col p-6 sm:p-8",
                built ? "bg-surface" : "bg-bg",
              )}
            >
              {built && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -top-px h-px bg-lime/70"
                />
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[10px] tracking-[0.13em] text-subtle uppercase">
                  <span className={built ? "text-lime" : "text-muted"}>
                    {pad(gi + 1)}
                  </span>
                  <span aria-hidden="true"> / </span>
                  <span className="sr-only"> of </span>
                  {pad(s.groups.length)}
                </p>
                <StatusChip status={status} />
              </div>
              <h3 className="mt-6 text-[22px] leading-[1.2] font-[550] tracking-title text-text md:text-[24px]">
                {g.label}
              </h3>
              <ul className="mt-6 grid gap-3.5 border-t border-line pt-6">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-start gap-3 text-[15px] leading-[1.6] tracking-[-0.01em]",
                      built ? "text-text" : "text-muted",
                    )}
                  >
                    <StatusMarker status={status} className="mt-[7px]" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}
