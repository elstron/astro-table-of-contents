// Astro integration implementation

import type { AstroIntegration } from 'astro';
import type { TocConfig } from '../types';
import { registerTocIntegration } from '../hooks/register-toc-integration';
import { updateTocConfig, INTEGRATION_NAME } from '../config';
import fs from 'fs/promises';
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
            'astro:build:done': async ({logger}) => {
              await fs.copyFile(process.cwd()+'/.astro/tocconfig.json', process.cwd()+'/dist/tocconfig.json');
          } 
        },
    };
};
