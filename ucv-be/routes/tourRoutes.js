const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// Route to get all tours
router.get('/', tourController.getAllTours);

// Route to get a specific tour by ID
router.get('/:id', tourController.getTourById);

// Route to create a new tour
router.post('/', tourController.createTour);

// Route to update a tour
router.put('/:id', tourController.updateTour);

// Route to delete a tour
router.delete('/:id', tourController.deleteTour);

module.exports = router; 