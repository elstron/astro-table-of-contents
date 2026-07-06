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

export type HeadingNode = HeadingData & { children: HeadingNode[] };

/**
 * Creates a hierarchical structure of headings from a flat array of heading data.
 *
 * @param {HeadingData[]} headings - The flat array of heading data.
 * @returns {HeadingNode[]} A hierarchical structure of heading nodes.
 */
export function createHierarchy(headings: HeadingData[]): HeadingNode[] {
    const root: HeadingNode[] = [];
    const stack: HeadingNode[] = [];

    for (const heading of headings) {
        const node: HeadingNode = { ...heading, children: [] };

        while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
            stack.pop();
        }

        stack.length === 0 ? root.push({
            ...node,
            indexId: root.length + 1,
            parentIndex: null,
        }) : stack[stack.length - 1].children.push({
            ...node,
            parentIndex: stack.length,
            indexId: stack[stack.length - 1].children.length + 1,
        });
        stack.push(node);
    }

    return root;
}
