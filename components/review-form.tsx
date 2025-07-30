"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ReviewFormProps {
  restaurantId: string
}

export function ReviewForm({ restaurantId }: ReviewFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600 mb-4">Please sign in to leave a review</p>
          <div className="flex justify-center">
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId,
          rating,
          comment: comment.trim(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review submitted successfully!",
        })
        setRating(0)
        setComment("")
        router.refresh()
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
