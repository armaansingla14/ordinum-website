import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routeMetadata } from "@/components/layout/metadata";
import EvidencePackageView from "@/components/sections/evidence/EvidencePackageView";
import { evidencePackage, evidencePackages } from "@/lib/evidence-packages";

/** Only the three packages exist; built at build time, so file links reflect public/evidence then. */
export const dynamicParams = false;

export function generateStaticParams() {
  return evidencePackages.map((p) => ({ case: p.slug }));
}

type Props = { params: Promise<{ case: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { case: slug } = await params;
  const pkg = evidencePackage(slug);
  if (!pkg) return {};
  return routeMetadata({
    href: `/evidence/${pkg.slug}`,
    title: `Evidence: ${pkg.title}`,
    fullTitle: `Evidence package: ${pkg.title}`,
    description: `${pkg.label}. ${pkg.summary}`,
  });
}

export default async function EvidencePage({ params }: Props) {
  const { case: slug } = await params;
  const pkg = evidencePackage(slug);
  if (!pkg) notFound();
  return <EvidencePackageView pkg={pkg} />;
}
