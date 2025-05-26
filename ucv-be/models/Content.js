const { pool } = require('../config/database');

class Content {
    static async getAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM content'
            );
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async getByName(pageName) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM content WHERE page_name = ?',
                [pageName]
            );
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async saveContent(pageName, content) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            // Check if content for this page already exists
            const existing = await conn.query(
                'SELECT * FROM content WHERE page_name = ?',
                [pageName]
            );
            
            if (existing.length > 0) {
                // Update existing content
                await conn.query(
                    'UPDATE content SET content = ?, updated_at = NOW() WHERE page_name = ?',
                    [JSON.stringify(content), pageName]
                );
                return { updated: true, pageName };
            } else {
                // Insert new content
                await conn.query(
                    'INSERT INTO content (page_name, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
                    [pageName, JSON.stringify(content)]
                );
                return { created: true, pageName };
            }
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async resetToDefault(defaultContent) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            // Start a transaction
            await conn.beginTransaction();
            
            // Delete all content
            await conn.query('DELETE FROM content');
            
            // Insert default content for each page
            for (const pageContent of defaultContent) {
                await conn.query(
                    'INSERT INTO content (page_name, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
                    [pageContent.pageName, JSON.stringify(pageContent)]
                );
            }
            
            // Commit the transaction
            await conn.commit();
            
            return { reset: true };
        } catch (error) {
            if (conn) await conn.rollback();
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    static async resetPage(pageName, defaultPageContent) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            // Delete the specific page content
            await conn.query('DELETE FROM content WHERE page_name = ?', [pageName]);
            
            // Insert default content for the page
            await conn.query(
                'INSERT INTO content (page_name, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
                [pageName, JSON.stringify(defaultPageContent)]
            );
            
            return { reset: true, pageName };
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = Content; 