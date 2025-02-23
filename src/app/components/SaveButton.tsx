import React from "react";

export default function SaveButton({ saveItinerary, selectedLocations, disabled }) {
    return (
        <button 
            onClick={saveItinerary}
            disabled={disabled || selectedLocations.length === 0} 
            style={{
                margin: "15px", 
                padding: "10px 20px",
                fontSize: "16px",
                cursor: disabled || selectedLocations.length === 0 ? "not-allowed" : "pointer",
                backgroundColor: disabled ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                marginLeft: "10px",
            }}
        >
            {disabled ? "Saving..." : selectedLocations.length > 0 ? "Save Itinerary" : "Select Locations First"}
        </button>
    );
}