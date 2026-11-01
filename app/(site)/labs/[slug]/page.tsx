import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routeMetadata } from "@/components/layout/metadata";
import ArticleView from "@/components/sections/labs/ArticleView";
import { labsArticle, labsArticles } from "@/lib/labs";

/** Only the published articles exist; anything else is a 404 (no runtime rendering). */
export const dynamicParams = false;

export function generateStaticParams() {
  return labsArticles.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = labsArticle(slug);
  if (!article) return {};
  return routeMetadata({
    href: `/labs/${article.slug}`,
    title: article.title,
    fullTitle: `${article.title} — Ordinum Labs`,
    description: article.leadingResult,
    type: "article",
  });
}

export default async function LabsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = labsArticle(slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
