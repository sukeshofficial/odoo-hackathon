import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import "./css/TripsList.css";

export default function TripsList() {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchAllTrips();
  }, []);

  useEffect(() => {
    filterAndSortTrips();
  }, [allTrips, searchQuery, statusFilter, sortBy]);

  const fetchAllTrips = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/trips?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAllTrips(data.trips || []);
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTrips = () => {
    let filtered = [...allTrips];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.destination?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.startDate) - new Date(a.startDate);
      } else if (sortBy === "budget") {
        return (b.budget || 0) - (a.budget || 0);
      }
      return 0;
    });

    setFilteredTrips(filtered);
  };

  const groupedTrips = {
    ongoing: filteredTrips.filter((t) => t.status === "ongoing"),
    upcoming: filteredTrips.filter((t) => t.status === "upcoming"),
    completed: filteredTrips.filter((t) => t.status === "completed"),
  };

  return (
    <div className="trips-list-page">
      <Navbar />

      <div className="trips-list-container">
        <div className="trips-list-header">
          <h1>My Trips</h1>
          <button className="btn-create-trip" onClick={() => navigate("/create-trip")}>
            + Create New Trip
          </button>
        </div>

        {/* Search and Filters */}
        <div className="trips-controls">
          <input
            type="text"
            placeholder="Search trips..."
            className="search-input-modern"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Trips</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="budget">Sort by Budget</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && <div className="loading-state">Loading trips...</div>}

        {/* Empty State */}
        {!loading && allTrips.length === 0 && (
          <div className="empty-state">
            <h3>No trips yet!</h3>
            <p>Start planning your first adventure</p>
            <button className="btn-primary-large" onClick={() => navigate("/create-trip")}>
              Create Your First Trip
            </button>
          </div>
        )}

        {/* Trips Display */}
        {!loading && filteredTrips.length > 0 && (
          <div className="trips-sections">
            {/* Ongoing */}
            {groupedTrips.ongoing.length > 0 && (
              <div className="trip-section">
                <h2 className="section-title">Ongoing</h2>
                <div className="trips-grid">
                  {groupedTrips.ongoing.map((trip) => (
                    <TripCard key={trip.id} trip={trip} navigate={navigate} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {groupedTrips.upcoming.length > 0 && (
              <div className="trip-section">
                <h2 className="section-title">Upcoming</h2>
                <div className="trips-grid">
                  {groupedTrips.upcoming.map((trip) => (
                    <TripCard key={trip.id} trip={trip} navigate={navigate} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {groupedTrips.completed.length > 0 && (
              <div className="trip-section">
                <h2 className="section-title">Completed</h2>
                <div className="trips-grid">
                  {groupedTrips.completed.map((trip) => (
                    <TripCard key={trip.id} trip={trip} navigate={navigate} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredTrips.length === 0 && allTrips.length > 0 && (
          <div className="no-results">
            <p>No trips match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, navigate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "#f59e0b";
      case "upcoming":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="trip-card-modern" onClick={() => navigate(`/trips/${trip.id}`)}>
      <div
        className="trip-card-image"
        style={{
          background: `linear-gradient(135deg, ${getStatusColor(trip.status)}22 0%, ${getStatusColor(trip.status)}44 100%)`,
        }}
      >
        <span className="status-badge" style={{ background: getStatusColor(trip.status) }}>
          {trip.status}
        </span>
      </div>
      <div className="trip-card-body">
        <h3>{trip.title || trip.destination}</h3>
        <p className="trip-dates">
          {new Date(trip.startDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          -{" "}
          {trip.endDate
            ? new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "TBD"}
        </p>
        <div className="trip-card-footer">
          {trip.budget && (
            <span className="budget-tag">
              {trip.currency || "$"}
              {trip.budget}
            </span>
          )}
          <span className="stops-count">{trip.stops?.length || 0} stops</span>
        </div>
      </div>
    </div>
  );
}
