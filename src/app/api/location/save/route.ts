import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Log the received request body to debug issues
        console.log("Received request body:", body);

        if (!body || typeof body !== "object") {
            console.error("Invalid body received:", body);
            return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
        }

        const { name, googlePlaceId, googleType, structured_formatting } = body;

        if (!name || !googlePlaceId || !googleType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Extract shortName correctly
        const shortName = structured_formatting?.main_text || name.split(",")[0];

        console.log("Extracted shortName:", shortName);

        // Validate Prisma Client
        if (!prisma.locationCategoryMapping) {
            throw new Error("Prisma Client not recognizing 'locationCategoryMapping'");
        }

        // Find the correct category ID based on googleType
        const categoryMapping = await prisma.locationCategoryMapping.findUnique({
            where: { googleType },
            include: { category: true }
        });

        if (!categoryMapping) {
            console.error("No category found for googleType:", googleType);
            return NextResponse.json({ error: `No category found for type: ${googleType}` }, { status: 400 });
        }

        console.log("Found category:", categoryMapping.category);

        // Save or update the location
        const location = await prisma.location.upsert({
            where: { googlePlaceId },
            update: { name, shortName },
            create: { 
                name,
                shortName,  
                googlePlaceId, 
                googleType, 
                categoryId: categoryMapping.category.id
            },
        });

        console.log("Saved location:", location);

        return NextResponse.json({ location });

    } catch (error) {
        console.error("Error saving location:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
