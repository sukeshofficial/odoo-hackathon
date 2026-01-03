const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get trip budget breakdown
const getTripBudget = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId);

        if (!tripId) {
            return res.status(400).json({ error: 'Trip ID is required' });
        }

        // Fetch trip with all stops and activities
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                stops: {
                    orderBy: { sequence: 'asc' },
                    include: {
                        activities: true
                    }
                }
            }
        });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Initialize breakdown categories
        const breakdown = {
            transport: 0,
            stay: 0,
            activities: 0,
            meals: 0,
            other: 0
        };

        // Aggregate costs by activity type
        let totalActivitiesCost = 0;
        const stopBudgets = [];

        trip.stops.forEach(stop => {
            let stopTotalCost = 0;

            stop.activities.forEach(activity => {
                const cost = activity.cost || 0;
                totalActivitiesCost += cost;
                stopTotalCost += cost;

                // Categorize by activity type
                const type = (activity.type || 'other').toLowerCase();
                
                if (type.includes('transport') || type.includes('travel')) {
                    breakdown.transport += cost;
                } else if (type.includes('hotel') || type.includes('stay') || type.includes('accommodation')) {
                    breakdown.stay += cost;
                } else if (type.includes('food') || type.includes('restaurant') || type.includes('meal')) {
                    breakdown.meals += cost;
                } else if (type.includes('activity') || type.includes('tour') || type.includes('sightseeing') || 
                           type.includes('culture') || type.includes('entertainment') || type.includes('nature')) {
                    breakdown.activities += cost;
                } else {
                    breakdown.other += cost;
                }
            });

            stopBudgets.push({
                stopId: stop.id,
                cityName: stop.cityName,
                allocatedBudget: stop.budget || 0,
                actualCost: stopTotalCost,
                variance: (stop.budget || 0) - stopTotalCost,
                isOverBudget: stopTotalCost > (stop.budget || 0)
            });
        });

        // Calculate totals
        const totalBudgetAllocated = trip.budget || 0;
        const totalCost = totalActivitiesCost;
        const variance = totalBudgetAllocated - totalCost;

        // Calculate daily averages
        const startDate = new Date(trip.startDate);
        const endDate = trip.endDate ? new Date(trip.endDate) : new Date(trip.startDate);
        const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const dailyAverage = totalCost / durationDays;
        const dailyBudget = totalBudgetAllocated / durationDays;

        // Check for budget alerts
        const alerts = [];
        if (totalCost > totalBudgetAllocated) {
            alerts.push({
                type: 'danger',
                message: `Total cost exceeds budget by ${Math.abs(variance).toFixed(2)} ${trip.currency || 'USD'}`
            });
        }
        if (dailyAverage > dailyBudget) {
            alerts.push({
                type: 'warning',
                message: `Daily average (${dailyAverage.toFixed(2)}) exceeds daily budget (${dailyBudget.toFixed(2)})`
            });
        }

        // Check per-stop budget alerts
        stopBudgets.forEach(stop => {
            if (stop.isOverBudget) {
                alerts.push({
                    type: 'warning',
                    message: `${stop.cityName} exceeded budget by ${Math.abs(stop.variance).toFixed(2)}`
                });
            }
        });

        res.json({
            tripId: trip.id,
            tripTitle: trip.title,
            currency: trip.currency || 'USD',
            breakdown,
            stopBudgets,
            summary: {
                totalBudgetAllocated,
                totalCost,
                variance,
                isOverBudget: totalCost > totalBudgetAllocated,
                durationDays,
                dailyAverage,
                dailyBudget
            },
            alerts
        });

    } catch (error) {
        console.error('Get Trip Budget Error:', error);
        res.status(500).json({ error: 'Failed to fetch trip budget' });
    }
};

module.exports = { getTripBudget };
