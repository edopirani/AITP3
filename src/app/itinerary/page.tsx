"use client";

import { useFetchItinerary } from "@/hooks/useFetchItinerary";
import { useSaveItinerary } from "@/hooks/useSaveItinerary"; // ✅ Handles selected locations
import { useSubmitItinerary } from "@/hooks/useSubmitItinerary"; // ✅ Handles API call
import ItineraryTable from "@/app/components/ItineraryTable";
import GenerateButton from "@/app/components/GenerateButton";
import SaveButton from "@/app/components/SaveButton";
import TripSummary from "@/app/components/TripSummary";

export default function ItineraryPage() {
    const { itinerary, tripInfo, locationCount, summary, loading, error, fetchItinerary } = useFetchItinerary();
    const { selectedLocations, setSelectedLocations, toggleLocationSelection } = useSaveItinerary();
    const { submitItinerary, saving, error: saveError } = useSubmitItinerary();

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Generate Your Itinerary</h1>

            {/* ✅ Generate Button */}
            <GenerateButton fetchItinerary={fetchItinerary} loading={loading} />

            {/* ✅ Display Errors */}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
            {saveError && <p style={{ color: "red", fontWeight: "bold" }}>{saveError}</p>}

            {/* ✅ Use TripSummary component */}
            <TripSummary summary={summary} tripInfo={tripInfo} locationCount={locationCount} />

            {/* ✅ Itinerary Table */}
            {itinerary && (
                <ItineraryTable 
                    itinerary={itinerary} 
                    selectedLocations={selectedLocations} 
                    toggleLocationSelection={toggleLocationSelection} 
                />
            )}

            {/* ✅ Save Button */}
            <SaveButton 
                saveItinerary={() => submitItinerary("cb14815e-c98b-491b-8681-0c0afc2e7070", selectedLocations)} 
                selectedLocations={selectedLocations} 
                disabled={saving} 
            />
        </div>
    );
}