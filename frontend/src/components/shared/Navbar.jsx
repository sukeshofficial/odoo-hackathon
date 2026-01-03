import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <h2 className="logo" onClick={() => navigate("/dashboard")}>
          🌍 TripPlanner
        </h2>
      </div>
      <div className="navbar-center">
        <a onClick={() => navigate("/dashboard")}>Home</a>
        <a onClick={() => navigate("/trips")}>My Trips</a>
        <a onClick={() => navigate("/search-activities")}>Activities</a>
        <a onClick={() => navigate("/calendar")}>Calendar</a>
      </div>
      <div className="navbar-right">
        <button onClick={() => navigate("/profile")} className="profile-btn">
          {user?.first_name || "Profile"}
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
