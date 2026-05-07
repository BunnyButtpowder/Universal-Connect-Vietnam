const { pool } = require('./database');

async function addDisplayOrderAndSignUpDisabled() {
    let conn;
    try {
        conn = await pool.getConnection();

        // Add display_order column
        const displayOrderColumns = await conn.query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'tours'
            AND COLUMN_NAME = 'display_order'
        `);

        if (displayOrderColumns.length === 0) {
            await conn.query(`
                ALTER TABLE tours
                ADD COLUMN display_order INT DEFAULT 0 AFTER is_coming_soon
            `);
            // Initialize display_order based on existing id order
            await conn.query('SET @row_number = 0');
            await conn.query('UPDATE tours SET display_order = (@row_number := @row_number + 1) ORDER BY id ASC');
            console.log('✓ display_order column added and initialized');
        } else {
            console.log('✓ display_order column already exists');
        }

        // Add sign_up_disabled column
        const signUpDisabledColumns = await conn.query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'tours'
            AND COLUMN_NAME = 'sign_up_disabled'
        `);

        if (signUpDisabledColumns.length === 0) {
            await conn.query(`
                ALTER TABLE tours
                ADD COLUMN sign_up_disabled BOOLEAN DEFAULT FALSE AFTER display_order
            `);
            console.log('✓ sign_up_disabled column added');
        } else {
            console.log('✓ sign_up_disabled column already exists');
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

addDisplayOrderAndSignUpDisabled();
