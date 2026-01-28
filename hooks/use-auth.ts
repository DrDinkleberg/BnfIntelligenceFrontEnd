"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useCallback } from "react"

export function useAuth() {
  const { data: session, status } = useSession()

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  const user = session?.user

  const login = useCallback(async () => {
    await signIn("google", { callbackUrl: "/" })
  }, [])

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" })
  }, [])

  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
