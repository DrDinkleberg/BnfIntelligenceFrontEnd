import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If the user is authenticated, continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if the path is public
        const publicPaths = ["/login", "/api/auth"]
        const isPublicPath = publicPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        )

        // Allow public paths
        if (isPublicPath) {
          return true
        }

        // Require authentication for all other paths
        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  // Protect all routes except public ones
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$).*)",
  ],
}
