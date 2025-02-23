import React from "react";

export default function TripSummary({ summary, tripInfo, locationCount }) {
    if (!summary) return null;

    return (
        <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
            <p>{summary}</p>
            {tripInfo && <p>📍 <strong>{tripInfo.name}</strong> — {tripInfo.duration}</p>}
            {locationCount && <p>We recommend selecting **{locationCount}** locations.</p>}
        </div>
    );
}