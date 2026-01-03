const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testFeature2() {
    try {
        console.log('--- 1. Create Trip ---');
        const tripRes = await axios.post(`${BASE_URL}/trips`, {
            title: 'Backend Test Trip',
            description: 'Testing via script',
            destination: 'London',
            startDate: '2025-08-01',
            userId: 1
        });
        const trip = tripRes.data;
        console.log('Trip Created:', trip.id, trip.title);

        console.log('--- 2. Add Stop ---');
        const stopRes = await axios.post(`${BASE_URL}/trips/${trip.id}/stops`, {
            cityName: 'London',
            sequence: 1,
            startDate: '2025-08-01',
            endDate: '2025-08-05'
        });
        const stop = stopRes.data;
        console.log('Stop Created:', stop.id, stop.cityName);

        console.log('--- 3. Add Activity ---');
        const actRes = await axios.post(`${BASE_URL}/stops/${stop.id}/activities`, {
            name: 'London Eye',
            startDatetime: '2025-08-02T10:00:00Z',
            durationHours: 1.5,
            cost: 40,
            type: 'sightseeing'
        });
        const activity = actRes.data;
        console.log('Activity Created:', activity.id, activity.name);

        console.log('--- 4. Validate Trip Hierarchy ---');
        const fullTripRes = await axios.get(`${BASE_URL}/trips/${trip.id}`);
        const fullTrip = fullTripRes.data;

        if (fullTrip.stops.length === 1 && fullTrip.stops[0].activities.length === 1) {
            console.log('SUCCESS: Trip contains correct stops and activities.');
        } else {
            console.error('FAILURE: Trip structure verification failed.');
            console.log(JSON.stringify(fullTrip, null, 2));
            process.exit(1);
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testFeature2();
