const express = require("express");
const rateLimit = require("../middleware/rateLimit.middleware");
const cache = require("../middleware/cache.middleware");
const geo = require("../services/geoapify.service");
const { normalizeGeocode, normalizePOI } = require("../utils/geoNormalize");

const router = express.Router();

router.use(rateLimit);

/**
 * 1) GEOCODE
 */
router.get("/geocode", cache(1000 * 60 * 5), async (req, res) => {
  const { q, limit = 5 } = req.query;
  if (!q) return res.status(400).json({ message: "q is required" });

  const data = await geo.geocode(q, Math.min(limit, 50));
  res.json(data.features.map(normalizeGeocode));
});

/**
 * 2) REVERSE
 */
router.get("/reverse", cache(1000 * 60 * 10), async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ message: "lat, lon required" });

  const data = await geo.reverse(lat, lon);
  res.json(normalizeGeocode(data.features[0]));
});

/**
 * 3) PLACES
 */
router.get("/places", cache(1000 * 60 * 10), async (req, res) => {
  const { q, categories, bias, limit = 10 } = req.query;
  const params = new URLSearchParams({
    text: q,
    categories,
    bias,
    limit: Math.min(limit, 50)
  });

  const data = await geo.places(params.toString());
  res.json(data.features.map(normalizePOI));
});

/**
 * 4) PLACE DETAILS (uses places id)
 */
router.get("/place-details", cache(1000 * 60 * 60), async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ message: "place_id required" });

  const data = await geo.places(`id=${place_id}`);
  res.json(data.features[0] || null);
});

/**
 * 5) TOP REGIONS (cached long)
 */
router.get("/top-regions", cache(1000 * 60 * 60 * 12), async (req, res) => {
  const { country, limit = 5 } = req.query;

  const data = await geo.places(
    `categories=tourism.attraction&filter=countrycode:${country}&limit=100`
  );

  const regions = {};
  data.features.forEach(f => {
    const r = f.properties.state || "Unknown";
    regions[r] ??= { regionName: r, count: 0, samplePlace: null };
    regions[r].count++;
    if (!regions[r].samplePlace) {
      regions[r].samplePlace = {
        name: f.properties.name,
        lat: f.properties.lat,
        lon: f.properties.lon
      };
    }
  });

  res.json(Object.values(regions).slice(0, limit));
});

/**
 * 6) ROUTE
 */
router.get("/route", async (req, res) => {
  const { srcLat, srcLon, dstLat, dstLon, profile = "car" } = req.query;
  if (!srcLat || !srcLon || !dstLat || !dstLon)
    return res.status(400).json({ message: "Invalid coordinates" });

  const waypoints = `${srcLat},${srcLon}|${dstLat},${dstLon}`;
  const data = await geo.route(waypoints, profile);

  res.json({
    distance: data.features[0].properties.distance,
    time: data.features[0].properties.time,
    polyline: data.features[0].geometry
  });
});

module.exports = router;
