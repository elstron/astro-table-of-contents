import type { TocOptions, HeadingData, HierarchyResult } from '../types/index';
import { parseHeadings } from '../parser/heading-parser';
import { tocContainerTemplate, nestedListTemplate } from '../templates/html-templates';

function hasChildHeadings(
    headings: HeadingData[],
    currentIndex: number,
    currentLevel: number,
): boolean {
    const nextIndex = currentIndex + 1;
    return nextIndex < headings.length && headings[nextIndex].level > currentLevel;
}

function processHeadingWithChildren(
    headings: HeadingData[],
    currentIndex: number,
    heading: HeadingData,
): { html: string; nextIndex: number } {
    const openTag = `<li><a data-level="${currentIndex+1}" href="#${heading.id}">${heading.title}</a>`;
    const childResult = buildHierarchy(headings, currentIndex + 1, heading.level + 1);
    const closeTag = '</li>';

    return {
        html: openTag + childResult.html + closeTag,
        nextIndex: childResult.nextIndex,
    };
}

function processHeadingWithoutChildren(heading: HeadingData): { html: string; nextIndex: number } {
    return {
        html: `<li><a data-level="${heading.level} href="#${heading.id}">${heading.title}</a></li>`,
        nextIndex: 1,
    };
}

export function buildHierarchy(
    headings: HeadingData[],
    startIndex = 0,
    currentLevel = 1,
): HierarchyResult {
    let html = '';
    let i = startIndex;

    while (i < headings.length) {
        const heading = headings[i];

        if (heading.level < currentLevel) break;

        if (heading.level > currentLevel) {
            i++;
            continue;
        }

        if (hasChildHeadings(headings, i, currentLevel)) {
            const result = processHeadingWithChildren(headings, i, heading);
            html += result.html;
            i = result.nextIndex;
        } else {
            const result = processHeadingWithoutChildren(heading);
            html += result.html;
            i += result.nextIndex;
        }
    }

    return {
        html: nestedListTemplate(html),
        nextIndex: i,
    };
}

export function generateToc(page: TocOptions): string {
    const parsedHeadings = parseHeadings(page.content);
    if (parsedHeadings.length === 0) return '';

    const result = buildHierarchy(parsedHeadings);
    return tocContainerTemplate(result.html);
}
