const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserCalendar = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { from, to } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Build date filter
        const dateFilter = {};
        if (from) {
            dateFilter.startDate = { gte: new Date(from) };
        }
        if (to) {
            // Checks if trip starts before 'to' date, effectively overlapping or starting within range
            // But for simplicity, let's just check startDate <= to
             if (dateFilter.startDate) {
                dateFilter.startDate.lte = new Date(to);
             } else {
                 dateFilter.startDate = { lte: new Date(to) };
             }
        }

        // Fetch user trips
        const trips = await prisma.trip.findMany({
            where: {
                userId: userId,
                ...dateFilter
            },
            select: {
                id: true,
                title: true,
                destination: true,
                startDate: true,
                endDate: true,
                budget: true
            }
        });

        // Format for calendar (e.g., FullCalendar or React Big Calendar)
        const calendarEvents = trips.map(trip => ({
            id: trip.id,
            title: trip.title || `Trip to ${trip.destination}`,
            start: trip.startDate,
            end: trip.endDate || trip.startDate, // Handle single-day trips
            allDay: true,
            resource: {
                destination: trip.destination,
                budget: trip.budget
            }
        }));

        res.json(calendarEvents);

    } catch (error) {
        console.error('Get User Calendar Error:', error);
        res.status(500).json({ error: 'Failed to fetch user calendar' });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                city: true,
                country: true,
                additional_info: true,
                profile_photo: true,
                created_at: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { firstName, lastName, phone, city, country, additionalInfo } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Build update data
        const updateData = {};
        if (firstName) updateData.first_name = firstName;
        if (lastName) updateData.last_name = lastName;
        if (phone) updateData.phone = phone;
        if (city) updateData.city = city;
        if (country) updateData.country = country;
        if (additionalInfo !== undefined) updateData.additional_info = additionalInfo;

        // Handle profile photo if uploaded
        if (req.file) {
            updateData.profile_photo = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                city: true,
                country: true,
                additional_info: true,
                profile_photo: true
            }
        });

        res.json(updatedUser);

    } catch (error) {
        console.error('Update User Profile Error:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

module.exports = { getUserCalendar, getUserProfile, updateUserProfile };
