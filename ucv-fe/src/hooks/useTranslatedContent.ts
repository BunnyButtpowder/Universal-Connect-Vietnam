import { useContentStore } from '@/lib/contentStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageContent } from '@/lib/types';

export function useTranslatedContent() {
  const { language } = useLanguage();
  const getPageContentTranslated = useContentStore(state => state.getPageContentTranslated);
  const getTranslatedContent = useContentStore(state => state.getTranslatedContent);

  const getPageContent = (pageName: string): PageContent | undefined => {
    return getPageContentTranslated(pageName, language);
  };

  const getContentItem = (itemId: string): string => {
    return getTranslatedContent(itemId, language);
  };

  return {
    getPageContent,
    getContentItem,
    language
  };
} 