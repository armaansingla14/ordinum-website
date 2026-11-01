import Link from "next/link";
import { cn } from "@/lib/cn";
import type { LabsArticle } from "@/lib/labs";

const meta = "font-mono text-[10px] leading-[1.4] tracking-[0.13em] uppercase";

/** A published Labs article: category, title, summary, date, author. The whole card is one link. */
export function ArticleCard({ article, headingLevel = "h3", className }: { article: LabsArticle; headingLevel?: "h2" | "h3"; className?: string }) {
  const H = headingLevel;
  return (
    <Link href={`/labs/${article.slug}`} className={cn("group flex h-full flex-col bg-bg p-6 transition-colors hover:bg-surface sm:p-7", className)}>
      <p className={cn(meta, "text-lime")}>{article.category}</p>
      <H className="mt-4 text-[21px] leading-[1.25] font-semibold tracking-title text-balance text-text group-hover:text-lime">
        {article.title}
      </H>
      <p className="mt-3 text-[14.5px] leading-[1.65] text-muted">{article.summary}</p>
      <span aria-hidden="true" className="min-h-5 flex-1" />
      <p className={cn(meta, "flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-subtle")}>
        <span>
          {article.date} · {article.authors.join(", ")}
        </span>
        <span aria-hidden="true" className="text-lime transition-transform duration-200 group-hover:translate-x-1">
          Read →
        </span>
      </p>
    </Link>
  );
}
