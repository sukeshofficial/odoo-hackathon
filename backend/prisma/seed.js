const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create a user if not exists (for assigning trips)
    let user = await prisma.user.findFirst({ where: { email: 'demo@example.com' } });
    if (!user) {
        // Only create if we can run hash, but since we don't have bcrypt imported here and to avoid dep issues,
        // we'll skip user creation or assume one exists/create simple. 
        // Ideally we should import bcrypt.
        // For now, let's look for ANY user or create a dummy one with a fake hash.
        user = await prisma.user.create({
            data: {
                first_name: 'Demo',
                last_name: 'User',
                email: 'demo@example.com',
                phone: '1234567890',
                city: 'Metropolis',
                country: 'World',
                password_hash: '$2b$10$EpOntpw.0.X/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1', // Dummy hash
            }
        });
    }

    // Seed Places (Recommended)
    const places = [
        {
            name: 'Eiffel Tower',
            region: 'Paris',
            country: 'France',
            description: 'The Iron Lady.',
            rating: 4.8,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg'
        },
        {
            name: 'Colosseum',
            region: 'Rome',
            country: 'Italy',
            description: 'Gladiatorial arena.',
            rating: 4.7,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg'
        },
        {
            name: 'Statue of Liberty',
            region: 'New York',
            country: 'USA',
            description: 'Symbol of freedom.',
            rating: 4.6,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/800px-Statue_of_Liberty_7.jpg'
        },
        {
            name: 'Taj Mahal',
            region: 'Agra',
            country: 'India',
            description: 'Mausoleum of love.',
            rating: 4.9,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg'
        },
        {
            name: 'Machu Picchu',
            region: 'Cusco',
            country: 'Peru',
            description: 'Lost city of Incas.',
            rating: 4.9,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/800px-Machu_Picchu%2C_Peru.jpg'
        }
    ];

    for (const p of places) {
        await prisma.place.create({
            data: p
        });
    }

    // Seed Trips for the user with stops and activities
    console.log('Creating trips with stops and activities...');
    
    // Trip 1: Paris (Upcoming)
    const parisTrip = await prisma.trip.create({
        data: {
            userId: user.id,
            destination: 'Paris, France',
            title: 'European Adventure',
            description: 'Exploring the city of lights',
            startDate: new Date('2026-05-01'),
            endDate: new Date('2026-05-10'),
            budget: 2500,
            currency: 'EUR'
        }
    });

    await prisma.stop.create({
        data: {
            tripId: parisTrip.id,
            cityName: 'Paris',
            sequence: 1,
            startDate: new Date('2026-05-01'),
            endDate: new Date('2026-05-05'),
            budget: 1200,
            activities: {
                create: [
                    {
                        name: 'Eiffel Tower Visit',
                        startDatetime: new Date('2026-05-02T10:00:00'),
                        durationHours: 3,
                        cost: 25,
                        type: 'sightseeing'
                    },
                    {
                        name: 'Louvre Museum',
                        startDatetime: new Date('2026-05-03T14:00:00'),
                        durationHours: 4,
                        cost: 17,
                        type: 'culture'
                    }
                ]
            }
        }
    });

    await prisma.stop.create({
        data: {
            tripId: parisTrip.id,
            cityName: 'Versailles',
            sequence: 2,
            startDate: new Date('2026-05-06'),
            endDate: new Date('2026-05-10'),
            budget: 1300,
            activities: {
                create: [
                    {
                        name: 'Palace of Versailles Tour',
                        startDatetime: new Date('2026-05-06T09:00:00'),
                        durationHours: 5,
                        cost: 28,
                        type: 'culture'
                    }
                ]
            }
        }
    });

    // Trip 2: Tokyo (Ongoing - adjust dates to be current)
    const tokyoTrip = await prisma.trip.create({
        data: {
            userId: user.id,
            destination: 'Tokyo, Japan',
            title: 'Japan Discovery',
            description: 'Amazing culture and food',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-01-15'),
            budget: 4000,
            currency: 'JPY'
        }
    });

    await prisma.stop.create({
        data: {
            tripId: tokyoTrip.id,
            cityName: 'Tokyo',
            sequence: 1,
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-01-10'),
            budget: 2500,
            activities: {
                create: [
                    {
                        name: 'Sensoji Temple',
                        startDatetime: new Date('2026-01-02T10:00:00'),
                        durationHours: 2,
                        cost: 0,
                        type: 'culture'
                    },
                    {
                        name: 'Sushi Making Class',
                        startDatetime: new Date('2026-01-03T15:00:00'),
                        durationHours: 3,
                        cost: 85,
                        type: 'food'
                    }
                ]
            }
        }
    });

    await prisma.stop.create({
        data: {
            tripId: tokyoTrip.id,
            cityName: 'Kyoto',
            sequence: 2,
            startDate: new Date('2026-01-11'),
            endDate: new Date('2026-01-15'),
            budget: 1500,
            activities: {
                create: [
                    {
                        name: 'Bamboo Forest Walk',
                        startDatetime: new Date('2026-01-12T08:00:00'),
                        durationHours: 2,
                        cost: 0,
                        type: 'nature'
                    }
                ]
            }
        }
    });

    // Trip 3: New York (Completed)
    const nyTrip = await prisma.trip.create({
        data: {
            userId: user.id,
            destination: 'New York, USA',
            title: 'Big Apple Tour',
            description: 'The city that never sleeps',
            startDate: new Date('2025-12-01'),
            endDate: new Date('2025-12-08'),
            budget: 3000,
            currency: 'USD'
        }
    });

    await prisma.stop.create({
        data: {
            tripId: nyTrip.id,
            cityName: 'Manhattan',
            sequence: 1,
            startDate: new Date('2025-12-01'),
            endDate: new Date('2025-12-08'),
            budget: 3000,
            activities: {
                create: [
                    {
                        name: 'Statue of Liberty',
                        startDatetime: new Date('2025-12-02T09:00:00'),
                        durationHours: 4,
                        cost: 23,
                        type: 'sightseeing'
                    },
                    {
                        name: 'Broadway Show',
                        startDatetime: new Date('2025-12-03T19:00:00'),
                        durationHours: 2.5,
                        cost: 150,
                        type: 'entertainment'
                    },
                    {
                        name: 'Central Park Walk',
                        startDatetime: new Date('2025-12-04T14:00:00'),
                        durationHours: 2,
                        cost: 0,
                        type: 'nature'
                    }
                ]
            }
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
