import { NextRequest, NextResponse } from "next/server";
import { fetchTrips } from "@/lib/tripDetails";
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const trips = await fetchTrips(username);
        if (!trips) {
            return NextResponse.json({ error: "No trips found" }, { status: 404 });
        }

        return NextResponse.json({ trips });
    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}