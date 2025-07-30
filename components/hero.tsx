import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Next
            <br />
            <span className="text-yellow-300">Favorite Spot</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Discover amazing restaurants and coffee shops through authentic reviews
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input placeholder="Search restaurants, coffee shops..." className="pl-10 h-12 text-gray-900" />
              </div>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                Search
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/browse">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-orange-600 bg-transparent"
              >
                Browse All Places
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
