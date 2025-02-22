"use client"; // 🚀 Required for useState to work

import { useState } from "react";
import ItineraryTable from "@/app/components/table";

export default function ItineraryPage() {
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            console.log("📌 API Response in UI:", data); // Debugging log

            if (data.gemini_response?.itinerary) {
                setItinerary(data.gemini_response.itinerary);
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

            {itinerary && <ItineraryTable itinerary={itinerary} />}
        </div>
    );
}