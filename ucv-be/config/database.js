const mariadb = require('mariadb');
const { loadEnv, getDbConfig, getSafeDbLabel } = require('./env');

loadEnv();

const dbConfig = getDbConfig();

const pool = mariadb.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    connectionLimit: 5,
    connectTimeout: 15000,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    allowPublicKeyRetrieval: true,
    initSql: 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'
});

async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log(`Connected to MariaDB ${getSafeDbLabel()}`);
        return true;
    } catch (err) {
        console.error(`Database connection error ${getSafeDbLabel()}:`, err.message);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    pool,
    testConnection,
    getSafeDbLabel
};
