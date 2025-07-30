import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"

interface RestaurantCardProps {
  restaurant: {
    id: string
    name: string
    description: string | null
    address: string
    location: string
    category: string
    imageUrl: string | null
    tags: string | null
    avgRating: number
    reviewCount: number
  }
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const tags = restaurant.tags ? JSON.parse(restaurant.tags) : []

  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={restaurant.imageUrl || "/placeholder.svg?height=200&width=400&query=restaurant"}
            alt={restaurant.name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{restaurant.name}</h3>
            <Badge variant="secondary" className="ml-2">
              {restaurant.category.replace("_", " ")}
            </Badge>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">
                {restaurant.avgRating > 0 ? restaurant.avgRating.toFixed(1) : "No ratings"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {restaurant.reviewCount} review{restaurant.reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
