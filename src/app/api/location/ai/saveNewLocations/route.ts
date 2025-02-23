import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ Import the shared Prisma instance

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📌 Raw Request Body:", body);

        if (!body || !body.locations || !Array.isArray(body.locations)) {
            console.error("❌ Invalid locations data received:", body);
            return NextResponse.json({ error: "Invalid locations data" }, { status: 400 });
        }

        const locations = body.locations;
        console.log("✅ Received Locations:", locations);

        const savedLocations = [];

        for (const location of locations) {
            try {
                console.log(`📌 Processing Location: ${location.name}`);

                const { googleDetails } = location;
                if (!googleDetails) {
                    console.error(`❌ Missing googleDetails for location: ${location.name}`);
                    continue;
                }

                const { googlePlaceId, googleType, adminLevel1, adminLevel2, adminLevel3, country } = googleDetails;
                if (!googlePlaceId) {
                    console.error(`❌ Missing googlePlaceId for location: ${location.name}`);
                    continue;
                }

                console.log("🔍 Google Details:", googleDetails);

                // ✅ Step 1: Find Category Mapping (Fallback to "TBD" if missing)
                let categoryMapping = await prisma.locationCategoryMapping.findUnique({
                    where: { googleType },
                    include: { category: true }
                });

                if (!categoryMapping) {
                    console.warn(`⚠️ No category found for googleType: ${googleType}. Defaulting to TBD.`);

                    categoryMapping = await prisma.locationCategoryMapping.findUnique({
                        where: { googleType: "unknown" },
                        include: { category: true }
                    });

                    if (!categoryMapping) {
                        console.error("❌ Fatal Error: 'TBD' category is missing from database.");
                        return NextResponse.json({ error: "Missing 'TBD' category in database" }, { status: 500 });
                    }
                }

                console.log("📌 Final category used:", categoryMapping.category.name);

                // ✅ Step 2: Save or Update Location
                const savedLocation = await prisma.location.upsert({
                    where: { googlePlaceId },
                    update: {
                        name: location.name,
                        shortName: googleDetails.name,
                        adminLevel1: adminLevel1 || null,
                        adminLevel2: adminLevel2 || null,
                        adminLevel3: adminLevel3 || null,
                        country: country || null,
                        categoryId: categoryMapping.category.id,
                    },
                    create: {
                        name: location.name,
                        shortName: googleDetails.name,
                        googlePlaceId,
                        googleType,
                        adminLevel1: adminLevel1 || null,
                        adminLevel2: adminLevel2 || null,
                        adminLevel3: adminLevel3 || null,
                        country: country || null,
                        categoryId: categoryMapping.category.id,
                    },
                });

                console.log(`✅ Successfully saved location: ${savedLocation.name}`);
                savedLocations.push(savedLocation);

            } catch (error) {
                console.error(`❌ Error saving location ${location.name}:`, error);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Locations saved successfully!",
            savedLocations,
        });

    } catch (error) {
        console.error("❌ Error saving new locations:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}