export function isValidRoute(pathname: string): boolean {
    const isApiRoute = pathname.startsWith('/api/');
    const isInternalAstroRoute = pathname.startsWith('/_astro/');
    const hasFileExtension = getExtFromUrl(pathname) !== "";
    if (isApiRoute || isInternalAstroRoute || hasFileExtension) return false;
    return true;
}

function getExtFromUrl(pathname: string): string {
  const i = pathname.lastIndexOf(".");
  return i > 0 ? pathname.slice(i) : "";
}
