const express = require('express');
const { searchActivities, addActivityToStop, getStopActivities } = require('../controllers/activity.controller');

const router = express.Router();

router.get('/search', searchActivities);
router.post('/stops/:stopId/activities', addActivityToStop);
router.get('/stops/:stopId/activities', getStopActivities);

module.exports = router;
