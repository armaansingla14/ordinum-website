import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import { cn } from "@/lib/cn";
import { differentiation, topline, type ComparisonColumn } from "@/lib/content";

/** "WHY ORDINUM / 007" -> ["WHY ORDINUM", "007"] */
function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

const ROWS = [
  { key: "finds", label: "Finds" },
  { key: "question", label: "Asks" },
  { key: "limits", label: "Misses" },
] as const satisfies readonly { key: keyof ComparisonColumn; label: string }[];

/** For the highlighted column the "limits" row is what it returns instead of a gap. */
function rowLabel(row: (typeof ROWS)[number], col: ComparisonColumn) {
  return row.key === "limits" && col.highlight ? "Returns" : row.label;
}

function ColumnName({ col }: { col: ComparisonColumn }) {
  return col.highlight ? (
    <span className="inline-flex items-center gap-2.5 text-lime">
      <span aria-hidden="true" className="inline-block size-[7px] rounded-full bg-lime shadow-[0_0_14px_var(--color-lime)]" />
      {col.name}
    </span>
  ) : (
    <span className="text-muted">{col.name}</span>
  );
}

const columns: readonly ComparisonColumn[] = differentiation.columns;
const pct = 100 / (columns.length + 0.8); // row-header column is 0.8 of a data column

export default function Differentiation() {
  const [kicker, index] = splitLabel(differentiation.kicker);
  const [lineIndex, lineLabel] = topline[6].split(" / ") as [string, string];
  const hi = columns.findIndex((c) => c.highlight);

  return (
    <Section id="why-ordinum" aria-labelledby="why-ordinum-title" className="pt-0 md:pt-0">
      <Topline index={lineIndex} contained={false}>
        {lineLabel}
      </Topline>

      <Reveal className="mt-[64px] grid gap-8 md:mt-[100px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <Kicker index={index}>{kicker}</Kicker>
          <Heading id="why-ordinum-title" className="mt-6 max-w-[16ch]">
            {differentiation.title}
          </Heading>
        </div>
        <p className="max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{differentiation.lede}</p>
      </Reveal>

      {/* Desktop: comparison table ------------------------------------------------ */}
      <Reveal className="relative mt-14 hidden md:mt-20 lg:block" amount={0.15}>
        <table className="w-full table-fixed border-collapse border border-line text-left">
          <caption className="sr-only">
            How Ordinum compares with traditional testing, security tools and observability
          </caption>
          <colgroup>
            <col style={{ width: `${pct * 0.8}%` }} />
            {columns.map((c) => (
              <col key={c.name} style={{ width: `${pct}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <td className="border-b border-line bg-bg p-6 align-bottom xl:p-7">
                <span className="label-mono text-[10px] text-subtle">Approach</span>
              </td>
              {columns.map((c) => (
                <th
                  key={c.name}
                  scope="col"
                  className={cn(
                    "label-mono border-b border-l border-line p-6 align-bottom text-[11px] font-normal leading-[1.6] xl:p-7",
                    c.highlight ? "bg-surface-2" : "bg-surface",
                  )}
                >
                  <ColumnName col={c} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, r) => (
              <tr key={row.key}>
                <th
                  scope="row"
                  className={cn(
                    "label-mono bg-bg p-6 align-top text-[10px] font-normal text-subtle xl:p-7",
                    r < ROWS.length - 1 && "border-b border-line",
                  )}
                >
                  <span className="text-lime">{String(r + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true"> / </span>
                  {row.label}
                </th>
                {columns.map((c) => (
                  <td
                    key={c.name}
                    className={cn(
                      "border-l border-line p-6 align-top xl:p-7",
                      r < ROWS.length - 1 && "border-b",
                      c.highlight ? "bg-surface-2" : "bg-surface",
                      row.key === "question"
                        ? cn(
                            "text-[19px] font-semibold leading-[1.3] tracking-title",
                            c.highlight ? "text-text" : "text-quiet",
                          )
                        : cn("text-[14.5px] leading-[1.7]", c.highlight ? "text-text" : "text-muted"),
                    )}
                  >
                    {c.highlight && row.key === "limits" && (
                      <span className="label-mono mb-2 block text-[10px] text-lime">Returns</span>
                    )}
                    {c[row.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Lime hairline around the highlighted column */}
        {hi !== -1 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 border border-lime"
            style={{ left: `${pct * (0.8 + hi)}%`, width: `${pct}%` }}
          />
        )}
      </Reveal>

      {/* Mobile / tablet: stacked cards ------------------------------------------- */}
      <Reveal as="ul" stagger={0.07} amount={0.05} className="hairline-grid mt-14 grid-cols-1 md:mt-20 md:grid-cols-2 lg:hidden">
        {columns.map((c) => (
          <RevealItem
            as="li"
            key={c.name}
            className={cn("relative p-6 sm:p-7", c.highlight ? "bg-surface-2 md:col-span-2" : "bg-surface")}
          >
            {c.highlight && (
              <span aria-hidden="true" className="pointer-events-none absolute -inset-px border border-lime" />
            )}
            <h3 className="label-mono text-[11px] leading-[1.6]">
              <ColumnName col={c} />
            </h3>
            <p
              className={cn(
                "mt-5 text-[22px] font-semibold leading-[1.25] tracking-title text-balance",
                c.highlight ? "text-text" : "text-quiet",
              )}
            >
              {c.question}
            </p>
            <dl className="mt-6 space-y-4 border-t border-line pt-5">
              {ROWS.filter((row) => row.key !== "question").map((row) => (
                <div key={row.key} className="grid grid-cols-[76px_minmax(0,1fr)] gap-3">
                  <dt className={cn("label-mono pt-[3px] text-[10px]", c.highlight && row.key === "limits" ? "text-lime" : "text-subtle")}>
                    {rowLabel(row, c)}
                  </dt>
                  <dd className={cn("text-[14.5px] leading-[1.7]", c.highlight ? "text-text" : "text-muted")}>
                    {c[row.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealItem>
        ))}
      </Reveal>

      {/* Statement + what it is not ---------------------------------------------- */}
      <Reveal className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:items-start lg:gap-12">
        <p className="border-l border-lime pl-6 text-[clamp(28px,3.2vw,46px)] font-semibold leading-[1.1] tracking-display text-text text-balance md:pl-10 lg:col-span-8">
          {differentiation.statement}
        </p>
        <ul
          aria-label="What Ordinum is not"
          className="divide-y divide-line border-y border-line lg:col-span-4 lg:col-start-9 lg:mt-2"
        >
          {differentiation.notList.map((item) => (
            <li key={item} className="label-mono flex items-center gap-3 py-3 text-subtle">
              <span aria-hidden="true" className="text-line-2">
                ×
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
