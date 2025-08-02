import { describe, it, expect } from 'vitest';
import { extractHeadingTitle } from '../extract-heading-title';

describe('Utils', () => {
    describe('extractHeadingTitle', () => {
        it('should extract the title from a heading element', () => {
            const heading = '<h1>Test Title</h1>';
            const expectedTitle = 'Test Title';
            expect(extractHeadingTitle(heading)).toBe(expectedTitle);
        });

        it('should extract the title from tags with additional attributes.', () => {
            const heading = `<h3 id="example" class="example">heading with additional attributes</h3>`;
            const expectedTitle = 'heading with additional attributes';

            expect(extractHeadingTitle(heading)).toBe(expectedTitle);
        });

        it('should handle headings with multiple spaces', () => {
            const heading = '<h2>  Multiple   Spaces  </h2>';
            const expectedTitle = 'Multiple Spaces';
            expect(extractHeadingTitle(heading)).toBe(expectedTitle);
        });
        it('should handle headings with special characters', () => {
            const heading = '<h3>Special &amp; Characters</h3>';
            const expectedTitle = 'Special & Characters';
            expect(extractHeadingTitle(heading)).toBe(expectedTitle);
        });
        it('should return an empty string for a non-heading string', () => {
            const nonHeading = 'Just a string without HTML tags';
            expect(extractHeadingTitle(nonHeading)).toBe('');
        });

        it('should return an empty string for an empty heading element', () => {
            const emptyHeading = '<h1></h1>';
            expect(extractHeadingTitle(emptyHeading)).toBe('');
        });
        it('should handle headings with nested elements', () => {
            const headingWithNested = '<h1><span>Nested Title</span></h1>';
            const expectedTitle = 'Nested Title';
            expect(extractHeadingTitle(headingWithNested)).toBe(expectedTitle);
        });

        it('should return an empty string for a non-heading element', () => {
            const nonHeading = '<p>Test Paragraph</p>';
            expect(extractHeadingTitle(nonHeading)).toBe('');
        });
    });
});
