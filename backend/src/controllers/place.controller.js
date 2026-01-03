const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simple in-memory cache fallback
const localCache = new Map();

const getTopRegions = async (req, res) => {
    try {
        const CACHE_KEY = 'top_regions';
        const CACHE_TTL = 12 * 60 * 60;

        if (localCache.has(CACHE_KEY)) {
            const { data, timestamp } = localCache.get(CACHE_KEY);
            if (Date.now() - timestamp < CACHE_TTL * 1000) {
                return res.json(data);
            }
        }

        const regions = await prisma.place.groupBy({
            by: ['region'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                }
            },
            take: 9,
        });

        const enrichedRegions = await Promise.all(regions.map(async (r) => {
            const samplePlace = await prisma.place.findFirst({
                where: { region: r.region },
                select: { imageUrl: true }
            });
            return {
                name: r.region,
                placeCount: r._count.id,
                imageUrl: samplePlace?.imageUrl || 'https://via.placeholder.com/300?text=Region'
            };
        }));

        localCache.set(CACHE_KEY, { data: enrichedRegions, timestamp: Date.now() });

        res.json(enrichedRegions);

    } catch (error) {
        console.error('Get Top Regions Error:', error);
        res.status(500).json({ error: 'Failed to fetch top regions' });
    }
};

module.exports = { getTopRegions };
