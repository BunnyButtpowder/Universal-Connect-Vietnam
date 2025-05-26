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
        
        console.log('Database tables initialized successfully!');
        return true;
    } catch (err) {
        console.error('Error initializing database: ', err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { initializeDatabase }; 