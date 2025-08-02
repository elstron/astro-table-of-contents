import type { BaseIntegrationHooks } from 'astro';
export function registerTocIntegration() {
    return ({
        config,
        addMiddleware,
        command,
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
        if (command !== 'build') {
            addMiddleware({
                order: 'pre',
                entrypoint: new URL('../middleware/toc-middleware', import.meta.url),
            });
        }
    };
}
