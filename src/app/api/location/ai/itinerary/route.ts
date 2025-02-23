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

         **Context:**

        You are an expert travel planner. Your task is to help a user structure the perfect itinerary by selecting the best destinations based on their input.

        The following structured data represents a traveler's preferences, trip details, and associated locations. Some fields may need clarification for AI interpretation. Below is a breakdown of key fields and their meaning:

        **Key Definitions for AI Understanding:**

        ✅ **Preferred Stay Pattern (You need to try to accomodate the preference by providing the appropriate group of options, at this stage we are still scoping the places to visit, so you can avoid deciding the bases for them):**  
        - **Single Base** → The traveler prefers staying in one location and taking day trips before returning to the same accommodation each night.  
        - **Multi Base** → The traveler enjoys moving between different locations and staying in multiple accommodations throughout the trip.
        
        ✅ Tourism Preference (Use this to recommend locations that align with the traveler’s preferred way of experiencing a destination):
        -	Iconic Landmarks & Major Attractions → The traveler prioritizes famous sights and well-known attractions. Recommendations should include the most famous historical landmarks, cultural sites, and must-visit spots in each city.
        -	Balanced Experience → The traveler enjoys a mix of major attractions and local hidden gems. Recommendations should balance mainstream highlights with less crowded, off-the-beaten-path spots that provide a more authentic experience.
        -	What a Local Would Do → The traveler prefers to experience destinations like a local, avoiding tourist-heavy areas and major attractions. Recommendations should focus on neighborhoods, cafes, markets, local festivals, and activities that residents enjoy rather than typical sightseeing spots.

        ✅ **Trip Purpose:**  
        - A list of key motivations for the trip (e.g., Cultural Exploration, Adventure, Relaxation).  
        - If a custom purpose is defined, it represents a unique intent from the traveler.  

        ✅ **Budget Level:**  
        - **Budget** → Prefers low-cost options, including hostels, budget airlines, and affordable food.  
        - **Mid-Range** → Comfortable accommodations, a mix of cost-conscious and experience-driven choices.  
        - **Luxury** → Prioritizes high-end experiences, fine dining, and premium accommodations.  

        ✅ **Travel Pace:**  
        - **Slow & Relaxed** → Enjoys taking time in each destination, prioritizing comfort over covering many places.  
        - **Balanced** → A mix of relaxation and exploration.  
        - **Fast-Paced** → Prefers maximizing activities and covering more ground in a shorter time.  

        ✅ **Solo Travel Preference:**  
        - **Alone** → Enjoys exploring independently.  
        - **Company** → Prefers being around others while traveling.  

        ✅ **Moving Preferences:**  
        - Includes transport methods preferred by the traveler, such as public transport, car rental, or walking.  

        ✅ **Staying Preferences:**  
        - Defines the types of accommodation the traveler prefers, such as hotels, villas, or hostels.  

        ✅ **Interests:**  
        - Specific activities or themes that the traveler enjoys, such as hiking, fine dining, museums.  

        ✅ **Languages Spoken (with proficiency level):**  
        - Indicates the languages the traveler speaks and their fluency level (1 = Basic, 3 = Fluent).  

        ---

        ### **📝 Task: Scope the Best Destinations for the Itinerary**  
        Your goal is to **help the traveler define their itinerary** by recommending the best destinations based on the information provided.

        1️⃣ **If the user selected a broad country/region (e.g., "Italy")**  
          - Narrow it down by recommending **the best cities/regions** to visit based on trip duration, travel preferences, and interests.  
          - Balance **culture, adventure, relaxation, and unique experiences** to create a well-rounded trip.  
          - Avoid overpacking the schedule – **only recommend what fits within the available time**.  

        2️⃣ **If the user selected a specific city (e.g., "Rome")**  
          - Suggest **nearby destinations** that make sense for a short trip (e.g., **Naples, Florence, Amalfi for a Rome-based trip**).  
          - Only include extra locations **if travel time allows** (avoid unrealistic day trips).  

        3️⃣ **Present the Information in a Clear Table Format**  
          - Include the following columns:  
            - **Destination Name**  
            - **Brief Description** (Vibe & Unique Features)  
            - **Popular Activities & Highlights**  

        4️⃣ **Ensure Suggestions Match User Preferences**  
          - If they prefer **relaxation**, avoid fast-paced cities.  
          - If they prefer **adventure**, suggest locations with outdoor activities.  
          - If they are food lovers, emphasize **culinary experiences**.  

        ---

        ### **🔹 Task: Define the Ideal Itinerary**
        - If the user selected a broad country (e.g., **"Italy"**), **narrow it down** to **best cities** based on **trip duration, preferences, and interests**.
        - If the user selected a specific city (e.g., **"Rome"**), **suggest surrounding destinations** that fit within the timeframe.
        - Ensure recommendations align with the user's **budget, pace, and interests**.
        - Provide a **table format** summarizing the recommended destinations, their vibe, and must-do activities.
        - **Provide exactly 5 destination options** that align with the user's preferences.
        - **Recommend an ideal number of locations** to visit based on **trip duration and travel style**.
        - Provide a **topline summary** in a **single sentence** before listing recommendations, explaining the rationale for these choices.

        ---

        ### **📌 Response Format**
        - **Return JSON only** (strictly no markdown, no additional text).
        - Ensure JSON is well-structured for easy parsing.
        - The response should **ONLY** contain **destination scoping** (not day-by-day itinerary).
        - Use the following **structured JSON format**:

        json
        {
          "trip_summary": {
            "trip_name": "Summer Vacation in Italy",
            "trip_duration": "10 days",
            "recommended_location_count": "3-4",
            "summary": "Since John and Maria prefer a mix of adventure, culture, and relaxation, and are staying in a single base, the best choices balance easy day trips with diverse experiences.",
            "recommended_destinations": [
              {
                "name": "Florence",
                "description": "Renaissance art hub, charming streets, great food.",
                "activities": [
                  "Explore the Uffizi Gallery",
                  "Walk across the Ponte Vecchio",
                  "Enjoy a Tuscan cooking class"
                ]
              },
              {
                "name": "Cinque Terre",
                "description": "Coastal villages with stunning views and scenic hikes.",
                "activities": [
                  "Hike between the five villages",
                  "Take a boat tour along the Ligurian coastline",
                  "Enjoy fresh seafood by the sea"
                ]
              },
              {
                "name": "Siena",
                "description": "Medieval city in Tuscany, known for its Gothic architecture.",
                "activities": [
                  "Visit Piazza del Campo",
                  "Explore the Siena Cathedral",
                  "Try local Sienese cuisine"
                ]
              }
            ]
          }
        }
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