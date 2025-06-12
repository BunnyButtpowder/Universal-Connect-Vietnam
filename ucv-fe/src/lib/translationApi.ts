import { Language, ContentTranslation } from './types';

const API_BASE_URL = 'https://api.ucv.com.vn';

export const translationApi = {
  // Fetch all translations for a specific page
  async getPageTranslations(pageName: string): Promise<ContentTranslation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/page/${pageName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Transform the grouped data back to flat array
      const translations: ContentTranslation[] = [];
      Object.values(data).forEach((itemTranslations: any) => {
        if (Array.isArray(itemTranslations)) {
          translations.push(...itemTranslations);
        }
      });
      
      return translations;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return [];
    }
  },

  // Fetch all translations
  async getAllTranslations(): Promise<Record<string, ContentTranslation[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations`);
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all translations:', error);
      return {};
    }
  },

  // Get specific translation
  async getTranslation(itemId: string, language: Language): Promise<ContentTranslation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/${itemId}/${language}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch translation: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching translation:', error);
      return null;
    }
  },

  // Update or create a translation
  async updateTranslation(translation: ContentTranslation): Promise<ContentTranslation> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translation),
      });

      if (!response.ok) {
        throw new Error(`Failed to update translation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  },

  // Bulk update translations
  async bulkUpdateTranslations(translations: ContentTranslation[]): Promise<ContentTranslation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ translations }),
      });

      if (!response.ok) {
        throw new Error(`Failed to bulk update translations: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error bulk updating translations:', error);
      throw error;
    }
  },

  // Delete a translation
  async deleteTranslation(itemId: string, language: Language): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/${itemId}/${language}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete translation: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting translation:', error);
      throw error;
    }
  },

  // Auto-translate content using the backend service
  async autoTranslate(text: string, fromLanguage: Language, toLanguage: Language): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/auto-translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          from: fromLanguage,
          to: toLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to auto-translate: ${response.statusText}`);
      }

      const result = await response.json();
      return result.translatedText;
    } catch (error) {
      console.error('Error auto-translating:', error);
      throw error;
    }
  },

  // Get static UI translations
  async getStaticTranslations(category?: string): Promise<Record<string, { en: string; vi: string }>> {
    try {
      const url = new URL(`${API_BASE_URL}/translations/static`);
      if (category) {
        url.searchParams.append('category', category);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch static translations: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching static translations:', error);
      return {};
    }
  },

  // Update static UI translation
  async updateStaticTranslation(key: string, en: string, vi: string, category?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/static`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, en, vi, category }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update static translation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating static translation:', error);
      throw error;
    }
  },

  // Get all content items
  async getAllContentItems(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/content-items`);
      if (!response.ok) {
        throw new Error(`Failed to fetch content items: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching content items:', error);
      return [];
    }
  },

  // Get content items for a specific page
  async getPageContentItems(pageName: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/content-items/page/${pageName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch page content items: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching page content items:', error);
      return [];
    }
  },

  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize default data: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
      throw error;
    }
  },

  // Get translation service status
  async getServiceStatus(): Promise<{
    googleTranslateAvailable: boolean;
    supportedLanguages: string[];
    fallbackTranslationsCount: number;
    provider: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/status`);
      if (!response.ok) {
        throw new Error(`Failed to get service status: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting service status:', error);
      return {
        googleTranslateAvailable: false,
        supportedLanguages: ['en', 'vi'],
        fallbackTranslationsCount: 0,
        provider: 'unknown'
      };
    }
  },
}; 