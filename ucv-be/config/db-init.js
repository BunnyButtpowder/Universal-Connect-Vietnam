const { pool } = require('./database');

async function initializeDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
        
        console.log('Creating users table if not exists...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                username VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);
        
        console.log('Creating tours table if not exists...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tours (
                id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                short_description TEXT,
                image_url VARCHAR(255),
                early_bird_price DECIMAL(10, 2) NOT NULL,
                early_bird_university_price DECIMAL(10, 2) NOT NULL,
                standard_regular_price DECIMAL(10, 2) NOT NULL,
                standard_university_price DECIMAL(10, 2) NOT NULL,
                date VARCHAR(100),
                location VARCHAR(255),
                duration TEXT,
                tour_dates VARCHAR(100),
                customize TEXT,
                early_bird_deadline DATE,
                standard_deadline DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);
        
        console.log('Creating shared entities tables...');
        
        // Cities table - shared across tours
        await conn.query(`
            CREATE TABLE IF NOT EXISTS cities (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL UNIQUE,
                image_url VARCHAR(255),
                wiki_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);

        // Event types table - shared across tours
        await conn.query(`
            CREATE TABLE IF NOT EXISTS event_types (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);

        // Package items table - shared across tours
        await conn.query(`
            CREATE TABLE IF NOT EXISTS package_items (
                id INT NOT NULL AUTO_INCREMENT,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);

        console.log('Creating relationship tables...');
        
        // Tour cities relationship table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_cities (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                city_id INT NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY unique_tour_city (tour_id, city_id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
                FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
            )
        `);

        // Tour event types relationship table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_event_types (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                event_type_id INT NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY unique_tour_event (tour_id, event_type_id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
                FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE CASCADE
            )
        `);

        // Tour package includes relationship table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_package_includes (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                package_item_id INT NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY unique_tour_package (tour_id, package_item_id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
                FOREIGN KEY (package_item_id) REFERENCES package_items(id) ON DELETE CASCADE
            )
        `);

        // Tour additional images table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_additional_images (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
            )
        `);
        
        // Tour customize options table - for different tour segments with their own pricing
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_customize_options (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                option_key VARCHAR(50) NOT NULL,
                option_name VARCHAR(255) NOT NULL,
                early_bird_price DECIMAL(10, 2) NOT NULL,
                early_bird_university_price DECIMAL(10, 2) NOT NULL,
                standard_regular_price DECIMAL(10, 2) NOT NULL,
                standard_university_price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY unique_tour_option (tour_id, option_key),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
            )
        `);
        
        // Tour timeline events table - for tour schedule timeline
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_timeline_events (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                date_range VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                description TEXT,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
                INDEX idx_tour_timeline_sort (tour_id, sort_order)
            )
        `);
        
        // Create images table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                mime_type VARCHAR(100) NOT NULL,
                path VARCHAR(255) NOT NULL,
                url VARCHAR(255) NOT NULL,
                size INT NOT NULL,
                created_at DATETIME NOT NULL
            )
        `);
        
        // Create content table for website content management
        console.log('Creating content table if not exists...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                page_name VARCHAR(100) NOT NULL UNIQUE,
                content LONGTEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
            )
        `);

        // Create content items table for granular content management
        console.log('Creating content items table for internationalization...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS content_items (
                id VARCHAR(255) PRIMARY KEY,
                type ENUM('heading', 'paragraph', 'button', 'image', 'statistic') NOT NULL,
                content TEXT NOT NULL,
                metadata JSON,
                page_name VARCHAR(100),
                section_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_page_section (page_name, section_id),
                INDEX idx_type (type)
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);

        // Create content translations table for internationalization
        console.log('Creating content translations table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS content_translations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content_item_id VARCHAR(255) NOT NULL,
                language ENUM('en', 'vi') NOT NULL,
                content TEXT NOT NULL,
                metadata JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (content_item_id) REFERENCES content_items(id) ON DELETE CASCADE,
                UNIQUE KEY unique_item_language (content_item_id, language),
                INDEX idx_language (language),
                INDEX idx_content_item (content_item_id)
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);

        // Create static translations table for UI elements
        console.log('Creating static translations table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS static_translations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                translation_key VARCHAR(255) NOT NULL UNIQUE,
                en TEXT NOT NULL,
                vi TEXT NOT NULL,
                category VARCHAR(100),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_key (translation_key)
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        
        console.log('Database tables initialized successfully!');
        
        // Initialize default internationalization data
        console.log('Initializing default internationalization data...');
        try {
            const ContentItem = require('../models/ContentItem');
            const Translation = require('../models/Translation');
            
            // Check if content items already exist
            const existingItems = await conn.query('SELECT COUNT(*) as count FROM content_items');
            if (existingItems[0].count === 0) {
                await ContentItem.initializeDefaultContentItems();
            }
            
            // Check if static translations already exist
            const existingTranslations = await conn.query('SELECT COUNT(*) as count FROM static_translations');
            if (existingTranslations[0].count === 0) {
                await Translation.initializeDefaultStaticTranslations();
            }
            
            console.log('Default internationalization data initialized successfully!');
        } catch (initError) {
            console.warn('Could not initialize default internationalization data:', initError.message);
            console.log('You can manually initialize data using POST /translations/initialize');
        }
        
        return true;
    } catch (err) {
        console.error('Error initializing database: ', err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { initializeDatabase }; 