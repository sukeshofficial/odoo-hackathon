import "./css/Dashboard.css";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [regions, setRegions] = useState([]);
  const [trips, setTrips] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const summary = await api.getTripSummary(user.id);
          setTrips(summary.recentTrips || []);
        }

        const topRegions = await api.getTopRegions();
        setRegions(topRegions || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const data = await api.geocode(query);
        setSuggestions(data.map(f => ({
          id: f.properties?.place_id || Math.random(),
          formatted: f.formatted || f.properties?.formatted || query,
          lat: f.properties?.lat,
          lon: f.properties?.lon
        })) || []);
      } catch { }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  const selectLocation = (loc) => {
    setQuery(loc.formatted);
    setSuggestions([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="main-navbar">
        <div className="navbar-left">
          <h2 className="logo">🌍 TripPlanner</h2>
        </div>
        <div className="navbar-center">
          <a href="#" onClick={() => navigate("/dashboard")}>Home</a>
          <a href="#" onClick={() => navigate("/trips")}>My Trips</a>
          <a href="#" onClick={() => navigate("/search-activities")}>Activities</a>
          <a href="#" onClick={() => navigate("/calendar")}>Calendar</a>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/profile")} className="profile-btn">
            {userProfile?.first_name || "Profile"}
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Plan, organize, and track your trips with ease</p>
          
          {/* Search Bar */}
          <div className="hero-search-container">
            <input
              className="hero-search-input"
              placeholder="Where do you want to go?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="hero-search-btn" onClick={() => navigate("/create-trip")}>
              Search
            </button>
            
            {suggestions.length > 0 && (
              <ul className="hero-search-suggestions">
                {suggestions.map((s) => (
                  <li key={s.id} onClick={() => selectLocation(s)}>
                    📍 {s.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="cta-btn" onClick={() => navigate("/create-trip")}>
            + Create New Trip
          </button>
        </div>
      </section>

      {/* Trips Section */}
      <section className="trips-section">
        <div className="section-header">
          <h2>Your Trips</h2>
          <button className="view-all-btn" onClick={() => navigate("/trips")}>
            View All →
          </button>
        </div>
        
        <div className="trips-grid">
          {trips.length === 0 ? (
            <div className="empty-state">
              <p>No trips yet. Start planning your first adventure!</p>
              <button className="btn-primary" onClick={() => navigate("/create-trip")}>
                Create Trip
              </button>
            </div>
          ) : (
            trips.slice(0, 3).map((trip, index) => (
              <div 
                key={index} 
                className="trip-card-modern"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <div className="trip-card-image">
                  <div className="trip-badge">
                    {new Date(trip.startDate) > new Date() ? "Upcoming" : 
                     new Date(trip.endDate) < new Date() ? "Completed" : "Ongoing"}
                  </div>
                </div>
                <div className="trip-card-content">
                  <h3>{trip.title || trip.destination}</h3>
                  <p className="trip-dates">
                    {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - 
                    {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  {trip.budget && (
                    <p className="trip-budget-tag">Budget: {trip.currency || "$"}{trip.budget}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="section-header">
          <h2>Popular Destinations</h2>
        </div>
        
        <div className="destinations-grid">
          {regions.length === 0 ? (
            <p>Loading destinations...</p>
          ) : (
            regions.slice(0, 6).map((region, index) => (
              <div 
                key={index} 
                className="destination-card"
                style={{
                  backgroundImage: region.imageUrl ? `url(${region.imageUrl})` : 
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <div className="destination-overlay">
                  <h3>{region.name || region.regionName}</h3>
                  <p>{region.placeCount || region.count || 0} places</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer-new">
        <p>© 2026 TripPlanner. Plan your perfect journey.</p>
      </footer>
    </div>
  );
}
