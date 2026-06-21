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

// Fast tour registration (JSON only — docs + email on server, async)
router.post('/submit-registration', contactController.submitRegistration);

// Pre-register coming soon tour (JSON only — email only, no docx)
router.post('/submit-pre-registration', contactController.submitPreRegistration);

// Legacy: FE-generated documents upload
router.post('/submit-documents', upload.array('documents'), contactController.submitDocuments);

module.exports = router; 