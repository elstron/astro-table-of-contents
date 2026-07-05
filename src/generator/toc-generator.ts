import type { TocOptions, HeadingData, HierarchyResult } from '../types/index';
import { createHierarchy, HeadingNode, parseHeadings } from '../parser/heading-parser';
import { tocContainerTemplate, nestedListTemplate } from '../templates/html-templates';


/**
 * Checks if the current heading has child headings.
 *
 * @param {HeadingData[]} headings - The array of heading data.
 * @param {number} currentIndex - The current index of the heading being processed.
 * @param {number} currentLevel - The current heading level being processed.
 * @returns {boolean} True if the current heading has child headings, false otherwise.
 */
function hasChildHeadings(
    headings: HeadingData[],
    currentIndex: number,
    currentLevel: number,
): boolean {
    const nextIndex = currentIndex + 1;
    return nextIndex < headings.length && headings[nextIndex].level > currentLevel;
}

/**
 * Processes a heading with child headings and generates the corresponding HTML.
 *
 * @param {HeadingData[]} headings - The array of heading data.
 * @param {number} currentIndex - The current index of the heading being processed.
 * @param {HeadingData} heading - The heading data to process.
 * @returns {{ html: string; nextIndex: number }} An object containing the generated HTML and the next index to process.
 */
function processHeadingWithChildren(
    headings: HeadingData[],
    currentIndex: number,
    heading: HeadingData,
): { html: string; nextIndex: number } {
    const openTag = `<li><a data-index="${heading.indexId}.${currentIndex}" href="#${heading.id}">${heading.title}</a>`;
    const childResult = buildHierarchy(headings, currentIndex + 1, heading.level + 1);
    const closeTag = '</li>';

    return {
        html: openTag + childResult.html + closeTag,
        nextIndex: childResult.nextIndex,
    };
}

/**
 * Processes a heading without child headings and generates the corresponding HTML.
 *
 * @param {HeadingData} heading - The heading data to process.
 * @returns {{ html: string; nextIndex: number }} An object containing the generated HTML and the next index to process.
 */
function processHeadingWithoutChildren({id, title, indexId}: HeadingData): { html: string; nextIndex: number } {
    return {
        html: `<li><a data-index="${indexId}" href="#${id}">${title}</a></li>`,
        nextIndex: 1,
    };
}

/** 
 * @depecated Use `buildHtmlHierarchy` instead.
 * Builds a hierarchical HTML structure from the given headings.
 *
 * @param {HeadingData[]} headings - The array of heading data.
 * @param {number} startIndex - The starting index for processing headings.
 * @param {number} currentLevel - The current heading level being processed.
 * @returns {HierarchyResult} An object containing the generated HTML and the next index to process.
 */
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

/**
 * Builds a hierarchical HTML structure from the given heading nodes.
 *
 * @param {HeadingNode[]} headings - The array of heading nodes.
 * @param {number[]} indexAcc - The accumulated index for nested headings.
 * @returns {{ html: string; }} An object containing the generated HTML.
 */
export function buildHtmlHierarchy(headings: HeadingNode[], indexAcc: number[] = []): { html: string; } {
  let html = '';
  if (headings.length === 0) return { html: nestedListTemplate(html) };
  
  for (const { indexId, id, title, children, parentIndex } of headings) {
    let newIndex = hasParentIndex(parentIndex) ? [...indexAcc, (indexId || 0)] : [indexId || 0]; 

    let index =  newIndex.join('.');

    if (children.length > 0) {
      const childResult = buildHtmlHierarchy(children, newIndex);
      html += `<li><a data-index="${index}" href="#${id}">${title}</a>${childResult.html}</li>`;
      continue;
    }
    html += `<li><a data-index="${index}" href="#${id}">${title}</a></li>`;
  }
  return {html: nestedListTemplate(html)};
}


/**
 * Checks if the given parent index is defined (not null or undefined).
 *
 * @param {number | undefined | null} parentIndex - The parent index to check.
 * @returns {boolean} True if the parent index is defined, false otherwise.
 */
function hasParentIndex(parentIndex: number | undefined | null ): boolean {
  return parentIndex !== null && parentIndex !== undefined;
}


/**
 * Generates a Table of Contents (TOC) from the given page content.
 *
 * @param {TocOptions} page - The page options containing the content to generate the TOC from.
 * @returns {string} The generated TOC HTML.
 */
export function generateToc(page: TocOptions): string {
    const parsedHeadings = parseHeadings(page.content);
    if (parsedHeadings.length === 0) return '';
    const headings = createHierarchy(parsedHeadings);
    const result = buildHtmlHierarchy(headings);
    return tocContainerTemplate(result.html);
}
