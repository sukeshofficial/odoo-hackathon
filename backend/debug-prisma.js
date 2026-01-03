const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Connecting to Prisma...');
        const users = await prisma.user.findMany();
        console.log('Users:', users);
        
        const trips = await prisma.trip.findMany();
        console.log('Trips:', trips);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
