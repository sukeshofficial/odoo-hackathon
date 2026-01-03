const BASE_URL = "http://localhost:5000/api/external";

// Generic fetch wrapper
async function request(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Network/API error:", err);
    throw err;
  }
}

// Forward geocoding
export const geocode = (query, limit = 5) =>
  request(`/geocode?q=${encodeURIComponent(query)}&limit=${limit}`);

// Reverse geocoding
export const reverseGeocode = (lat, lon) =>
  request(`/reverse?lat=${lat}&lon=${lon}`);

// Nearby places / POIs
export const getPlaces = ({ query, category, lat, lon, limit = 10 }) =>
  request(
    `/places?q=${encodeURIComponent(query)}&categories=${category}&bias=${lat},${lon}&limit=${limit}`
  );

// Place details
export const getPlaceDetails = (placeId) =>
  request(`/place-details?place_id=${placeId}`);

// Top regions
export const getTopRegions = (country, limit = 5) =>
  request(`/top-regions?country=${country}&limit=${limit}`);

// Route preview
export const getRoute = ({ srcLat, srcLon, dstLat, dstLon, profile = "car" }) =>
  request(
    `/route?srcLat=${srcLat}&srcLon=${srcLon}&dstLat=${dstLat}&dstLon=${dstLon}&profile=${profile}`
  );
