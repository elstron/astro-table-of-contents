// HTML templates and formatting functions

/**
 * Template for individual TOC item
 */
export function tocItemTemplate({ title, id }: { title: string; id: string }): string {
    return `<li><a href="#${id}">${title}</a></li>`;
}

/**
 * Template for TOC container
 */
export function tocContainerTemplate(content: string): string {
    return `<div class="toc-content">\n${content}\n</div>`;
}

/**
 * Template for nested list structure
 */
export function nestedListTemplate(content: string): string {
    return `<ul>${content}</ul>`;
}
