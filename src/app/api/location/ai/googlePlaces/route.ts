import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const locationName = searchParams.get("locationName");

        if (!locationName) {
            return NextResponse.json({ error: "Missing locationName parameter" }, { status: 400 });
        }

        console.log("🔍 Searching Google Places for:", locationName);

        const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
        const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(locationName)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;

        const findResponse = await fetch(findPlaceUrl);
        const findData = await findResponse.json();

        if (!findData.candidates || findData.candidates.length === 0) {
            console.warn(`⚠️ No results found for ${locationName}`);
            return NextResponse.json({ error: "No results found" }, { status: 404 });
        }

        const placeId = findData.candidates[0].place_id;

        console.log(`✅ Found placeId: ${placeId} for ${locationName}`);

        // 🔹 Fetch detailed place info using placeId
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,types,place_id,address_components&key=${GOOGLE_API_KEY}`;

        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (!detailsData.result) {
            console.warn(`⚠️ No detailed info found for ${locationName}`);
            return NextResponse.json({ error: "No details found" }, { status: 404 });
        }

        const place = detailsData.result;

        console.log("✅ Google Places Details Response:", place);

        // 🔹 Extract administrative levels
        let adminLevel1 = null;
        let adminLevel2 = null;
        let adminLevel3 = null;
        let country = null;

        if (place.address_components) {
            place.address_components.forEach((component) => {
                if (component.types.includes("administrative_area_level_1")) {
                    adminLevel1 = component.short_name;
                }
                if (component.types.includes("administrative_area_level_2")) {
                    adminLevel2 = component.short_name;
                }
                if (component.types.includes("administrative_area_level_3")) {
                    adminLevel3 = component.short_name;
                }
                if (component.types.includes("country")) {
                    country = component.short_name;
                }
            });
        }

        return NextResponse.json({
            name: place.name,
            googlePlaceId: place.place_id,
            googleType: place.types?.[0] || "unknown", // Use first type as main category
            adminLevel1,
            adminLevel2,
            adminLevel3,
            country,
        });

    } catch (error) {
        console.error("❌ Google Places API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}