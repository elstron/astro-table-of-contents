import type { TocConfig } from './types/index';

// Extend global type for our config
declare global {
    var __TOC_CONFIG__: TocConfig | undefined;
}

export let tocConfig: TocConfig = {
    title: 'Table of Contents',
    position: 'right',
    collapsible: true,
};

/**
 * Updates the global TOC configuration
 * @param newConfig - Partial configuration to merge with existing config
 */
export const updateTocConfig = (newConfig: Partial<TocConfig>): void => {
    tocConfig = { ...tocConfig, ...newConfig };
    // Store in global for middleware access
    if (typeof globalThis !== 'undefined') {
        globalThis.__TOC_CONFIG__ = tocConfig;
    }
};

/**
 * Gets the current TOC configuration
 * @returns Current TOC configuration
 */
export const getTocConfig = (): TocConfig => {
    // Try to get from global first (for middleware)
    if (typeof globalThis !== 'undefined' && globalThis.__TOC_CONFIG__) {
        return { ...globalThis.__TOC_CONFIG__ };
    }
    return { ...tocConfig };
};
