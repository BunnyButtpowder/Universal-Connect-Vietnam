const { pool } = require('../config/database');

class Tour {
    constructor({
        id,
        title,
        description,
        imageUrl,
        // New structured pricing
        earlyBirdPrice,
        earlyBirdUniversityPrice,
        standardRegularPrice,
        standardUniversityPrice,
        date,
        shortDescription,
        location,
        duration,
        tourDates,
        customize,
        eventTypes,
        cities = [],
        packageIncludes = [],
        earlyBirdDeadline,
        standardDeadline,
        additionalImages = [],
        customizeOptions = [],
        created_at
    }) {
        // Basic information
        this.id = id;
        this.title = title;
        this.description = description;
        this.shortDescription = shortDescription;
        this.imageUrl = imageUrl;
        
        // Structured pricing (these will be used for grandTotal/full tour pricing)
        this.pricing = {
            earlyBird: {
                regular: earlyBirdPrice,
                returningUniversity: earlyBirdUniversityPrice
            },
            standard: {
                regular: standardRegularPrice,
                returningUniversity: standardUniversityPrice
            }
        };
        
        // Customize options with their own pricing
        this.customizeOptions = customizeOptions.map(option => ({
            id: option.id,
            key: option.option_key || option.key,
            name: option.option_name || option.name,
            description: option.description,
            pricing: {
                earlyBird: {
                    regular: option.early_bird_price,
                    returningUniversity: option.early_bird_university_price
                },
                standard: {
                    regular: option.standard_regular_price,
                    returningUniversity: option.standard_university_price
                }
            }
        }));
        
        // Dates and duration
        this.date = date; // Display date (e.g., "JULY 4")
        this.tourDates = tourDates; // Tour dates (e.g., "October 2 - 8, 2025")
        this.duration = duration;
        this.customize = customize; // Customize options (e.g., "You can choose between the full tour, the northern tour or the central tour.")
        this.earlyBirdDeadline = earlyBirdDeadline;
        this.standardDeadline = standardDeadline;
        
        // Location details
        this.location = location;
        this.cities = cities.map(city => ({
            id: city.id,
            name: city.name,
            imageUrl: city.imageUrl,
            wikiUrl: city.wikiUrl
        }));
        
        // Event information
        this.eventTypes = (eventTypes || []).map(et => {
            if (typeof et === 'string') {
                return et;
            }
            return et.name || et;
        });
        this.packageIncludes = (packageIncludes || []).map(pi => {
            if (typeof pi === 'string') {
                return pi;
            }
            return pi.name || pi;
        });
        
        // Media
        this.additionalImages = additionalImages;
        
        // Metadata
        this.created_at = created_at;
    }
    
    // Calculate price based on registration date and university status
    calculatePrice(registrationDate, isReturningUniversity) {
        if (!registrationDate) {
            return isReturningUniversity 
                ? this.pricing.standard.returningUniversity 
                : this.pricing.standard.regular;
        }
        
        const regDate = new Date(registrationDate);
        const earlyBirdDate = new Date(this.earlyBirdDeadline);
        
        if (regDate <= earlyBirdDate) {
            return isReturningUniversity 
                ? this.pricing.earlyBird.returningUniversity 
                : this.pricing.earlyBird.regular;
        } else {
            return isReturningUniversity 
                ? this.pricing.standard.returningUniversity 
                : this.pricing.standard.regular;
        }
    }
    
    // Calculate price for a specific customize option
    calculateCustomizeOptionPrice(optionKey, registrationDate, isReturningUniversity) {
        const option = this.customizeOptions.find(opt => opt.key === optionKey);
        if (!option) {
            throw new Error(`Customize option '${optionKey}' not found`);
        }
        
        if (!registrationDate) {
            return isReturningUniversity 
                ? option.pricing.standard.returningUniversity 
                : option.pricing.standard.regular;
        }
        
        const regDate = new Date(registrationDate);
        const earlyBirdDate = new Date(this.earlyBirdDeadline);
        
        if (regDate <= earlyBirdDate) {
            return isReturningUniversity 
                ? option.pricing.earlyBird.returningUniversity 
                : option.pricing.earlyBird.regular;
        } else {
            return isReturningUniversity 
                ? option.pricing.standard.returningUniversity 
                : option.pricing.standard.regular;
        }
    }
    
