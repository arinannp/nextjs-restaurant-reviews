import { db } from "../lib/db"
import { restaurants, reviews, users } from "../lib/db/schema"
import { eq } from "drizzle-orm"

async function checkRatings() {
  console.log("🔍 Checking restaurant ratings and reviews...\n")

  try {
    // Get all restaurants
    const allRestaurants = await db.select().from(restaurants)

    for (const restaurant of allRestaurants) {
      // Get reviews for this restaurant
      const restaurantReviews = await db
        .select({
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          user: {
            name: users.name,
          },
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.restaurantId, restaurant.id))

      // Calculate average rating
      const avgRating =
        restaurantReviews.length > 0
          ? restaurantReviews.reduce((sum, review) => sum + review.rating, 0) / restaurantReviews.length
          : 0

      console.log(`📍 ${restaurant.name}`)
      console.log(`   Category: ${restaurant.category.replace("_", " ")}`)
      console.log(`   Location: ${restaurant.location}`)
      console.log(`   Average Rating: ${avgRating > 0 ? avgRating.toFixed(1) : "No ratings"} ⭐`)
      console.log(`   Total Reviews: ${restaurantReviews.length}`)

      if (restaurantReviews.length > 0) {
        console.log(`   Recent Reviews:`)
        restaurantReviews
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
          .forEach((review, index) => {
            console.log(`     ${index + 1}. ${review.rating}⭐ by ${review.user?.name || "Anonymous"}`)
            console.log(`        "${review.comment.substring(0, 80)}${review.comment.length > 80 ? "..." : ""}"`)
          })
      }
      console.log("")
    }

    // Overall statistics
    const totalReviews = await db.select().from(reviews)
    const totalUsers = await db.select().from(users)

    console.log("📊 Overall Statistics:")
    console.log(`   Total Restaurants: ${allRestaurants.length}`)
    console.log(`   Total Reviews: ${totalReviews.length}`)
    console.log(`   Total Users: ${totalUsers.length}`)
    console.log(`   Average Reviews per Restaurant: ${(totalReviews.length / allRestaurants.length).toFixed(1)}`)

    // Rating distribution
    const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: totalReviews.filter((review) => review.rating === rating).length,
    }))

    console.log("\n⭐ Rating Distribution:")
    ratingCounts.forEach(({ rating, count }) => {
      const percentage = totalReviews.length > 0 ? ((count / totalReviews.length) * 100).toFixed(1) : "0"
      console.log(`   ${rating}⭐: ${count} reviews (${percentage}%)`)
    })
  } catch (error) {
    console.error("❌ Error checking ratings:", error)
  }
}

// Run the script
if (require.main === module) {
  checkRatings()
    .then(() => {
      console.log("\n✅ Rating check complete!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Script failed:", error)
      process.exit(1)
    })
}

export { checkRatings }
