import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

const ItineraryView = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/trips/${tripId}/itinerary?view=daywise`);
                if (response.ok) {
                    const data = await response.json();
                    setTripData(data);
                } else {
                    console.error("Failed to fetch itinerary");
                }
            } catch (error) {
                console.error("Error fetching itinerary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItinerary();
    }, [tripId]);

    if (loading) return <div className="page"><p>Loading Itinerary...</p></div>;
    if (!tripData) return <div className="page"><p>Itinerary not found</p></div>;

    return (
        <div className="page itinerary-view-page">
            <div className="itinerary-header">
                <h2>{tripData.title || "Trip Itinerary"}</h2>
                <button className="btn btn-secondary" onClick={() => navigate(`/trips/${tripId}`)}>
                    Edit Itinerary
                </button>
            </div>

            <div className="days-container">
                {tripData.days.map((day) => (
                    <div key={day.dayNumber} className="day-card">
                        <div className="day-header">
                            <h3>Day {day.dayNumber}</h3>
                            <span className="day-date">{day.date}</span>
                        </div>
                        
                        <div className="day-content">
                            {/* Stops/Locations */}
                             {day.stops.length > 0 && (
                                <div className="day-stops">
                                    <strong>Locations:</strong>
                                    <ul>
                                        {day.stops.map(stop => (
                                            <li key={stop.id}>{stop.cityName}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Activities */}
                            <div className="day-activities">
                                {day.activities.length > 0 ? (
                                    day.activities.map(act => (
                                        <div key={act.id} className="activity-item">
                                            <span className="activity-time">{act.time}</span>
                                            <span className="activity-name">{act.name}</span>
                                            <span className="activity-cost">${act.cost}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-activity">No activities planned</p>
                                )}
                            </div>
                        </div>

                        <div className="day-footer">
                            <span>Total: ${day.totalCost}</span>
                        </div>
                    </div>
                ))}
            </div>
             <button className="btn btn-back" onClick={() => navigate("/trips")}>
                Back to Trips
            </button>
        </div>
    );
};

export default ItineraryView;
