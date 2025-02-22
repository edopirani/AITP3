import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ error: "Query must be at least 2 characters long" }, { status: 400 });
        }

        // Step 1: Get autocomplete suggestions
        const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_PLACES_API_KEY}`;
        const googleResponse = await fetch(googleUrl);
        const googleData = await googleResponse.json();

        if (!googleData.predictions || googleData.predictions.length === 0) {
            return NextResponse.json({ error: "No locations found" }, { status: 404 });
        }

        // Step 2: Fetch details for all place IDs
        const placeDetails = await Promise.all(
            googleData.predictions.map(async (place: any) => {
                const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${GOOGLE_PLACES_API_KEY}`;
                const detailsResponse = await fetch(detailsUrl);
                const detailsData = await detailsResponse.json();

                const googleType = detailsData.result?.types?.[0] || "unknown";

                return {
                    name: place.description, // Full name
                    googlePlaceId: place.place_id,
                    googleType,
                    address_components: detailsData.result?.address_components || [],
                    structured_formatting: place.structured_formatting || {
                        main_text: place.description.split(",")[0],
                        secondary_text: place.description.split(",").slice(1).join(", "),
                    }
                };
            })
        );

        return NextResponse.json({ locations: placeDetails });

    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
