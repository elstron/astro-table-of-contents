import type { BaseIntegrationHooks } from 'astro';
import fs from 'fs/promises';
import { getTocConfig, CONFIG_FILE_PATH, INTEGRATION_NAME } from '../config';
import { logMessages } from '../log-messages';

export function registerTocIntegration() {
    return async ({
        config,
        addMiddleware,
        command,
        logger,
    }: Parameters<BaseIntegrationHooks['astro:config:setup']>[0]) => {
        if (command === 'preview') return;

        logger.info(logMessages.REGISTERING_INTEGRATION);

        if (!config.integrations.some((integration) => integration.name === INTEGRATION_NAME)) {
            config.integrations.push({
                name: INTEGRATION_NAME,
                hooks: {},
            });
        }
        logger.info(logMessages.ADDING_TOC);

        try {
            await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(getTocConfig()));
        } catch (e) {
            logger.warn(logMessages.FAILED_WRITE_CONFIG);
        }
        addMiddleware({
            order: 'pre',
            entrypoint: new URL('../middleware/toc-middleware.js', import.meta.url),
        });
    };
}
