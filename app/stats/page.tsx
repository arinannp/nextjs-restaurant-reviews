'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Users, MapPin } from "lucide-react"

async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch stats")
    return await response.json()
  } catch (error) {
    console.error("Error fetching stats:", error)
    return null
  }
}

export default async function StatsPage() {
  const stats = await getStats()

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading statistics. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Platform Statistics</h1>
        <p className="text-gray-600">Overview of restaurants, reviews, and user activity</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalRestaurants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reviews/Restaurant</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.averageReviewsPerRestaurant}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.ratingDistribution.map((item: any) => (
                <div key={item.rating} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {item.rating} Star{item.rating !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count} reviews</span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Rated Restaurants */}
        <Card>
          <CardHeader>
            <CardTitle>Top Rated Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topRated.map((restaurant: any, index: number) => (
                <div key={restaurant.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-lg font-semibold mr-2">#{index + 1}</span>
                      <h3 className="font-medium">{restaurant.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{restaurant.location}</p>
                    <Badge variant="secondary" className="mt-1">
                      {restaurant.category.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{restaurant.avgRating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{restaurant.reviewCount} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Reviewed Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle>Most Reviewed Restaurants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.mostReviewed.map((restaurant: any, index: number) => (
              <div key={restaurant.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{restaurant.name}</h3>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{restaurant.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm">{restaurant.avgRating > 0 ? restaurant.avgRating : "No ratings"}</span>
                  </div>
                  <span className="text-sm font-medium">{restaurant.reviewCount} reviews</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
