import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Shared Prisma instance

export async function POST(req: NextRequest) {
    try {
        // Expecting tripId and selectedLocations in the request body
        const { tripId, selectedLocations } = await req.json();
        console.log("📌 Received Save Itinerary Request:", { tripId, selectedLocations });

        // Validate tripId
        if (!tripId) {
            return NextResponse.json({ error: "Missing tripId in request." }, { status: 400 });
        }

        // Validate locations
        if (!selectedLocations || !Array.isArray(selectedLocations) || selectedLocations.length === 0) {
            return NextResponse.json({ error: "No selected locations provided." }, { status: 400 });
        }

        // Array to store newly created ItineraryItems
        const newItineraryItems = [];

        // Process each selected location
        for (const location of selectedLocations) {
            try {
                // Make sure it has a googlePlaceId to match an existing Location
                const placeId = location.googleDetails?.googlePlaceId;
                if (!placeId) {
                    console.warn(`❌ No googlePlaceId found for location: ${location.name}`);
                    continue;
                }

                // 1) Find existing location in the DB (Location already saved)
                const existingLocation = await prisma.location.findUnique({
                    where: { googlePlaceId: placeId },
                    select: { id: true },
                });

                if (!existingLocation) {
                    console.warn(`❌ Location not found in DB for: ${location.name} (PlaceID: ${placeId})`);
                    // If it doesn't exist, skip or handle as you wish
                    continue;
                }

                // 2) Create a new ItineraryItem referencing the found Location & provided tripId
                //    (Assumes dayNumber, order, etc. are optional — use them if you have that data.)
                const itineraryItem = await prisma.itineraryItem.create({
                    data: {
                        tripId,
                        locationId: existingLocation.id,
                        // dayNumber: 1,   // Example: set dayNumber = 1
                        // order: 1,      // Example: set an order if you wish
                        // startTime: new Date(), // Example: set start time
                        // endTime: new Date(),   // Example: set end time
                    },
                });

                console.log(`✅ Created ItineraryItem for location: ${location.name}`);
                newItineraryItems.push(itineraryItem);

            } catch (err) {
                console.error(`❌ Error creating ItineraryItem for: ${location.name}`, err);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Itinerary items saved successfully!",
            itineraryItems: newItineraryItems,
        });

    } catch (error) {
        console.error("❌ Error in POST /itineraryItems:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}