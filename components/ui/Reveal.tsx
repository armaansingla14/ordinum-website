"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealTag = "div" | "section" | "ul" | "ol" | "li" | "article" | "header" | "p" | "span";

type RevealProps = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  /** Delay in seconds before this element reveals. */
  delay?: number;
  /**
   * When set, direct <RevealItem> children reveal in sequence, `stagger` seconds apart.
   * The container itself does not fade.
   */
  stagger?: number;
  /** Portion of the element that must be visible before revealing (0-1). Default 0.2. */
  amount?: number;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Fade + 12px rise on first view (once). The hidden state is server-rendered, so
 * app/layout.tsx ships a <noscript> override on [data-reveal] for visitors without JS. Reduced motion is handled globally by MotionConfig
 * (transforms are skipped; opacity still fades).
 */
export default function Reveal({ children, as = "div", className, delay = 0, stagger, amount = 0.2 }: RevealProps) {
  const Component = motion[as];
  const variants: Variants =
    stagger !== undefined
      ? { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }
      : {
          hidden: itemVariants.hidden,
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
        };

  return (
    <Component
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
};

/** Child of a staggered <Reveal stagger={...}>. */
export function RevealItem({ children, as = "div", className }: RevealItemProps) {
  const Component = motion[as];
  return (
    <Component data-reveal="" className={className} variants={itemVariants}>
      {children}
    </Component>
  );
}
