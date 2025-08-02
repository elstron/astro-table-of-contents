import type { TocOptions } from '../types';

/**
 * Check if page contains TOC marker
 */

export function pageContainsToc(page: TocOptions): boolean {
    return /<\/stron-toc>/i.test(page.content);
}
