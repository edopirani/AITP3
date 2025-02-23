import { NextRequest, NextResponse } from "next/server";
import { fetchTrips } from "@/lib/tripDetails"; 
import hardcodedResponse from "@/lib/hardcodedResponse";

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        console.log("✅ Getting Trip and Profile");

        // Fetch trip details from database (mock this too if necessary)
        const tripData = await fetchTrips(username);
        if (!tripData || tripData.length === 0) {
            return NextResponse.json({ error: "No trip data found" }, { status: 404 });
        }

        console.log("✅ Using Hardcoded Itinerary Response");

        // ✅ Hardcoded Gemini response
        const response = hardcodedResponse;

        // ✅ Fetch Google Places details for each recommended location
        console.log("🔄 Fetching Google Places for recommended destinations...");

        const enrichedDestinations = await Promise.all(
          response.trip_summary.recommended_destinations.map(async (location) => {
              try {
                  const googleResponse = await fetch(`http://localhost:3000/api/location/ai/googlePlaces?locationName=${encodeURIComponent(location.name)}`);
      
                  const googleData = await googleResponse.json();
      
                  if (googleData.error) {
                      console.warn(`⚠️ No details found for ${location.name}`);
                  }
      
                  return {
                      ...location,
                      googleDetails: googleData.error ? { error: googleData.error } : googleData,
                  };
              } catch (err) {
                  console.error(`❌ Error fetching Google Places for ${location.name}:`, err);
                  return {
                      ...location,
                      googleDetails: { error: "Failed to fetch Google Places" },
                  };
              }
          })
      );
        console.log("✅ Enriched Destinations:", enrichedDestinations);


        console.log("✅ Enriched Destinations:", enrichedDestinations);

        // ✅ Step 2: Immediately Save Locations to Database
        const saveLocationsResponse = await fetch("http://localhost:3000/api/location/ai/saveNewLocations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locations: enrichedDestinations }),
        });

        const saveLocationsData = await saveLocationsResponse.json();

        if (!saveLocationsResponse.ok) {
            console.error("❌ Failed to save new locations:", saveLocationsData);
        } else {
            console.log("✅ Successfully saved new locations:", saveLocationsData);
        }

        return NextResponse.json({
            trip_data: tripData,
            gemini_response: {
                ...response,
                trip_summary: {
                    ...response.trip_summary,
                    recommended_destinations: enrichedDestinations,
                },
            },
        });
        

    } catch (error) {
        console.error("❌ Error generating itinerary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}