// import { drizzle } from "drizzle-orm/neon-http"
// import { neon } from "@neondatabase/serverless"
// import * as schema from "./schema"

// if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
//   throw new Error("DATABASE_URL environment variable is required")
// }

// const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL)
// export const db = drizzle(sql, { schema })

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_DATABASE_URL!,
})

export const db = drizzle(pool)
