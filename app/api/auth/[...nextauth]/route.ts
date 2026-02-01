/**
 * NextAuth Route Handler
 * 
 * Auth config is in lib/auth.ts to avoid circular imports
 * between this file and the BFF proxy route.
 */

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
