export function generateItineraryPrompt(trip) {
  function calculateTripDuration(start, end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timeDiff = endDate.getTime() - startDate.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days
  }

  return `
  **Trip Details**
  - Trip Name: ${trip.trip_name}
  - Trip Type: ${trip.trip_type}
  - Trip Budget: ${trip.trip_budget}
  - Preferred Stay Pattern: ${trip.preferred_stay_pattern}
  - Trip Purpose: ${trip.trip_purpose}
  - Custom Trip Purpose: ${trip.custom_trip_purpose}
  - Trip Locations: ${trip.trip_locations}
  - Start Date: ${trip.startDate}
  - End Date: ${trip.endDate}
  - Trip Duration: ${calculateTripDuration(trip.startDate, trip.endDate)} days

  **Profiles in this Trip:**
  ${trip.profiles.map((p) => `
      - Name: ${p.profile_name}
      - Party Size: ${p.party_size}
      - Age: ${p.age_range}
      - Gender: ${p.gender}
      - Relationship Status: ${p.relationship_status}
      - Fitness Level: ${p.fitness_level}
      - Nightlife Preference: ${p.nightlife_preference}
      - Tourism Preference: ${p.tourism_preference}
      - Pace Preference: ${p.pace_preference}
      - Solo Travel Preference: ${p.solo_travel_preference}
      - Schedule Preference: ${p.schedule_preference}
      - Comfort Preference: ${p.comfort_preference}
      - Interests: ${p.interests}
      - Moving Preferences: ${p.moving_preferences}
      - Staying Preferences: ${p.staying_preferences}
      - Languages: ${p.languages}
  `).join("\n")}

  **Context:**

  You are an expert travel planner. Your task is to help a user structure the perfect itinerary by selecting the best destinations based on their input.

  The following structured data represents a traveler's preferences, trip details, and associated locations. Some fields may need clarification for AI interpretation. Below is a breakdown of key fields and their meaning:

  **Key Definitions for AI Understanding:**

  ✅ **Preferred Stay Pattern (You need to try to accommodate the preference by providing the appropriate group of options, at this stage we are still scoping the places to visit, so you can avoid deciding the bases for them):**  
  - **Single Base** → The traveler prefers staying in one location and taking day trips before returning to the same accommodation each night.  
  - **Multi Base** → The traveler enjoys moving between different locations and staying in multiple accommodations throughout the trip.

  ✅ **Tourism Preference:**  
  - **Iconic Landmarks & Major Attractions** → Focus on famous sites and must-see landmarks.  
  - **Balanced Experience** → A mix of major attractions and hidden gems.  
  - **What a Local Would Do** → Off-the-beaten-path experiences and local culture.

  ✅ **Travel Pace:**  
  - **Slow & Relaxed** → Prioritizes comfort and depth over covering many places.  
  - **Balanced** → A mix of relaxation and exploration.  
  - **Fast-Paced** → Prefers maximizing activities and covering more ground.

  ✅ **Task: Scope the Best Destinations for the Itinerary**  
  - If the user selected a broad country (e.g., "Italy"), recommend **the best cities/regions** based on trip duration, travel preferences, and interests.  
  - If the user selected a specific city (e.g., "Rome"), suggest **nearby destinations** that fit within the timeframe.  
  - **Provide exactly 5 destination options** that align with the user's preferences.  
  - **Recommend an ideal number of locations** to visit based on **trip duration and travel style**.  
  - Provide a **topline summary** in a **single sentence** before listing recommendations, explaining the rationale for these choices.

  **📌 Response Format:**
  - **Return JSON only** (strictly no markdown, no additional text).
  - **Only return scoped destinations** (not day-by-day itineraries).
  - Use the following JSON format:

  json
  {
    "trip_summary": {
      "trip_name": "${trip.trip_name}",
      "trip_duration": "${calculateTripDuration(trip.startDate, trip.endDate)} days",
      "recommended_location_count": "3-4",
      "summary": "Since the traveler prefers ${trip.preferred_stay_pattern}, a balanced mix of locations has been chosen to align with their interests.",
      "recommended_destinations": [
        {
          "name": "Florence",
          "description": "Renaissance art hub, charming streets, great food.",
          "activities": [
            "Explore the Uffizi Gallery",
            "Walk across the Ponte Vecchio",
            "Enjoy a Tuscan cooking class"
          ]
        },
        {
          "name": "Cinque Terre",
          "description": "Coastal villages with stunning views and scenic hikes.",
          "activities": [
            "Hike between the five villages",
            "Take a boat tour along the Ligurian coastline",
            "Enjoy fresh seafood by the sea"
          ]
        },
        {
          "name": "Siena",
          "description": "Medieval city in Tuscany, known for its Gothic architecture.",
          "activities": [
            "Visit Piazza del Campo",
            "Explore the Siena Cathedral",
            "Try local Sienese cuisine"
          ]
        }
      ]
    }
  }
  `;
}