// Astro integration implementation

import type { AstroIntegration } from 'astro';
import type { TocConfig } from '../types';
import { registerTocIntegration } from '../hooks/register-toc-integration';
import { updateTocConfig, INTEGRATION_NAME  } from '../config';
/**
 * Astro integration for automatic table of contents generation
 */
export const tableOfContents = (config: TocConfig): AstroIntegration => {
    // Update global config with provided config
    updateTocConfig(config);
    return {
        name: INTEGRATION_NAME,
        hooks: {
            'astro:config:setup': registerTocIntegration(),
        },
    };
};
