import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./css/Itinerary.css";

export default function Itinerary() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userProfile");
        if (storedUser) {
            setUserProfile(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        fetchTrip();
        fetchTotals();
    }, [tripId]);

    const fetchTrip = async () => {
        setLoading(true);
        try {
            const data = await api.getTrip(tripId);
            setTrip(data);
        } catch (err) {
            console.error("Failed to fetch trip:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotals = async () => {
        try {
            const data = await api.getTripTotals(tripId);
            setTotals(data);
        } catch (err) {
            console.error("Failed to fetch totals:", err);
        }
    };

    const handleBudgetChange = async (stopId, budget) => {
        try {
            await api.updateStopBudget(stopId, budget);
            await fetchTrip();
            await fetchTotals();
        } catch (err) {
            console.error("Failed to update budget:", err);
        }
    };

    const moveStop = async (index, direction) => {
        const newStops = [...trip.stops];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newStops.length) return;

        // Swap
        [newStops[index], newStops[targetIndex]] = [newStops[targetIndex], newStops[index]];

        // Update local state first for immediate UI feedback
        setTrip({ ...trip, stops: newStops });

        // Update backend
        try {
            const stopIds = newStops.map(s => s.id);
            await api.reorderStops(tripId, stopIds);
            await fetchTrip(); // Refresh to get updated sequences
        } catch (err) {
            console.error("Failed to reorder:", err);
            await fetchTrip(); // Revert on error
        }
    };

    const addSection = async () => {
        try {
            // Calculate next sequence
            const nextSequence = trip.stops.length + 1;
            const lastStop = trip.stops[trip.stops.length - 1];

            // Default dates: day after last stop
            const startDate = lastStop ? new Date(new Date(lastStop.endDate).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            const endDate = new Date(new Date(startDate).getTime() + 86400000).toISOString().split('T')[0];

            await api.addStop(tripId, {
                cityName: 'New Stop',
                sequence: nextSequence,
                startDate,
                endDate
            });

            await fetchTrip();
            await fetchTotals();
        } catch (err) {
            console.error("Failed to add section:", err);
            alert("Failed to add section");
        }
    };

    if (loading) return <div className="page"><p>Loading...</p></div>;
    if (!trip) return <div className="page"><p>Trip not found</p></div>;

    return (
        <div className="page itinerary-page">
            <div className="itinerary-container">

                {/* Header */}
                <div className="itinerary-header">
                    <h2>GlobeTrotter</h2>
                    <div
                        className="avatar"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundImage: userProfile?.profilePhoto
                                ? `url(http://localhost:5000${userProfile.profilePhoto})`
                                : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    />
                </div>

                <div className="itinerary-content">

                    {/* Trip Overview */}
                    <div className="trip-overview">
                        <h3>Build Itinerary Screen</h3>
                        <p className="trip-title">{trip.title || trip.destination}</p>
                    </div>

                    {/* Sections (Stops) */}
                    {trip.stops && trip.stops.length > 0 ? (
                        trip.stops.map((stop, index) => (
                            <div key={stop.id} className="itinerary-section">
                                <div className="section-header">
                                    <h4>Section {index + 1}:</h4>
                                    <div className="reorder-buttons">
                                        <button
                                            className="reorder-btn"
                                            onClick={() => moveStop(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            className="reorder-btn"
                                            onClick={() => moveStop(index, 'down')}
                                            disabled={index === trip.stops.length - 1}
                                        >
                                            ↓
                                        </button>
                                    </div>
                                </div>
                                <p className="section-description">
                                    All the necessary information about this section.
                                    <br />
                                    This can be anything like travel section, hotel or any other activity
                                </p>
                                <div className="section-details">
                                    <div className="section-field">
                                        <label>Date Range:</label>
                                        <span>{new Date(stop.startDate).toLocaleDateString()} to {new Date(stop.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="section-field">
                                        <label>Budget of this section</label>
                                        <input
                                            type="number"
                                            className="budget-input"
                                            value={stop.budget || ''}
                                            onChange={(e) => handleBudgetChange(stop.id, e.target.value)}
                                            placeholder="Enter budget"
                                        />
                                    </div>
                                </div>
                                <div className="section-location">
                                    <strong>Location:</strong> {stop.cityName}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-sections">No sections added yet</p>
                    )}

                    {/* Add Section Button */}
                    <div className="add-section-container">
                        <button className="btn add-section-btn" onClick={addSection}>
                            + Add another Section
                        </button>
                    </div>

                    {/* Totals Display */}
                    {totals && (
                        <div className="trip-totals">
                            <h4>Trip Summary</h4>
                            <div className="totals-grid">
                                <div className="total-item">
                                    <span className="total-label">Total Budget:</span>
                                    <span className="total-value">${totals.totalBudget}</span>
                                </div>
                                <div className="total-item">
                                    <span className="total-label">Total Days:</span>
                                    <span className="total-value">{totals.totalDays}</span>
                                </div>
                                <div className="total-item">
                                    <span className="total-label">Sections:</span>
                                    <span className="total-value">{totals.stopCount}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Back button */}
                    <div className="itinerary-actions">
                        <button className="btn btn-back" onClick={() => navigate("/trips")}>
                            Back to Trips
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
