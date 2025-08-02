export function extractHeadingTitle(heading: string): string {
    if (!heading || typeof heading !== 'string') {
        return '';
    }
    if (heading.includes('id="toc-title"')) return '';

    const matches = heading.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi);
    const texts = matches
        ?.map((tag) =>
            tag
                .replace(/<[^>]+>/g, '')
                .replace(/\s+/g, ' ')
                .trim(),
        )
        .map((text) => decodeHtmlEntities(text));

    return texts?.join('') || '';
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
    const htmlEntities: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&#x27;': "'",
        '&apos;': "'",
        '&nbsp;': ' ',
        '&copy;': '©',
        '&reg;': '®',
        '&trade;': '™',
    };

    return text.replace(/&[#\w]+;/g, (entity) => {
        return htmlEntities[entity] || entity;
    });
}
