import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { reviews, users } from "@/lib/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    const result = await db
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
      .where(eq(reviews.restaurantId, restaurantId))
      .orderBy(desc(reviews.createdAt))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { restaurantId, rating, comment, imageUrl } = await request.json()

    if (!restaurantId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const newReview = await db
      .insert(reviews)
      .values({
        restaurantId,
        userId: session.user.id,
        rating,
        comment,
        imageUrl,
      })
      .returning()

    return NextResponse.json(newReview[0])
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
