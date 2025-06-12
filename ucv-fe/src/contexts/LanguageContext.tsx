import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/types';
import { getStoredLanguage, setStoredLanguage, t as staticT } from '@/lib/i18n';
import { translationApi } from '@/lib/translationApi';
import { useContentStore } from '@/lib/contentStore';
import { toast } from 'sonner';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
  staticTranslations: Record<string, { en: string; vi: string }>;
  refreshTranslations: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());
  const [isLoading, setIsLoading] = useState(false);
  const [staticTranslations, setStaticTranslations] = useState<Record<string, { en: string; vi: string }>>({});

  // Fetch static translations from API
  const fetchStaticTranslations = async () => {
    try {
      const translations = await translationApi.getStaticTranslations();
      setStaticTranslations(translations);
      console.log('📝 Static translations loaded from API:', Object.keys(translations).length, 'items');
    } catch (error) {
      console.error('Failed to fetch static translations:', error);
      // Fail silently for background fetching
    }
  };

  // Fetch content translations from API
  const fetchContentTranslations = async () => {
    try {
      const contentStore = useContentStore.getState();
      await contentStore.fetchTranslations();
      console.log('🌍 Content translations refreshed from API');
    } catch (error) {
      console.error('Failed to fetch content translations:', error);
    }
  };

  // Load translations on mount
  useEffect(() => {
    const loadInitialTranslations = async () => {
      setIsLoading(true);
      try {
        // Load both static and content translations in parallel
        await Promise.all([
          fetchStaticTranslations(),
          fetchContentTranslations()
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTranslations();
  }, []);

  const setLanguage = async (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setIsLoading(true);
    
    try {
      // Update state first for immediate UI feedback
      setLanguageState(newLanguage);
      setStoredLanguage(newLanguage);
      
      // Sync with content store
      const contentStore = useContentStore.getState();
      contentStore.setLanguage(newLanguage);
      
      // Refresh translations to ensure we have the latest data
      await Promise.all([
        fetchStaticTranslations(),
        fetchContentTranslations()
      ]);
      
      toast.success(`Language switched to ${newLanguage === 'en' ? 'English' : 'Vietnamese'}`);
    } catch (error) {
      console.error('Failed to refresh translations after language change:', error);
      // Still allow the language change to go through
      toast.success(`Language switched to ${newLanguage === 'en' ? 'English' : 'Vietnamese'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced translation function that uses both static and API translations
  const translate = (key: string): string => {
    // First try to get from API-loaded static translations
    const apiTranslation = staticTranslations[key];
    if (apiTranslation && apiTranslation[language]) {
      return apiTranslation[language];
    }
    
    // Fallback to local static translations
    return staticT(key, language);
  };

  // Function to manually refresh all translations
  const refreshTranslations = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStaticTranslations(),
        fetchContentTranslations()
      ]);
      toast.success('Translations refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh translations:', error);
      toast.error('Failed to refresh translations');
    } finally {
      setIsLoading(false);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translate,
    isLoading,
    staticTranslations,
    refreshTranslations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 