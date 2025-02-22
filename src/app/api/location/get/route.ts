// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const googlePlaceId = searchParams.get("googlePlaceId");

//         if (!googlePlaceId) {
//             return NextResponse.json({ error: "Missing googlePlaceId" }, { status: 400 });
//         }

//         const location = await prisma.location.findUnique({
//             where: { googlePlaceId },
//             include: { category: true },
//         });

//         if (!location) {
//             return NextResponse.json({ error: "Location not found" }, { status: 404 });
//         }

//         return NextResponse.json({ 
//             id: location.id,
//             name: location.name,         // Full name (e.g., "Colosseum, Rome, Italy")
//             shortName: location.shortName, // Short name (e.g., "Colosseum")
//             googlePlaceId: location.googlePlaceId,
//             googleType: location.googleType,
//             category: location.category?.name || "Unknown",
//         });

//     } catch (error) {
//         console.error("Error fetching location:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
