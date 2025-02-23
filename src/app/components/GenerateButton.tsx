import React from "react";

export default function GenerateButton({ fetchItinerary, loading }) {
    return (
        <button 
            onClick={fetchItinerary} 
            disabled={loading} 
            style={{
                margin: "15px", 
                padding: "10px 20px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
            }}
        >
            {loading ? "Generating..." : "Generate Itinerary"}
        </button>
    );
}