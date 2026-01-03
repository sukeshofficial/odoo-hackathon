const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Search activities (this could be extended to search external APIs or a local activity database)
const searchActivities = async (req, res) => {
    try {
        const { q, type, stopId } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query (q) is required' });
        }

        // For now, search existing activities in the database
        const activities = await prisma.activity.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { type: { contains: q, mode: 'insensitive' } }
                ],
                ...(type && { type: type }),
                ...(stopId && { stopId: parseInt(stopId) })
            },
            include: {
                stop: {
                    select: {
                        cityName: true,
                        tripId: true
                    }
                }
            },
            take: 20
        });

        // Mock some additional activities if search is empty
        let results = activities;
        if (activities.length === 0) {
            results = [
                {
                    id: 'mock-1',
                    name: `${q} Museum Tour`,
                    type: 'culture',
                    cost: 25,
                    durationHours: 2,
                    description: 'Explore local history and culture'
                },
                {
                    id: 'mock-2',
                    name: `${q} Food Tour`,
                    type: 'food',
                    cost: 45,
                    durationHours: 3,
                    description: 'Taste authentic local cuisine'
                },
                {
                    id: 'mock-3',
                    name: `${q} Walking Tour`,
                    type: 'sightseeing',
                    cost: 15,
                    durationHours: 2,
                    description: 'Discover hidden gems'
                }
            ];
        }

        res.json(results);

    } catch (error) {
        console.error('Search Activities Error:', error);
        res.status(500).json({ error: 'Failed to search activities' });
    }
};

// Add activity to a stop
const addActivityToStop = async (req, res) => {
    try {
        const stopId = parseInt(req.params.stopId);
        const { name, type, cost, durationHours, startDatetime } = req.body;

        if (!stopId || !name) {
            return res.status(400).json({ error: 'stopId and name are required' });
        }

        // Verify stop exists
        const stop = await prisma.stop.findUnique({
            where: { id: stopId }
        });

        if (!stop) {
            return res.status(404).json({ error: 'Stop not found' });
        }

        // Create activity
        const activity = await prisma.activity.create({
            data: {
                stopId: stopId,
                name: name,
                type: type || 'general',
                cost: cost ? parseFloat(cost) : null,
                durationHours: durationHours ? parseFloat(durationHours) : null,
                startDatetime: startDatetime ? new Date(startDatetime) : new Date(stop.startDate)
            }
        });

        res.status(201).json(activity);

    } catch (error) {
        console.error('Add Activity Error:', error);
        res.status(500).json({ error: 'Failed to add activity' });
    }
};

// Get activities for a specific stop
const getStopActivities = async (req, res) => {
    try {
        const stopId = parseInt(req.params.stopId);

        const activities = await prisma.activity.findMany({
            where: { stopId: stopId },
            orderBy: { startDatetime: 'asc' }
        });

        res.json(activities);

    } catch (error) {
        console.error('Get Stop Activities Error:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
};

module.exports = { searchActivities, addActivityToStop, getStopActivities };
