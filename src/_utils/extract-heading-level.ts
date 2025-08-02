/**
 * Extract heading level from HTML tag
 */

export function extractHeadingLevel(heading: string): number {
    if (heading.startsWith('<H')) {
        return parseInt(heading.match(/<H([1-6])/)?.[1] || '1');
    }
    return parseInt(heading.match(/<h([1-6])/)?.[1] || '1');
}
