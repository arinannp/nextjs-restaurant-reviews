import { db } from "../lib/db"
import { users, restaurants, reviews } from "../lib/db/schema"
import { sql } from "drizzle-orm"

// Utility functions for database operations
export async function resetDatabase() {
  console.log("🗑️  Resetting database...")

  // Drop tables in correct order (due to foreign key constraints)
  await db.execute(sql`DROP TABLE IF EXISTS reviews CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS restaurants CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`)

  // Drop custom types
  await db.execute(sql`DROP TYPE IF EXISTS role CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS category CASCADE`)

  console.log("✅ Database reset complete")
}

export async function checkDatabaseConnection() {
  try {
    await db.execute(sql`SELECT 1`)
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

export async function getDatabaseStats() {
  try {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users)
    const [restaurantCount] = await db.select({ count: sql<number>`count(*)` }).from(restaurants)
    const [reviewCount] = await db.select({ count: sql<number>`count(*)` }).from(reviews)

    console.log("📊 Database Statistics:")
    console.log(`   Users: ${userCount.count}`)
    console.log(`   Restaurants: ${restaurantCount.count}`)
    console.log(`   Reviews: ${reviewCount.count}`)

    return {
      users: userCount.count,
      restaurants: restaurantCount.count,
      reviews: reviewCount.count,
    }
  } catch (error) {
    console.error("❌ Failed to get database stats:", error)
    return null
  }
}

// Run this script to test the database connection
if (require.main === module) {
  checkDatabaseConnection()
    .then(() => getDatabaseStats())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Script failed:", error)
      process.exit(1)
    })
}
