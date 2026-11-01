import type { NavEntry, NavItem } from "@/lib/content";

/** On the home page nav links are in-page hashes; on other routes they are prefixed with "/". */
export function resolveHref(href: string, onHome: boolean) {
  return href.startsWith("#") && !onHome ? `/${href}` : href;
}

/** Path part of an href ("/contact#talk" -> "/contact"). */
export function pathOf(href: string) {
  return href.split("#")[0];
}

/** True when `pathname` is this item's page (exact match: /products is not current on /products/software). */
export function isCurrent(item: Pick<NavItem, "href">, pathname: string) {
  return pathOf(item.href) === pathname;
}

/** True when the route belongs to this top-level entry (a group's items, or a link and its sub-routes). */
export function entryOwns(entry: NavEntry, pathname: string) {
  const owns = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  if (entry.kind === "group") return entry.items.some((i) => owns(pathOf(i.href)));
  return owns(entry.href) || (entry.match ?? []).some(owns);
}
