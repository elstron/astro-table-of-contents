// TypeScript type definitions for the TOC system

export interface TocOptions {
    content: string;
}

export interface HeadingData {
    level: number;
    title: string;
    id: string;
    parentIndex?: number | null;
    indexId?: number;
}

export interface HierarchyResult {
    html: string;
    nextIndex: number;
}

export interface TocConfig {
    title?: string;
    showIndex?: boolean;
    position?: 'left' | 'right';
    collapsible?: boolean;
    maxDepth?: number;
    minDepth?: number;
}
