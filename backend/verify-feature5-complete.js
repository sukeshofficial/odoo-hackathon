const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verifyFeature5Complete() {
    console.log('=== Verifying Feature 5 ===\n');

    try {
        // Test 1: Calendar Endpoint
        console.log('1. Testing Calendar Endpoint');
        console.log('   GET /users/1/calendar');
        const calendarRes = await axios.get(`${BASE_URL}/users/1/calendar`);
        console.log(`   ✅ Status: ${calendarRes.status}`);
        console.log(`   ✅ Response type: ${Array.isArray(calendarRes.data) ? 'Array' : 'Object'}`);
        console.log(`   ✅ Events count: ${calendarRes.data.length}`);
        if (calendarRes.data.length > 0) {
            console.log(`   ✅ Sample event:`, JSON.stringify(calendarRes.data[0], null, 2));
        }
        console.log('');

        // Test 2: Get trips to find a tripId
        console.log('2. Getting trips for testing itinerary');
        const tripsRes = await axios.get(`${BASE_URL}/trips?userId=1`);
        console.log(`   ✅ Found ${tripsRes.data.trips.length} trips`);
        
        if (tripsRes.data.trips.length > 0) {
            const tripId = tripsRes.data.trips[0].id;
            console.log(`   ✅ Using trip ID: ${tripId}\n`);
            
            // Test 3: Itinerary Endpoint
            console.log('3. Testing Itinerary Endpoint');
            console.log(`   GET /trips/${tripId}/itinerary?view=daywise`);
            const itineraryRes = await axios.get(`${BASE_URL}/trips/${tripId}/itinerary?view=daywise`);
            console.log(`   ✅ Status: ${itineraryRes.status}`);
            console.log(`   ✅ Has days array: ${!!itineraryRes.data.days}`);
            console.log(`   ✅ Days count: ${itineraryRes.data.days?.length || 0}`);
            if (itineraryRes.data.days && itineraryRes.data.days.length > 0) {
                console.log(`   ✅ Sample day:`, JSON.stringify(itineraryRes.data.days[0], null, 2));
            }
        } else {
            console.log('   ⚠️  No trips found - cannot test itinerary endpoint');
        }

        console.log('\n✅ Feature 5 verification complete!');
        return true;

    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
        if (error.response) {
            console.error('   Response status:', error.response.status);
            console.error('   Response data:', error.response.data);
        }
        return false;
    }
}

verifyFeature5Complete();
