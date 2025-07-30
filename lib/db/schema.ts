import { pgTable, text, integer, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const roleEnum = pgEnum("role", ["user", "admin"])
export const categoryEnum = pgEnum("category", ["restaurant", "coffee_shop", "cafe", "fast_food", "fine_dining"])

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const restaurants = pgTable("restaurants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  location: text("location").notNull(),
  category: categoryEnum("category").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags"), // JSON string of tags
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  restaurantId: uuid("restaurant_id")
    .references(() => restaurants.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
}))

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  reviews: many(reviews),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}))


// INSERT INTO users (email, password, name, role) VALUES ('admin@mail.com', '$2a$12$WrVGbnSYAQr.RpVIISQExepfZnNVpkTkd8o7Fh.JuacCN9O2/Jjmy', 'admin', 'admin');
// email: 'admin@mail.com'
// password: 'admin'