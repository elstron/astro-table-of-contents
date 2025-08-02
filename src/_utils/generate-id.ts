/**
 * Generate a clean ID from heading text
 */
export function generateId(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-_]+|[-_]+$/g, '');
}
