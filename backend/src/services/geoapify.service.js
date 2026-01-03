const fetch = require("node-fetch");

const GEO_BASE_V1 = "https://api.geoapify.com/v1";
const GEO_BASE_V2 = "https://api.geoapify.com/v2";

const apiKey = process.env.GEOAPIFY_API_KEY;

if (!apiKey) throw new Error("GEOAPIFY_API_KEY missing");

const callGeoapify = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const msg = await res.text();
    throw { status: res.status, message: msg };
  }
  return res.json();
};

module.exports = {
  geocode: (q, limit) =>
    callGeoapify(
      `${GEO_BASE_V1}/geocode/search?text=${encodeURIComponent(q)}&limit=${limit}&apiKey=${apiKey}`
    ),

  reverse: (lat, lon) =>
    callGeoapify(
      `${GEO_BASE_V1}/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
    ),

  places: (params) =>
    callGeoapify(
      `${GEO_BASE_V2}/places?${params}&apiKey=${apiKey}`
    ),

  route: (waypoints, mode) =>
    callGeoapify(
      `${GEO_BASE_V1}/routing?waypoints=${waypoints}&mode=${mode}&apiKey=${apiKey}`
    )
};
