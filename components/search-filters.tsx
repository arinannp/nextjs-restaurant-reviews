"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "all") params.set("category", category)
    if (location) params.set("location", location)
    if (sortBy) params.set("sortBy", sortBy)

    router.push(`/?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    setCategory("all")
    setLocation("")
    setSortBy("newest")
    router.push("/")
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="coffee_shop">Coffee Shop</SelectItem>
            <SelectItem value="cafe">Cafe</SelectItem>
            <SelectItem value="fast_food">Fast Food</SelectItem>
            <SelectItem value="fine_dining">Fine Dining</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1 md:flex-none">
          Search
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
