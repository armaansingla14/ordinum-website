import Link from "next/link";
import type { ReactNode } from "react";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import Research from "@/components/sections/Research";
import { EvidenceLabel } from "@/components/sections/demo/parts";
import { Bullets } from "@/components/sections/research/shared";
import { Disclosure } from "@/components/sections/technology/shared";
import Container from "@/components/ui/Container";
import GoalPlot from "@/components/visuals/GoalPlot";
import { cn } from "@/lib/cn";
import type { LabsArticle } from "@/lib/labs";

const mono = "font-mono text-[10.5px] leading-[1.5] tracking-[0.13em] uppercase";

/** One article block: mono number + h2 on the left, content on the right (stacked below md). */
function Block({ id, n, title, children, className }: { id: string; n: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("grid gap-4 border-b border-line py-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 md:py-12", className)}>
      <h2 id={`${id}-title`} className="flex items-baseline gap-3 text-[19px] leading-[1.3] font-semibold tracking-[-0.025em] text-text">
        <span aria-hidden="true" className="font-mono text-[11px] font-normal tracking-[0.1em] text-lime">
          {n}
        </span>
        {title}
      </h2>
      <div className="min-w-0 max-w-[760px]">{children}</div>
    </section>
  );
}

function Paragraphs({ items }: { items: readonly string[] }) {
  return (
    <div className="space-y-4">
      {items.map((p) => (
        <p key={p} className="text-[16px] leading-[1.75] text-muted">
          {p}
        </p>
      ))}
    </div>
  );
}

function Links({ links }: { links: readonly { label: string; href: string }[] }) {
  return (
    <ul className="border-t border-line">
      {links.map((l) => (
        <li key={l.href} className="border-b border-line">
          <Link href={l.href} className="group flex min-h-11 items-center justify-between gap-4 py-3 text-[15.5px] text-text transition-colors hover:text-lime">
            <span>{l.label}</span>
            <span aria-hidden="true" className="text-lime transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Key/value rows (what it shows, technical details). */
function Rows({ rows }: { rows: readonly { k: string; v: string }[] }) {
  return (
    <dl className="border-t border-line">
      {rows.map((r) => (
        <div key={r.k} className="grid grid-cols-1 gap-1 border-b border-line py-3.5 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-5">
          <dt className="font-mono text-[10.5px] tracking-[0.1em] text-subtle uppercase sm:pt-[3px]">{r.k}</dt>
          <dd className="text-[15px] leading-[1.6] break-words text-text">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A Labs article, in this order: the finding (with its evidence label); what was tested; why it
 * matters; how it worked; what it shows (research summary: the full research sections follow);
 * what it does not establish; artifacts and reproduction (evidence links, collapsed technical
 * details, related work, corrections); and the AI methods note last.
 */
export default function ArticleView({ article }: { article: LabsArticle }) {
  return (
    <article aria-labelledby="page-title">
      <PageHeader header={{ kicker: `Ordinum Labs · ${article.category}`, title: article.title, lede: article.summary }}>
        <p className={cn(mono, "mt-7 flex flex-wrap gap-x-4 gap-y-1 text-subtle")}>
          <span>By {article.authors.join(", ")}</span>
          <span aria-hidden="true">·</span>
          <span>
            <time>{article.date}</time>
          </span>
          <span aria-hidden="true">·</span>
          <span>{article.revision}</span>
        </p>
      </PageHeader>

      <Container>
        <section id="finding" aria-labelledby="finding-title" className="border-b border-line pt-10 pb-10 md:pt-12 md:pb-12">
          <h2 id="finding-title" className={cn(mono, "text-lime")}>
            The finding
          </h2>
          <p className="mt-5 max-w-[920px] text-[clamp(20px,2vw,26px)] leading-[1.4] tracking-[-0.03em] text-balance text-text">
            {article.leadingResult}
          </p>
          <EvidenceLabel size="lg" text={article.label.text} classes={article.label.classes} className="mt-6" />
        </section>

        <Block id="tested" n="01" title="What was tested">
          <p className="mb-4 text-[16px] leading-[1.75] text-text">{article.question}</p>
          <Paragraphs items={article.system} />
        </Block>
        <Block id="why-it-matters" n="02" title="Why it matters">
          <Paragraphs items={article.whyItMatters} />
        </Block>
        <Block id="how-it-worked" n="03" title="How it worked">
          <Paragraphs items={article.method} />
        </Block>
        <Block id="what-it-shows" n="04" title="What it shows" className={article.body === "research-summary" ? "border-b-0" : undefined}>
          <Rows rows={article.results} />
          {article.resultsNote && <p className="mt-4 text-[14px] leading-[1.65] text-subtle">{article.resultsNote}</p>}
          {article.visual === "goalPlot" && <GoalPlot className="mt-8" />}
        </Block>
      </Container>

      {article.body === "research-summary" && (
        <div className="border-t border-line">
          <Research />
        </div>
      )}

      <Container>
        <Block id="not-established" n="05" title="What it does not establish">
          <Bullets items={article.limitations} mark="dashed" />
        </Block>
        <Block id="artifacts" n="06" title="Artifacts and reproduction">
          <Links links={article.reproducibility} />
          <Disclosure summary="Technical details" className="mt-5">
            <div className="mt-2">
              <Rows rows={article.technical} />
            </div>
          </Disclosure>
          <p className={cn(mono, "mt-8 text-subtle")}>Related</p>
          <div className="mt-2">
            <Links links={article.related} />
          </div>
          <p className={cn(mono, "mt-8 text-subtle")}>Corrections</p>
          <ol className="mt-3 space-y-3">
            {article.corrections.map((c) => (
              <li key={c.date + c.text.slice(0, 20)} className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
                <span className="font-mono text-[11px] tracking-[0.06em] text-subtle sm:pt-[3px]">{c.date}</span>
                <span className="text-[14.5px] leading-[1.65] text-muted">{c.text}</span>
              </li>
            ))}
          </ol>
        </Block>
        <Block id="methods-note" n="07" title="Methods note" className="border-b-0">
          <p className="text-[15px] leading-[1.7] text-muted">{article.methodsNote}</p>
        </Block>
      </Container>

      <CtaBand current="labs" />
    </article>
  );
}
