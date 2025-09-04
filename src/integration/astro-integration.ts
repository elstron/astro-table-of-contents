// Astro integration implementation

import type { AstroIntegration } from 'astro';
import type { TocConfig } from '../types';
import { registerTocIntegration } from '../hooks/register-toc-integration';
import { updateTocConfig } from '../config';

/**
 * Astro integration for automatic table of contents generation
 */
export const tableOfContents = (config: TocConfig): AstroIntegration => {
    // Update global config with provided config
    updateTocConfig(config);
    return {
        name: 'table-of-contents-by-stron',
        hooks: {
            'astro:config:setup': registerTocIntegration(),
        },
    };
};
