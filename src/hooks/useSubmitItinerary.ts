import { useState } from "react";

export function useSubmitItinerary() {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submitItinerary(tripId: string, selectedLocations: any[]) {
        if (!tripId) {
            setError("❌ No trip ID provided!");
            return;
        }

        if (!selectedLocations || !Array.isArray(selectedLocations) || selectedLocations.length === 0) {
            setError("❌ No locations selected!");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // ✅ Fix: Use the correct API endpoint
            const response = await fetch("/api/location/ai/saveItinerary", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tripId,
                    selectedLocations,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "❌ Failed to save itinerary");
                return;
            }

            console.log("✅ Itinerary Saved Successfully:", result);
            alert("Itinerary saved successfully!");

        } catch (error) {
            console.error("❌ Error saving itinerary:", error);
            setError("❌ An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    }

    return { submitItinerary, saving, error };
}