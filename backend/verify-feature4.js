const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testFeature4() {
    try {
        console.log('=== Feature 4: Itinerary Builder ===\n');

        console.log('--- 1. Get Trip with Stops ---');
        const tripRes = await axios.get(`${BASE_URL}/trips/1`);
        const trip = tripRes.data;
        console.log(`Trip: ${trip.title || trip.destination}`);
        console.log(`Stops: ${trip.stops.length}`);

        if (trip.stops.length === 0) {
            console.log('No stops found. Creating test stops...');
            await axios.post(`${BASE_URL}/trips/1/stops`, {
                cityName: 'Paris',
                sequence: 1,
                startDate: '2026-06-01',
                endDate: '2026-06-03'
            });
            await axios.post(`${BASE_URL}/trips/1/stops`, {
                cityName: 'London',
                sequence: 2,
                startDate: '2026-06-04',
                endDate: '2026-06-06'
            });
        }

        console.log('\n--- 2. Update Stop Budgets ---');
        const updatedTrip = await axios.get(`${BASE_URL}/trips/1`);
        const stop1 = updatedTrip.data.stops[0];
        const stop2 = updatedTrip.data.stops[1];

        await axios.patch(`${BASE_URL}/stops/${stop1.id}/budget`, { budget: 500 });
        await axios.patch(`${BASE_URL}/stops/${stop2.id}/budget`, { budget: 700 });
        console.log('Budgets updated: $500 and $700');

        console.log('\n--- 3. Get Trip Totals ---');
        const totalsRes = await axios.get(`${BASE_URL}/trips/1/totals`);
        console.log('Totals:', totalsRes.data);
        console.log(`Total Budget: $${totalsRes.data.totalBudget}`);
        console.log(`Total Days: ${totalsRes.data.totalDays}`);

        console.log('\n--- 4. Reorder Stops ---');
        const stopIds = [stop2.id, stop1.id]; // Reverse order
        await axios.patch(`${BASE_URL}/trips/1/reorder-stops`, { stopIds });
        console.log('Stops reordered (reversed)');

        console.log('\n--- 5. Verify New Order ---');
        const verifyRes = await axios.get(`${BASE_URL}/trips/1`);
        const reorderedStops = verifyRes.data.stops;
        console.log('New order:');
        reorderedStops.forEach(s => console.log(`  Sequence ${s.sequence}: ${s.cityName}`));

        if (reorderedStops[0].sequence === 1 && reorderedStops[0].id === stop2.id) {
            console.log('\n✅ SUCCESS: All tests passed!');
        } else {
            console.error('\n❌ FAILURE: Reordering did not work correctly');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testFeature4();
