import "./css/Dashboard.css";

export default function Dashboard() {
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
          Banner Image
        </div>

        {/* Search & Controls */}
        <div className="dashboard-controls">
          <input
            className="input dashboard-search"
            placeholder="Search bar..."
          />
          <button className="btn">Group by</button>
          <button className="btn">Filter</button>
          <button className="btn">Sort by</button>
        </div>

        {/* Top Regional Selections */}
        <h4 className="dashboard-section-title">
          Top Regional Selections
        </h4>
        <div className="dashboard-regions">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="region-card" />
          ))}
        </div>

        {/* Previous Trips */}
        <h4 className="dashboard-section-title">
          Previous Trips
        </h4>
        <div className="dashboard-trips">
          {[1, 2, 3].map((i) => (
            <div key={i} className="trip-card" />
          ))}
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <button className="btn plan-btn">
            + Plan a trip
          </button>
        </div>

      </div>
    </div>
  );
}
