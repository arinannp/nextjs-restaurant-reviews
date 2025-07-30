import { Suspense } from "react"
import { db } from "@/lib/db"
import { restaurants, reviews } from "@/lib/db/schema"
import { desc, eq, ilike } from "drizzle-orm"
import { RestaurantCard } from "@/components/restaurant-card"
import { SearchFilters } from "@/components/search-filters"
import { Hero } from "@/components/hero"

async function RestaurantList({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; location?: string; sortBy?: string }
}) {
  const { search, category, location, sortBy = "newest" } = await searchParams

  try {
    // First, get all restaurants with basic filtering
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

    // Apply basic sorting (we'll calculate ratings separately)
    switch (sortBy) {
      case "oldest":
        restaurantQuery = restaurantQuery.orderBy(restaurants.createdAt)
        break
      default:
        restaurantQuery = restaurantQuery.orderBy(desc(restaurants.createdAt))
    }

    const restaurantList = await restaurantQuery.limit(12)

    // Now get review statistics for each restaurant
    const restaurantsWithStats = await Promise.all(
      restaurantList.map(async (restaurant) => {
        const reviewStats = await db
          .select({
            avgRating: reviews.rating,
            count: reviews.id,
          })
          .from(reviews)
          .where(eq(reviews.restaurantId, restaurant.id))

        const avgRating =
          reviewStats.length > 0
            ? reviewStats.reduce((sum, review) => sum + review.avgRating, 0) / reviewStats.length
            : 0

        const reviewCount = reviewStats.length

        return {
          ...restaurant,
          avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
          reviewCount,
        }
      }),
    )

    // Sort by rating if requested (after calculating ratings)
    if (sortBy === "rating") {
      restaurantsWithStats.sort((a, b) => b.avgRating - a.avgRating)
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantsWithStats.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
        {restaurantsWithStats.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-red-500 text-lg">Error loading restaurants. Please try again later.</p>
      </div>
    )
  }
}

function RestaurantListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-lg" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; location?: string; sortBy?: string }
}) {
  return (
    <div className="min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Great Places</h2>
          <SearchFilters />
        </div>

        <Suspense fallback={<RestaurantListSkeleton />}>
          <RestaurantList searchParams={await searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
