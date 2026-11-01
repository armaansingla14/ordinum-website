import Link from "next/link";
import type { ReactNode } from "react";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import Research from "@/components/sections/Research";
import { EvidenceLabel } from "@/components/sections/demo/parts";
import { Bullets } from "@/components/sections/research/shared";
import Container from "@/components/ui/Container";
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

/**
 * A Labs article: leading result with its evidence label, then question, system under test,
 * method, results, (research summary: the migrated research sections), limitations, related
 * work, reproducibility links, correction history and the AI-assistance methods note.
 */
export default function ArticleView({ article }: { article: LabsArticle }) {
  return (
    <article aria-labelledby="page-title">
      <PageHeader header={{ kicker: `Ordinum Labs · ${article.category}`, title: article.title, lede: article.summary }}>
        <p className={cn(mono, "mt-8 flex flex-wrap gap-x-4 gap-y-1 text-subtle")}>
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
        <section id="leading-result" aria-labelledby="leading-result-title" className="border-b border-line py-10 md:py-14">
          <h2 id="leading-result-title" className={cn(mono, "text-lime")}>
            Leading result
          </h2>
          <p className="mt-5 max-w-[920px] text-[clamp(21px,2.2vw,28px)] leading-[1.4] tracking-[-0.03em] text-balance text-text">
            {article.leadingResult}
          </p>
          <EvidenceLabel size="lg" text={article.label.text} classes={article.label.classes} className="mt-6" />
        </section>

        <Block id="question" n="01" title="Question">
          <p className="text-[17px] leading-[1.7] text-text">{article.question}</p>
        </Block>
        <Block id="system" n="02" title="System under test">
          <Paragraphs items={article.system} />
        </Block>
        <Block id="method" n="03" title="Method">
          <Paragraphs items={article.method} />
        </Block>
        <Block id="results" n="04" title="Results">
          <dl className="border-t border-line">
            {article.results.map((r) => (
              <div key={r.k} className="grid grid-cols-1 gap-1 border-b border-line py-3.5 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-5">
                <dt className="font-mono text-[10.5px] tracking-[0.1em] text-subtle uppercase sm:pt-[3px]">{r.k}</dt>
                <dd className="text-[15px] leading-[1.6] text-text">{r.v}</dd>
              </div>
            ))}
          </dl>
          {article.resultsNote && <p className="mt-4 text-[14px] leading-[1.65] text-subtle">{article.resultsNote}</p>}
        </Block>
      </Container>

      {article.body === "research-summary" && (
        <div className="mt-[-1px] border-t border-line">
          <Research />
        </div>
      )}

      <Container>
        <Block id="article-limitations" n="05" title="Limitations">
          <Bullets items={article.limitations} mark="dashed" />
        </Block>
        <Block id="related" n="06" title="Related work">
          <Links links={article.related} />
        </Block>
        <Block id="reproduce" n="07" title="Reproducibility">
          <Links links={article.reproducibility} />
        </Block>
        <Block id="corrections" n="08" title="Correction history">
          <ol className="space-y-4">
            {article.corrections.map((c) => (
              <li key={c.date + c.text.slice(0, 20)} className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
                <span className="font-mono text-[11px] tracking-[0.06em] text-subtle sm:pt-[3px]">{c.date}</span>
                <span className="text-[15px] leading-[1.65] text-muted">{c.text}</span>
              </li>
            ))}
          </ol>
        </Block>
        <Block id="methods-note" n="09" title="Methods note" className="border-b-0">
          <p className="text-[15px] leading-[1.7] text-muted">{article.methodsNote}</p>
        </Block>
      </Container>

      <CtaBand current="labs" />
    </article>
  );
}
