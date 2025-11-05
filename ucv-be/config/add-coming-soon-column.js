const { pool } = require('./database');

async function addComingSoonColumn() {
    let conn;
    try {
        conn = await pool.getConnection();
        
        console.log('Adding is_coming_soon column to tours table...');
        
        // Check if column already exists
        const columns = await conn.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'tours' 
            AND COLUMN_NAME = 'is_coming_soon'
        `);
        
        if (columns.length === 0) {
            await conn.query(`
                ALTER TABLE tours 
                ADD COLUMN is_coming_soon BOOLEAN DEFAULT FALSE AFTER standard_deadline
            `);
            console.log('✓ is_coming_soon column added successfully');
        } else {
            console.log('✓ is_coming_soon column already exists');
        }
        
        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Error during migration:', err);
        throw err;
    } finally {
        if (conn) conn.release();
        process.exit(0);
    }
}

addComingSoonColumn();

