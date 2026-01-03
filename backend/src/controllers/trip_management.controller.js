const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create Trip
const createTrip = async (req, res) => {
    try {
        const { title, description, startDate, endDate, currency, destination, userId } = req.body;

        // Basic validation
        if (!destination || !startDate || !userId) {
            return res.status(400).json({ error: 'Missing required fields: destination, startDate, userId' });
        }

        const trip = await prisma.trip.create({
            data: {
                userId: Number(userId),
                title,
                description,
                destination,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                currency: currency || 'USD'
            }
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error('Create Trip Error:', error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
};

// Add Stop
const addStop = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { cityName, sequence, startDate, endDate } = req.body;

        const stop = await prisma.stop.create({
            data: {
                tripId: Number(tripId),
                cityName,
                sequence: Number(sequence) || 1,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
        });

        res.status(201).json(stop);
    } catch (error) {
        console.error('Add Stop Error:', error);
        res.status(500).json({ error: 'Failed to add stop' });
    }
};

// Add Activity
const addActivity = async (req, res) => {
    try {
        const { stopId } = req.params;
        const { name, startDatetime, durationHours, cost, type } = req.body;

        const activity = await prisma.activity.create({
            data: {
                stopId: Number(stopId),
                name,
                startDatetime: new Date(startDatetime),
                durationHours: Number(durationHours),
                cost: Number(cost),
                type
            }
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('Add Activity Error:', error);
        res.status(500).json({ error: 'Failed to add activity' });
    }
};

// Get Trip Details (Hooks to existing trip routes potentially, or new one)
// Feature says GET /api/trips/:tripId returns trip, stops, activities
const getTripDetails = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await prisma.trip.findUnique({
            where: { id: Number(tripId) },
            include: {
                stops: {
                    orderBy: { sequence: 'asc' },
                    include: {
                        activities: {
                            orderBy: { startDatetime: 'asc' }
                        }
                    }
                }
            }
        });

        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        res.json(trip);
    } catch (error) {
        console.error('Get Trip Details Error:', error);
        res.status(500).json({ error: 'Failed to fetch trip details' });
    }
};

// Reorder Stops (Feature 4)
const reorderStops = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { stopIds } = req.body; // Array of stop IDs in desired order

        if (!stopIds || !Array.isArray(stopIds)) {
            return res.status(400).json({ error: 'stopIds array is required' });
        }

        // Update sequence for each stop
        const updatePromises = stopIds.map((stopId, index) =>
            prisma.stop.update({
                where: { id: Number(stopId) },
                data: { sequence: index + 1 }
            })
        );

        await Promise.all(updatePromises);

        res.json({ message: 'Stops reordered successfully' });
    } catch (error) {
        console.error('Reorder Stops Error:', error);
        res.status(500).json({ error: 'Failed to reorder stops' });
    }
};

// Get Trip Totals (Feature 4)
const getTripTotals = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await prisma.trip.findUnique({
            where: { id: Number(tripId) },
            include: {
                stops: {
                    include: {
                        activities: true
                    }
                }
            }
        });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Calculate totals
        const totalBudget = trip.stops.reduce((sum, stop) => sum + (stop.budget || 0), 0);
        const totalActivityCost = trip.stops.reduce((sum, stop) => {
            const stopActivityCost = stop.activities.reduce((aSum, activity) => aSum + (activity.cost || 0), 0);
            return sum + stopActivityCost;
        }, 0);

        const totalDays = trip.stops.reduce((sum, stop) => {
            const start = new Date(stop.startDate);
            const end = new Date(stop.endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            return sum + days;
        }, 0);

        res.json({
            totalBudget,
            totalActivityCost,
            totalDays,
            stopCount: trip.stops.length
        });
    } catch (error) {
        console.error('Get Trip Totals Error:', error);
        res.status(500).json({ error: 'Failed to fetch trip totals' });
    }
};

// Update Stop Budget (Feature 4)
const updateStopBudget = async (req, res) => {
    try {
        const { stopId } = req.params;
        const { budget } = req.body;

        const stop = await prisma.stop.update({
            where: { id: Number(stopId) },
            data: { budget: budget ? Number(budget) : null }
        });

        res.json(stop);
    } catch (error) {
        console.error('Update Stop Budget Error:', error);
        res.status(500).json({ error: 'Failed to update stop budget' });
    }
};

module.exports = {
    createTrip,
    addStop,
    addActivity,
    getTripDetails,
    reorderStops,
    getTripTotals,
    updateStopBudget
};
