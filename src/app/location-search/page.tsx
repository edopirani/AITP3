"use client";
import { useState } from "react";

export default function LocationSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ name: string; googlePlaceId: string; googleType: string }[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{ name: string; googlePlaceId: string; googleType: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/location/search?q=${value}`);
            const data = await res.json();
            if (data.locations) {
                setResults(data.locations);
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
        setLoading(false);
    };

    const handleSelectLocation = (location: { name: string; googlePlaceId: string; googleType: string }) => {
        console.log("Clicked:", location);
        setSelectedLocation(location);
        setQuery(location.name);
        setResults([]); // Hide dropdown after selection
    };

    // ✅ Make sure this function exists ONLY ONCE!
    const handleConfirmLocation = async () => {
        if (!selectedLocation) return;

        try {
            const res = await fetch("/api/location/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedLocation),
            });
            const data = await res.json();
            console.log("Saved Location:", data);
        } catch (error) {
            console.error("Error saving location:", error);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-xl font-bold mb-4">Location Search</h1>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Type a location..."
                className="border p-2 w-80 rounded-md"
            />
            {loading && <p>Loading...</p>}
            {results.length > 0 && (
                <ul className="mt-2 w-80 border rounded-md bg-white shadow-md">
                    {results.map((location) => (
                        <li 
                            key={location.googlePlaceId} 
                            className="p-2 border-b last:border-0 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectLocation(location)}
                        >
                            {location.name}
                        </li>
                    ))}
                </ul>
            )}
            {selectedLocation && (
                <div className="mt-4 p-2 border rounded-md w-80 bg-green-100">
                    <p>✅ Selected: <strong>{selectedLocation.name}</strong></p>
                    <button 
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={handleConfirmLocation} // ✅ Click to save
                    >
                        Save Location
                    </button>
                </div>
            )}
        </div>
    );
}
