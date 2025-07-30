import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, restaurants, reviews } from "@/lib/db/schema"

export async function GET() {
  try {
    // Test database connection and get counts
    const [allUsers, allRestaurants, allReviews] = await Promise.all([
      db.select().from(users),
      db.select().from(restaurants),
      db.select().from(reviews),
    ])

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      stats: {
        users: allUsers.length,
        restaurants: allRestaurants.length,
        reviews: allReviews.length,
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
