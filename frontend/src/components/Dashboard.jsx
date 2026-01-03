import "./css/Dashboard.css";
import { useEffect, useState } from "react";
import {
  geocode,
  getPlaces,
  getTopRegions,
  getPlaceDetails,
  getRoute,
} from "../api/geoApi";
import banner from '../assets/banner.png';

export default function Dashboard() {
  // ---------------- STATE ----------------
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [regions, setRegions] = useState([]);
  const [places, setPlaces] = useState([]);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  // ---------------- SEARCH (Forward Geocode) ----------------
  useEffect(() => {
    if (query.length < 3) return;

    const t = setTimeout(async () => {
      try {
        const data = await geocode(query);
        setSuggestions(data || []);
      } catch {}
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  // ---------------- LOCATION SELECT ----------------
  const selectLocation = async (loc) => {
    setSelectedLocation(loc);
    setQuery(loc.formatted);
    setSuggestions([]);

    // Load nearby places
    try {
      const p = await getPlaces({
        query: "",
        categories: "tourism.attraction",
        biasLat: loc.lat,
        biasLon: loc.lon,
      });
      setPlaces(p || []);
    } catch {}

    // Load top regions
    if (loc.country) {
      try {
        const r = await getTopRegions(loc.country);
        setRegions(r || []);
      } catch {}
    }
  };

  // ---------------- REGION CLICK ----------------
  const selectRegion = async (region) => {
    if (!region.samplePlace) return;

    try {
      const p = await getPlaces({
        query: "",
        categories: "tourism.attraction",
        biasLat: region.samplePlace.lat,
        biasLon: region.samplePlace.lon,
      });
      setPlaces(p || []);
    } catch {}
  };

  // ---------------- PLACE CLICK ----------------
  const selectPlace = async (place) => {
    setSelectedPlace(place);
    try {
      await getPlaceDetails(place.id); // details fetched, stored if needed later
    } catch {}
  };

  // ---------------- PLAN TRIP (ROUTE PREVIEW) ----------------
  const planTrip = async () => {
    if (!selectedLocation || !selectedPlace) return;

    try {
      const r = await getRoute({
        srcLat: selectedLocation.lat,
        srcLon: selectedLocation.lon,
        dstLat: selectedPlace.lat,
        dstLon: selectedPlace.lon,
      });
      setRouteInfo(r);
      console.log("Route preview:", r);
    } catch {}
  };

  // ---------------- JSX (UNCHANGED STRUCTURE) ----------------
  return (
    <div className="page dashboard-page ">
      <div className="card dashboard-card">

        {/* Navbar */}
        <div className="dashboard-navbar">
          <h3>GlobeTrotter</h3>
          <div className="avatar dashboard-avatar" style={{ width: "40px", height: "40px" }} />
        </div>

        {/* Banner */}
        <div className="dashboard-banner">
          <img src={banner} className="dashboard-banner"/>
        </div>

        {/* Search & Controls */}
        <div className="dashboard-controls">
          <input
            className="input dashboard-search"
            placeholder="Search bar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn">Group by</button>
          <button className="btn">Filter</button>
          <button className="btn">Sort by</button>
        </div>

        {/* Autocomplete (logic only, no new UI) */}
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((s) => (
              <li key={s.id} onClick={() => selectLocation(s)}>
                {s.formatted}
              </li>
            ))}
          </ul>
        )}

        {/* Top Regional Selections */}
        <h4 className="dashboard-section-title">
          Top Regional Selections
        </h4>
        <div className="dashboard-regions">
          {regions.map((r, i) => (
            <div
              key={i}
              className="region-card"
              onClick={() => selectRegion(r)}
            />
          ))}
        </div>

        {/* Previous Trips (used as Nearby Places) */}
        <h4 className="dashboard-section-title">
          Previous Trips
        </h4>
        <div className="dashboard-trips">
          {places.map((p, i) => (
            <div
              key={i}
              className="trip-card"
              onClick={() => selectPlace(p)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <button className="btn plan-btn" onClick={planTrip}>
            + Plan a trip
          </button>
        </div>

      </div>
    </div>
  );
}
