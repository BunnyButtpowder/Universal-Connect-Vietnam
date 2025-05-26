const express = require('express');
const contentController = require('../controllers/contentController');
const router = express.Router();

// Get all content
router.get('/', contentController.getAllContent);

// Get content for a specific page
router.get('/:pageName', contentController.getContentByPage);

// Save or update content for a specific page
router.put('/:pageName', contentController.saveContent);

// Update a specific content item
router.patch('/:pageName/:sectionId/:itemId', contentController.updateContentItem);

// Reset all content to default values
router.post('/reset', contentController.resetAllContent);

// Reset specific page content to default
router.post('/reset/:pageName', contentController.resetPageContent);

module.exports = router; 