import { describe, it, expect } from 'vitest';
import { generateToc, buildHierarchy } from './toc-generator';
import { tocContainerTemplate } from '../templates/html-templates';

describe('generateToc', () => {
    it('should generate hierarchical HTML TOC from parsed headings', () => {
        const headings = [
            { level: 1, title: 'Introduction', id: 'introduction' },
            { level: 2, title: 'Getting Started', id: 'getting-started' },
            { level: 2, title: 'Installation', id: 'installation' },
            { level: 3, title: 'Using npm', id: 'using-npm' },
            { level: 3, title: 'Using yarn', id: 'using-yarn' },
        ];

        const expectedHtml =
            `<ul>` +
            `<li><a href="#introduction">Introduction</a>` +
            `<ul>` +
            `<li><a href="#getting-started">Getting Started</a></li>` +
            `<li><a href="#installation">Installation</a>` +
            `<ul>` +
            `<li><a href="#using-npm">Using npm</a></li>` +
            `<li><a href="#using-yarn">Using yarn</a></li>` +
            `</ul></li>` +
            `</ul></li>` +
            `</ul>`;

        expect(buildHierarchy(headings)).toEqual({
            html: expectedHtml,
            nextIndex: headings.length,
        });
    });

    it('should handle empty headings array', () => {
        const headings: any[] = [];
        const expectedHtml = `<ul></ul>`;

        expect(buildHierarchy(headings)).toEqual({
            html: expectedHtml,
            nextIndex: 0,
        });
    });

    it('should generate TOC from HTML page', () => {
        const page = {
            content: `
                <h1>Introduction</h1>
                <h2 class="example class">Getting Started</h2>
                <h2 id="example-id">Installation</h2>
                <H3>Using npm</H3>
                <H3>Using yarn</H3>
                <h1>Another Introduction</h1>
            `,
        };

        let expectedHtml =
            `<ul>` +
            `<li><a href="#introduction">Introduction</a>` +
            `<ul>` +
            `<li><a href="#getting-started">Getting Started</a></li>` +
            `<li><a href="#installation">Installation</a>` +
            `<ul>` +
            `<li><a href="#using-npm">Using npm</a></li>` +
            `<li><a href="#using-yarn">Using yarn</a></li>` +
            `</ul></li>` +
            `</ul></li>` +
            `<li><a href="#another-introduction">Another Introduction</a></li>` +
            `</ul>`;

        expectedHtml = tocContainerTemplate(expectedHtml);

        expect(generateToc(page)).toBe(expectedHtml);
    });

    it('should return empty TOC for content without headings', () => {
        const page = {
            content: '<p>No headings here!</p>',
        };

        expect(generateToc(page)).toBe('');
    });

    it('should handle headings with special characters in titles', () => {
        const page = {
            content: `
                <h1>Introduction & Overview</h1>
                <h2>Getting Started: A Guide</h2>
                <h3>Using npm & yarn</h3>
            `,
        };

        let expectedHtml =
            `<ul>` +
            `<li><a href="#introduction-overview">Introduction & Overview</a>` +
            `<ul>` +
            `<li><a href="#getting-started-a-guide">Getting Started: A Guide</a>` +
            `<ul>` +
            `<li><a href="#using-npm-yarn">Using npm & yarn</a></li>` +
            `</ul></li>` +
            `</ul></li>` +
            `</ul>`;

        expectedHtml = tocContainerTemplate(expectedHtml);

        expect(generateToc(page)).toBe(expectedHtml);
    });
});
