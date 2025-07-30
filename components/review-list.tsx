import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment: string
  imageUrl: string | null
  createdAt: Date
  user: {
    name: string
  } | null
}

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="font-medium text-gray-900">{review.user?.name || "Anonymous"}</p>
              </div>
              <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>

            <p className="text-gray-700 mb-3">{review.comment}</p>

            {review.imageUrl && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image src={review.imageUrl || "/placeholder.svg"} alt="Review image" fill className="object-cover" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
