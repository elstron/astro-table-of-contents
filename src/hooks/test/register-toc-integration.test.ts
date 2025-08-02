import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerTocIntegration } from '../register-toc-integration';

describe('registerTocIntegration', () => {
    let mockConfig: any;
    let mockSetupParams: any;

    beforeEach(() => {
        mockConfig = {
            integrations: [],
        };

        // Create a complete mock for the setup parameters
        mockSetupParams = {
            config: mockConfig,
            command: 'build' as const,
            isRestart: false,
            updateConfig: vi.fn(),
            addRenderer: vi.fn(),
            addWatchFile: vi.fn(),
            addClientDirective: vi.fn(),
            addMiddleware: vi.fn(),
            addDevToolbarApp: vi.fn(),
            injectScript: vi.fn(),
            injectRoute: vi.fn(),
            logger: {
                info: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
                debug: vi.fn(),
            },
        };
    });

    it('should add table-of-contents integration when it does not exist', () => {
        const existingIntegrations = [
            { name: 'some-other-integration', hooks: {} },
            { name: 'another-integration', hooks: {} },
        ];
        mockConfig.integrations = [...existingIntegrations];

        const integrationSetup = registerTocIntegration();
        integrationSetup(mockSetupParams);

        expect(mockConfig.integrations).toHaveLength(3);
        expect(mockConfig.integrations[2]).toEqual({
            name: 'table-of-contents-by-stron',
            hooks: {},
        });
    });

    it('should not add table-of-contents integration when it already exists', () => {
        const existingIntegrations = [
            { name: 'some-other-integration', hooks: {} },
            { name: 'table-of-contents-by-stron', hooks: {} },
            { name: 'another-integration', hooks: {} },
        ];
        mockConfig.integrations = [...existingIntegrations];
        const originalLength = mockConfig.integrations.length;

        const integrationSetup = registerTocIntegration();
        integrationSetup(mockSetupParams);

        expect(mockConfig.integrations).toHaveLength(originalLength);
        expect(
            mockConfig.integrations.filter(
                (integration) => integration.name === 'table-of-contents-by-stron',
            ),
        ).toHaveLength(1);
    });

    it('should add integration to empty integrations array', () => {
        mockConfig.integrations = [];

        const integrationSetup = registerTocIntegration();
        integrationSetup(mockSetupParams);

        expect(mockConfig.integrations).toHaveLength(1);
        expect(mockConfig.integrations[0]).toEqual({
            name: 'table-of-contents-by-stron',
            hooks: {},
        });
    });

    it('should handle case where integration with same name but different properties exists', () => {
        const existingIntegrations = [
            {
                name: 'table-of-contents-by-stron',
                hooks: { 'astro:build:generated': () => {} },
                someOtherProperty: 'value',
            },
        ];
        mockConfig.integrations = [...existingIntegrations];

        const integrationSetup = registerTocIntegration();
        integrationSetup(mockSetupParams);

        expect(mockConfig.integrations).toHaveLength(1);
        expect(mockConfig.integrations[0]).toEqual(existingIntegrations[0]);
    });

    it('should handle integration names with partial matches', () => {
        const existingIntegrations = [
            { name: 'table-of-contents', hooks: {} },
            { name: 'by-stron', hooks: {} },
            { name: 'table-of-contents-by-stron-extended', hooks: {} },
        ];
        mockConfig.integrations = [...existingIntegrations];

        const integrationSetup = registerTocIntegration();
        integrationSetup(mockSetupParams);

        expect(mockConfig.integrations).toHaveLength(4);
        expect(mockConfig.integrations[3]).toEqual({
            name: 'table-of-contents-by-stron',
            hooks: {},
        });
    });

    it('should work with integrations that have undefined or null name', () => {
        const existingIntegrations = [
            { name: undefined, hooks: {} },
            { name: null, hooks: {} },
            { hooks: {} },
        ];
        mockConfig.integrations = [...existingIntegrations];

        const integrationSetup = registerTocIntegration();
        integrationSetup(mockSetupParams);

        expect(mockConfig.integrations).toHaveLength(4);
        expect(mockConfig.integrations[3]).toEqual({
            name: 'table-of-contents-by-stron',
            hooks: {},
        });
    });
});
