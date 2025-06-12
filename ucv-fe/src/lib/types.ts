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

// Internationalization types
export type Language = 'en' | 'vi';

export interface Translation {
  key: string;
  en: string;
  vi: string;
}

export interface ContentTranslation {
  id: string;
  language: Language;
  content: string;
  metadata?: any;
}

export interface PageContentTranslated extends Omit<PageContent, 'sections'> {
  language: Language;
  sections: {
    [sectionId: string]: {
      title: string;
      items: ContentItem[];
    };
  };
} 