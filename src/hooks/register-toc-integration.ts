import type { BaseIntegrationHooks, AstroIntegrationLogger } from 'astro';
import fs from 'fs/promises';
import { getTocConfig, SAVE_CONFIG_PATH, INTEGRATION_NAME } from '../config';
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

    if (command === 'build') {
      await saveConfigToFile(logger);
    }

    addMiddleware({
      order: 'pre',
      entrypoint: new URL('../middleware/toc-middleware.js', import.meta.url),
    });
  };
}

async function saveConfigToFile(logger: AstroIntegrationLogger) {
  logger.info("guardando en.." + SAVE_CONFIG_PATH);
  try {
    await fs.mkdir(SAVE_CONFIG_PATH, { recursive: true });
    await fs.writeFile('/.astro/' + "tocconfig.json", JSON.stringify(getTocConfig()));
  } catch (e) {
    logger.warn(logMessages.FAILED_WRITE_CONFIG);
  }
}
