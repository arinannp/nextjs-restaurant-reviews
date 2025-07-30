// import type { Config } from "drizzle-kit"

// export default {
//   schema: "./lib/db/schema.ts",
//   out: "./drizzle",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
// } satisfies Config

import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_l4r2eSZmEkMq@ep-rough-queen-a1ahlfxk-pooler.ap-southeast-1.aws.neon.tech/restaurant_ratings?sslmode=require&channel_binding=require', // put connection string  here ...
  },
})