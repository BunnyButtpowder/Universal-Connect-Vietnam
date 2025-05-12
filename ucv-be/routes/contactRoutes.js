const express = require('express');
const contactController = require('../controllers/contactController');
const multer = require('multer');

const router = express.Router();

// Configure multer for handling file uploads
const upload = multer({
    storage: multer.memoryStorage()
});

// Submit contact form
router.post('/submit', contactController.submitContactForm);

// Submit documents to email
router.post('/submit-documents', upload.array('documents'), contactController.submitDocuments);

module.exports = router; 