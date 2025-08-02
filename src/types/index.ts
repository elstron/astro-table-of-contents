// TypeScript type definitions for the TOC system

export interface TocOptions {
    content: string;
}

export interface HeadingData {
    level: number;
    title: string;
    id: string;
}

export interface HierarchyResult {
    html: string;
    nextIndex: number;
}

export interface TocConfig {
    title?: string;
    position?: 'left' | 'right';
    collapsible?: boolean;
    maxDepth?: number;
    minDepth?: number;
}
