import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { username, selectedLocations } = await req.json();

        if (!username || !selectedLocations || selectedLocations.length === 0) {
            return NextResponse.json({ error: "Username and selected locations are required" }, { status: 400 });
        }

        // 🔍 Fetch user's trip (assuming each user has one active trip)
        const trip = await prisma.trip.findFirst({
            where: { tripProfiles: { some: { profile: { user: { username } } } } },
        });

        if (!trip) {
            return NextResponse.json({ error: "No active trip found for the user" }, { status: 404 });
        }

        // ❌ Delete previous itinerary items for this trip
        await prisma.itineraryItem.deleteMany({
            where: { tripId: trip.id },
        });

        // 🔍 Fetch location IDs for the selected destinations
        const locations = await prisma.location.findMany({
            where: { name: { in: selectedLocations } },
        });

        if (!locations || locations.length === 0) {
            return NextResponse.json({ error: "No matching locations found in the database" }, { status: 404 });
        }

        // 📝 Insert new itinerary items
        const itineraryItems = locations.map((location, index) => ({
            tripId: trip.id,
            locationId: location.id,
            dayNumber: index + 1, // ✅ Assign days sequentially for now
            order: 1, // Default order (can be adjusted later)
            startTime: null,
            endTime: null,
        }));

        await prisma.itineraryItem.createMany({ data: itineraryItems });

        return NextResponse.json({ success: true, message: "Itinerary saved successfully!" });

    } catch (error) {
        console.error("❌ Error saving itinerary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}