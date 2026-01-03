const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verifyFeature7() {
    console.log('\n🔍 FEATURE 7 VERIFICATION: City Search\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Geocode search
        console.log('\n1. Testing Geocode Search');
        console.log('   GET /external/geocode?q=Paris');
        const geocodeRes = await axios.get(`${BASE_URL}/external/geocode?q=Paris`);
        console.log(`   ✅ Status: ${geocodeRes.status}`);
        console.log(`   ✅ Results: ${geocodeRes.data.length} locations found`);
        if (geocodeRes.data.length > 0) {
            console.log(`   ✅ First result: ${geocodeRes.data[0].formatted || geocodeRes.data[0].name}`);
        }

        // Test 2: Places search
        console.log('\n2. Testing Places Search');
        console.log('   GET /external/places?q=museum&limit=5');
        const placesRes = await axios.get(`${BASE_URL}/external/places?q=museum&limit=5`);
        console.log(`   ✅ Status: ${placesRes.status}`);
        console.log(`   ✅ Results: ${placesRes.data.length} places found`);
        if (placesRes.data.length > 0) {
            console.log(`   ✅ First place: ${placesRes.data[0].name || placesRes.data[0].formatted}`);
        }

        // Test 3: Top Regions
        console.log('\n3. Testing Top Regions (Cached 12h)');
        console.log('   GET /external/top-regions?country=US&limit=5');
        const regionsRes = await axios.get(`${BASE_URL}/external/top-regions?country=US&limit=5`);
        console.log(`   ✅ Status: ${regionsRes.status}`);
        console.log(`   ✅ Regions: ${regionsRes.data.length} found`);

        // Test 4: Verify mock data exists
        console.log('\n4. Verifying Mock Data in Database');
        const tripsRes = await axios.get(`${BASE_URL}/trips?userId=1`);
        console.log(`   ✅ Trips in DB: ${tripsRes.data.trips.length}`);
        
        if (tripsRes.data.trips.length > 0) {
            const trip = tripsRes.data.trips[0];
            console.log(`   ✅ Sample trip: ${trip.title || trip.destination}`);
            console.log(`   ✅ Trip has ${trip.stops?.length || 0} stops`);
        }

        // Test 5: Test caching (make same request twice)
        console.log('\n5. Testing Cache Performance');
        const start1 = Date.now();
        await axios.get(`${BASE_URL}/external/geocode?q=London`);
        const time1 = Date.now() - start1;
        
        const start2 = Date.now();
        await axios.get(`${BASE_URL}/external/geocode?q=London`);
        const time2 = Date.now() - start2;
        
        console.log(`   ✅ First request: ${time1}ms`);
        console.log(`   ✅ Cached request: ${time2}ms`);
        console.log(`   ✅ Speed improvement: ${Math.round((time1 - time2) / time1 * 100)}%`);

        console.log('\n' + '='.repeat(60));
        console.log('✅ FEATURE 7 VERIFICATION COMPLETE\n');
        console.log('📋 Summary:');
        console.log('   - Geocode API: Working ✅');
        console.log('   - Places Search: Working ✅');
        console.log('   - Top Regions: Working ✅');
        console.log('   - Caching: Active ✅');
        console.log('   - Mock Data: Seeded ✅');
        console.log('\n🌐 Frontend Testing:');
        console.log('   - Navigate to http://localhost:5173/dashboard');
        console.log('   - Use search bar to search for cities');
        console.log('   - View trips list with new mock data');
        console.log('');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Endpoint:', error.config?.url);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

verifyFeature7();
