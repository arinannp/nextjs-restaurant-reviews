import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { restaurants, reviews, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users, Star, MapPin } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  try {
    // Get statistics by counting records
    const [allRestaurants, allReviews, allUsers] = await Promise.all([
      db.select().from(restaurants),
      db.select().from(reviews),
      db.select().from(users).where(eq(users.role, "user")),
    ])

    const restaurantCount = allRestaurants.length
    const reviewCount = allReviews.length
    const userCount = allUsers.length

    // Get recent restaurants
    const recentRestaurants = await db.select().from(restaurants).orderBy(desc(restaurants.createdAt)).limit(5)

    // Calculate stats for recent restaurants
    const recentRestaurantsWithStats = await Promise.all(
      recentRestaurants.map(async (restaurant) => {
        const restaurantReviews = await db
          .select({ rating: reviews.rating })
          .from(reviews)
          .where(eq(reviews.restaurantId, restaurant.id))

        const avgRating =
          restaurantReviews.length > 0
            ? restaurantReviews.reduce((sum, review) => sum + review.rating, 0) / restaurantReviews.length
            : 0

        const reviewCount = restaurantReviews.length

        return {
          ...restaurant,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount,
        }
      }),
    )

    // Get recent reviews
    const recentReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        restaurant: {
          name: restaurants.name,
        },
        user: {
          name: users.name,
        },
      })
      .from(reviews)
      .leftJoin(restaurants, eq(reviews.restaurantId, restaurants.id))
      .leftJoin(users, eq(reviews.userId, users.id))
      .orderBy(desc(reviews.createdAt))
      .limit(5)

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Manage restaurants and reviews</p>
            <Link href="/admin/restaurants/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Restaurant
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurantCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Restaurants */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRestaurantsWithStats.map((restaurant) => (
                  <div key={restaurant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600">{restaurant.location}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{restaurant.category.replace("_", " ")}</Badge>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs">
                            {restaurant.avgRating > 0 ? restaurant.avgRating.toFixed(1) : "No ratings"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{restaurant.reviewCount} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium">{review.restaurant?.name}</p>
                        <p className="text-xs text-gray-600">by {review.user?.name}</p>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading admin dashboard:", error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading dashboard. Please try again later.</p>
        </div>
      </div>
    )
  }
}
