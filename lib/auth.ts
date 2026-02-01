/**
 * NextAuth Configuration
 * 
 * Exported from a separate file so both:
 *   - app/api/auth/[...nextauth]/route.ts (NextAuth handler)
 *   - app/api/v1/[...path]/route.ts (BFF proxy)
 * can import authOptions without circular dependencies.
 */

import { type NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          hd: "bursor.com",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email?.endsWith("@bursor.com")) {
        return true
      }
      return false
    },

    async jwt({ token, user, account }): Promise<JWT> {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : 0,
          user: {
            id: user.id,
            email: user.email || '',
            name: user.name || '',
            image: user.image || undefined,
          },
        }
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user as typeof session.user
        session.accessToken = token.accessToken as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
}
