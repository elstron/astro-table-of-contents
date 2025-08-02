import type { BaseIntegrationHooks } from 'astro';
import { pageContainsToc } from '../_utils';
import { generateToc } from '../generator/toc-generator';
import { getTocConfig } from '../config';

export const fs = await import('fs/promises');
export const path = await import('path');

export function processHtmlFilesForToc() {
    return async ({
        dir,
        logger,
    }: Parameters<BaseIntegrationHooks['astro:build:generated']>[0]) => {
        const outputDir = dir.pathname;
        const files = await fs.readdir(outputDir, { recursive: true });
        const htmlFiles = files.filter((file) => file.endsWith('.html'));

        logger.info(`Generating Table of Contents`);
        for (const file of htmlFiles) {
            const filePath = path.join(outputDir, file);
            const htmlContent = await fs.readFile(filePath, 'utf-8');

            if (!pageContainsToc({ content: htmlContent })) continue;

            const toc = generateToc({ content: htmlContent });

            let updatedHtml = htmlContent.replace(
                /(<h2[^>]*id="toc-title"[^>]*>.*?<\/h2>)/i,
                (match) => {
                    return `${match}\n${toc}`;
                },
            );

            updatedHtml = updatedHtml.replace(
                /<h2[^>]*id="toc-title"[^>]*>([\s\S]*?)<\/h2>/i,
                (match, content) => {
                    const clean = content.replace(/<[^>]*>/g, '').trim();
                    return clean.length === 0
                        ? match.replace(/>[\s\S]*?<\/h2>/, `>${getTocConfig().title}</h2>`)
                        : match;
                },
            );
            await fs.writeFile(filePath, updatedHtml, 'utf-8');
        }
    };
}
