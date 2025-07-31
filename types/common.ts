/* eslint-disable @typescript-eslint/no-explicit-any */
export type BaseUserType = {
  id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'user'
  created_at: Date | null
}

export type BaseRestaurantType = {
  id: string
  name: string
  description: string
  address: string
  location: string
  category: string
  image_url: string
  tags: string
  created_at: Date | null
  updated_at: Date | null
}

export type BaseReviewType = {
  id: string
  restaurant_id: string
  user_id: string
  rating: string
  comment: string
  image_url: string
  created_at: Date | null
  updated_at: Date | null
}