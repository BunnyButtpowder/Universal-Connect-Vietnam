const { pool } = require('../config/database');

class Tour {
    constructor({
        id,
        title,
        description,
        imageUrl,
        price,
        standardPrice,
        returningUniversityPrice,
        date,
        shortDescription,
        location,
        duration,
        plannedStartDate,
        eventTypes,
        cities = [],
        packageIncludes = [],
        earlyBirdDeadline,
        standardDeadline,
        additionalImages = [],
        created_at
    }) {
        // Basic information
        this.id = id;
        this.title = title;
        this.description = description;
        this.shortDescription = shortDescription;
        this.imageUrl = imageUrl;
        
        // Pricing
        this.price = price; // Base price
        this.standardPrice = standardPrice || price;
        this.returningUniversityPrice = returningUniversityPrice;
        
        // Dates and duration
        this.date = date; // Display date (e.g., "JULY 4")
        this.plannedStartDate = plannedStartDate;
        this.duration = duration;
        this.earlyBirdDeadline = earlyBirdDeadline;
        this.standardDeadline = standardDeadline;
        
        // Location details
        this.location = location;
        this.cities = cities.map(city => ({
            name: city.name,
            imageUrl: city.imageUrl,
            wikiUrl: city.wikiUrl
        }));
        
        // Event information
        this.eventTypes = eventTypes || [];
        this.packageIncludes = packageIncludes;
        
        // Media
        this.additionalImages = additionalImages;
        
        // Metadata
        this.created_at = created_at;
    }
    
    // Calculate price based on registration date and university status
    calculatePrice(registrationDate, isReturningUniversity) {
        if (!registrationDate) return this.standardPrice;
        
        const regDate = new Date(registrationDate);
        const earlyBirdDate = new Date(this.earlyBirdDeadline);
        
        if (regDate <= earlyBirdDate) {
            return isReturningUniversity ? this.returningUniversityPrice : this.price;
        } else {
            return isReturningUniversity ? this.price : this.standardPrice;
        }
    }
    
    // Format for display
    toDisplayFormat() {
        return {
            id: this.id,
            title: this.title,
            shortDescription: this.shortDescription || this.description.substring(0, 120) + "...",
            imageUrl: this.imageUrl,
            price: this.price,
            date: this.date,
            location: this.location,
            duration: this.duration
        };
    }

