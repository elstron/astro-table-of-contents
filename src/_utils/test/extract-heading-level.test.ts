import { describe, it, expect } from 'vitest';
import { extractHeadingLevel } from '../extract-heading-level';

describe('Utils', () => {
    describe('extractHeadingLevel', () => {
        it('should extract the heading level from a valid heading tag', () => {
            const heading = '<h2>Sample Heading</h2>';
            expect(extractHeadingLevel(heading)).toBe(2);
        });

        it('should extract the heading level even if it is in capital letters', () => {
            const heading = '<H4>Another Heading</H4>';
            expect(extractHeadingLevel(heading)).toBe(4);
        });

        it('should return 1 for an h1 tag', () => {
            const heading = '<h1>Main Title</h1>';
            expect(extractHeadingLevel(heading)).toBe(1);
        });

        it('should return 6 for an h6 tag', () => {
            const heading = '<h6>Lowest Level Heading</h6>';
            expect(extractHeadingLevel(heading)).toBe(6);
        });

        it('should return 1 for an invalid tag', () => {
            const invalidHeading = '<p>Not a heading</p>';
            expect(extractHeadingLevel(invalidHeading)).toBe(1);
        });

        it('should handle empty strings gracefully', () => {
            expect(extractHeadingLevel('')).toBe(1);
        });

        it('should handle headings with attributes', () => {
            const headingWithAttributes =
                '<h3 id="test" class="example">Heading with Attributes</h3>';
            expect(extractHeadingLevel(headingWithAttributes)).toBe(3);
        });
    });
});
