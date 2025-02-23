"use client";

import { useState } from "react";
import ItineraryTable from "@/app/components/table";

export default function ItineraryPage() {
    const [itinerary, setItinerary] = useState<any[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // ✅ Store additional details
    const [summary, setSummary] = useState<string>("");
    const [locationCount, setLocationCount] = useState<number | null>(null);
    const [tripInfo, setTripInfo] = useState<{ name: string; duration: string } | null>(null);

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
                setSummary(data.gemini_response.trip_summary.summary); // ✅ Store summary
                setLocationCount(data.gemini_response.trip_summary.recommended_location_count); // ✅ Store recommended count
                setTripInfo({
                    name: data.gemini_response.trip_summary.trip_name,
                    duration: data.gemini_response.trip_summary.trip_duration,
                }); // ✅ Store trip info
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

    async function saveItinerary() {
        if (selectedLocations.length === 0) {
            alert("Please select at least one location.");
            return;
        }

        try {
            const response = await fetch("/api/location/ai/saveItinerary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "johndoe", selectedLocations }),
            });

            const result = await response.json();
            if (result.success) {
                alert("Itinerary saved successfully!");
            } else {
                alert(`Failed to save itinerary: ${result.error}`);
            }
        } catch (err) {
            console.error("❌ Failed to save itinerary:", err);
            alert("Error saving itinerary.");
        }
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Generate Your Itinerary</h1>
            <button 
                onClick={fetchItinerary} 
                disabled={loading} 
                style={{
                    padding: "10px 20px",
                    marginTop: "10px",
                    fontSize: "16px",
                    cursor: loading ? "not-allowed" : "pointer",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginBottom: "20px",
                }}
            >
                {loading ? "Generating..." : "Generate Itinerary"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* ✅ Show Summary + Trip Info */}
            {summary && (
                <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
                    <p>{summary}</p>
                    {tripInfo && (
                        <p>
                            📍 {tripInfo.name} — {tripInfo.duration}
                        </p>
                    )}
                    {locationCount && <p>We recommend selecting {locationCount} locations.</p>}
                </div>
            )}

            {itinerary.length > 0 && (
                <>
                    <ItineraryTable itinerary={itinerary} selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
                    
                    <button 
                        onClick={saveItinerary}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            cursor: "pointer",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            marginTop: "20px",
                        }}
                    >
                        Save Selected Locations
                    </button>
                </>
            )}
        </div>
    );
}