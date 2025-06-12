const express = require('express');
const TranslationController = require('../controllers/translationController');

const router = express.Router();

// Translation management routes
router.get('/', TranslationController.getAllTranslations);
router.get('/page/:pageName', TranslationController.getPageTranslations);
router.get('/:contentItemId/:language', TranslationController.getTranslation);
router.put('/', TranslationController.upsertTranslation);
router.put('/bulk', TranslationController.bulkUpsertTranslations);
router.delete('/:contentItemId/:language', TranslationController.deleteTranslation);

// Auto-translation route
router.post('/auto-translate', TranslationController.autoTranslate);

// Translation service status
router.get('/status', TranslationController.getTranslationServiceStatus);

// Static translations (UI elements)
router.get('/static', TranslationController.getStaticTranslations);
router.put('/static', TranslationController.upsertStaticTranslation);

// Content items management
router.get('/content-items', TranslationController.getAllContentItems);
router.get('/content-items/page/:pageName', TranslationController.getPageContentItems);
router.put('/content-items', TranslationController.upsertContentItem);

// Initialize default data
router.post('/initialize', TranslationController.initializeDefaultData);

module.exports = router; 