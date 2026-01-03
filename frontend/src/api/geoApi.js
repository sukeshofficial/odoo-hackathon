const BASE_URL = "http://localhost:3000/api/external";

async function request(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error("Request failed");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const geoApi = {
  geocode: (q) => request(`/geocode?q=${encodeURIComponent(q)}&limit=5`),

  reverse: (lat, lon) =>
    request(`/reverse?lat=${lat}&lon=${lon}`),

  places: ({ q, categories, lat, lon }) =>
    request(
      `/places?q=${encodeURIComponent(q || "")}&categories=${categories}&bias=${lat},${lon}&limit=10`
    ),

  placeDetails: (id) =>
    request(`/place-details?place_id=${id}`),

  topRegions: (country) =>
    request(`/top-regions?country=${country}&limit=5`),

  route: ({ srcLat, srcLon, dstLat, dstLon }) =>
    request(
      `/route?srcLat=${srcLat}&srcLon=${srcLon}&dstLat=${dstLat}&dstLon=${dstLon}&profile=car`
    ),
};