    // Get all customize options with their pricing
    getAllCustomizeOptions() {
        return this.customizeOptions.map(option => ({
            key: option.key,
            name: option.name,
            description: option.description,
            pricing: {
                earlyBird: {
                    regular: option.pricing.earlyBird.regular,
                    returningUniversity: option.pricing.earlyBird.returningUniversity
                },
                standard: {
                    regular: option.pricing.standard.regular,
                    returningUniversity: option.pricing.standard.returningUniversity
                }
            }
        }));
    }

    // Get all pricing options for display
    getAllPricing() {
        return {
            grandTotal: {
                earlyBird: {
                    regular: this.pricing.earlyBird.regular,
                    returningUniversity: this.pricing.earlyBird.returningUniversity
                },
                standard: {
                    regular: this.pricing.standard.regular,
                    returningUniversity: this.pricing.standard.returningUniversity
                }
            },
            customizeOptions: this.getAllCustomizeOptions(),
            deadlines: {
                earlyBird: this.earlyBirdDeadline,
                standard: this.standardDeadline
            }
        };
    }
    
    // Format for display
    toDisplayFormat() {
        return {
            id: this.id,
            title: this.title,
            shortDescription: this.shortDescription || this.description.substring(0, 120) + "...",
            imageUrl: this.imageUrl,
            price: this.pricing.earlyBird.returningUniversity, // Display early bird returning university price as base
            pricing: this.getAllPricing(),
            date: this.date,
            location: this.location,
            duration: this.duration,
            customizeOptions: this.getAllCustomizeOptions()
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
                       a.additional_images_json,
                       co.customize_options_json
                FROM tours t
                LEFT JOIN (
                    SELECT tc.tour_id, JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name, 'imageUrl', c.image_url, 'wikiUrl', c.wiki_url)) as cities_json
                    FROM tour_cities tc
                    JOIN cities c ON tc.city_id = c.id
                    GROUP BY tc.tour_id
                ) c ON t.id = c.tour_id
                LEFT JOIN (
                    SELECT tet.tour_id, JSON_ARRAYAGG(JSON_OBJECT('id', et.id, 'name', et.name)) as event_types_json
                    FROM tour_event_types tet
                    JOIN event_types et ON tet.event_type_id = et.id
                    GROUP BY tet.tour_id
                ) e ON t.id = e.tour_id
                LEFT JOIN (
                    SELECT tpi.tour_id, JSON_ARRAYAGG(JSON_OBJECT('id', pi.id, 'name', pi.name)) as package_includes_json
                    FROM tour_package_includes tpi
                    JOIN package_items pi ON tpi.package_item_id = pi.id
                    GROUP BY tpi.tour_id
                ) p ON t.id = p.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(image_url) as additional_images_json
                    FROM tour_additional_images
                    GROUP BY tour_id
                ) a ON t.id = a.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(JSON_OBJECT(
                        'id', id,
                        'option_key', option_key,
                        'option_name', option_name,
                        'early_bird_price', early_bird_price,
                        'early_bird_university_price', early_bird_university_price,
                        'standard_regular_price', standard_regular_price,
                        'standard_university_price', standard_university_price,
                        'description', description
                    )) as customize_options_json
                    FROM tour_customize_options
                    GROUP BY tour_id
                ) co ON t.id = co.tour_id
            `);
            
            return rows.map(row => {
                // Safe JSON parsing function
                const safeJsonParse = (jsonStr) => {
                    if (!jsonStr || jsonStr === null || jsonStr === 'null') return [];
                    if (typeof jsonStr === 'object') return jsonStr; // Already parsed
                    if (typeof jsonStr === 'string') {
                        try {
                            return JSON.parse(jsonStr);
                        } catch (e) {
                            console.warn('Failed to parse JSON:', jsonStr, e);
                            return [];
                        }
                    }
                    return [];
                };
                
                const cities = safeJsonParse(row.cities_json);
                const eventTypes = safeJsonParse(row.event_types_json);
                const packageIncludes = safeJsonParse(row.package_includes_json);
                const additionalImages = safeJsonParse(row.additional_images_json);
                const customizeOptions = safeJsonParse(row.customize_options_json);
                
                return new Tour({
                    // Convert BigInt IDs to numbers and map column names
                    id: Number(row.id),
                    title: row.title,
                    description: row.description,
                    shortDescription: row.short_description,
                    imageUrl: row.image_url,
                    earlyBirdPrice: row.early_bird_price,
                    earlyBirdUniversityPrice: row.early_bird_university_price,
                    standardRegularPrice: row.standard_regular_price,
                    standardUniversityPrice: row.standard_university_price,
                    date: row.date,
                    location: row.location,
                    duration: row.duration,
                    tourDates: row.tour_dates,
                    customize: row.customize,
                    earlyBirdDeadline: row.early_bird_deadline,
                    standardDeadline: row.standard_deadline,
                    created_at: row.created_at,
                    cities: cities.map(city => ({
                        id: Number(city.id),
                        name: city.name,
                        imageUrl: city.imageUrl,
                        wikiUrl: city.wikiUrl
                    })),
                    eventTypes: eventTypes,
                    packageIncludes: packageIncludes,
                    additionalImages: additionalImages,
                    customizeOptions: customizeOptions
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
                       a.additional_images_json,
                       co.customize_options_json
                FROM tours t
                LEFT JOIN (
                    SELECT tc.tour_id, JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name, 'imageUrl', c.image_url, 'wikiUrl', c.wiki_url)) as cities_json
                    FROM tour_cities tc
                    JOIN cities c ON tc.city_id = c.id
                    GROUP BY tc.tour_id
                ) c ON t.id = c.tour_id
                LEFT JOIN (
                    SELECT tet.tour_id, JSON_ARRAYAGG(JSON_OBJECT('id', et.id, 'name', et.name)) as event_types_json
                    FROM tour_event_types tet
                    JOIN event_types et ON tet.event_type_id = et.id
                    GROUP BY tet.tour_id
                ) e ON t.id = e.tour_id
                LEFT JOIN (
                    SELECT tpi.tour_id, JSON_ARRAYAGG(JSON_OBJECT('id', pi.id, 'name', pi.name)) as package_includes_json
                    FROM tour_package_includes tpi
                    JOIN package_items pi ON tpi.package_item_id = pi.id
                    GROUP BY tpi.tour_id
                ) p ON t.id = p.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(image_url) as additional_images_json
                    FROM tour_additional_images
                    GROUP BY tour_id
                ) a ON t.id = a.tour_id
                LEFT JOIN (
                    SELECT tour_id, JSON_ARRAYAGG(JSON_OBJECT(
                        'id', id,
                        'option_key', option_key,
                        'option_name', option_name,
                        'early_bird_price', early_bird_price,
                        'early_bird_university_price', early_bird_university_price,
                        'standard_regular_price', standard_regular_price,
                        'standard_university_price', standard_university_price,
                        'description', description
                    )) as customize_options_json
                    FROM tour_customize_options
                    GROUP BY tour_id
                ) co ON t.id = co.tour_id
                WHERE t.id = ?
            `, [id]);
            
            if (rows.length === 0) {
                return null;
            }
            
            const row = rows[0];
            
            // Safe JSON parsing function
            const safeJsonParse = (jsonStr) => {
                if (!jsonStr || jsonStr === null || jsonStr === 'null') return [];
                if (typeof jsonStr === 'object') return jsonStr; // Already parsed
                if (typeof jsonStr === 'string') {
                    try {
                        return JSON.parse(jsonStr);
                    } catch (e) {
                        console.warn('Failed to parse JSON:', jsonStr, e);
                        return [];
                    }
                }
                return [];
            };
            
            const cities = safeJsonParse(row.cities_json);
            const eventTypes = safeJsonParse(row.event_types_json);
            const packageIncludes = safeJsonParse(row.package_includes_json);
            const additionalImages = safeJsonParse(row.additional_images_json);
            const customizeOptions = safeJsonParse(row.customize_options_json);
            
            return new Tour({
                // Convert BigInt IDs to numbers and map column names
                id: Number(row.id),
                title: row.title,
                description: row.description,
                shortDescription: row.short_description,
                imageUrl: row.image_url,
                earlyBirdPrice: row.early_bird_price,
                earlyBirdUniversityPrice: row.early_bird_university_price,
                standardRegularPrice: row.standard_regular_price,
                standardUniversityPrice: row.standard_university_price,
                date: row.date,
                location: row.location,
                duration: row.duration,
                tourDates: row.tour_dates,
                customize: row.customize,
                earlyBirdDeadline: row.early_bird_deadline,
                standardDeadline: row.standard_deadline,
                created_at: row.created_at,
                cities: cities.map(city => ({
                    id: Number(city.id),
                    name: city.name,
                    imageUrl: city.imageUrl,
                    wikiUrl: city.wikiUrl
                })),
                eventTypes: eventTypes,
                packageIncludes: packageIncludes,
                additionalImages: additionalImages,
                customizeOptions: customizeOptions
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
                    title, description, image_url, early_bird_price, early_bird_university_price,
                    standard_regular_price, standard_university_price, date, short_description, location,
                    duration, tour_dates, customize, early_bird_deadline, standard_deadline
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newTour.title, newTour.description, newTour.imageUrl, 
                    newTour.earlyBirdPrice, newTour.earlyBirdUniversityPrice,
                    newTour.standardRegularPrice, newTour.standardUniversityPrice,
                    newTour.date, newTour.shortDescription, newTour.location,
                    newTour.duration, newTour.tourDates, newTour.customize, 
                    newTour.earlyBirdDeadline, newTour.standardDeadline
                ]
            );
            
            const tourId = Number(result.insertId);
            
            // Handle cities
            if (newTour.cities && Array.isArray(newTour.cities) && newTour.cities.length > 0) {
                for (const city of newTour.cities) {
                    let cityId;
                    
                    if (city.id) {
                        cityId = Number(city.id);
                    } else {
                        const cityResult = await conn.query(
                            'INSERT INTO cities (name, image_url, wiki_url) VALUES (?, ?, ?)',
                            [city.name, city.imageUrl, city.wikiUrl]
                        );
                        cityId = Number(cityResult.insertId);
                    }
                    
                    await conn.query(
                        'INSERT INTO tour_cities (tour_id, city_id) VALUES (?, ?)',
                        [tourId, cityId]
                    );
                }
            }
            
            // Handle event types
            if (newTour.eventTypes && Array.isArray(newTour.eventTypes) && newTour.eventTypes.length > 0) {
                for (const eventType of newTour.eventTypes) {
                    let eventTypeId;
                    
                    if (typeof eventType === 'object' && eventType.id) {
                        eventTypeId = Number(eventType.id);
                    } else {
                        const eventName = typeof eventType === 'string' ? eventType : eventType.name;
                        const eventResult = await conn.query(
                            'INSERT IGNORE INTO event_types (name) VALUES (?)',
                            [eventName]
                        );
                        
                        if (eventResult.insertId) {
                            eventTypeId = Number(eventResult.insertId);
                        } else {
                            const existing = await conn.query('SELECT id FROM event_types WHERE name = ?', [eventName]);
                            eventTypeId = Number(existing[0].id);
                        }
                    }
                    
                    await conn.query(
                        'INSERT INTO tour_event_types (tour_id, event_type_id) VALUES (?, ?)',
                        [tourId, eventTypeId]
                    );
                }
            }
            
            // Handle package items
            if (newTour.packageIncludes && Array.isArray(newTour.packageIncludes) && newTour.packageIncludes.length > 0) {
                for (const packageItem of newTour.packageIncludes) {
                    let packageItemId;
                    
                    if (typeof packageItem === 'object' && packageItem.id) {
                        packageItemId = Number(packageItem.id);
                    } else {
                        const itemName = typeof packageItem === 'string' ? packageItem : packageItem.name;
                        const packageResult = await conn.query(
                            'INSERT INTO package_items (name) VALUES (?)',
                            [itemName]
                        );
                        packageItemId = Number(packageResult.insertId);
                    }
                    
                    await conn.query(
                        'INSERT INTO tour_package_includes (tour_id, package_item_id) VALUES (?, ?)',
                        [tourId, packageItemId]
                    );
                }
            }
            
            // Insert additional images
            if (newTour.additionalImages && Array.isArray(newTour.additionalImages) && newTour.additionalImages.length > 0) {
                for (const imageUrl of newTour.additionalImages) {
                    await conn.query(
                        'INSERT INTO tour_additional_images (tour_id, image_url) VALUES (?, ?)',
                        [tourId, imageUrl]
                    );
                }
            }
            
            // Insert customize options
            if (newTour.customizeOptions && Array.isArray(newTour.customizeOptions) && newTour.customizeOptions.length > 0) {
                for (const option of newTour.customizeOptions) {
                    await conn.query(
                        `INSERT INTO tour_customize_options (
                            tour_id, option_key, option_name, early_bird_price, early_bird_university_price,
                            standard_regular_price, standard_university_price, description
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            tourId, option.key, option.name, 
                            option.pricing.earlyBird.regular, option.pricing.earlyBird.returningUniversity,
                            option.pricing.standard.regular, option.pricing.standard.returningUniversity,
                            option.description
                        ]
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
                    title = ?, description = ?, image_url = ?, early_bird_price = ?, early_bird_university_price = ?,
                    standard_regular_price = ?, standard_university_price = ?, date = ?, short_description = ?, location = ?,
                    duration = ?, tour_dates = ?, customize = ?, early_bird_deadline = ?, standard_deadline = ?
                WHERE id = ?`,
                [
                    tourData.title, tourData.description, tourData.imageUrl, 
                    tourData.earlyBirdPrice, tourData.earlyBirdUniversityPrice,
                    tourData.standardRegularPrice, tourData.standardUniversityPrice,
                    tourData.date, tourData.shortDescription, tourData.location,
                    tourData.duration, tourData.tourDates, tourData.customize, 
                    tourData.earlyBirdDeadline, tourData.standardDeadline, id
                ]
            );
            
            // Clear existing related data
            await conn.query('DELETE FROM tour_cities WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_event_types WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_package_includes WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_additional_images WHERE tour_id = ?', [id]);
            await conn.query('DELETE FROM tour_customize_options WHERE tour_id = ?', [id]);
            
            // Insert cities
            if (tourData.cities && tourData.cities.length > 0) {
                for (const city of tourData.cities) {
                    await conn.query(
                        'INSERT INTO tour_cities (tour_id, city_id) VALUES (?, ?)',
                        [id, city.id]
                    );
                }
            }
            
            // Insert event types
            if (tourData.eventTypes && tourData.eventTypes.length > 0) {
                for (const eventType of tourData.eventTypes) {
                    await conn.query(
                        'INSERT INTO tour_event_types (tour_id, event_type_id) VALUES (?, ?)',
                        [id, eventType.id]
                    );
                }
            }
            
            // Insert package includes
            if (tourData.packageIncludes && tourData.packageIncludes.length > 0) {
                for (const packageItem of tourData.packageIncludes) {
                    await conn.query(
                        'INSERT INTO tour_package_includes (tour_id, package_item_id) VALUES (?, ?)',
                        [id, packageItem.id]
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
            
            // Insert customize options
            if (tourData.customizeOptions && tourData.customizeOptions.length > 0) {
                for (const option of tourData.customizeOptions) {
                    await conn.query(
                        `INSERT INTO tour_customize_options (
                            tour_id, option_key, option_name, early_bird_price, early_bird_university_price,
                            standard_regular_price, standard_university_price, description
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            id, option.key, option.name, 
                            option.pricing.earlyBird.regular, option.pricing.earlyBird.returningUniversity,
                            option.pricing.standard.regular, option.pricing.standard.returningUniversity,
                            option.description
                        ]
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
            await conn.query('DELETE FROM tour_customize_options WHERE tour_id = ?', [id]);
            
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