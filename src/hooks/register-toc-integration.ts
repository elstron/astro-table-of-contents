import type { BaseIntegrationHooks } from 'astro';
import { TocConfig } from '../types';

export function registerTocIntegration(tocConfig: TocConfig) {
    return async ({
        config,
        updateConfig,
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

        updateConfig({
            vite: {
                plugins: [
                    {
                        name: 'virtual-astro-toc',
                        resolveId(id) {
                            if (id === 'virtual:astro-toc') return 'virtual:astro-toc';
                        },
                        load(id) {
                            if (id === 'virtual:astro-toc') {
                                return `export default ${JSON.stringify(tocConfig)};`;
                            }
                        },
                    },
                ],
            },
        });

        addMiddleware({
            order: 'pre',
            entrypoint: new URL('../middleware/toc-middleware.js', import.meta.url),
        });
    };
}
