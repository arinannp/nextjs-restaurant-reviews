// https://next-auth.js.org/providers/credentials
// https://next-auth.js.org/configuration/callbacks
// https://next-auth.js.org/configuration/nextjs#secret
// https://next-auth.js.org/configuration/options#options

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { BaseUserType } from '@/types/common'
import { RequestInternal } from 'next-auth'

const MAX_AGE = 60 * 60 * 24

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<BaseUserType & { token: string }> {
        const user = (await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email || ''))
          .limit(1)
          .then((res) => res[0])) as BaseUserType

        if (!user) {
          throw new Error('User not registered')
        }

        const isValidPassword = await bcrypt.compare(
          credentials?.password || '',
          user.password,
        )

        if (!isValidPassword) {
          throw new Error('User not valid')
        }

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.NEXT_PUBLIC_JWT_SECRET!,
          { expiresIn: '1d' },
        )

        return { ...user, token }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = user.role
        token.email = user.email
        token.token = user.token
        token.expires = Math.floor(Date.now() / 1000) + MAX_AGE
      }

      if (token.expires && Date.now() / 1000 > Number(token.expires || 0)) {
        return {}
      }

      return token
    },
    async session({ session, token }: any) {
      if (!token.id) {
        return null
      }

      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.role = token.role
        session.user.email = token.email
        session.user.token = token.token
      }

      console.log('session =>', session)
      return session
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
}
