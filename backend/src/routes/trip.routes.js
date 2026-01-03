const express = require('express');
const { getTripSummary, getUserTrips, getTripItinerary } = require('../controllers/trip.controller.js');
const { createTrip, addStop, getTripDetails, reorderStops, getTripTotals, updateStopBudget } = require('../controllers/trip_management.controller.js');
const { getTripBudget } = require('../controllers/trip_budget.controller.js');

console.log('[DEBUG] Loading Trip Routes');
const router = express.Router();

// Feature 1
router.get('/summary', getTripSummary);

// Feature 3 - Trip Listing
router.get('/', getUserTrips);

// Feature 2
router.post('/', createTrip);
router.post('/:tripId/stops', addStop);
router.get('/:tripId', getTripDetails);

// Feature 4 - Itinerary Builder
router.patch('/:tripId/reorder-stops', reorderStops);
router.get('/:tripId/totals', getTripTotals);
router.get('/:tripId/itinerary', getTripItinerary);
router.get('/:tripId/budget', getTripBudget);

module.exports = router;
