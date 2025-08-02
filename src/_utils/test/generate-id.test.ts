// Tests for utility functions
import { describe, it, expect } from 'vitest';
import { generateId } from '../generate-id';

describe('Utils', () => {
    describe('generateId', () => {
        it('should generate a clean ID from a title with leading and trailing spaces', () => {
            const title = '  Test Title  ';
            const expectedId = 'test-title';
            expect(generateId(title)).toBe(expectedId);
        });

        it('should generate a clean ID from a title with mixed case', () => {
            const title = 'Test Title';
            const expectedId = 'test-title';
            expect(generateId(title)).toBe(expectedId);
        });

        it('should generate a clean ID from a title with special characters', () => {
            const title = 'Test Title!@#';
            const expectedId = 'test-title';
            expect(generateId(title)).toBe(expectedId);
        });

        it('should generate a clean ID from a title with spaces', () => {
            const title = 'Test Title';
            const expectedId = 'test-title';
            expect(generateId(title)).toBe(expectedId);
        });

        it('should return an empty string for an empty title', () => {
            expect(generateId('')).toBe('');
        });

        it('should generate a clean ID from heading text', () => {
            const title = 'Hello World';
            const expectedId = 'hello-world';
            expect(generateId(title)).toBe(expectedId);
        });
    });
});
