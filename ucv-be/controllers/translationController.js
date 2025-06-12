const Translation = require('../models/Translation');
const ContentItem = require('../models/ContentItem');
const googleTranslateService = require('../services/googleTranslateService');

class TranslationController {
    // Get all translations
    static async getAllTranslations(req, res) {
        try {
            const translations = await Translation.getAllTranslations();
            res.json(translations);
        } catch (error) {
            console.error('Error getting all translations:', error);
            res.status(500).json({ 
                error: 'Failed to fetch translations',
                details: error.message 
            });
        }
    }

    // Get translations for a specific page
    static async getPageTranslations(req, res) {
        try {
            const { pageName } = req.params;
            
            if (!pageName) {
                return res.status(400).json({ error: 'Page name is required' });
            }
            
            const translations = await Translation.getPageTranslations(pageName);
            res.json(translations);
        } catch (error) {
            console.error('Error getting page translations:', error);
            res.status(500).json({ 
                error: 'Failed to fetch page translations',
                details: error.message 
            });
        }
    }

    // Get specific translation
    static async getTranslation(req, res) {
        try {
            const { contentItemId, language } = req.params;
            
            if (!contentItemId || !language) {
                return res.status(400).json({ error: 'Content item ID and language are required' });
            }
            
            if (!['en', 'vi'].includes(language)) {
                return res.status(400).json({ error: 'Language must be either "en" or "vi"' });
            }
            
            const translation = await Translation.getTranslation(contentItemId, language);
            
            if (!translation) {
                return res.status(404).json({ error: 'Translation not found' });
            }
            
            res.json(translation);
        } catch (error) {
            console.error('Error getting translation:', error);
            res.status(500).json({ 
                error: 'Failed to fetch translation',
                details: error.message 
            });
        }
    }

    // Create or update a translation
    static async upsertTranslation(req, res) {
        try {
            const { id, language, content, metadata } = req.body;
            
            if (!id || !language || !content) {
                return res.status(400).json({ 
                    error: 'Content item ID, language, and content are required' 
                });
            }
            
            if (!['en', 'vi'].includes(language)) {
                return res.status(400).json({ error: 'Language must be either "en" or "vi"' });
            }
            
            const translation = await Translation.upsertTranslation(id, language, content, metadata);
            res.json(translation);
        } catch (error) {
            console.error('Error upserting translation:', error);
            
            if (error.message.includes('does not exist')) {
                return res.status(404).json({ 
                    error: 'Content item not found',
                    details: error.message 
                });
            }
            
            res.status(500).json({ 
                error: 'Failed to save translation',
                details: error.message 
            });
        }
    }

    // Bulk update translations
    static async bulkUpsertTranslations(req, res) {
        try {
            const { translations } = req.body;
            
            if (!Array.isArray(translations)) {
                return res.status(400).json({ error: 'Translations must be an array' });
            }
            
            // Validate each translation
            for (const translation of translations) {
                const { id, language, content } = translation;
                
                if (!id || !language || !content) {
                    return res.status(400).json({ 
                        error: 'Each translation must have id, language, and content' 
                    });
                }
                
                if (!['en', 'vi'].includes(language)) {
                    return res.status(400).json({ 
                        error: `Invalid language "${language}". Must be either "en" or "vi"` 
                    });
                }
            }
            
            const results = await Translation.bulkUpsertTranslations(translations);
            res.json(results);
        } catch (error) {
            console.error('Error bulk upserting translations:', error);
            res.status(500).json({ 
                error: 'Failed to bulk update translations',
                details: error.message 
            });
        }
    }

    // Delete a translation
    static async deleteTranslation(req, res) {
        try {
            const { contentItemId, language } = req.params;
            
            if (!contentItemId || !language) {
                return res.status(400).json({ error: 'Content item ID and language are required' });
            }
            
            if (!['en', 'vi'].includes(language)) {
                return res.status(400).json({ error: 'Language must be either "en" or "vi"' });
            }
            
            const deleted = await Translation.deleteTranslation(contentItemId, language);
            
            if (!deleted) {
                return res.status(404).json({ error: 'Translation not found' });
            }
            
            res.json({ message: 'Translation deleted successfully' });
        } catch (error) {
            console.error('Error deleting translation:', error);
            res.status(500).json({ 
                error: 'Failed to delete translation',
                details: error.message 
            });
        }
    }

