const Tour = require('../models/Tour');

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
        const result = await Tour.delete(req.params.id);
        
        if (!result) {
            return res.status(404).json({
                status: 'fail',
                message: 'Tour not found'
            });
        }
        
        res.status(204).send();
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
}; 