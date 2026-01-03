const express = require('express');
const { getTopRegions } = require('../controllers/place.controller.js');

const router = express.Router();

// GET /api/places/top-regions
router.get('/top-regions', getTopRegions);

module.exports = router;
