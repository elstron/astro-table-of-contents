// Main exports for the TOC integration
export { tableOfContents } from './integration/astro-integration';
// Template exports
export {
    tocItemTemplate,
    tocContainerTemplate,
    nestedListTemplate,
} from './templates/html-templates';

// Type exports
export type { TocOptions, HeadingData, HierarchyResult } from './types/index';