    // Auto-translate content using Google Translate API
    static async autoTranslate(req, res) {
        try {
            const { text, from, to } = req.body;
            
            if (!text || !from || !to) {
                return res.status(400).json({ 
                    error: 'Text, from language, and to language are required' 
                });
            }
            
            if (!['en', 'vi'].includes(from) || !['en', 'vi'].includes(to)) {
                return res.status(400).json({ 
                    error: 'Languages must be either "en" or "vi"' 
                });
            }

            // If translating to the same language, return the original text
            if (from === to) {
                return res.json({
                    translatedText: text,
                    originalText: text,
                    fromLanguage: from,
                    toLanguage: to,
                    provider: 'same_language'
                });
            }
            
            // Use Google Translate service
            const translatedText = await googleTranslateService.translateText(text, from, to);
            
            // Determine the provider used
            const provider = googleTranslateService.isGoogleTranslateAvailable() ? 'google' : 'fallback';
            
            res.json({ 
                translatedText,
                originalText: text,
                fromLanguage: from,
                toLanguage: to,
                provider,
                googleApiAvailable: googleTranslateService.isGoogleTranslateAvailable()
            });
        } catch (error) {
            console.error('Error auto-translating:', error);
            res.status(500).json({ 
                error: 'Failed to auto-translate',
                details: error.message 
            });
        }
    }

    // Get static UI translations
    static async getStaticTranslations(req, res) {
        try {
            const { category } = req.query;
            const translations = await Translation.getStaticTranslations(category);
            res.json(translations);
        } catch (error) {
            console.error('Error getting static translations:', error);
            res.status(500).json({ 
                error: 'Failed to fetch static translations',
                details: error.message 
            });
        }
    }

    // Create or update static translation
    static async upsertStaticTranslation(req, res) {
        try {
            const { key, en, vi, category, description } = req.body;
            
            if (!key || !en || !vi) {
                return res.status(400).json({ 
                    error: 'Key, English text, and Vietnamese text are required' 
                });
            }
            
            const translation = await Translation.upsertStaticTranslation(key, en, vi, category, description);
            res.json(translation);
        } catch (error) {
            console.error('Error upserting static translation:', error);
            res.status(500).json({ 
                error: 'Failed to save static translation',
                details: error.message 
            });
        }
    }

    // Get all content items
    static async getAllContentItems(req, res) {
        try {
            const contentItems = await ContentItem.getAllContentItems();
            res.json(contentItems);
        } catch (error) {
            console.error('Error getting all content items:', error);
            res.status(500).json({ 
                error: 'Failed to fetch content items',
                details: error.message 
            });
        }
    }

    // Get content items for a specific page
    static async getPageContentItems(req, res) {
        try {
            const { pageName } = req.params;
            
            if (!pageName) {
                return res.status(400).json({ error: 'Page name is required' });
            }
            
            const contentItems = await ContentItem.getPageContentItems(pageName);
            res.json(contentItems);
        } catch (error) {
            console.error('Error getting page content items:', error);
            res.status(500).json({ 
                error: 'Failed to fetch page content items',
                details: error.message 
            });
        }
    }

    // Create or update content item
    static async upsertContentItem(req, res) {
        try {
            const { id, type, content, metadata, pageName, sectionId } = req.body;
            
            if (!id || !type || !content) {
                return res.status(400).json({ 
                    error: 'ID, type, and content are required' 
                });
            }
            
            const validTypes = ['heading', 'paragraph', 'button', 'image', 'statistic'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    error: `Type must be one of: ${validTypes.join(', ')}` 
                });
            }
            
            const contentItem = await ContentItem.upsertContentItem(id, type, content, metadata, pageName, sectionId);
            res.json(contentItem);
        } catch (error) {
            console.error('Error upserting content item:', error);
            res.status(500).json({ 
                error: 'Failed to save content item',
                details: error.message 
            });
        }
    }

    // Initialize default data
    static async initializeDefaultData(req, res) {
        try {
            // Initialize content items first
            await ContentItem.initializeDefaultContentItems();
            
            // Then initialize static translations
            await Translation.initializeDefaultStaticTranslations();
            
            res.json({ 
                message: 'Default internationalization data initialized successfully' 
            });
        } catch (error) {
            console.error('Error initializing default data:', error);
            res.status(500).json({ 
                error: 'Failed to initialize default data',
                details: error.message 
            });
        }
    }

    // Check Google Translate API status
    static async getTranslationServiceStatus(req, res) {
        try {
            const status = {
                googleTranslateAvailable: googleTranslateService.isGoogleTranslateAvailable(),
                supportedLanguages: googleTranslateService.getSupportedLanguages(),
                fallbackTranslationsCount: Object.keys(googleTranslateService.getFallbackTranslations().en_to_vi || {}).length,
                provider: googleTranslateService.isGoogleTranslateAvailable() ? 'google' : 'fallback'
            };
            
            res.json(status);
        } catch (error) {
            console.error('Error getting translation service status:', error);
            res.status(500).json({ 
                error: 'Failed to get translation service status',
                details: error.message 
            });
        }
    }
}

module.exports = TranslationController; 