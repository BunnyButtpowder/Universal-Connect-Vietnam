const { pool } = require('../config/database');

class ContentItem {
    // Get all content items for a specific page
    static async getPageContentItems(pageName) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = `
                SELECT * FROM content_items 
                WHERE page_name = ? 
                ORDER BY section_id, id
            `;
            
            const results = await conn.query(query, [pageName]);
            
            return results.map(row => ({
                id: row.id,
                type: row.type,
                content: row.content,
                metadata: row.metadata ? JSON.parse(row.metadata) : null,
                pageName: row.page_name,
                sectionId: row.section_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            }));
            
        } catch (error) {
            console.error('Error getting page content items:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Get all content items
    static async getAllContentItems() {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = `
                SELECT * FROM content_items 
                ORDER BY page_name, section_id, id
            `;
            
            const results = await conn.query(query);
            
            return results.map(row => ({
                id: row.id,
                type: row.type,
                content: row.content,
                metadata: row.metadata ? JSON.parse(row.metadata) : null,
                pageName: row.page_name,
                sectionId: row.section_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            }));
            
        } catch (error) {
            console.error('Error getting all content items:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Get specific content item
    static async getContentItem(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = 'SELECT * FROM content_items WHERE id = ?';
            const results = await conn.query(query, [id]);
            
            if (results.length === 0) {
                return null;
            }
            
            const row = results[0];
            return {
                id: row.id,
                type: row.type,
                content: row.content,
                metadata: row.metadata ? JSON.parse(row.metadata) : null,
                pageName: row.page_name,
                sectionId: row.section_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
            
        } catch (error) {
            console.error('Error getting content item:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Create or update content item
    static async upsertContentItem(id, type, content, metadata = null, pageName = null, sectionId = null) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = `
                INSERT INTO content_items (id, type, content, metadata, page_name, section_id)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                type = VALUES(type),
                content = VALUES(content),
                metadata = VALUES(metadata),
                page_name = VALUES(page_name),
                section_id = VALUES(section_id),
                updated_at = CURRENT_TIMESTAMP
            `;
            
            const result = await conn.query(query, [
                id,
                type,
                content,
                metadata ? JSON.stringify(metadata) : null,
                pageName,
                sectionId
            ]);
            
            // Return the created/updated content item
            return await this.getContentItem(id);
            
        } catch (error) {
            console.error('Error upserting content item:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Bulk upsert content items
    static async bulkUpsertContentItems(contentItems) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            const results = [];
            
            for (const item of contentItems) {
                const { id, type, content, metadata, pageName, sectionId } = item;
                
                const query = `
                    INSERT INTO content_items (id, type, content, metadata, page_name, section_id)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    type = VALUES(type),
                    content = VALUES(content),
                    metadata = VALUES(metadata),
                    page_name = VALUES(page_name),
                    section_id = VALUES(section_id),
                    updated_at = CURRENT_TIMESTAMP
                `;
                
                await conn.query(query, [
                    id,
                    type,
                    content,
                    metadata ? JSON.stringify(metadata) : null,
                    pageName,
                    sectionId
                ]);
                
                // Get the updated content item
                const updatedItem = await this.getContentItem(id);
                if (updatedItem) {
                    results.push(updatedItem);
                }
            }
            
            await conn.commit();
            return results;
            
        } catch (error) {
            if (conn) await conn.rollback();
            console.error('Error bulk upserting content items:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Delete content item and its translations
    static async deleteContentItem(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            // The foreign key constraint will automatically delete related translations
            const query = 'DELETE FROM content_items WHERE id = ?';
            const result = await conn.query(query, [id]);
            
            return result.affectedRows > 0;
            
        } catch (error) {
            console.error('Error deleting content item:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Initialize default content items from frontend content store
    static async initializeDefaultContentItems() {
        const defaultContentItems = [
            // Hero Banner
            {
                id: 'heroBanner-heading',
                type: 'heading',
                content: "Explore Vietnam's Top State Schools with Us",
                pageName: 'home',
                sectionId: 'heroBanner'
            },
            {
                id: 'heroBanner-paragraph1',
                type: 'paragraph',
                content: "Welcome to UCV - we aim to bridge top schools in Vietnam and international universities. We're a unique connector - we have years of experience on both the university and the school side.",
                pageName: 'home',
                sectionId: 'heroBanner'
            },
            {
                id: 'heroBanner-paragraph2',
                type: 'paragraph',
                content: "Specializing in crafting quality school tours across Vietnam, we focus primarily on state schools (mostly Schools for gifted students).",
                pageName: 'home',
                sectionId: 'heroBanner'
            },
            {
                id: 'heroBanner-paragraph3',
                type: 'paragraph',
                content: "Join us to build partnerships, explore opportunities, and experience Vietnam's vibrant education landscape.",
                pageName: 'home',
                sectionId: 'heroBanner'
            },
            {
                id: 'heroBanner-button',
                type: 'button',
                content: "Find out more",
                pageName: 'home',
                sectionId: 'heroBanner'
            },
            
            // About Us Section
            {
                id: 'aboutUs-heading',
                type: 'heading',
                content: "ABOUT US",
                pageName: 'home',
                sectionId: 'aboutUs'
            },
            {
                id: 'aboutUs-subheading',
                type: 'heading',
                content: "We're passionate about bridging the gap between international universities and Vietnam's top state schools.",
                pageName: 'home',
                sectionId: 'aboutUs'
            },
            {
                id: 'aboutUs-paragraph1',
                type: 'paragraph',
                content: "At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.",
                pageName: 'home',
                sectionId: 'aboutUs'
            },
            {
                id: 'aboutUs-paragraph2',
                type: 'paragraph',
                content: "Our mission? To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.",
                pageName: 'home',
                sectionId: 'aboutUs'
            },
            {
                id: 'aboutUs-button',
                type: 'button',
                content: "Get to Know Us Better",
                pageName: 'home',
                sectionId: 'aboutUs'
            }
        ];

        let conn;
        try {
            conn = await pool.getConnection();
            
            for (const item of defaultContentItems) {
                await this.upsertContentItem(
                    item.id,
                    item.type,
                    item.content,
                    null,
                    item.pageName,
                    item.sectionId
                );
            }
            
            console.log('Default content items initialized successfully!');
            return true;
            
        } catch (error) {
            console.error('Error initializing default content items:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = ContentItem; 