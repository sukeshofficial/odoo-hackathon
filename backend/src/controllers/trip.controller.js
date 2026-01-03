const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getTripSummary = async (req, res) => {
    try {
        const userId = Number(req.query.userId);

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Fetch recent trips (limit 3)
        const recentTrips = await prisma.trip.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });

        // Fetch recommended places (limit 5)
        const recommendedPlaces = await prisma.place.findMany({
            take: 5,
            orderBy: { rating: 'desc' },
        });

        // Budget highlights
        const totalBudget = recentTrips.reduce((acc, trip) => acc + (trip.budget || 0), 0);

        res.json({
            recentTrips,
            recommendedPlaces,
            budgetStats: {
                totalAllocated: totalBudget,
                tripCount: recentTrips.length
            }
        });

    } catch (error) {
        console.error('Get Trip Summary Error:', error);
        res.status(500).json({ error: 'Failed to fetch trip summary' });
    }
};

// Get User Trips with Status and Pagination (Feature 3)
const getUserTrips = async (req, res) => {
    try {
        const { userId } = req.query;
        const status = req.query.status; // ongoing, upcoming, completed, or undefined (all)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Fetch all trips for user
        const allTrips = await prisma.trip.findMany({
            where: { userId: Number(userId) },
            include: {
                stops: {
                    orderBy: { sequence: 'asc' }
                }
            },
            orderBy: { startDate: 'desc' }
        });

        // Derive status for each trip
        const now = new Date();
        const tripsWithStatus = allTrips.map(trip => {
            const start = new Date(trip.startDate);
            const end = trip.endDate ? new Date(trip.endDate) : start;

            let tripStatus;
            if (now < start) {
                tripStatus = 'upcoming';
            } else if (now > end) {
                tripStatus = 'completed';
            } else {
                tripStatus = 'ongoing';
            }

            return { ...trip, status: tripStatus };
        });

        // Filter by status if provided
        let filteredTrips = tripsWithStatus;
        if (status && ['ongoing', 'upcoming', 'completed'].includes(status)) {
            filteredTrips = tripsWithStatus.filter(t => t.status === status);
        }

        // Pagination
        const total = filteredTrips.length;
        const paginatedTrips = filteredTrips.slice(skip, skip + limit);

        res.json({
            trips: paginatedTrips,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get User Trips Error:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

// Feature 5 - Itinerary View (Day-wise grouping)
const getTripItinerary = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId);
        const { view } = req.query; // e.g., 'daywise'

        if (!tripId) {
            return res.status(400).json({ error: 'Trip ID is required' });
        }

        // Fetch Trip with stops and activities
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
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

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (view === 'daywise') {
            // Group by Day
            const daysMap = new Map();
            
            // Helper to get date string YYYY-MM-DD
            const getDateStr = (date) => date.toISOString().split('T')[0];

            // Initialize days from trip start to end (optional, but good for empty days)
            let currentDate = new Date(trip.startDate);
            const endDate = trip.endDate ? new Date(trip.endDate) : new Date(trip.startDate);
            
            // Limit loop to avoid infinite loop if dates are wrong
            const maxDays = 60; 
            let dayCount = 0;

            while (currentDate <= endDate && dayCount < maxDays) {
                const dateStr = getDateStr(currentDate);
                daysMap.set(dateStr, {
                    date: dateStr,
                    dayNumber: dayCount + 1,
                    stops: [],
                    activities: [],
                    totalCost: 0
                });
                currentDate.setDate(currentDate.getDate() + 1);
                dayCount++;
            }

            // Populate activities/stops
            trip.stops.forEach(stop => {
                const stopDateStr = getDateStr(new Date(stop.startDate));
                 // Note: Stops span ranges, but for itinerary view we might want to list them on start day
                 // or replicate. For now, let's attach to start day.
                 if (daysMap.has(stopDateStr)) {
                     daysMap.get(stopDateStr).stops.push({
                         id: stop.id,
                         cityName: stop.cityName,
                         budget: stop.budget
                     });
                 }

                 stop.activities.forEach(activity => {
                     const actDateStr = getDateStr(new Date(activity.startDatetime));
                     if (daysMap.has(actDateStr)) {
                         const dayEntry = daysMap.get(actDateStr);
                         dayEntry.activities.push({
                             id: activity.id,
                             name: activity.name,
                             time: new Date(activity.startDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                             cost: activity.cost || 0,
                             type: activity.type
                         });
                         dayEntry.totalCost += (activity.cost || 0);
                     }
                 });
            });

            return res.json({
                tripId: trip.id,
                title: trip.title,
                days: Array.from(daysMap.values())
            });
        }

        // Default: return raw trip data
        res.json(trip);

    } catch (error) {
        console.error('Get Trip Itinerary Error:', error);
        res.status(500).json({ error: 'Failed to fetch itinerary' });
    }
};

module.exports = { getTripSummary, getUserTrips, getTripItinerary };
