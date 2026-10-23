"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { nav, site } from "@/lib/content";
import { resolveHref } from "@/lib/nav";

/**
 * Anchor that uses next/link for route paths and a plain <a> for in-page hashes,
 * so hash jumps on the home page stay native (smooth scroll, no router work).
 */
export function NavAnchor({ href, ...props }: ComponentPropsWithoutRef<"a"> & { href: string }) {
  if (href.startsWith("/") && !href.startsWith("//")) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const noopSubscribe = () => () => {};
/** False during SSR and hydration, true afterwards. Lets us portal to document.body safely. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function lockScroll() {
  const html = document.documentElement;
  const prev = { html: html.style.overflow, body: document.body.style.overflow };
  html.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  return () => {
    html.style.overflow = prev.html;
    document.body.style.overflow = prev.body;
  };
}

type MobileMenuProps = {
  /** On the home page links are in-page hashes; elsewhere they are prefixed with "/". */
  onHome: boolean;
  /** Nav href of the current page, if any. */
  active: string | null;
};

/**
 * Mobile navigation disclosure (below lg).
 * Toggle lives in the header; the full-height sheet is portaled to <body> so the header's
 * backdrop-filter doesn't become its containing block. Focus is trapped between the toggle
 * and the sheet, Escape closes and restores focus, links close the sheet, body scroll is locked.
 */
export default function MobileMenu({ onHome, active }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const sheetId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const unlockRef = useRef<(() => void) | null>(null);

  const unlock = useCallback(() => {
    unlockRef.current?.();
    unlockRef.current = null;
  }, []);

  const close = useCallback(
    (restoreFocus: boolean) => {
      unlock();
      setOpen(false);
      if (restoreFocus) toggleRef.current?.focus();
    },
    [unlock],
  );

  // Scroll lock + initial focus while open.
  useEffect(() => {
    if (!open) return;
    unlockRef.current = lockScroll();
    const frame = requestAnimationFrame(() => {
      sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      unlock();
    };
  }, [open, unlock]);

  // Everything behind the full-screen sheet is inert, so virtual cursors and swipe
  // navigation can't wander into the page underneath. The header (and toggle) stay live.
  useEffect(() => {
    if (!open) return;
    const behind = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    behind.forEach((el) => el.setAttribute("inert", ""));
    return () => behind.forEach((el) => el.removeAttribute("inert"));
  }, [open]);

  // Escape to close, Tab cycles within [toggle, ...sheet].
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current || !toggleRef.current) return;
      const items = [
        toggleRef.current,
        ...Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      const inside = current !== null && items.includes(current);
      if (event.shiftKey && (current === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // The sheet only exists below lg; close it if the viewport grows past that.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && close(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, close]);

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) {
      close(false);
      return;
    }
    // In-page hash: release the scroll lock first, then scroll, so the jump isn't swallowed.
    event.preventDefault();
    close(false);
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      window.history.pushState(null, "", href);
      // Move focus to the section so keyboard / screen-reader users continue from there,
      // not from the top of the document.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  };

  const demoHref = resolveHref(nav.demo.href, onHome);

  const sheet = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id={sheetId}
          ref={sheetRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.16 } }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 top-[62px] z-40 flex flex-col overflow-y-auto overscroll-contain bg-bg lg:hidden"
        >
          <div aria-hidden="true" className="grid-bg-flat pointer-events-none absolute inset-0 opacity-70" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgb(193_226_158/0.07),transparent_55%)]"
          />

          <Container className="relative flex flex-1 flex-col pb-[max(28px,env(safe-area-inset-bottom))] pt-7">
            <p className="label-mono flex items-center justify-between text-subtle">
              <span>Index</span>
              <span aria-hidden="true">{String(nav.links.length).padStart(2, "0")} pages</span>
            </p>

            <nav aria-label="Mobile" className="mt-4">
              <ul className="border-t border-line">
                {nav.links.map((link, i) => {
                  const href = resolveHref(link.href, onHome);
                  const isActive = active === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      className="border-b border-line"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.04 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <NavAnchor
                        href={href}
                        onClick={(event) => onLinkClick(event, href)}
                        aria-current={isActive ? "page" : undefined}
                        className="group flex items-center justify-between gap-6 py-[19px] focus-visible:outline-offset-[-2px]"
                      >
                        <span
                          className={cn(
                            "text-[clamp(30px,8.6vw,40px)] font-semibold leading-none tracking-display transition-colors duration-200",
                            isActive ? "text-lime" : "text-text group-hover:text-lime",
                          )}
                        >
                          {link.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "font-mono text-[11px] tracking-[0.14em]",
                            isActive ? "text-lime" : "text-subtle",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </NavAnchor>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              className="mt-auto grid gap-3 pt-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button
                href={demoHref}
                icon="→"
                className="w-full justify-between"
                onClick={(event) => onLinkClick(event, demoHref)}
              >
                {nav.demo.label}
              </Button>
              <Button
                href={nav.bookCall.href}
                variant="secondary"
                className="w-full justify-between"
                onClick={() => close(false)}
              >
                {nav.bookCall.label}
              </Button>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 flex items-center justify-between border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-lime"
              >
                <span>Email</span>
                <span className="normal-case tracking-[0.02em]">{site.email}</span>
              </a>
            </motion.div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={sheetId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close(false) : setOpen(true))}
        className={cn(
          "relative -mr-1 grid size-11 place-items-center border transition-colors duration-200 lg:hidden",
          open ? "border-line-2 bg-surface-2" : "border-line hover:border-line-2",
        )}
      >
        <span aria-hidden="true" className="relative block h-[9px] w-[18px]">
          <span
            className={cn(
              "absolute left-0 h-px w-full bg-text transition-transform duration-300 ease-out-expo motion-reduce:transition-none",
              open ? "top-1 rotate-45" : "top-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 h-px bg-text transition-[transform,width] duration-300 ease-out-expo motion-reduce:transition-none",
              open ? "top-1 w-full -rotate-45" : "top-2 w-[12px]",
            )}
          />
        </span>
      </button>
      {isClient && createPortal(sheet, document.body)}
    </>
  );
}
