import { useState } from "react";

export function useFetchItinerary() {
    const [itinerary, setItinerary] = useState(null);
    const [tripInfo, setTripInfo] = useState({ name: "", duration: "" });
    const [locationCount, setLocationCount] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /** ✅ Fetch Itinerary from API */
    async function fetchItinerary() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/location/ai/itinerary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "johndoe" }),
            });

            const data = await response.json();
            console.log("📌 API Response in UI:", data);

            if (data.gemini_response?.trip_summary?.recommended_destinations) {
                setItinerary(data.gemini_response.trip_summary.recommended_destinations);
                setSummary(data.gemini_response.trip_summary.summary || "No summary available.");
                setLocationCount(data.gemini_response.trip_summary.recommended_location_count || "N/A");

                setTripInfo({
                    name: data.gemini_response.trip_summary.trip_name || "Unnamed Trip",
                    duration: data.gemini_response.trip_summary.trip_duration || "Unknown Duration",
                });
            } else {
                setError("No itinerary found.");
            }
        } catch (err) {
            console.error("❌ Failed to fetch itinerary:", err);
            setError("Failed to fetch itinerary. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return {
        itinerary,
        tripInfo,
        locationCount,
        summary,
        loading,
        error,
        fetchItinerary,
        setItinerary,
    };
}