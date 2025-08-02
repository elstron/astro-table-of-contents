import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { processHtmlFilesForToc } from '../process-html-files-for-toc';

vi.mock('fs/promises', () => ({
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
}));

vi.mock('path', () => ({
    join: vi.fn((...args) => args.join('/')),
}));

vi.mock('../../_utils', () => ({
    pageContainsToc: vi.fn(),
}));

vi.mock('../../generator/toc-generator', () => ({
    generateToc: vi.fn(),
}));

describe('processHtmlFilesForToc', () => {
    let mockFs: any;
    let mockPath: any;
    let mockPageContainsToc: Mock;
    let mockGenerateToc: Mock;
    let mockLogger: any;
    let mockDir: any;
    let mockExperimentalRouteToHeaders: any;

    beforeEach(async () => {
        vi.clearAllMocks();

        mockFs = await import('fs/promises');
        mockPath = await import('path');
        const utilsModule = await import('../../_utils');
        const generatorModule = await import('../../generator/toc-generator');

        mockPageContainsToc = utilsModule.pageContainsToc as Mock;
        mockGenerateToc = generatorModule.generateToc as Mock;

        mockLogger = {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };

        mockDir = {
            pathname: '/output/dist',
        };

        mockExperimentalRouteToHeaders = new Map();
    });

    it('should process HTML files that contain TOC markers', async () => {
        const mockFiles = ['index.html', 'about.html', 'styles.css', 'script.js'];
        const mockHtmlContent = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <stron-toc></stron-toc>
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                </body>
            </html>
        `;
        const mockTocContent = '<nav><ul><li><a href="#heading-1">Heading 1</a></li></ul></nav>';

        mockFs.readdir.mockResolvedValue(mockFiles);
        mockFs.readFile.mockResolvedValue(mockHtmlContent);
        mockPageContainsToc.mockReturnValue(true);
        mockGenerateToc.mockReturnValue(mockTocContent);
        mockFs.writeFile.mockResolvedValue(undefined);

        const processor = processHtmlFilesForToc();
        await processor({
            dir: mockDir,
            logger: mockLogger,
            experimentalRouteToHeaders: mockExperimentalRouteToHeaders,
        });

        expect(mockFs.readdir).toHaveBeenCalledWith('/output/dist', { recursive: true });
        expect(mockFs.readFile).toHaveBeenCalledTimes(2); // Only HTML files
        expect(mockFs.readFile).toHaveBeenCalledWith('/output/dist/index.html', 'utf-8');
        expect(mockFs.readFile).toHaveBeenCalledWith('/output/dist/about.html', 'utf-8');

        expect(mockPageContainsToc).toHaveBeenCalledTimes(2);
        expect(mockPageContainsToc).toHaveBeenCalledWith({ content: mockHtmlContent });

        expect(mockGenerateToc).toHaveBeenCalledTimes(2);
        expect(mockGenerateToc).toHaveBeenCalledWith({ content: mockHtmlContent });

        expect(mockLogger.info).toHaveBeenCalledTimes(2);
        expect(mockLogger.info).toHaveBeenCalledWith(
            'Generating Table of Contents for /output/dist/index.html...',
        );
        expect(mockLogger.info).toHaveBeenCalledWith(
            'Generating Table of Contents for /output/dist/about.html...',
        );

        expect(mockFs.writeFile).toHaveBeenCalledTimes(2);
        const expectedUpdatedContent = mockHtmlContent.replace(
            /<\/stron-toc>/i,
            `${mockTocContent}\n</stron-toc>`,
        );
        expect(mockFs.writeFile).toHaveBeenCalledWith(
            '/output/dist/index.html',
            expectedUpdatedContent,
            'utf-8',
        );
        expect(mockFs.writeFile).toHaveBeenCalledWith(
            '/output/dist/about.html',
            expectedUpdatedContent,
            'utf-8',
        );
    });

    it('should skip HTML files that do not contain TOC markers', async () => {
        const mockFiles = ['index.html', 'about.html'];
        const mockHtmlContent = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                </body>
            </html>
        `;

        mockFs.readdir.mockResolvedValue(mockFiles);
        mockFs.readFile.mockResolvedValue(mockHtmlContent);
        mockPageContainsToc.mockReturnValue(false);

        const processor = processHtmlFilesForToc();
        await processor({
            dir: mockDir,
            logger: mockLogger,
            experimentalRouteToHeaders: mockExperimentalRouteToHeaders,
        });

        expect(mockFs.readdir).toHaveBeenCalledWith('/output/dist', { recursive: true });
        expect(mockFs.readFile).toHaveBeenCalledTimes(2);

        expect(mockPageContainsToc).toHaveBeenCalledTimes(2);
        expect(mockPageContainsToc).toHaveBeenCalledWith({ content: mockHtmlContent });

        expect(mockGenerateToc).not.toHaveBeenCalled();
        expect(mockFs.writeFile).not.toHaveBeenCalled();
        expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should handle mixed scenarios - some files with TOC, some without', async () => {
        // Arrange
        const mockFiles = ['with-toc.html', 'without-toc.html', 'styles.css'];
        const htmlWithToc = `
            <html>
                <body>
                    <stron-toc></stron-toc>
                    <h1>Page with TOC</h1>
                </body>
            </html>
        `;
        const htmlWithoutToc = `
            <html>
                <body>
                    <h1>Page without TOC</h1>
                </body>
            </html>
        `;
        const mockTocContent =
            '<nav><ul><li><a href="#page-with-toc">Page with TOC</a></li></ul></nav>';

        mockFs.readdir.mockResolvedValue(mockFiles);
        mockFs.readFile.mockResolvedValueOnce(htmlWithToc).mockResolvedValueOnce(htmlWithoutToc);
        mockPageContainsToc.mockReturnValueOnce(true).mockReturnValueOnce(false);
        mockGenerateToc.mockReturnValue(mockTocContent);
        mockFs.writeFile.mockResolvedValue(undefined);

        const processor = processHtmlFilesForToc();
        await processor({
            dir: mockDir,
            logger: mockLogger,
            experimentalRouteToHeaders: mockExperimentalRouteToHeaders,
        });

        expect(mockFs.readFile).toHaveBeenCalledTimes(2);
        expect(mockPageContainsToc).toHaveBeenCalledTimes(2);

        expect(mockGenerateToc).toHaveBeenCalledTimes(1);
        expect(mockGenerateToc).toHaveBeenCalledWith({ content: htmlWithToc });

        expect(mockFs.writeFile).toHaveBeenCalledTimes(1);
        const expectedUpdatedContent = htmlWithToc.replace(
            /<\/stron-toc>/i,
            `${mockTocContent}\n</stron-toc>`,
        );
        expect(mockFs.writeFile).toHaveBeenCalledWith(
            '/output/dist/with-toc.html',
            expectedUpdatedContent,
            'utf-8',
        );

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith(
            'Generating Table of Contents for /output/dist/with-toc.html...',
        );
    });

    it('should handle empty directory', async () => {
        mockFs.readdir.mockResolvedValue([]);

        const processor = processHtmlFilesForToc();
        await processor({
            dir: mockDir,
            logger: mockLogger,
            experimentalRouteToHeaders: mockExperimentalRouteToHeaders,
        });

        expect(mockFs.readdir).toHaveBeenCalledWith('/output/dist', { recursive: true });
        expect(mockFs.readFile).not.toHaveBeenCalled();
        expect(mockPageContainsToc).not.toHaveBeenCalled();
        expect(mockGenerateToc).not.toHaveBeenCalled();
        expect(mockFs.writeFile).not.toHaveBeenCalled();
        expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should handle directory with no HTML files', async () => {
        const mockFiles = ['styles.css', 'script.js', 'image.png'];
        mockFs.readdir.mockResolvedValue(mockFiles);

        const processor = processHtmlFilesForToc();
        await processor({
            dir: mockDir,
            logger: mockLogger,
            experimentalRouteToHeaders: mockExperimentalRouteToHeaders,
        });

        expect(mockFs.readdir).toHaveBeenCalledWith('/output/dist', { recursive: true });
        expect(mockFs.readFile).not.toHaveBeenCalled();
        expect(mockPageContainsToc).not.toHaveBeenCalled();
        expect(mockGenerateToc).not.toHaveBeenCalled();
        expect(mockFs.writeFile).not.toHaveBeenCalled();
        expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should handle case-insensitive TOC replacement', async () => {
        const mockFiles = ['index.html'];
        const mockHtmlContent = `
            <html>
                <body>
                    <STRON-TOC></STRON-TOC>
                    <h1>Heading 1</h1>
                </body>
            </html>
        `;
        const mockTocContent = '<nav><ul><li><a href="#heading-1">Heading 1</a></li></ul></nav>';

        mockFs.readdir.mockResolvedValue(mockFiles);
        mockFs.readFile.mockResolvedValue(mockHtmlContent);
        mockPageContainsToc.mockReturnValue(true);
        mockGenerateToc.mockReturnValue(mockTocContent);
        mockFs.writeFile.mockResolvedValue(undefined);

        const processor = processHtmlFilesForToc();
        await processor({
            dir: mockDir,
            logger: mockLogger,
            experimentalRouteToHeaders: mockExperimentalRouteToHeaders,
        });

        const expectedUpdatedContent = mockHtmlContent.replace(
            /<\/stron-toc>/i,
            `${mockTocContent}\n</stron-toc>`,
        );
        expect(mockFs.writeFile).toHaveBeenCalledWith(
            '/output/dist/index.html',
            expectedUpdatedContent,
            'utf-8',
        );
    });
});
