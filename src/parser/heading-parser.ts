import type { HeadingData } from '../types';
import { extractHeadingLevel, extractHeadingTitle, generateId } from '../_utils';

/**
 * Parses headings from the given HTML content.
 *
 * @param {string} content - The HTML content to parse.
 * @returns {HeadingData[]} An array of heading data objects.
 */
export function parseHeadings(content: string): HeadingData[] {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];

    return headings
        .map((heading) => {
            const level = extractHeadingLevel(heading);
            const title = extractHeadingTitle(heading);

            return {
                level,
                title,
                id: generateId(title),
            };
        })
        .filter((heading) => heading.title.trim().length > 0);
}
