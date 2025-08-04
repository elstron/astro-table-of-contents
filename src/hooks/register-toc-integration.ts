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
        
        logger.info('Registering Table of Contents integration hooks');
        logger.info(`Running Command: ${command}`);

        if (command !== 'build') {
            logger.info('Adding TOC middleware for non-build commands');
            
            const currentFile = fileURLToPath(import.meta.url);
            const middlewarePath = path.resolve(
                path.dirname(currentFile),
                '../middleware/toc-middleware.ts'
            );

            addMiddleware({
                order: 'pre',
                entrypoint: middlewarePath,
            });
        }
    };
}
