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
        
        console.log('Creating tours tables if not exists...');
        // Main tours table
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
        
        // Add new pricing columns to existing tours table if they don't exist
        console.log('Adding new pricing columns if they don\'t exist...');
        
        try {
            await conn.query(`ALTER TABLE tours ADD COLUMN early_bird_price DECIMAL(10, 2) NOT NULL DEFAULT 0`);
        } catch (e) {
            // Column might already exist, ignore error
        }
        
        try {
            await conn.query(`ALTER TABLE tours ADD COLUMN early_bird_university_price DECIMAL(10, 2) NOT NULL DEFAULT 0`);
        } catch (e) {
            // Column might already exist, ignore error
        }
        
        try {
            await conn.query(`ALTER TABLE tours ADD COLUMN standard_regular_price DECIMAL(10, 2) NOT NULL DEFAULT 0`);
        } catch (e) {
            // Column might already exist, ignore error
        }
        
        try {
            await conn.query(`ALTER TABLE tours ADD COLUMN standard_university_price DECIMAL(10, 2) NOT NULL DEFAULT 0`);
        } catch (e) {
            // Column might already exist, ignore error
        }
        
        // Add new tour structure columns
        console.log('Adding new tour structure columns if they don\'t exist...');
        
        try {
            await conn.query(`ALTER TABLE tours ADD COLUMN tour_dates VARCHAR(100)`);
        } catch (e) {
            // Column might already exist, ignore error
        }
        
        try {
            await conn.query(`ALTER TABLE tours ADD COLUMN customize TEXT`);
        } catch (e) {
            // Column might already exist, ignore error
        }
        
        // Remove legacy pricing columns if they exist
        console.log('Removing legacy pricing columns if they exist...');
        
        try {
            await conn.query(`ALTER TABLE tours DROP COLUMN price`);
        } catch (e) {
            // Column might not exist, ignore error
        }
        
        try {
            await conn.query(`ALTER TABLE tours DROP COLUMN standard_price`);
        } catch (e) {
            // Column might not exist, ignore error
        }
        
        try {
            await conn.query(`ALTER TABLE tours DROP COLUMN returning_university_price`);
        } catch (e) {
            // Column might not exist, ignore error
        }
        
        // Remove planned_start_date column if it exists
        console.log('Removing planned_start_date column if it exists...');
        
        try {
            await conn.query(`ALTER TABLE tours DROP COLUMN planned_start_date`);
        } catch (e) {
            // Column might not exist, ignore error
        }
        
        // Create shared entities tables
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

        // Update relationship tables to use IDs instead of direct data
        console.log('Creating/updating relationship tables...');
        
        // Tour cities relationship table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_cities_new (
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
            CREATE TABLE IF NOT EXISTS tour_event_types_new (
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
            CREATE TABLE IF NOT EXISTS tour_package_includes_new (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                package_item_id INT NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY unique_tour_package (tour_id, package_item_id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
                FOREIGN KEY (package_item_id) REFERENCES package_items(id) ON DELETE CASCADE
            )
        `);

        // Migrate existing data if old tables exist
        console.log('Migrating existing data...');
        
        try {
            // Migrate cities data
            await conn.query(`
                INSERT IGNORE INTO cities (name, image_url, wiki_url)
                SELECT DISTINCT name, image_url, wiki_url FROM tour_cities
            `);
            
            // Migrate tour-city relationships
            await conn.query(`
                INSERT IGNORE INTO tour_cities_new (tour_id, city_id)
                SELECT tc.tour_id, c.id 
                FROM tour_cities tc 
                JOIN cities c ON tc.name = c.name
            `);
        } catch (e) {
            console.log('No existing tour_cities data to migrate or already migrated');
        }

        try {
            // Migrate event types data
            await conn.query(`
                INSERT IGNORE INTO event_types (name)
                SELECT DISTINCT event_type FROM tour_event_types
            `);
            
            // Migrate tour-event relationships
            await conn.query(`
                INSERT IGNORE INTO tour_event_types_new (tour_id, event_type_id)
                SELECT tet.tour_id, et.id 
                FROM tour_event_types tet 
                JOIN event_types et ON tet.event_type = et.name
            `);
        } catch (e) {
            console.log('No existing tour_event_types data to migrate or already migrated');
        }

        try {
            // Migrate package items data
            await conn.query(`
                INSERT IGNORE INTO package_items (name)
                SELECT DISTINCT item FROM tour_package_includes
            `);
            
            // Migrate tour-package relationships
            await conn.query(`
                INSERT IGNORE INTO tour_package_includes_new (tour_id, package_item_id)
                SELECT tpi.tour_id, pi.id 
                FROM tour_package_includes tpi 
                JOIN package_items pi ON tpi.item = pi.name
            `);
        } catch (e) {
            console.log('No existing tour_package_includes data to migrate or already migrated');
        }

        // Drop old relationship tables and rename new ones
        console.log('Updating table structure...');
        
        try {
            await conn.query(`DROP TABLE IF EXISTS tour_cities`);
            await conn.query(`RENAME TABLE tour_cities_new TO tour_cities`);
        } catch (e) {
            console.log('tour_cities table update completed or already done');
        }

        try {
            await conn.query(`DROP TABLE IF EXISTS tour_event_types`);
            await conn.query(`RENAME TABLE tour_event_types_new TO tour_event_types`);
        } catch (e) {
            console.log('tour_event_types table update completed or already done');
        }

        try {
            await conn.query(`DROP TABLE IF EXISTS tour_package_includes`);
            await conn.query(`RENAME TABLE tour_package_includes_new TO tour_package_includes`);
        } catch (e) {
            console.log('tour_package_includes table update completed or already done');
        }

        // Tour cities table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_cities (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                image_url VARCHAR(255),
                wiki_url VARCHAR(255),
                PRIMARY KEY (id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
            )
        `);
        
        // Tour event types table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_event_types (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                event_type VARCHAR(255) NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
            )
        `);
        
        // Tour package includes table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS tour_package_includes (
                id INT NOT NULL AUTO_INCREMENT,
                tour_id INT NOT NULL,
                item TEXT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
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