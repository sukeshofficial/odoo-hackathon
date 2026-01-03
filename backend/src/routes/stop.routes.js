const express = require('express');
const { addActivity, updateStopBudget } = require('../controllers/trip_management.controller.js');

const router = express.Router();

router.post('/:stopId/activities', addActivity);
router.patch('/:stopId/budget', updateStopBudget);

module.exports = router;
