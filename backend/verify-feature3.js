const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testFeature3() {
    try {
        console.log('=== Feature 3: Trip Listing API ===\n');

        console.log('--- 1. Get All Trips ---');
        const allTripsRes = await axios.get(`${BASE_URL}/trips?userId=1`);
        console.log(`Total trips: ${allTripsRes.data.pagination.total}`);
        console.log(`Trips fetched: ${allTripsRes.data.trips.length}`);

        console.log('\n--- 2. Filter by Status: Upcoming ---');
        const upcomingRes = await axios.get(`${BASE_URL}/trips?userId=1&status=upcoming`);
        console.log(`Upcoming trips: ${upcomingRes.data.trips.length}`);
        if (upcomingRes.data.trips.length > 0) {
            console.log(`Sample: ${upcomingRes.data.trips[0].title || upcomingRes.data.trips[0].destination}`);
        }

        console.log('\n--- 3. Filter by Status: Completed ---');
        const completedRes = await axios.get(`${BASE_URL}/trips?userId=1&status=completed`);
        console.log(`Completed trips: ${completedRes.data.trips.length}`);
        if (completedRes.data.trips.length > 0) {
            console.log(`Sample: ${completedRes.data.trips[0].title || completedRes.data.trips[0].destination}`);
        }

        console.log('\n--- 4. Filter by Status: Ongoing ---');
        const ongoingRes = await axios.get(`${BASE_URL}/trips?userId=1&status=ongoing`);
        console.log(`Ongoing trips: ${ongoingRes.data.trips.length}`);

        console.log('\n--- 5. Test Pagination ---');
        const page1 = await axios.get(`${BASE_URL}/trips?userId=1&page=1&limit=2`);
        console.log(`Page 1: ${page1.data.trips.length} trips`);
        console.log(`Total pages: ${page1.data.pagination.totalPages}`);

        console.log('\n✅ SUCCESS: All tests passed!');
    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testFeature3();
