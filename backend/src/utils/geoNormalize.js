exports.normalizeGeocode = (f) => ({
  id: f.properties.place_id,
  formatted: f.properties.formatted,
  lat: f.properties.lat,
  lon: f.properties.lon,
  country: f.properties.country,
  city: f.properties.city || null
});

exports.normalizePOI = (f) => ({
  id: f.properties.place_id,
  name: f.properties.name,
  category: f.properties.categories?.[0] || null,
  address: f.properties.formatted,
  lat: f.properties.lat,
  lon: f.properties.lon,
  distance: f.properties.distance || null,
  source: "geoapify"
});
