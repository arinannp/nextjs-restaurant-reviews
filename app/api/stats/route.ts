import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { restaurants, reviews, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // Get all data
    const [allRestaurants, allReviews, allUsers] = await Promise.all([
      db.select().from(restaurants),
      db.select().from(reviews),
      db.select().from(users),
    ])

    // Calculate restaurant statistics
    const restaurantStats = await Promise.all(
      allRestaurants.map(async (restaurant) => {
        const restaurantReviews = await db
          .select({ rating: reviews.rating })
          .from(reviews)
          .where(eq(reviews.restaurantId, restaurant.id))

        const avgRating =
          restaurantReviews.length > 0
            ? restaurantReviews.reduce((sum, review) => sum + review.rating, 0) / restaurantReviews.length
            : 0

        return {
          id: restaurant.id,
          name: restaurant.name,
          category: restaurant.category,
          location: restaurant.location,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: restaurantReviews.length,
        }
      }),
    )

    // Rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: allReviews.filter((review) => review.rating === rating).length,
      percentage:
        allReviews.length > 0
          ? ((allReviews.filter((review) => review.rating === rating).length / allReviews.length) * 100).toFixed(1)
          : "0",
    }))

    // Top rated restaurants
    const topRated = restaurantStats
      .filter((r) => r.reviewCount > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5)

    // Most reviewed restaurants
    const mostReviewed = restaurantStats.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5)

    return NextResponse.json({
      overview: {
        totalRestaurants: allRestaurants.length,
        totalReviews: allReviews.length,
        totalUsers: allUsers.length,
        averageReviewsPerRestaurant:
          allRestaurants.length > 0 ? (allReviews.length / allRestaurants.length).toFixed(1) : "0",
      },
      ratingDistribution,
      topRated,
      mostReviewed,
      restaurantStats,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
