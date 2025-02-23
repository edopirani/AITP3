const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

/** ✅ Fetch Google Place details for a given location */
export async function fetchGooglePlaceDetails(locationName: string) {
    if (!GOOGLE_PLACES_API_KEY) {
        console.error("❌ Google API Key is missing!");
        return null;
    }

    try {
        console.log(`🔍 Fetching Google Place ID for: ${locationName}`);

        const response = await fetch(
            `${GOOGLE_PLACES_URL}?input=${encodeURIComponent(locationName)}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}`
        );

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            console.warn(`⚠️ No Google Places result for: ${locationName}`);
            return null;
        }

        const place = data.candidates[0]; // Take the first result
        console.log(`✅ Google Place Found: ${place.name} (${place.place_id})`);

        return {
            name: place.name,
            placeId: place.place_id,
            address: place.formatted_address,
            location: place.geometry?.location || null,
        };
    } catch (error) {
        console.error("❌ Google Places API Error:", error);
        return null;
    }
}