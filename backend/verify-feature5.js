const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verifyFeature5() {
    console.log('--- Verifying Feature 5 ---');

    // 1. Setup: Create a trip with stops and activities to test itinerary
    // Note: This relies on existing Feature 2/4 implementation working.
    let userId = 1; // Assuming user 1 exists, or we might need to create one.
    let tripId;

    try {
        console.log('1. Fetching first user trip for testing...');
        const userTrips = await axios.get(`${BASE_URL}/trips?userId=${userId}`);
        if (userTrips.data.trips.length > 0) {
            tripId = userTrips.data.trips[0].id;
            console.log(`Using existing Trip ID: ${tripId}`);
        } else {
             console.log('No trips found, skipping Itinerary test or needing manual creation.');
             // Logic to create trip could be here but keeping it simple
        }

        if (tripId) {
            // 2. Test Itinerary View Endpoint
            console.log(`2. Testing GET /trips/${tripId}/itinerary?view=daywise`);
            const itineraryRes = await axios.get(`${BASE_URL}/trips/${tripId}/itinerary?view=daywise`);
            if (itineraryRes.status === 200 && itineraryRes.data.days) {
                console.log('✅ Itinerary endpoint returning days array.');
                const days = itineraryRes.data.days;
                console.log(`   - Found ${days.length} days in itinerary.`);
                if (days.length > 0) {
                    console.log(`   - Day 1 Date: ${days[0].date}`);
                }
            } else {
                console.error('❌ Itinerary endpoint failed or format incorrect.');
            }
        }

        // 3. Test Calendar Endpoint
        console.log(`3. Testing GET /users/${userId}/calendar`);
        const calendarRes = await axios.get(`${BASE_URL}/users/${userId}/calendar`);
        if (calendarRes.status === 200 && Array.isArray(calendarRes.data)) {
            console.log('✅ Calendar endpoint returning array.');
            console.log(`   - Found ${calendarRes.data.length} events.`);
            if (calendarRes.data.length > 0) {
                const event = calendarRes.data[0];
                if (event.start && event.title) {
                     console.log('   - Event structure looks correct (has start, title).');
                } else {
                     console.error('   - ❌ Event structure missing start or title.');
                }
            }
        } else {
            console.error('❌ Calendar endpoint failed.');
        }

    } catch (error) {
        console.error('❌ Verification Error:', error.message);
        if (error.response) {
            console.error('   Response Status:', error.response.status);
            console.error('   Response Data:', error.response.data);
        }
    }
}

verifyFeature5();
