import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SearchActivity = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStop, setSelectedStop] = useState(null);
    const [userTrips, setUserTrips] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserTrips();
    }, []);

    const fetchUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            const response = await fetch(`http://localhost:5000/api/trips?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setUserTrips(data.trips || []);
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/activities/search?q=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            } else {
                console.error('Search failed');
            }
        } catch (error) {
            console.error('Error searching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToTrip = async (activity) => {
        if (!selectedStop) {
            alert('Please select a trip stop first');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/activities/stops/${selectedStop}/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: activity.name,
                    type: activity.type,
                    cost: activity.cost,
                    durationHours: activity.durationHours
                })
            });

            if (response.ok) {
                alert('Activity added successfully!');
            } else {
                alert('Failed to add activity');
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('Error adding activity');
        }
    };

    return (
        <div className="page search-activity-page">
            <div className="search-header">
                <h2>Search Activities</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/trips')}>
                    Back to Trips
                </button>
            </div>

            <div className="search-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for activities (e.g., museum, tour, restaurant)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {userTrips.length > 0 && (
                    <div className="trip-selector">
                        <label>Select trip stop to add activities:</label>
                        <select 
                            value={selectedStop || ''} 
                            onChange={(e) => setSelectedStop(e.target.value)}
                            className="trip-select"
                        >
                            <option value="">-- Select a stop --</option>
                            {userTrips.map(trip => 
                                trip.stops?.map(stop => (
                                    <option key={stop.id} value={stop.id}>
                                        {trip.title || trip.destination} - {stop.cityName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                )}
            </div>

            <div className="activity-results">
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={activity.id || index} className="activity-card">
                            <div className="activity-info">
                                <h3>{activity.name}</h3>
                                <p className="activity-type">{activity.type}</p>
                                {activity.description && (
                                    <p className="activity-description">{activity.description}</p>
                                )}
                                <div className="activity-details">
                                    {activity.cost && <span className="activity-cost">${activity.cost}</span>}
                                    {activity.durationHours && (
                                        <span className="activity-duration">{activity.durationHours}h</span>
                                    )}
                                </div>
                            </div>
                            <button 
                                className="btn btn-add"
                                onClick={() => handleAddToTrip(activity)}
                                disabled={!selectedStop}
                            >
                                Add to Trip
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-results">
                        {loading ? 'Searching...' : 'Search for activities to add to your trip'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchActivity;
