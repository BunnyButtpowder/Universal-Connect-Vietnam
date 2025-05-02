const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { initializeDatabase } = require('./config/db-init');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const tourRoutes = require('./routes/tourRoutes');
const corsOptions = require('./config/cors');

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/tours', tourRoutes);

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
