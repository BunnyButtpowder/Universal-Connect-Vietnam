const mariadb = require('mariadb');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ucv_db',
    connectionLimit: 5
});

// Connect and check for errors
async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Connected to MariaDB!');
        return true;
    } catch (err) {
        console.error('Database connection error: ', err);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    pool,
    testConnection
}; 