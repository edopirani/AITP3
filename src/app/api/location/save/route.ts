import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, googlePlaceId, googleType } = body;

        if (!name || !googlePlaceId || !googleType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Log received data for debugging
        console.log("Received data:", { name, googlePlaceId, googleType });

        // Ensure Prisma Client is correctly initialized
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

        // Log the found category
        console.log("Found category:", categoryMapping.category);

        // Save or update the location with the correct categoryId
        const location = await prisma.location.upsert({
            where: { googlePlaceId },
            update: { name },  // Ensuring update works correctly
            create: { 
                name, 
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
