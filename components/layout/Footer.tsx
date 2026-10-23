import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import OrdinumMark from "@/components/brand/OrdinumMark";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { footer } from "@/lib/content";
import { resolveHref } from "@/lib/nav";

type FooterProps = {
  /**
   * True on the home page (in-page "#hash" links and back-to-top target #top).
   * Off the home page, hashes become "/#hash" and back-to-top targets #main.
   */
  onHome?: boolean;
};


function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function FooterLink({
  href,
  external,
  className,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string; external?: boolean }) {
  const ext = external ?? isExternal(href);
  if (ext) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}

/* Minimal monochrome social glyphs (currentColor, 24px grid). */
const GLYPHS: Record<string, ReactNode> = {
  "x.com": (
    <path
      fill="currentColor"
      d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z"
    />
  ),
  "instagram.com": (
    <g fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.75" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.35" cy="6.65" r="0.6" fill="currentColor" stroke="none" />
    </g>
  ),
  "linkedin.com": (
    <path
      fill="currentColor"
      d="M5.2 7.15a1.95 1.95 0 1 1 0-3.9 1.95 1.95 0 0 1 0 3.9ZM3.55 8.7h3.3V20.5h-3.3V8.7Zm5.4 0h3.16v1.62h.05c.44-.83 1.52-1.7 3.12-1.7 3.34 0 3.96 2.2 3.96 5.06v6.82h-3.3v-6.04c0-1.44-.03-3.3-2-3.3-2.02 0-2.32 1.57-2.32 3.2v6.14H8.95V8.7Z"
    />
  ),
};

function glyphFor(href: string): ReactNode | null {
  if (!isExternal(href)) return null;
  const host = new URL(href).hostname.replace(/^www\./, "");
  return GLYPHS[host] ?? null;
}

const linkClass =
  "group -my-2.5 inline-flex min-h-11 items-center gap-2.5 text-[14px] leading-6 tracking-[-0.01em] text-muted transition-colors duration-200 hover:text-lime";

export default function Footer({ onHome = true }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace(/\d{4}/, String(year));
  const topHref = onHome ? "#top" : "#main";

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg">
      <Container className="relative pt-16 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
          {/* Brand + thesis */}
          <div className="max-w-[460px]">
            <FooterLink
              href={onHome ? "#top" : "/"}
              aria-label="Ordinum, home"
              className="-mx-1 inline-flex items-center gap-3 px-1 py-1 text-text"
            >
              <OrdinumMark className="size-7" />
              <span className="text-[20px] font-bold leading-none tracking-[-0.065em]">ORDINUM</span>
            </FooterLink>

            <p className="mt-9 text-[24px] font-semibold leading-[1.18] tracking-title text-text md:text-[28px]">
              {footer.thesis}
            </p>

            <p className="label-mono mt-8 flex items-center gap-2.5 text-subtle">
              <span aria-hidden="true" className="inline-block size-[6px] bg-lime" />
              Research-stage verification infrastructure
            </p>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-11 sm:grid-cols-3">
            {footer.columns.map((column) => (
              <div key={column.title} className={cn(column.title === "Contact" && "order-last col-span-2 sm:order-none sm:col-span-1")}>
                <h2 className="label-mono border-b border-line pb-4 text-subtle">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => {
                    const href = resolveHref(link.href, onHome);
                    const glyph = glyphFor(link.href);
                    const ext = "external" in link ? link.external : undefined;
                    return (
                      <li key={link.href}>
                        <FooterLink href={href} external={ext} className={linkClass}>
                          {glyph && (
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              focusable="false"
                              className="size-[15px] shrink-0 text-subtle transition-colors duration-200 group-hover:text-lime"
                            >
                              {glyph}
                            </svg>
                          )}
                          <span className={cn(link.href.startsWith("mailto:") && "break-all")}>{link.label}</span>
                          {isExternal(link.href) && (
                            <span
                              aria-hidden="true"
                              className="text-[12px] text-subtle transition-[color,transform] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-lime"
                            >
                              ↗
                            </span>
                          )}
                        </FooterLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-5 border-t border-line py-6 font-mono text-[11px] uppercase tracking-[0.1em] text-subtle md:mt-24 md:flex-row md:items-center md:justify-between">
          <p>{copyright}</p>
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {footer.legal.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} className="-my-3 inline-flex min-h-11 items-center transition-colors duration-200 hover:text-lime">
                  {link.label}
                </FooterLink>
              </li>
            ))}
            <li>
              <a href={topHref} className="group -my-3 inline-flex min-h-11 items-center gap-2 transition-colors duration-200 hover:text-lime">
                Back to top
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5">
                  ↑
                </span>
              </a>
            </li>
          </ul>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the page edge. Decorative. */}
      <Container aria-hidden="true" className="pointer-events-none select-none">
        <p className="-mb-[0.2em] mt-2 whitespace-nowrap bg-linear-to-b from-[#1b2327] to-bg to-85% bg-clip-text text-[clamp(72px,20.4vw,284px)] font-bold leading-[0.9] tracking-[-0.075em] text-transparent">
          ORDINUM
        </p>
      </Container>
    </footer>
  );
}
