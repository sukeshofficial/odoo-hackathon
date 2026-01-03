import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateTrip from "./components/CreateTrip";
import TripsList from "./components/TripsList";
import Itinerary from "./components/Itinerary";

import CalendarView from "./components/CalendarView";
import ItineraryView from "./components/ItineraryView";
import SearchActivity from "./components/SearchActivity";
import UserProfile from "./components/UserProfile";
import BudgetView from "./components/BudgetView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-trip" element={<CreateTrip />} />
      <Route path="/trips" element={<TripsList />} />
      <Route path="/trips/:tripId" element={<Itinerary />} />
      <Route path="/trips/:tripId/view" element={<ItineraryView />} />
      <Route path="/trips/:tripId/budget" element={<BudgetView />} />
      <Route path="/calendar" element={<CalendarView />} />
      <Route path="/search-activities" element={<SearchActivity />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}