    static async findAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT t.*, 
                       c.cities_json,
                       e.event_types_json,
                       p.package_includes_json,
                       a.additional_images_json
                FROM tours t
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(JSON_OBJECT('name', name, 'imageUrl', image_url, 'wikiUrl', wiki_url)) as cities_json
                    FROM tour_cities
                    GROUP BY tour_id
                ) c ON t.id = c.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(event_type) as event_types_json
                    FROM tour_event_types
                    GROUP BY tour_id
                ) e ON t.id = e.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(item) as package_includes_json
                    FROM tour_package_includes
                    GROUP BY tour_id
                ) p ON t.id = p.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(image_url) as additional_images_json
                    FROM tour_additional_images
                    GROUP BY tour_id
                ) a ON t.id = a.tour_id
            `);
            
            return rows.map(row => {
                return new Tour({
                    ...row,
                    cities: row.cities_json ? JSON.parse(row.cities_json) : [],
                    eventTypes: row.event_types_json ? JSON.parse(row.event_types_json) : [],
                    packageIncludes: row.package_includes_json ? JSON.parse(row.package_includes_json) : [],
                    additionalImages: row.additional_images_json ? JSON.parse(row.additional_images_json) : []
                });
            });
        } catch (err) {
            console.error('Error getting tours: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async findById(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT t.*, 
                       c.cities_json,
                       e.event_types_json,
                       p.package_includes_json,
                       a.additional_images_json
                FROM tours t
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(JSON_OBJECT('name', name, 'imageUrl', image_url, 'wikiUrl', wiki_url)) as cities_json
                    FROM tour_cities
                    GROUP BY tour_id
                ) c ON t.id = c.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(event_type) as event_types_json
                    FROM tour_event_types
                    GROUP BY tour_id
                ) e ON t.id = e.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(item) as package_includes_json
                    FROM tour_package_includes
                    GROUP BY tour_id
                ) p ON t.id = p.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(image_url) as additional_images_json
                    FROM tour_additional_images
                    GROUP BY tour_id
                ) a ON t.id = a.tour_id
                WHERE t.id = ?
            `, [id]);
            
            if (rows.length === 0) {
                return null;
            }
            
            const row = rows[0];
            return new Tour({
                ...row,
                cities: row.cities_json ? JSON.parse(row.cities_json) : [],
                eventTypes: row.event_types_json ? JSON.parse(row.event_types_json) : [],
                packageIncludes: row.package_includes_json ? JSON.parse(row.package_includes_json) : [],
                additionalImages: row.additional_images_json ? JSON.parse(row.additional_images_json) : []
            });
        } catch (err) {
            console.error('Error getting tour by id: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async create(newTour) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            // Insert main tour data
            const result = await conn.query(
                `INSERT INTO tours (
                    title, description, image_url, price, standard_price, 
                    returning_university_price, date, short_description, location,
                    duration, planned_start_date, early_bird_deadline, standard_deadline
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newTour.title, newTour.description, newTour.imageUrl, 
                    newTour.price, newTour.standardPrice, newTour.returningUniversityPrice,
                    newTour.date, newTour.shortDescription, newTour.location,
                    newTour.duration, newTour.plannedStartDate, 
                    newTour.earlyBirdDeadline, newTour.standardDeadline
                ]
            );
            
            const tourId = result.insertId;
            
            // Insert cities
            if (newTour.cities && newTour.cities.length > 0) {
                for (const city of newTour.cities) {
                    await conn.query(
                        'INSERT INTO tour_cities (tour_id, name, image_url, wiki_url) VALUES (?, ?, ?, ?)',
                        [tourId, city.name, city.imageUrl, city.wikiUrl]
                    );
                }
            }
            
            // Insert event types
            if (newTour.eventTypes && newTour.eventTypes.length > 0) {
                for (const eventType of newTour.eventTypes) {
                    await conn.query(
                        'INSERT INTO tour_event_types (tour_id, event_type) VALUES (?, ?)',
                        [tourId, eventType]
                    );
                }
            }
            
            // Insert package includes
            if (newTour.packageIncludes && newTour.packageIncludes.length > 0) {
                for (const item of newTour.packageIncludes) {
                    await conn.query(
                        'INSERT INTO tour_package_includes (tour_id, item) VALUES (?, ?)',
                        [tourId, item]
                    );
                }
            }
            
            // Insert additional images
            if (newTour.additionalImages && newTour.additionalImages.length > 0) {
                for (const imageUrl of newTour.additionalImages) {
                    await conn.query(
                        'INSERT INTO tour_additional_images (tour_id, image_url) VALUES (?, ?)',
                        [tourId, imageUrl]
                    );
                }
            }
            
            await conn.commit();
            
            // Get the newly created tour
            return Tour.findById(tourId);
        } catch (err) {
            if (conn) await conn.rollback();
            console.error('Error creating tour: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async update(id, tourData) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            // Update main tour data
            await conn.query(
                `UPDATE tours SET
                    title = ?, description = ?, image_url = ?, price = ?, 
                    standard_price = ?, returning_university_price = ?, date = ?,
                    short_description = ?, location = ?, duration = ?,
                    planned_start_date = ?, early_bird_deadline = ?, standard_deadline = ?
                WHERE id = ?`,
                [
                    tourData.title, tourData.description, tourData.imageUrl, 
                    tourData.price, tourData.standardPrice, tourData.returningUniversityPrice,
                    tourData.date, tourData.shortDescription, tourData.location,
                    tourData.duration, tourData.plannedStartDate, 
                    tourData.earlyBirdDeadline, tourData.standardDeadline, id
                ]
            );
            
            // Clear existing related data
            await conn.query('DELETE FROM tour_cities WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_event_types WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_package_includes WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_additional_images WHERE tour_id = ?', [id]);
            
            // Insert cities
            if (tourData.cities && tourData.cities.length > 0) {
                for (const city of tourData.cities) {
                    await conn.query(
                        'INSERT INTO tour_cities (tour_id, name, image_url, wiki_url) VALUES (?, ?, ?, ?)',
                        [id, city.name, city.imageUrl, city.wikiUrl]
                    );
                }
            }
            
            // Insert event types
            if (tourData.eventTypes && tourData.eventTypes.length > 0) {
                for (const eventType of tourData.eventTypes) {
                    await conn.query(
                        'INSERT INTO tour_event_types (tour_id, event_type) VALUES (?, ?)',
                        [id, eventType]
                    );
                }
            }
            
            // Insert package includes
            if (tourData.packageIncludes && tourData.packageIncludes.length > 0) {
                for (const item of tourData.packageIncludes) {
                    await conn.query(
                        'INSERT INTO tour_package_includes (tour_id, item) VALUES (?, ?)',
                        [id, item]
                    );
                }
            }
            
            // Insert additional images
            if (tourData.additionalImages && tourData.additionalImages.length > 0) {
                for (const imageUrl of tourData.additionalImages) {
                    await conn.query(
                        'INSERT INTO tour_additional_images (tour_id, image_url) VALUES (?, ?)',
                        [id, imageUrl]
                    );
                }
            }
            
            await conn.commit();
            
            // Get the updated tour
            return Tour.findById(id);
        } catch (err) {
            if (conn) await conn.rollback();
            console.error('Error updating tour: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async delete(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            // Delete related data first
            await conn.query('DELETE FROM tour_cities WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_event_types WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_package_includes WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_additional_images WHERE tour_id = ?', [id]);
            
            // Delete main tour record
            await conn.query('DELETE FROM tours WHERE id = ?', [id]);
            
            await conn.commit();
            return true;
        } catch (err) {
            if (conn) await conn.rollback();
            console.error('Error deleting tour: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = Tour; 