import { describe, it, expect } from 'vitest';
import { generateToc, buildHtmlHierarchy } from './toc-generator';
import { tocContainerTemplate } from '../templates/html-templates';
import { createHierarchy } from '../parser/heading-parser';

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
            `<li><a data-index="1" href="#introduction">Introduction</a>` +
            `<ul>` +
            `<li><a data-index="1.1" href="#getting-started">Getting Started</a></li>` +
            `<li><a data-index="1.2" href="#installation">Installation</a>` +
            `<ul>` +
            `<li><a data-index="1.2.1" href="#using-npm">Using npm</a></li>` +
            `<li><a data-index="1.2.2" href="#using-yarn">Using yarn</a></li>` +
            `</ul></li>` +
            `</ul></li>` +
            `</ul>`;

        const herarchyResult = buildHtmlHierarchy(createHierarchy(headings));

        expect(herarchyResult).toEqual({
            html: expectedHtml,
        });
    });

    it('should handle empty headings array', () => {
        const headings: any[] = [];
        const expectedHtml = `<ul></ul>`;

        expect(buildHtmlHierarchy(headings)).toEqual({
            html: expectedHtml,
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
            `<li><a data-index="1" href="#introduction">Introduction</a>` +
            `<ul>` +
            `<li><a data-index="1.1" href="#getting-started">Getting Started</a></li>` +
            `<li><a data-index="1.2" href="#installation">Installation</a>` +
            `<ul>` +
            `<li><a data-index="1.2.1" href="#using-npm">Using npm</a></li>` +
            `<li><a data-index="1.2.2" href="#using-yarn">Using yarn</a></li>` +
            `</ul></li>` +
            `</ul></li>` +
            `<li><a data-index="2" href="#another-introduction">Another Introduction</a></li>` +
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
            `<li><a data-index="1" href="#introduction-overview">Introduction & Overview</a>` +
            `<ul>` +
            `<li><a data-index="1.1" href="#getting-started-a-guide">Getting Started: A Guide</a>` +
            `<ul>` +
            `<li><a data-index="1.1.1" href="#using-npm-yarn">Using npm & yarn</a></li>` +
            `</ul></li>` +
            `</ul></li>` +
            `</ul>`;

        expectedHtml = tocContainerTemplate(expectedHtml);

        expect(generateToc(page)).toBe(expectedHtml);
    });
});
