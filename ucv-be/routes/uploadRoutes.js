const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Store images in the uploads directory
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with UUID
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Configure multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Handle multer errors
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File size exceeds the 5MB limit'
            });
        }
        return res.status(400).json({
            status: 'error',
            message: `Upload error: ${err.message}`
        });
    } else if (err) {
        // An unknown error occurred
        return res.status(500).json({
            status: 'error',
            message: err.message || 'Unknown error occurred during upload'
        });
    }
    // If no error, proceed
    next();
};

// Route for uploading images
router.post('/image', upload.single('image'), handleMulterErrors, async (req, res) => {
    let conn;
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No file uploaded'
            });
        }

        // Generate the URL for the uploaded file
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        try {
            // Store image information in the database
            conn = await pool.getConnection();
            
            // Insert into images table
            await conn.query(
                'INSERT INTO images (filename, original_name, mime_type, path, url, size, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [
                    req.file.filename,
                    req.file.originalname,
                    req.file.mimetype,
                    req.file.path,
                    imageUrl,
                    req.file.size
                ]
            );
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Even if DB operation fails, we can still return the image URL
            // Just log the error but don't throw it
        } finally {
            if (conn) conn.release();
        }

        // Always return a valid JSON response
        return res.status(200).json({
            status: 'success',
            imageUrl: imageUrl
        });
    } catch (err) {
        console.error('Error uploading image:', err);
        
        // If there was an error, try to delete the uploaded file
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
            }
        }
        
        // Make sure we always return valid JSON
        return res.status(500).json({
            status: 'error',
            message: err.message || 'An unknown error occurred during upload'
        });
    }
});

module.exports = router; 