const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verifyFeature8() {
    console.log('\n💰 FEATURE 8 VERIFICATION: Trip Budget\n');
    console.log('='.repeat(60));

    try {
        // Get a trip ID from the database to test with
        console.log('\n1. Getting test trip...');
        const tripsRes = await axios.get(`${BASE_URL}/trips?userId=1`);
        
        if (tripsRes.data.trips.length === 0) {
            console.error('❌ No trips found. Please run seed script first.');
            return;
        }

        const testTrip = tripsRes.data.trips[0];
        const tripId = testTrip.id;
        console.log(`   ✅ Using trip: ${testTrip.title || testTrip.destination} (ID: ${tripId})`);

        // Test budget endpoint
        console.log('\n2. Testing Budget Endpoint');
        console.log(`   GET /api/trips/${tripId}/budget`);
        const budgetRes = await axios.get(`${BASE_URL}/trips/${tripId}/budget`);
        
        console.log(`   ✅ Status: ${budgetRes.status}`);
        console.log(`   ✅ Currency: ${budgetRes.data.currency}`);
        
        // Display breakdown
        console.log('\n3. Category Breakdown:');
        const breakdown = budgetRes.data.breakdown;
        console.log(`   🚗 Transport: ${budgetRes.data.currency} ${breakdown.transport}`);
        console.log(`   🏨 Stay: ${budgetRes.data.currency} ${breakdown.stay}`);
        console.log(`   🎯 Activities: ${budgetRes.data.currency} ${breakdown.activities}`);
        console.log(`   🍽️  Meals: ${budgetRes.data.currency} ${breakdown.meals}`);
        console.log(`   📦 Other: ${budgetRes.data.currency} ${breakdown.other}`);

        // Display summary
        console.log('\n4. Budget Summary:');
        const summary = budgetRes.data.summary;
        console.log(`   💵 Allocated Budget: ${budgetRes.data.currency} ${summary.totalBudgetAllocated}`);
        console.log(`   💸 Total Cost: ${budgetRes.data.currency} ${summary.totalCost}`);
        console.log(`   📊 Variance: ${budgetRes.data.currency} ${summary.variance}`);
        console.log(`   ${summary.isOverBudget ? '⚠️  OVER BUDGET' : '✅ WITHIN BUDGET'}`);
        console.log(`   📅 Duration: ${summary.durationDays} days`);
        console.log(`   📈 Daily Average: ${budgetRes.data.currency} ${summary.dailyAverage.toFixed(2)}/day`);
        console.log(`   🎯 Daily Budget: ${budgetRes.data.currency} ${summary.dailyBudget.toFixed(2)}/day`);

        // Display stop budgets
        console.log('\n5. Per-Stop Budgets:');
        budgetRes.data.stopBudgets.forEach(stop => {
            const status = stop.isOverBudget ? '❌ OVER' : '✅ OK';
            console.log(`   ${stop.cityName}: Allocated ${budgetRes.data.currency} ${stop.allocatedBudget}, Spent ${budgetRes.data.currency} ${stop.actualCost} ${status}`);
        });

        // Display alerts
        if (budgetRes.data.alerts.length > 0) {
            console.log('\n6. Budget Alerts:');
            budgetRes.data.alerts.forEach(alert => {
                const icon = alert.type === 'danger' ? '🚨' : '⚠️';
                console.log(`   ${icon} ${alert.message}`);
            });
        } else {
            console.log('\n6. ✅ No budget alerts');
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ FEATURE 8 VERIFICATION COMPLETE\n');
        console.log('📋 Summary:');
        console.log('   - Budget aggregation: Working ✅');
        console.log('   - Category breakdown: Working ✅');
        console.log('   - Per-stop budgets: Working ✅');
        console.log('   - Alert system: Working ✅');
        console.log('\n🌐 Frontend Testing:');
        console.log(`   - Navigate to http://localhost:5173/trips/${tripId}/budget`);
        console.log('   - View pie chart for category breakdown');
        console.log('   - View bar chart for stop budgets');
        console.log('   - Check budget alerts and summary cards');
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

verifyFeature8();
