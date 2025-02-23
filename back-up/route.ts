import { NextRequest, NextResponse } from "next/server";
import { fetchTrips } from "@/lib/tripDetails";  
import { generateItineraryPrompt } from "@/lib/geminiPrompt";  

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

        // Select the first trip
        const trip = tripData[0];

        // Generate Gemini prompt
        const prompt = generateItineraryPrompt(trip);

        console.log("📝 Gemini Prompt Sent:", prompt);

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

        if (!response.ok) {
            console.error("❌ Gemini API Error:", geminiData);
            return NextResponse.json({ error: geminiData.error?.message || "Failed to generate itinerary" }, { status: response.status });
        }

        const itinerary = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No itinerary generated";
        console.log("📜 Raw Gemini Response:", itinerary);

        let cleanedItinerary = "";
        try {
            cleanedItinerary = itinerary.replace(/```[a-z]*\n?/g, "").trim();
            cleanedItinerary = cleanedItinerary.replace(/\/\/.*$/gm, "").trim();

            console.log("🧹 Cleaned Gemini Response Before Parsing:", cleanedItinerary);

            const parsedItinerary = JSON.parse(cleanedItinerary);

            console.log("✅ Gemini Parsed Response:", JSON.stringify(parsedItinerary, null, 2));

            return NextResponse.json({
                trip_data: tripData,
                gemini_response: parsedItinerary, 
            });

        } catch (jsonError) {
            console.error("❌ Failed to parse Gemini response:", cleanedItinerary);
            console.error("❌ JSON Parsing Error:", jsonError);
            return NextResponse.json({ trip_data: tripData, gemini_raw_response: cleanedItinerary });
        }

    } catch (error) {
        console.error("❌ Error generating itinerary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}