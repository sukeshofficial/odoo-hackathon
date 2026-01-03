import axios from 'axios';

// Base URL for Backend
const API_URL = 'http://localhost:5000/api';

export const api = {
    // Trip Summary: Recent trips + Recommended places
    getTripSummary: async (userId) => {
        const res = await axios.get(`${API_URL}/trips/summary?userId=${userId}`);
        return res.data;
    },

    // Top Regions
    getTopRegions: async () => {
        const res = await axios.get(`${API_URL}/places/top-regions`);
        return res.data;
    },

    // Geocode (Search) - Proxy
    geocode: async (text) => {
        const res = await axios.get(`${API_URL}/external/geocode?text=${encodeURIComponent(text)}`);
        return res.data.features || []; // Geoapify returns features array
    },

    // Feature 2: Trip Management
    createTrip: async (tripData) => {
        const res = await axios.post(`${API_URL}/trips`, tripData);
        return res.data;
    },

    addStop: async (tripId, stopData) => {
        const res = await axios.post(`${API_URL}/trips/${tripId}/stops`, stopData);
        return res.data;
    },

    getTrip: async (tripId) => {
        const res = await axios.get(`${API_URL}/trips/${tripId}`);
        return res.data;
    },

    // Feature 3: Trip Listing
    getUserTrips: async (userId, status, page = 1, limit = 10) => {
        let url = `${API_URL}/trips?userId=${userId}&page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        const res = await axios.get(url);
        return res.data;
    },

    // Feature 4: Itinerary Builder
    reorderStops: async (tripId, stopIds) => {
        const res = await axios.patch(`${API_URL}/trips/${tripId}/reorder-stops`, { stopIds });
        return res.data;
    },

    getTripTotals: async (tripId) => {
        const res = await axios.get(`${API_URL}/trips/${tripId}/totals`);
        return res.data;
    },

    updateStopBudget: async (stopId, budget) => {
        const res = await axios.patch(`${API_URL}/stops/${stopId}/budget`, { budget });
        return res.data;
    }
};
