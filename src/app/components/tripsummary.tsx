import React from "react";

export default function TripSummary({ summary, tripInfo, locationCount }) {
    if (!summary) return null;

    return (
        <div style={{ margin: "20px", fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
            {tripInfo && <p>📍 <strong>{tripInfo.name}</strong> — {tripInfo.duration}</p>}
            <p>{summary}</p>
            {locationCount && <p>We recommend selecting {locationCount} locations.</p>}
        </div>
    );
}