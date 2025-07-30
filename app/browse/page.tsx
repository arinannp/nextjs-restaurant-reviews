import { db } from "@/lib/db"
import { restaurants, reviews } from "@/lib/db/schema"
import { desc, asc, ilike, eq } from "drizzle-orm"
import { RestaurantCard } from "@/components/restaurant-card"
import { SearchFilters } from "@/components/search-filters"

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; location?: string; sortBy?: string }
}) {
  const { search, category, location, sortBy = "newest" } = await searchParams

  try {
    // Get restaurants with basic filtering
    let restaurantQuery = db.select().from(restaurants)

    // Apply filters
    if (search) {
      restaurantQuery = restaurantQuery.where(ilike(restaurants.name, `%${search}%`))
    }
    if (category && category !== "all") {
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

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Restaurants & Coffee Shops</h1>
          <SearchFilters />
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Found {restaurantsWithStats.length} result{restaurantsWithStats.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantsWithStats.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {restaurantsWithStats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading restaurants. Please try again later.</p>
        </div>
      </div>
    )
  }
}
