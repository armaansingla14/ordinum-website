"use client";

import { useEffect, useId, useRef, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { MaturityMarker } from "@/components/ui/MaturityMarker";
import { cn } from "@/lib/cn";
import { MATURITY_LABELS, type NavGroup, type NavItem } from "@/lib/content";
import { isCurrent } from "@/lib/nav";
import { NavAnchor } from "./MobileMenu";

/** Mono maturity label for a nav item: marker shape + exact label + scope. */
export function NavMaturity({ item, className }: { item: NavItem; className?: string }) {
  if (!item.maturity) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[9.5px] leading-[1.35] tracking-[0.11em] uppercase",
        item.maturity === "planned" ? "text-subtle" : "text-lime",
        className,
      )}
    >
      <MaturityMarker maturity={item.maturity} className="size-[8px]" />
      <span>
        {MATURITY_LABELS[item.maturity]}
        {item.maturityNote && <span className="text-subtle"> · {item.maturityNote}</span>}
      </span>
    </span>
  );
}

type NavDisclosureProps = {
  group: NavGroup;
  pathname: string;
  /** This group owns the current route (underline + colour). */
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Panel edge: "start" aligns the panel's left edge with the button, "end" its right edge. */
  align?: "start" | "end";
  /** Wide two-column panel (Products). */
  wide?: boolean;
  /** Extra decoration inside the item (the active underline). */
  children?: ReactNode;
};

/**
 * Desktop nav disclosure (WAI-ARIA disclosure pattern, not a menu): a button with
 * aria-expanded / aria-controls toggles a panel of links. Opens on click, Enter or Space (native
 * button), never on hover alone. Escape closes it and returns focus to the button; focus leaving
 * the group or a click outside closes it; the parent closes it on route change.
 */
export default function NavDisclosure({
  group,
  pathname,
  active,
  open,
  onOpenChange,
  align = "start",
  wide = false,
  children,
}: NavDisclosureProps) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLLIElement>(null);

  // Click (or tap) outside closes the panel.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(false);
      buttonRef.current?.focus();
    }
  };

  // Focus moving to an element outside the group closes it (null = focus left the document; keep it).
  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null;
    if (open && next && rootRef.current && !rootRef.current.contains(next)) onOpenChange(false);
  };

  return (
    <li ref={rootRef} className="relative flex h-full items-center" onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 py-2 text-[12px] leading-none font-medium tracking-[0.09em] uppercase transition-colors duration-200",
          active || open ? "text-text" : "text-[#c1c9c6] hover:text-lime",
        )}
      >
        {group.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={cn("h-[6px] w-[10px] transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute top-full z-50 -mt-px border border-line-2 bg-surface shadow-[0_24px_60px_-30px_rgb(0_0_0/0.95)]",
          align === "start" ? "left-0" : "right-0",
          wide ? "w-[min(680px,calc(100vw-48px))]" : "w-[320px]",
        )}
      >
        <ul className={cn("grid gap-px bg-line p-px", wide && "grid-cols-2")}>
          {group.items.map((item, i) => {
            const current = isCurrent(item, pathname);
            const spanFull = wide && i === group.items.length - 1 && group.items.length % 2 === 1;
            return (
              <li key={item.href} className={cn("bg-surface", spanFull && "col-span-2")}>
                <NavAnchor
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => onOpenChange(false)}
                  className="group/item flex h-full flex-col gap-1.5 px-5 py-4 transition-colors duration-200 hover:bg-surface-2 focus-visible:outline-offset-[-2px]"
                >
                  <span
                    className={cn(
                      "text-[15px] leading-[1.3] font-semibold tracking-[-0.02em] transition-colors",
                      current ? "text-lime" : "text-text group-hover/item:text-lime",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="text-[13px] leading-[1.5] text-muted">{item.description}</span>
                  <NavMaturity item={item} className="mt-1" />
                </NavAnchor>
              </li>
            );
          })}
        </ul>
      </div>
      {children}
    </li>
  );
}
