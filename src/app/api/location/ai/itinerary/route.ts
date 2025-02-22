import { NextRequest, NextResponse } from "next/server";
import { fetchTrips } from "@/lib/tripDetails";  // Import fetchTrips from your lib

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { username } = await req.json();

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        // Fetch trip details from database
        const tripData = await fetchTrips(username);

        if (!tripData || tripData.length === 0) {
            return NextResponse.json({ error: "No trip data found" }, { status: 404 });
        }

        // Select the first trip (modify if handling multiple trips)
        const trip = tripData[0];

        function calculateTripDuration(start, end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            const timeDiff = endDate.getTime() - startDate.getTime();
            return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days
        }

        // Construct a structured prompt for Gemini
        const prompt = `
        **Trip Details**
        - Trip Name: ${trip.trip_name}
        - Trip Type: ${trip.trip_type}
        - Trip Budget: ${trip.trip_budget}
        - Preferred Stay Pattern: ${trip.preferred_stay_pattern}
        - Trip Purpose: ${trip.trip_purpose}
        - Custom Trip Purpose: ${trip.custom_trip_purpose}
        - Trip Locations: ${trip.trip_locations}
        - Start Date: ${trip.startDate}
        - End Date: ${trip.endDate}
        - Trip Duration: ${calculateTripDuration(trip.startDate, trip.endDate)} days

        **Profiles in this Trip:**
        ${trip.profiles.map((p) => `
            - Name: ${p.profile_name}
            - Party Size: ${p.party_size}
            - Age: ${p.age_range}
            - Gender: ${p.gender}
            - Relationship Status: ${p.relationship_status}
            - Fitness Level: ${p.fitness_level}
            - Nightlife Preference: ${p.nightlife_preference}
            - Tourism Preference: ${p.tourism_preference}
            - Pace Preference: ${p.pace_preference}
            - Solo Travel Preference: ${p.solo_travel_preference}
            - Schedule Preference: ${p.schedule_preference}
            - Comfort Preference: ${p.comfort_preference}
            - Interests: ${p.interests}
            - Moving Preferences: ${p.moving_preferences}
            - Staying Preferences: ${p.staying_preferences}
            - Languages: ${p.languages}
        `).join("\n")}

        ---

        **🔹 Task: Define the Ideal Itinerary**
        - If the user selected a broad country (e.g., "Italy"), narrow it down to **best cities** based on trip duration, preferences, and interests.
        - If the user selected a specific city (e.g., "Rome"), suggest **surrounding destinations** that fit within the time frame.
        - Provide a **table format** summarizing the recommended destinations, their vibe, and must-do activities.

        **📌 Response Format:**
        - Return **JSON only**.
        - Ensure JSON is well-structured for easy parsing.
        `;

        console.log("📝 Gemini Prompt Sent:", prompt);  // Debugging log

        // Send request to Google Gemini API
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ]
            }),
        });

        // Parse Gemini API response
        const geminiData = await response.json();

        // Check if Gemini response is valid
        if (!response.ok) {
            console.error("❌ Gemini API Error:", geminiData);
            return NextResponse.json({ error: geminiData.error?.message || "Failed to generate itinerary" }, { status: response.status });
        }

        // Extract structured itinerary from response if available
        const itinerary = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No itinerary generated";

        console.log("📜 Raw Gemini Response:", itinerary); // Debugging log

        try {
          // Remove potential markdown formatting (```json ... ```)
          let cleanedItinerary = itinerary.replace(/```[a-z]*\n?/g, "").trim();
      
          // Remove any lines that contain comments (e.g., "// some text")
          cleanedItinerary = cleanedItinerary.replace(/\/\/.*$/gm, "").trim();
      
          console.log("🧹 Cleaned Gemini Response Before Parsing:", cleanedItinerary); // Debugging log
      
          try {
              // Attempt to parse response as JSON
              const parsedItinerary = JSON.parse(cleanedItinerary);
      
              // Log formatted response
              console.log("✅ Gemini Parsed Response:", JSON.stringify(parsedItinerary, null, 2));
      
              // Return trip data + Gemini structured response
              return NextResponse.json({
                  trip_data: tripData,
                  gemini_response: parsedItinerary, // Returning structured JSON
              });
      
          } catch (jsonError) {
              console.error("❌ Failed to parse Gemini response (after cleanup):", cleanedItinerary);
              console.error("❌ JSON Parsing Error:", jsonError);
              return NextResponse.json({ trip_data: tripData, gemini_raw_response: cleanedItinerary });
          }
      
      } catch (processingError) {
          console.error("❌ Error processing itinerary:", processingError);
          return NextResponse.json({ error: "Failed to process itinerary" }, { status: 500 });
      }

    } catch (globalError) {
        console.error("❌ Error generating itinerary:", globalError);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}