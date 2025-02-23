import React from "react";

export default function ItineraryTable({ itinerary, selectedLocations, toggleLocationSelection }) {
    if (!itinerary || !Array.isArray(itinerary)) {
        return <p>No valid itinerary data.</p>;
    }

    return (
        <div>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Destination</th>
                        <th>Description</th>
                        <th>Activities</th>
                    </tr>
                </thead>
                <tbody>
                    {itinerary.map((location) => (
                        <tr key={location.googleDetails?.googlePlaceId}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedLocations.some(
                                        (l) => l.googleDetails?.googlePlaceId === location.googleDetails?.googlePlaceId
                                    )}
                                    onChange={() => toggleLocationSelection(location)}
                                />
                            </td>
                            <td>{location.name}</td>
                            <td>{location.description}</td>
                            <td>
                                <ul>
                                    {location.activities.map((activity, index) => (
                                        <li key={index}>{activity}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}