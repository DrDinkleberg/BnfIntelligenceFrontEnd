import NextAuth, { type NextAuthOptions } from "next-auth"
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
          // Restrict to bursor.com domain
          hd: "bursor.com",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow @bursor.com emails
      if (user.email?.endsWith("@bursor.com")) {
        return true
      }
      // Reject non-bursor.com emails
      return false
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          },
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to refresh it
      // For now, we'll just return the token and let the user re-authenticate
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
      // After sign in, redirect to dashboard
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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
