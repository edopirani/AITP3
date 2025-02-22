import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received request body:", body);

        if (!body || typeof body !== "object") {
            console.error("Invalid body received:", body);
            return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
        }

        const { name, googlePlaceId, googleType, structured_formatting, address_components } = body;

        if (!name || !googlePlaceId || !googleType) {
            console.error("Missing required fields:", { name, googlePlaceId, googleType });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Extract shortName
        const shortName = structured_formatting?.main_text || name.split(",")[0];

        // 🔹 Extract Admin Levels (Using Short Names)
        let adminLevel1 = null;
        let adminLevel2 = null;
        let adminLevel3 = null;
        let country = null;

        if (address_components) {
            address_components.forEach((component: any) => {
                if (component.types.includes("administrative_area_level_1")) {
                    adminLevel1 = component.short_name; // ✅ Save "RM" instead of "Città metropolitana di Roma Capitale"
                }
                if (component.types.includes("administrative_area_level_2")) {
                    adminLevel2 = component.short_name;
                }
                if (component.types.includes("administrative_area_level_3")) {
                    adminLevel3 = component.short_name;
                }
                if (component.types.includes("country")) {
                    country = component.short_name; // ✅ Save "IT" instead of "Italy"
                }
            });
        }

        console.log("Extracted Admin Levels (Short Names):", { adminLevel1, adminLevel2, adminLevel3, country });

        // 🔹 Step 1: Find Category Mapping (Fallback to "TBD" if missing)
        let categoryMapping = await prisma.locationCategoryMapping.findUnique({
            where: { googleType },
            include: { category: true }
        });

        if (!categoryMapping) {
            console.warn(`No category found for googleType: ${googleType}. Defaulting to TBD.`);

            categoryMapping = await prisma.locationCategoryMapping.findUnique({
                where: { googleType: "unknown" },
                include: { category: true }
            });

            if (!categoryMapping) {
                console.error("Fatal Error: 'TBD' category is missing from database.");
                return NextResponse.json({ error: "Missing 'TBD' category in database" }, { status: 500 });
            }
        }

        console.log("Final category used:", categoryMapping.category.name);

        // 🔹 Step 2: Save or Update Location
        const location = await prisma.location.upsert({
            where: { googlePlaceId },
            update: { name, shortName, adminLevel1, adminLevel2, adminLevel3, country },
            create: { 
                name,
                shortName,  
                googlePlaceId, 
                googleType, 
                categoryId: categoryMapping.category.id,
                adminLevel1,
                adminLevel2,
                adminLevel3,
                country
            },
        });

        console.log("Saved location:", location);

        return NextResponse.json({ location });

    } catch (error) {
        console.error("Error saving location:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
