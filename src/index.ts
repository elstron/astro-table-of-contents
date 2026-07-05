export { tableOfContents } from './integration/astro-integration';

export { generateToc } from './generator/toc-generator';

export {
    tocItemTemplate,
    tocContainerTemplate,
    nestedListTemplate
} from './templates/html-templates';

export type { TocOptions, HeadingData, HierarchyResult } from './types';
