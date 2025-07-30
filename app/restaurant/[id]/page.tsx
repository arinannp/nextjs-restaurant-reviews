import { notFound } from "next/navigation"
import Image from "next/image"
import { db } from "@/lib/db"
import { restaurants, reviews, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock } from "lucide-react"
import { ReviewForm } from "@/components/review-form"
import { ReviewList } from "@/components/review-list"

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  try {
    // Get restaurant details
    const restaurantData = await db.select().from(restaurants).where(eq(restaurants.id, params.id)).limit(1)

    if (!restaurantData.length) {
      notFound()
    }

    const restaurant = restaurantData[0]

    // Get review statistics
    const reviewStats = await db
      .select({
        rating: reviews.rating,
      })
      .from(reviews)
      .where(eq(reviews.restaurantId, params.id))

    const avgRating =
      reviewStats.length > 0 ? reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewStats.length : 0

    const reviewCount = reviewStats.length

    const restaurantWithStats = {
      ...restaurant,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount,
    }

    const tags = restaurant.tags ? JSON.parse(restaurant.tags) : []

    // Get reviews with user names
    const restaurantReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        imageUrl: reviews.imageUrl,
        createdAt: reviews.createdAt,
        user: {
          name: users.name,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.restaurantId, params.id))
      .orderBy(desc(reviews.createdAt))

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant Details */}
          <div className="lg:col-span-2">
            <div className="relative h-64 md:h-96 w-full mb-6 rounded-lg overflow-hidden">
              <Image
                src={restaurantWithStats.imageUrl || "/placeholder.svg?height=400&width=800&query=restaurant interior"}
                alt={restaurantWithStats.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurantWithStats.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{restaurantWithStats.address}</span>
                    </div>
                    <Badge variant="secondary">{restaurantWithStats.category.replace("_", " ")}</Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-xl font-semibold">
                      {restaurantWithStats.avgRating > 0 ? restaurantWithStats.avgRating.toFixed(1) : "No ratings"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {restaurantWithStats.reviewCount} review{restaurantWithStats.reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {restaurantWithStats.description && (
                <p className="text-gray-700 mb-4">{restaurantWithStats.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
              <ReviewForm restaurantId={restaurantWithStats.id} />
              <ReviewList reviews={restaurantReviews} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">{restaurantWithStats.address}</p>
                    <p className="text-sm text-gray-600">{restaurantWithStats.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="font-medium">Added</p>
                    <p className="text-sm text-gray-600">
                      {new Date(restaurantWithStats.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {restaurantWithStats.avgRating > 0 ? restaurantWithStats.avgRating.toFixed(1) : "N/A"}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= restaurantWithStats.avgRating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {restaurantWithStats.reviewCount} review{restaurantWithStats.reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    notFound()
  }
}
