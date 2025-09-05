// Astro middleware for TOC processing
import type { MiddlewareHandler } from 'astro';
import { isValidPage, pageContainsToc } from '../_utils';
import { generateToc } from '../generator/toc-generator';
import { getTocConfig } from '../config';

export const onRequest: MiddlewareHandler = async ({ originPathname }, next) => {
    const response = await next();
    const html = await response.text();

    if (!isValidPage(originPathname, response.headers) || !pageContainsToc({ content: html }))
        await next();

    const toc = generateToc({ content: html });

    let updatedHtml = html.replace(/(<h2[^>]*id="toc-title"[^>]*>.*?<\/h2>)/i, (match) => {
        return `${match}\n${toc}`;
    });

    updatedHtml = updatedHtml.replace(
        /<h2[^>]*id="toc-title"[^>]*>([\s\S]*?)<\/h2>/i,
        (match, content) => {
            const clean = content.replace(/<[^>]*>/g, '').trim();
            return clean.length === 0
                ? match.replace(/>[\s\S]*?<\/h2>/, `>${getTocConfig().title}</h2>`)
                : match;
        },
    );

    return new Response(updatedHtml, {
        status: 200,
        headers: response.headers,
    });
};
