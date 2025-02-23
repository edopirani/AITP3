import { useState } from "react";

export function useItinerary() {
    const [selectedLocations, setSelectedLocations] = useState([]);

    /** ✅ Save Itinerary to Database */
    async function saveItinerary(tripInfo: { name: string }, selectedLocations: string[]) {
        if (!tripInfo.name || tripInfo.name.trim() === "") {
            console.error("❌ Cannot save itinerary: Trip name is missing!");
            alert("Trip name is missing. Please generate an itinerary first.");
            return;
        }

        console.log("🔍 Sending to API:", {
            tripName: tripInfo.name,
            selectedLocations,
        });

        const response = await fetch("/api/location/ai/saveItinerary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tripName: tripInfo.name,
                selectedLocations,
            }),
        });

        const data = await response.json();
        console.log("✅ Save Itinerary Response:", data);

        if (data.success) {
            alert("Itinerary saved successfully!");
        } else {
            alert("❌ Failed to save itinerary!");
        }
    }

    return {
        selectedLocations,
        setSelectedLocations,
        saveItinerary,
    };
}