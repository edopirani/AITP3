import { useState } from "react";

export function useSaveItinerary() {
    const [selectedLocations, setSelectedLocations] = useState<any[]>([]);

    const toggleLocationSelection = (location: any) => {
        setSelectedLocations((prevSelected) => {
            const alreadySelected = prevSelected.some(
                (l) => l.googleDetails?.googlePlaceId === location.googleDetails?.googlePlaceId
            );

            return alreadySelected
                ? prevSelected.filter((l) => l.googleDetails?.googlePlaceId !== location.googleDetails?.googlePlaceId)
                : [...prevSelected, location];
        });
    };

    return { selectedLocations, setSelectedLocations, toggleLocationSelection };
}