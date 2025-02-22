import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ error: "Query must be at least 2 characters long" }, { status: 400 });
        }

        // 🔹 Step 1: Get autocomplete suggestions
        const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`;
        const googleResponse = await fetch(googleUrl);
        const googleData = await googleResponse.json();

        if (!googleData.predictions || googleData.predictions.length === 0) {
            return NextResponse.json({ error: "No locations found" }, { status: 404 });
        }

        // 🔹 Step 2: Get full details for the first result
        const firstPlaceId = googleData.predictions[0].place_id;
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${firstPlaceId}&key=${GOOGLE_PLACES_API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (!detailsData.result) {
            return NextResponse.json({ error: "No details found for place_id" }, { status: 404 });
        }

        // 🔹 Step 3: Extract proper location type
        const googleType = detailsData.result.types.find((type: string) =>
            ["locality", "administrative_area_level_1", "administrative_area_level_2", "country"].includes(type)
        ) || "unknown"; // Default to unknown if nothing matches

        // 🔹 Step 4: Format response
        const locations = googleData.predictions.map((place: any) => ({
            name: place.description,
            googlePlaceId: place.place_id,
            googleType, // ✅ Now using the correct Google type!
        }));

        return NextResponse.json({ locations });

    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
