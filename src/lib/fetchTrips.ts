import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchTrips(username: string) {
    console.log("🔍 Fetching trips for username:", username);

    const trips = await prisma.trip.findMany({
        where: { tripProfiles: { some: { profile: { user: { username } } } } },
        include: {
            tripProfiles: { include: { profile: true } },
            locations: true,
            budget: true,
            type: true,
        },
    });

    console.log("📊 Retrieved trips:", trips);

    if (!trips || trips.length === 0) {
        console.log("❌ No trips found for user:", username);
        return null;
    }

    return trips;
}