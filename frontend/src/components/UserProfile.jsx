import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        country: '',
        additionalInfo: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}/profile`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setFormData({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    phone: data.phone || '',
                    city: data.city || '',
                    country: data.country || '',
                    additionalInfo: data.additional_info || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));
        
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                setEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    if (loading) return <div className="page"><p>Loading profile...</p></div>;
    if (!profile) return <div className="page"><p>Profile not found</p></div>;

    return (
        <div className="page user-profile-page">
            <div className="profile-header">
                <h2>User Profile</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            <div className="profile-container">
                <div className="profile-photo-section">
                    <div 
                        className="profile-photo-large"
                        style={{
                            backgroundImage: profile.profile_photo 
                                ? `url(http://localhost:5000${profile.profile_photo})`
                                : 'none',
                            backgroundColor: profile.profile_photo ? 'transparent' : '#ccc'
                        }}
                    >
                        {!profile.profile_photo && <span className="photo-placeholder">No Photo</span>}
                    </div>
                    <p className="profile-email">{profile.email}</p>
                </div>

                {!editing ? (
                    <div className="profile-info">
                        <div className="info-item">
                            <label>Name:</label>
                            <span>{profile.first_name} {profile.last_name}</span>
                        </div>
                        <div className="info-item">
                            <label>Phone:</label>
                            <span>{profile.phone || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <label>City:</label>
                            <span>{profile.city || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <label>Country:</label>
                            <span>{profile.country || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                            <label>Additional Info:</label>
                            <span>{profile.additional_info || 'Not provided'}</span>
                        </div>
                        <button className="btn btn-primary" onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>City:</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Country:</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Additional Info:</label>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                rows="3"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
