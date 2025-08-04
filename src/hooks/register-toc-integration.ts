import type { BaseIntegrationHooks } from 'astro';
import { fileURLToPath } from 'url';
const path = await import('path');
export function registerTocIntegration() {
    return async ({
        config,
        addMiddleware,
        command,
        logger,
    }: Parameters<BaseIntegrationHooks['astro:config:setup']>[0]) => {
        if (command === 'preview') return;
        if (
            !config.integrations.some(
                (integration) => integration.name === 'table-of-contents-by-stron',
            )
        ) {
            config.integrations.push({
                name: 'table-of-contents-by-stron',
                hooks: {},
            });
        }
        logger.info('Registering Table of Contents integration');
        logger.info('Adding TOC...');

        
        addMiddleware({
            order: 'pre',
            entrypoint: new URL('../middleware/toc-middleware.js', import.meta.url)
        });
    };
}
