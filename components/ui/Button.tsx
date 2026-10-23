import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "dark";
export type ButtonSize = "md" | "sm";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing glyph, e.g. "↓". External links get "↗" automatically. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer" and appends ↗. Auto-detected for http(s) URLs. */
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

type ButtonAsButton = CommonProps & {
  href?: undefined;
  external?: never;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "group inline-flex items-center justify-center gap-5 whitespace-nowrap border font-semibold uppercase " +
  "transition-[background-color,border-color,color] duration-200 ease-out " +
  "disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<ButtonSize, string> = {
  md: "px-6 py-[17px] text-[12px] tracking-[0.06em]",
  sm: "px-[18px] py-[13px] text-[11px] tracking-[0.13em]",
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-text bg-text text-bg hover:border-lime hover:bg-lime hover:text-bg",
  secondary: "border-[#515d5e] bg-transparent text-text hover:border-lime hover:bg-lime hover:text-bg",
  dark:
    "border-sage-ink bg-sage-ink text-[#f0f5ec] hover:border-sage-accent hover:bg-sage-accent " +
    "focus-visible:outline-sage-ink",
};

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

/**
 * Square, uppercase CTA. Renders <a> (or next/link for internal routes) when `href` is set,
 * otherwise <button>. Hover fills lime (primary/secondary).
 */
type AnchorRest = Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type ButtonRest = Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, className, children, ...rest } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if (props.href !== undefined) {
    const { href, external, ...anchorRest } = rest as AnchorRest & { href: string; external?: boolean };
    const isExternal = external ?? isExternalHref(href);
    const trailing = icon ?? (isExternal ? "↗" : null);
    const content = (
      <>
        <span>{children}</span>
        {trailing && (
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
            {trailing}
          </span>
        )}
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
      </>
    );

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...anchorRest}>
          {content}
        </a>
      );
    }
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link href={href} className={classes} {...anchorRest}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const { type, ...buttonRest } = rest as ButtonRest;
  return (
    <button type={type ?? "button"} className={classes} {...buttonRest}>
      <span>{children}</span>
      {icon && <span aria-hidden="true">{icon}</span>}
    </button>
  );
}
