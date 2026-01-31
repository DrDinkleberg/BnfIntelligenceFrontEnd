import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"

const authOptions: NextAuthOptions = {
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
    jwt({ token, user, account }): JWT {
      if (account && user) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0
        token.user = {
          id: user.id,
          email: user.email ?? "",
          name: user.name ?? "",
          image: user.image ?? "",
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as typeof session.user
      }
      if (token?.accessToken) {
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
    maxAge: 8 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
