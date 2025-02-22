import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchTrips(username: string) {
    if (!username) throw new Error("Username is required");

    const trips = await prisma.trip.findMany({
        where: { tripProfiles: { some: { profile: { user: { username } } } } },
        include: {
            tripProfiles: {
                include: {
                    profile: {
                        include: {
                            profileType: true,
                            ageRange: true,
                            gender: true,
                            relationshipStatus: true,
                            fitnessPreference: true,
                            nightlifePreference: true,
                            tourismPreference: true,
                            pacePreference: true,
                            soloTravelerPreference: true,
                            schedulePreference: true,
                            comfortPreference: true,
                            interests: { include: { interest: true } },
                            movingPreferences: { include: { movingPreference: true } },
                            stayingPreferences: { include: { stayingPreference: true } },
                            languages: { include: { language: true } },
                        },
                    },
                },
            },
            type: true,
            budget: true,
            basePreference: true,
            purposes: { include: { purpose: true } },
            locations: { include: { location: true } },
        },
    });

    if (!trips || trips.length === 0) return null;

    return trips.map((trip) => ({
        trip_name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        trip_type: trip.type?.name || "Unknown",
        trip_budget: trip.budget?.label || "Unknown",
        preferred_stay_pattern: trip.basePreference?.name || "Unknown",
        trip_purpose: trip.purposes?.map((p) => p.purpose.name).join(", ") || "None",
        custom_trip_purpose: trip.customPurpose || "None",
        trip_locations: trip.locations?.map((tl) => tl.location.name).join(", ") || "None",

        profiles: trip.tripProfiles.map((tp) => ({
            profile_name: tp.profile.name,
            party_size: tp.partySize,
            age_range: tp.profile.ageRange?.name || "Unknown",
            gender: tp.profile.gender?.name || "Unknown",
            relationship_status: tp.profile.relationshipStatus?.name || "Unknown",
            profile_type: tp.profile.profileType?.name || "Unknown",
            fitness_level: tp.profile.fitnessPreference?.name || "Unknown",
            nightlife_preference: tp.profile.nightlifePreference?.name || "Unknown",
            tourism_preference: tp.profile.tourismPreference?.name || "Unknown",
            pace_preference: tp.profile.pacePreference?.name || "Unknown",
            solo_travel_preference: tp.profile.soloTravelerPreference?.name || "Unknown",
            schedule_preference: tp.profile.schedulePreference?.name || "Unknown",
            comfort_preference: tp.profile.comfortPreference?.name || "Unknown",
            interests: tp.profile.interests?.map((pi) => pi.interest.name).join(", ") || "None",
            moving_preferences: tp.profile.movingPreferences?.map((pmp) => pmp.movingPreference.type).join(", ") || "None",
            staying_preferences: tp.profile.stayingPreferences?.map((psp) => psp.stayingPreference.type).join(", ") || "None",
            languages: tp.profile.languages?.map((pl) => `${pl.language.name} (Level ${pl.proficiency})`).join(", ") || "None",
        })),
    }));
}