export interface ContentItem {
    id: string;
    type: 'heading' | 'paragraph' | 'button' | 'image' | 'statistic';
    content: string;
    metadata?: {
        [key: string]: any;
    };
}

export interface PageContent {
    pageName: string;
    sections: {
        [sectionId: string]: {
            title: string;
            items: ContentItem[];
        };
    };
}

export interface ContentUpdate {
    pageName: string;
    sectionId: string;
    itemId: string;
    content: string;
    metadata?: {
        [key: string]: any;
    };
} 