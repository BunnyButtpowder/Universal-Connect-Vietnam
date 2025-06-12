const { pool } = require('../config/database');

class Translation {
    // Get all translations for a specific page
    static async getPageTranslations(pageName) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = `
                SELECT ct.*, ci.type, ci.page_name, ci.section_id
                FROM content_translations ct
                JOIN content_items ci ON ct.content_item_id = ci.id
                WHERE ci.page_name = ?
                ORDER BY ci.section_id, ci.id, ct.language
            `;
            
            const results = await conn.query(query, [pageName]);
            
            // Group translations by content item
            const groupedTranslations = {};
            results.forEach(row => {
                if (!groupedTranslations[row.content_item_id]) {
                    groupedTranslations[row.content_item_id] = [];
                }
                groupedTranslations[row.content_item_id].push({
                    id: row.content_item_id,
                    language: row.language,
                    content: row.content,
                    metadata: row.metadata,
                    type: row.type,
                    pageName: row.page_name,
                    sectionId: row.section_id,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                });
            });
            
            return groupedTranslations;
            
        } catch (error) {
            console.error('Error getting page translations:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Get all translations
    static async getAllTranslations() {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = `
                SELECT ct.*, ci.type, ci.page_name, ci.section_id
                FROM content_translations ct
                JOIN content_items ci ON ct.content_item_id = ci.id
                ORDER BY ci.page_name, ci.section_id, ci.id, ct.language
            `;
            
            const results = await conn.query(query);
            
            // Group translations by content item
            const groupedTranslations = {};
            results.forEach(row => {
                if (!groupedTranslations[row.content_item_id]) {
                    groupedTranslations[row.content_item_id] = [];
                }
                groupedTranslations[row.content_item_id].push({
                    id: row.content_item_id,
                    language: row.language,
                    content: row.content,
                    metadata: row.metadata,
                    type: row.type,
                    pageName: row.page_name,
                    sectionId: row.section_id,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                });
            });
            
            return groupedTranslations;
            
        } catch (error) {
            console.error('Error getting all translations:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Get specific translation
    static async getTranslation(contentItemId, language) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = `
                SELECT ct.*, ci.type, ci.page_name, ci.section_id
                FROM content_translations ct
                JOIN content_items ci ON ct.content_item_id = ci.id
                WHERE ct.content_item_id = ? AND ct.language = ?
            `;
            
            const results = await conn.query(query, [contentItemId, language]);
            
            if (results.length === 0) {
                return null;
            }
            
            const row = results[0];
            return {
                id: row.content_item_id,
                language: row.language,
                content: row.content,
                metadata: row.metadata,
                type: row.type,
                pageName: row.page_name,
                sectionId: row.section_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
            
        } catch (error) {
            console.error('Error getting translation:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Create or update a translation
    static async upsertTranslation(contentItemId, language, content, metadata = null) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            // First, check if the content item exists
            const contentItemCheck = await conn.query(
                'SELECT id FROM content_items WHERE id = ?',
                [contentItemId]
            );
            
            if (contentItemCheck.length === 0) {
                throw new Error(`Content item with id '${contentItemId}' does not exist`);
            }
            
            // Use ON DUPLICATE KEY UPDATE for upsert operation
            const query = `
                INSERT INTO content_translations (content_item_id, language, content, metadata)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                content = VALUES(content),
                metadata = VALUES(metadata),
                updated_at = CURRENT_TIMESTAMP
            `;
            
            const result = await conn.query(query, [
                contentItemId,
                language,
                content,
                metadata ? JSON.stringify(metadata) : null
            ]);
            
            // Get the updated/created translation
            return await this.getTranslation(contentItemId, language);
            
        } catch (error) {
            console.error('Error upserting translation:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Bulk upsert translations
    static async bulkUpsertTranslations(translations) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            const results = [];
            
            for (const translation of translations) {
                const { id, language, content, metadata } = translation;
                
                // First, check if the content item exists
                const contentItemCheck = await conn.query(
                    'SELECT id FROM content_items WHERE id = ?',
                    [id]
                );
                
                if (contentItemCheck.length === 0) {
                    console.warn(`Content item with id '${id}' does not exist, skipping...`);
                    continue;
                }
                
                const query = `
                    INSERT INTO content_translations (content_item_id, language, content, metadata)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    content = VALUES(content),
                    metadata = VALUES(metadata),
                    updated_at = CURRENT_TIMESTAMP
                `;
                
                await conn.query(query, [
                    id,
                    language,
                    content,
                    metadata ? JSON.stringify(metadata) : null
                ]);
                
                // Get the updated translation
                const updatedTranslation = await this.getTranslation(id, language);
                if (updatedTranslation) {
                    results.push(updatedTranslation);
                }
            }
            
            await conn.commit();
            return results;
            
        } catch (error) {
            if (conn) await conn.rollback();
            console.error('Error bulk upserting translations:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Delete a translation
    static async deleteTranslation(contentItemId, language) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = 'DELETE FROM content_translations WHERE content_item_id = ? AND language = ?';
            const result = await conn.query(query, [contentItemId, language]);
            
            return result.affectedRows > 0;
            
        } catch (error) {
            console.error('Error deleting translation:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Get static UI translations
    static async getStaticTranslations(category = null) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            let query = 'SELECT * FROM static_translations';
            let params = [];
            
            if (category) {
                query += ' WHERE category = ?';
                params.push(category);
            }
            
            query += ' ORDER BY translation_key';
            
            const results = await conn.query(query, params);
            
            // Transform to key-value structure
            const translations = {};
            results.forEach(row => {
                translations[row.translation_key] = {
                    en: row.en,
                    vi: row.vi,
                    category: row.category,
                    description: row.description
                };
            });
            
            return translations;
            
        } catch (error) {
            console.error('Error getting static translations:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Create or update static translation
    static async upsertStaticTranslation(key, en, vi, category = null, description = null) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const query = `
                INSERT INTO static_translations (translation_key, en, vi, category, description)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                en = VALUES(en),
                vi = VALUES(vi),
                category = VALUES(category),
                description = VALUES(description),
                updated_at = CURRENT_TIMESTAMP
            `;
            
            const result = await conn.query(query, [key, en, vi, category, description]);
            
            // Return the created/updated translation
            const selectQuery = 'SELECT * FROM static_translations WHERE translation_key = ?';
            const selectResult = await conn.query(selectQuery, [key]);
            
            return selectResult[0];
            
        } catch (error) {
            console.error('Error upserting static translation:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Initialize default static translations
    static async initializeDefaultStaticTranslations() {
        const defaultTranslations = [
            // Navigation
            { key: 'nav.home', en: 'Home', vi: 'Trang chủ', category: 'navigation' },
            { key: 'nav.aboutUs', en: 'About Us', vi: 'Về chúng tôi', category: 'navigation' },
            { key: 'nav.ourTours', en: 'Our Tours', vi: 'Tours của chúng tôi', category: 'navigation' },
            { key: 'nav.contact', en: 'Contact', vi: 'Liên hệ', category: 'navigation' },
            
            // Common actions
            { key: 'common.readMore', en: 'Read More', vi: 'Đọc thêm', category: 'common' },
            { key: 'common.getStarted', en: 'Get Started', vi: 'Bắt đầu', category: 'common' },
            { key: 'common.learnMore', en: 'Learn More', vi: 'Tìm hiểu thêm', category: 'common' },
            { key: 'common.signUp', en: 'Sign Up', vi: 'Đăng ký', category: 'common' },
            { key: 'common.login', en: 'Login', vi: 'Đăng nhập', category: 'common' },
            { key: 'common.logout', en: 'Logout', vi: 'Đăng xuất', category: 'common' },
            { key: 'common.submit', en: 'Submit', vi: 'Gửi', category: 'common' },
            { key: 'common.cancel', en: 'Cancel', vi: 'Hủy', category: 'common' },
            { key: 'common.save', en: 'Save', vi: 'Lưu', category: 'common' },
            { key: 'common.edit', en: 'Edit', vi: 'Chỉnh sửa', category: 'common' },
            { key: 'common.delete', en: 'Delete', vi: 'Xóa', category: 'common' },
            { key: 'common.loading', en: 'Loading...', vi: 'Đang tải...', category: 'common' },
            { key: 'common.error', en: 'Error', vi: 'Lỗi', category: 'common' },
            { key: 'common.success', en: 'Success', vi: 'Thành công', category: 'common' },
            
            // Language selector
            { key: 'language.english', en: 'English', vi: 'Tiếng Anh', category: 'language' },
            { key: 'language.vietnamese', en: 'Vietnamese', vi: 'Tiếng Việt', category: 'language' },
            { key: 'language.toggleLanguage', en: 'Toggle language', vi: 'Chuyển đổi ngôn ngữ', category: 'language' },
            
            // Loading states
            { key: 'loading.content', en: 'Loading content...', vi: 'Đang tải nội dung...', category: 'loading' },
            { key: 'loading.error', en: 'Error loading content', vi: 'Lỗi khi tải nội dung', category: 'loading' },
            { key: 'loading.tryAgain', en: 'Try Again', vi: 'Thử lại', category: 'loading' },
            
            // Form fields
            { key: 'form.name', en: 'Name', vi: 'Tên', category: 'form' },
            { key: 'form.email', en: 'Email', vi: 'Email', category: 'form' },
            { key: 'form.phone', en: 'Phone', vi: 'Số điện thoại', category: 'form' },
            { key: 'form.message', en: 'Message', vi: 'Tin nhắn', category: 'form' },
            { key: 'form.university', en: 'University', vi: 'Trường đại học', category: 'form' },
            { key: 'form.position', en: 'Position', vi: 'Vị trí', category: 'form' },
            
            // Admin panel
            { key: 'admin.panel', en: 'Admin Panel', vi: 'Bảng quản trị', category: 'admin' },
            { key: 'admin.content', en: 'Content Management', vi: 'Quản lý nội dung', category: 'admin' },
            { key: 'admin.users', en: 'User Management', vi: 'Quản lý người dùng', category: 'admin' },
            { key: 'admin.tours', en: 'Tour Management', vi: 'Quản lý tour', category: 'admin' },
        ];

        let conn;
        try {
            conn = await pool.getConnection();
            
            for (const translation of defaultTranslations) {
                await this.upsertStaticTranslation(
                    translation.key,
                    translation.en,
                    translation.vi,
                    translation.category
                );
            }
            
            console.log('Default static translations initialized successfully!');
            return true;
            
        } catch (error) {
            console.error('Error initializing default static translations:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = Translation; 