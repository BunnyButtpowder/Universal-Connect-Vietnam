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
                price DECIMAL(10, 2) NOT NULL,
                standard_price DECIMAL(10, 2),
                returning_university_price DECIMAL(10, 2),
                date VARCHAR(100),
                location VARCHAR(255),
                duration TEXT,
                planned_start_date VARCHAR(100),
                early_bird_deadline DATE,
                standard_deadline DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);
        
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
        
        console.log('Database tables initialized successfully!');
        return true;
    } catch (err) {
        console.error('Error initializing database tables: ', err);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { initializeDatabase }; 