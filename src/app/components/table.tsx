import React, { useState } from "react";

export default function ItineraryTable({ itinerary, selectedLocations, setSelectedLocations }) {
    if (!itinerary || !Array.isArray(itinerary)) {
        return <p>No valid itinerary data.</p>;
    }

    const handleCheckboxChange = (name) => {
        setSelectedLocations((prev) => {
            if (prev.includes(name)) {
                return prev.filter((loc) => loc !== name); // Remove if unchecked
            } else {
                return [...prev, name]; // Add if checked
            }
        });
    };

    return (
        <table border={1} style={{ margin: "20px auto", width: "80%", textAlign: "left" }}>
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Destination</th>
                    <th>Description</th>
                    <th>Popular Activities</th>
                </tr>
            </thead>
            <tbody>
                {itinerary.map((place) => (
                    <tr key={place.name}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedLocations.includes(place.name)}
                                onChange={() => handleCheckboxChange(place.name)}
                            />
                        </td>
                        <td><strong>{place.name}</strong></td>
                        <td>{place.description}</td>
                        <td>
                            <ul>
                                {place.activities.map((activity, index) => (
                                    <li key={index}>{activity}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}