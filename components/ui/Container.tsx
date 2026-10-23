import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Site-width wrapper: max 1320px, 22px gutters on mobile, 48px from md up. */
export default function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={cn("mx-auto w-full max-w-site px-[22px] md:px-12", className)} {...props} />;
}
