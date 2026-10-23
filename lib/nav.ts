/** On the home page nav links are in-page hashes; on other routes they are prefixed with "/". */
export function resolveHref(href: string, onHome: boolean) {
  return href.startsWith("#") && !onHome ? `/${href}` : href;
}
