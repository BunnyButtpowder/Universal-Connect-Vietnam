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

// Timeline event routes for tours
router.get('/:tourId/timeline', tourController.getTourTimelineEvents);
router.post('/:tourId/timeline', tourController.createTourTimelineEvent);
router.put('/:tourId/timeline/:eventId', tourController.updateTourTimelineEvent);
router.delete('/:tourId/timeline/:eventId', tourController.deleteTourTimelineEvent);

// Routes for shared entities
// Cities
router.get('/shared/cities', tourController.getAllCities);
router.post('/shared/cities', tourController.createCity);

// Event Types
router.get('/shared/event-types', tourController.getAllEventTypes);
router.post('/shared/event-types', tourController.createEventType);

// Package Items
router.get('/shared/package-items', tourController.getAllPackageItems);
router.post('/shared/package-items', tourController.createPackageItem);

module.exports = router; 