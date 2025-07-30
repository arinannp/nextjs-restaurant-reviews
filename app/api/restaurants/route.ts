import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { restaurants, reviews } from "@/lib/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { desc, asc, ilike, eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const sortBy = searchParams.get("sortBy") || "newest"

    // First, get restaurants with basic filtering
    let restaurantQuery = db.select().from(restaurants)

    // Apply filters
    if (search) {
      restaurantQuery = restaurantQuery.where(ilike(restaurants.name, `%${search}%`))
    }
    if (category) {
      restaurantQuery = restaurantQuery.where(eq(restaurants.category, category as any))
    }
    if (location) {
      restaurantQuery = restaurantQuery.where(ilike(restaurants.location, `%${location}%`))
    }

    // Apply basic sorting
    switch (sortBy) {
      case "oldest":
        restaurantQuery = restaurantQuery.orderBy(asc(restaurants.createdAt))
        break
      default:
        restaurantQuery = restaurantQuery.orderBy(desc(restaurants.createdAt))
    }

    const restaurantList = await restaurantQuery

    // Calculate review statistics for each restaurant
    const restaurantsWithStats = await Promise.all(
      restaurantList.map(async (restaurant) => {
        const reviewStats = await db
          .select({
            rating: reviews.rating,
          })
          .from(reviews)
          .where(eq(reviews.restaurantId, restaurant.id))

        const avgRating =
          reviewStats.length > 0 ? reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewStats.length : 0

        const reviewCount = reviewStats.length

        return {
          ...restaurant,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount,
        }
      }),
    )

    // Sort by rating if requested
    if (sortBy === "rating") {
      restaurantsWithStats.sort((a, b) => b.avgRating - a.avgRating)
    }

    return NextResponse.json(restaurantsWithStats)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, address, location, category, imageUrl, tags } = await request.json()

    if (!name || !address || !location || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newRestaurant = await db
      .insert(restaurants)
      .values({
        name,
        description,
        address,
        location,
        category,
        imageUrl,
        tags: JSON.stringify(tags || []),
      })
      .returning()

    return NextResponse.json(newRestaurant[0])
  } catch (error) {
    console.error("Error creating restaurant:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
