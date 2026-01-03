const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verifyFeature6() {
    console.log('=== Verifying Feature 6 ===\n');

    try {
        // Test 1: Activity Search
        console.log('1. Testing Activity Search');
        console.log('   GET /activities/search?q=museum');
        const searchRes = await axios.get(`${BASE_URL}/activities/search?q=museum`);
        console.log(`   ✅ Status: ${searchRes.status}`);
        console.log(`   ✅ Results count: ${searchRes.data.length}`);
        if (searchRes.data.length > 0) {
            console.log(`   ✅ Sample activity:`, JSON.stringify(searchRes.data[0], null, 2));
        }
        console.log('');

        // Test 2: User Profile - Get
        console.log('2. Testing Get User Profile');
        console.log('   GET /users/1/profile');
        const profileRes = await axios.get(`${BASE_URL}/users/1/profile`);
        console.log(`   ✅ Status: ${profileRes.status}`);
        console.log(`   ✅ User:`, profileRes.data.first_name, profileRes.data.last_name);
        console.log(`   ✅ Email:`, profileRes.data.email);
        console.log('');

        // Test 3: User Profile - Update
        console.log('3. Testing Update User Profile');
        console.log('   PUT /users/1/profile');
        const updateRes = await axios.put(`${BASE_URL}/users/1/profile`, {
            firstName: profileRes.data.first_name,
            lastName: profileRes.data.last_name,
            city: 'Test City',
            country: 'Test Country',
            additionalInfo: 'Verified by Feature 6 test'
        });
        console.log(`   ✅ Status: ${updateRes.status}`);
        console.log(`   ✅ Updated city:`, updateRes.data.city);
        console.log('');

        // Test 4: Add Activity to Stop (requires existing trip/stop)
        console.log('4. Testing Add Activity to Stop');
        const tripsRes = await axios.get(`${BASE_URL}/trips?userId=1`);
        if (tripsRes.data.trips.length > 0 && tripsRes.data.trips[0].stops?.length > 0) {
            const stopId = tripsRes.data.trips[0].stops[0].id;
            console.log(`   Using stop ID: ${stopId}`);
            
            const addActivityRes = await axios.post(
                `${BASE_URL}/activities/stops/${stopId}/activities`,
                {
                    name: 'Museum Tour',
                    type: 'culture',
                    cost: 25,
                    durationHours: 2
                }
            );
            console.log(`   ✅ Status: ${addActivityRes.status}`);
            console.log(`   ✅ Activity created:`, addActivityRes.data.name);
        } else {
            console.log('   ⚠️  No trips/stops found - skipping add activity test');
        }
        console.log('');

        console.log('✅ Feature 6 verification complete!\n');
        console.log('Frontend routes to test:');
        console.log('   - http://localhost:5173/search-activities');
        console.log('   - http://localhost:5173/profile');

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

verifyFeature6();
