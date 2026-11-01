import Link from "next/link";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { EvidenceLabel } from "@/components/sections/demo/parts";
import { Bullets } from "@/components/sections/research/shared";
import { Caveat, SECTION_PAD, mono } from "@/components/sections/technology/shared";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { formatBytes, publishedFile } from "@/lib/evidence-files";
import { CHECKSUM_NOTE, PENDING_LABEL, type EvidencePackage } from "@/lib/evidence-packages";

function KV({ rows }: { rows: readonly { k: string; v: string }[] }) {
  return (
    <dl className="border-t border-line">
      {rows.map((r) => (
        <div key={r.k} className="grid grid-cols-1 gap-1 border-b border-line py-3.5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5">
          <dt className="font-mono text-[10.5px] tracking-[0.1em] text-subtle uppercase sm:pt-[3px]">{r.k}</dt>
          <dd className="text-[14.5px] leading-[1.6] break-words text-text">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Head({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <div>
      <Kicker index={index}>{title}</Kicker>
      <h2 id={id} className="sr-only">
        {title}
      </h2>
    </div>
  );
}

/**
 * /evidence/[case]: one proof package. Files are linked only if they exist in
 * public/evidence/<slug>/ at build time, with size and a SHA-256 computed from the published
 * bytes; otherwise the row says "Artifact pending publication" and has no link.
 */
export default function EvidencePackageView({ pkg }: { pkg: EvidencePackage }) {
  const files = pkg.files.map((f) => ({ ...f, published: publishedFile(pkg.slug, f.name) }));
  const anyPublished = files.some((f) => f.published);

  return (
    <>
      <PageHeader header={{ kicker: "Evidence package", title: pkg.title, lede: pkg.summary }}>
        <div className="mt-8 flex flex-col items-start gap-3 md:mt-10">
          <EvidenceLabel size="lg" text={pkg.label} classes={pkg.classes} />
          <p className="text-[15px] leading-[1.6] text-muted">{pkg.qualifier}</p>
        </div>
      </PageHeader>

      <Section id="identity" aria-labelledby="identity-title" className={SECTION_PAD}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <Head id="identity-title" index="001" title="Run identity" />
            <div className="mt-6">
              <KV rows={pkg.identity} />
            </div>
            <p className={cn(mono, "mt-8 text-subtle")}>Prerequisites</p>
            <Bullets items={pkg.prerequisites} className="mt-4 [&_li]:text-[14.5px]" />
          </div>
          <div className="min-w-0">
            <Head id="properties-title" index="002" title="Properties and counts" />
            <ul className="mt-6 border-t border-line">
              {pkg.properties.map((p) => (
                <li key={p.name} className="grid grid-cols-1 gap-1 border-b border-line py-3.5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5">
                  <span className="font-mono text-[12px] tracking-[0.02em] text-lime">{p.name}</span>
                  <span className="text-[14.5px] leading-[1.6] text-text">{p.detail}</span>
                </li>
              ))}
            </ul>
            {pkg.counts.length > 0 && (
              <div className="mt-6">
                <KV rows={pkg.counts} />
              </div>
            )}
            <Caveat className="mt-6">{pkg.comparisonRule}</Caveat>
          </div>
        </div>
      </Section>

      <Section id="files" variant="charcoal" aria-labelledby="files-title" className={SECTION_PAD}>
        <Head id="files-title" index="003" title="Files" />
        {!anyPublished && (
          <p className="mt-6 max-w-[760px] text-[15px] leading-[1.7] text-muted">
            The files below are being prepared for publication. Each one becomes a download here once it is published; until then
            nothing is linked.
          </p>
        )}
        <ul className="mt-6 border-t border-line">
          {files.map((f) => (
            <li key={f.name} className="grid gap-x-8 gap-y-2 border-b border-line py-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="min-w-0">
                {f.published ? (
                  <a
                    href={f.published.href}
                    download
                    className="inline-flex min-h-11 items-center gap-2 font-mono text-[13px] tracking-[0.01em] break-all text-lime underline decoration-lime/40 underline-offset-4 hover:decoration-lime md:min-h-0"
                  >
                    {f.name}
                    <span aria-hidden="true">↓</span>
                  </a>
                ) : (
                  <span className="font-mono text-[13px] tracking-[0.01em] break-all text-[#c9d1ce]">{f.name}</span>
                )}
                <p className="mt-1 text-[13.5px] leading-[1.55] text-muted">{f.description}</p>
              </div>
              <div className="min-w-0">
                {f.published ? (
                  <p className="font-mono text-[11px] leading-[1.6] break-all text-[#b7c4bf]">
                    <span className="text-subtle uppercase">{formatBytes(f.published.bytes)} · SHA-256 </span>
                    {f.published.sha256}
                  </p>
                ) : (
                  <p
                    data-pending=""
                    className="inline-flex items-center gap-2.5 border border-dashed border-line-2 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-subtle uppercase"
                  >
                    <span aria-hidden="true" className="size-[7px] shrink-0 border border-dashed border-[#7d8c8a]" />
                    {PENDING_LABEL}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-12">
          <Caveat>{pkg.sanitization}</Caveat>
          <Caveat>{CHECKSUM_NOTE}</Caveat>
        </div>
      </Section>

      <Section id="package-limitations" aria-labelledby="package-limitations-title" className={SECTION_PAD}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <Head id="package-limitations-title" index="004" title="Limitations" />
            <Bullets items={pkg.limitations} mark="dashed" className="mt-6" />
          </div>
          <div>
            <Head id="package-related-title" index="005" title="Related" />
            <ul className="mt-6 border-t border-line">
              {pkg.related.map((l) => (
                <li key={l.href} className="border-b border-line">
                  <Link href={l.href} className="group flex min-h-11 items-center justify-between gap-4 py-3 text-[15.5px] text-text hover:text-lime">
                    <span>{l.label}</span>
                    <span aria-hidden="true" className="text-lime transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
