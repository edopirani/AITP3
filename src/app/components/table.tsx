import React from "react";

export default function ItineraryTable({ itinerary }) {
    if (!itinerary || !Array.isArray(itinerary)) {
        return <p>No valid itinerary data.</p>;
    }

    return (
        <table border={1}>
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Vibe</th>
                    <th>Activities</th>
                </tr>
            </thead>
            <tbody>
                {itinerary.map((day) => (
                    <tr key={day.day}>
                        <td>{day.day}</td>
                        <td>{day.date}</td>
                        <td>{day.location}</td>
                        <td>{day.vibe}</td>
                        <td>
                            <ul>
                                {day.activities.map((activity, index) => (
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