// Main exports for the TOC integration
export { tableOfContents } from './integration/astro-integration';
export { default as TableOfContents } from '../astro/TableOfContents.astro';
// Template exports
export {
    tocItemTemplate,
    tocContainerTemplate,
    nestedListTemplate,
} from './templates/html-templates';

// Type exports
export type { TocOptions, HeadingData, HierarchyResult } from './types/index';
