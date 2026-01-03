import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import "./css/CreateTrip.css";

export default function CreateTrip() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/external/geocode?q=${query}`);
        const data = await response.json();
        setSuggestions(data.map(f => ({
          id: f.place_id || Math.random(),
          formatted: f.formatted || f.name,
        })).slice(0, 5) || []);
      } catch (error) {
        console.error("Geocode error:", error);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const selectDestination = (place) => {
    setDestination(place.formatted);
    setQuery(place.formatted);
    setSuggestions([]);
  };

  const handleCreate = async () => {
    const finalDestination = destination || query;
    if (!title || !finalDestination || !startDate) {
      alert("Please fill in Trip Name, Destination, and Start Date.");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || 1,
          title,
          destination: finalDestination,
          description,
          startDate,
          endDate: endDate || null,
          budget: budget ? parseFloat(budget) : null,
          currency,
        }),
      });

      if (response.ok) {
        const trip = await response.json();
        alert("Trip Created Successfully!");
        navigate(`/trips/${trip.id}`);
      } else {
        alert("Failed to create trip.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">
      <Navbar />

      <div className="create-trip-container">
        <div className="create-trip-header-main">
          <h1>Plan Your Next Adventure</h1>
          <p>Fill in the details to create your perfect trip</p>
        </div>

        <div className="create-trip-form-wrapper">
          <div className="form-card">
            <h2>Trip Details</h2>

            <div className="form-group">
              <label>Trip Name *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Summer in Europe"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Destination *</label>
              <div className="search-input-wrapper">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a city or country..."
                  className="form-input"
                />
                {suggestions.length > 0 && (
                  <ul className="autocomplete-list">
                    {suggestions.map((s, i) => (
                      <li key={i} onClick={() => selectDestination(s)}>
                        📍 {s.formatted}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Budget</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="form-input">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your trip plans..."
                className="form-textarea"
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button onClick={() => navigate("/dashboard")} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={loading} className="btn-create">
                {loading ? "Creating..." : "Create Trip"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
