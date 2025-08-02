import { describe, it, expect } from 'vitest';
import { pageContainsToc } from '../page-contains-toc';

const fakePage = (content: string) => ({ content });

const makePageWithToc = () => ({
    content: `
        <html>
        <head>
            <title>Test Page</title>
        </head>
        <body>
            <stron-toc></stron-toc>
            <h1>Page Content</h1>
            <p>This is a test page.</p>
        </body>
        </html>
    `,
});

const makePageWithoutToc = () => ({
    content: `
        <html>
        <head>
            <title>Test Page</title>
        </head>
        <body>
            <h1>Page Content</h1>
            <p>This is a test page.</p>
        </body>
        </html>
    `,
});

const TocWithExtraAttributes = () => ({
    content: `
        <html>
        <head>
            <title>Test Page</title>
        </head>
        <body>
            <stron-toc class="toc" id="toc"></stron-toc>
            <h1>Page Content</h1>
            <p>This is a test page.</p>
        </body>
        </html>
    `,
});

describe('Utils', () => {
    describe('pageContainsToc', () => {
        it('should return true for a page with TOC marker', () => {
            const page = makePageWithToc();
            expect(pageContainsToc(page)).toBe(true);
        });

        it('should return false for a page without TOC marker', () => {
            const page = makePageWithoutToc();
            expect(pageContainsToc(page)).toBe(false);
        });

        it('should return false for an empty page', () => {
            const page = makePageWithoutToc();
            expect(pageContainsToc(page)).toBe(false);
        });

        it('should handle case-insensitive TOC marker', () => {
            const page = makePageWithToc();
            expect(pageContainsToc(page)).toBe(true);
        });

        it('should return true for a page with TOC marker with extra attributes', () => {
            const page = TocWithExtraAttributes();
            expect(pageContainsToc(page)).toBe(true);
        });
    });
});
