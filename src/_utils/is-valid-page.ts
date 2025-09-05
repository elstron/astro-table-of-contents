export function isValidPage(pathname: string, headers: Headers): boolean {
    if(headers.get('content-type')?.includes('text/html') === false) return false;
    if (pathname.startsWith('/api/') || pathname.startsWith('/_astro/')) return false;
    if (hasFileExtension(pathname)) return false;
    return true;
}

function hasFileExtension(pathname: string): boolean {
    const lastSlash = pathname.lastIndexOf('/');
    const lastDot = pathname.lastIndexOf('.');
    return lastDot > lastSlash;
}
