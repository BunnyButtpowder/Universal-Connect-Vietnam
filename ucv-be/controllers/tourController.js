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
                packageItems: packageItems.map(pi => ({
                    id: Number(pi.id),
                    name: pi.name
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
        conn = await pool.getConnection();
        const { name } = req.body;
        
        const result = await conn.query(
            'INSERT INTO package_items (name) VALUES (?)',
            [name]
        );
        
        const newPackageItem = {
            id: Number(result.insertId),
            name
        };
        
        res.status(201).json({
            status: 'success',
            data: {
                packageItem: newPackageItem
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