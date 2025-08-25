import type { BaseIntegrationHooks, AstroIntegrationLogger } from 'astro';
import fs from 'fs/promises';
import { getTocConfig, INTEGRATION_NAME, OUTPUT_DIRS } from '../config';
import { logMessages } from '../log-messages';

export function registerTocIntegration() {
  return async ({
    config,
    addMiddleware,
    command,
    logger,
  }: Parameters<BaseIntegrationHooks['astro:config:setup']>[0]) => {
    if (command === 'preview') return;
      
    OUTPUT_DIRS.server = config.build.server.pathname;
    OUTPUT_DIRS.public = config.build.client.pathname;

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
  try {
    await fs.mkdir(process.cwd()+'/.astro', { recursive: true });
    await fs.writeFile(process.cwd()+'/.astro/tocconfig.json', JSON.stringify(getTocConfig()));
  } catch (e) {
    logger.warn(logMessages.FAILED_WRITE_CONFIG);
  }
}
