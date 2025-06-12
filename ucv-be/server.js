const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { testConnection } = require('./config/database');
const { initializeDatabase } = require('./config/db-init');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const tourRoutes = require('./routes/tourRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contentRoutes = require('./routes/contentRoutes');
const translationRoutes = require('./routes/translationRoutes');
const corsOptions = require('./config/cors');

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at: ${uploadsDir}`);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));
console.log(`Serving static files from: ${uploadsDir}`);

// API routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/tours', tourRoutes);
app.use('/upload', uploadRoutes);
app.use('/content', contentRoutes);
app.use('/translations', translationRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Universal Connect Vietnam API' });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        
        if (dbConnected) {
            // Initialize database tables
            await initializeDatabase();
            
            // Start the server
            app.listen(process.env.PORT, () => {
                console.log(`Server is running on port ${process.env.PORT}`);
                console.log(`CORS enabled for: http://localhost:5173, https://ucv.com.vn`);
                console.log(`Static files are served from: ${uploadsDir}`);
                console.log(`Translation API available at: http://localhost:${process.env.PORT}/translations`);
            });
        } else {
            console.error('Failed to connect to the database. Server not started.');
            process.exit(1);
        }
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();
