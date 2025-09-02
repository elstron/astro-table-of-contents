// Main integration export
export { tableOfContents } from './integration/astro-integration';

// Export generation utilities
export { generateToc } from './generator/toc-generator';

// Export templates
export {
    tocItemTemplate,
    tocContainerTemplate,
    nestedListTemplate
} from './templates/html-templates';

// Export types
export type { TocOptions, HeadingData, HierarchyResult } from './types';
