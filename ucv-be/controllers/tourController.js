const Tour = require('../models/Tour');
const { pool } = require('../config/database');

// Get all tours
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.findAll();
        
        // Return display format for list view
        const formattedTours = tours.map(tour => tour.toDisplayFormat());
        
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: formattedTours
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get tour by ID
exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        
        if (!tour) {
            return res.status(404).json({
                status: 'fail',
                message: 'Tour not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Create new tour
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
};

// Update tour
exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.update(req.params.id, req.body);
        
        if (!updatedTour) {
            return res.status(404).json({
                status: 'fail',
                message: 'Tour not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
};

// Delete tour
exports.deleteTour = async (req, res) => {
    try {
        const success = await Tour.delete(req.params.id);
        
        if (!success) {
            return res.status(404).json({
                status: 'fail',
                message: 'Tour not found'
            });
        }
        
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get all available cities
exports.getAllCities = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const cities = await conn.query('SELECT * FROM cities ORDER BY name');
        
        res.status(200).json({
            status: 'success',
            results: cities.length,
            data: {
                cities: cities.map(city => ({
                    id: Number(city.id),
                    name: city.name,
                    imageUrl: city.image_url,
                    wikiUrl: city.wiki_url
                }))
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Get all available event types
exports.getAllEventTypes = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const eventTypes = await conn.query('SELECT * FROM event_types ORDER BY name');
        
        res.status(200).json({
            status: 'success',
            results: eventTypes.length,
            data: {
                eventTypes: eventTypes.map(et => ({
                    id: Number(et.id),
                    name: et.name
                }))
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Get all available package items
exports.getAllPackageItems = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const packageItems = await conn.query('SELECT * FROM package_items ORDER BY name');
        
        res.status(200).json({
            status: 'success',
            results: packageItems.length,
            data: {
                packageItems: packageItems.map(item => ({
                    id: Number(item.id),
                    name: item.name
                }))
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Create new city
exports.createCity = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const { name, imageUrl, wikiUrl } = req.body;
        
        const result = await conn.query(
            'INSERT INTO cities (name, image_url, wiki_url) VALUES (?, ?, ?)',
            [name, imageUrl, wikiUrl]
        );
        
        const newCity = {
            id: Number(result.insertId),
            name,
            imageUrl,
            wikiUrl
        };
        
        res.status(201).json({
            status: 'success',
            data: {
                city: newCity
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Create new event type
exports.createEventType = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const { name } = req.body;
        
        const result = await conn.query(
            'INSERT INTO event_types (name) VALUES (?)',
            [name]
        );
        
        const newEventType = {
            id: Number(result.insertId),
            name
        };
        
        res.status(201).json({
            status: 'success',
            data: {
                eventType: newEventType
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Create new package item
exports.createPackageItem = async (req, res) => {
    let conn;
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({
                status: 'fail',
                message: 'Package item name is required'
            });
        }
        
        conn = await pool.getConnection();
        const result = await conn.query(
            'INSERT INTO package_items (name) VALUES (?)',
            [name]
        );
        
        const packageItem = {
            id: Number(result.insertId),
            name
        };
        
        res.status(201).json({
            status: 'success',
            data: {
                packageItem
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Get timeline events for a specific tour
exports.getTourTimelineEvents = async (req, res) => {
    let conn;
    try {
        const { tourId } = req.params;
        
        conn = await pool.getConnection();
        const events = await conn.query(
            'SELECT * FROM tour_timeline_events WHERE tour_id = ? ORDER BY sort_order ASC',
            [tourId]
        );
        
        res.status(200).json({
            status: 'success',
            results: events.length,
            data: {
                timelineEvents: events.map(event => ({
                    id: Number(event.id),
                    tourId: Number(event.tour_id),
                    dateRange: event.date_range,
                    location: event.location,
                    description: event.description,
                    sortOrder: event.sort_order
                }))
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Create timeline event for a tour
exports.createTourTimelineEvent = async (req, res) => {
    let conn;
    try {
        const { tourId } = req.params;
        const { dateRange, location, description, sortOrder } = req.body;
        
        if (!dateRange || !location) {
            return res.status(400).json({
                status: 'fail',
                message: 'Date range and location are required'
            });
        }
        
        conn = await pool.getConnection();
        const result = await conn.query(
            'INSERT INTO tour_timeline_events (tour_id, date_range, location, description, sort_order) VALUES (?, ?, ?, ?, ?)',
            [tourId, dateRange, location, description, sortOrder || 0]
        );
        
        const timelineEvent = {
            id: Number(result.insertId),
            tourId: Number(tourId),
            dateRange,
            location,
            description,
            sortOrder: sortOrder || 0
        };
        
        res.status(201).json({
            status: 'success',
            data: {
                timelineEvent
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Update timeline event
exports.updateTourTimelineEvent = async (req, res) => {
    let conn;
    try {
        const { tourId, eventId } = req.params;
        const { dateRange, location, description, sortOrder } = req.body;
        
        conn = await pool.getConnection();
        await conn.query(
            'UPDATE tour_timeline_events SET date_range = ?, location = ?, description = ?, sort_order = ? WHERE id = ? AND tour_id = ?',
            [dateRange, location, description, sortOrder || 0, eventId, tourId]
        );
        
        const updatedEvent = {
            id: Number(eventId),
            tourId: Number(tourId),
            dateRange,
            location,
            description,
            sortOrder: sortOrder || 0
        };
        
        res.status(200).json({
            status: 'success',
            data: {
                timelineEvent: updatedEvent
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
};

// Delete timeline event
exports.deleteTourTimelineEvent = async (req, res) => {
    let conn;
    try {
        const { tourId, eventId } = req.params;
        
        conn = await pool.getConnection();
        await conn.query(
            'DELETE FROM tour_timeline_events WHERE id = ? AND tour_id = ?',
            [eventId, tourId]
        );
        
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    } finally {
        if (conn) conn.release();
    }
}; 