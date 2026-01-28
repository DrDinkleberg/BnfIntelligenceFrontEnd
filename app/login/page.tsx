"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

// B&F Intelligence Platform Logo
const BFLogo = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Abstract scales of justice / intelligence network */}
    <rect width="48" height="48" rx="8" fill="currentColor" className="text-primary" />
    <path
      d="M12 16h24M24 16v20M16 20l8 8M32 20l-8 8M14 32h8M26 32h8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="12" r="2" fill="white" />
    <circle cx="14" cy="34" r="2" fill="white" />
    <circle cx="34" cy="34" r="2" fill="white" />
  </svg>
)

// Google Logo SVG
const GoogleLogo = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get error from URL if present
  const urlError = searchParams.get("error")
  const errorMessage = urlError === "AccessDenied" 
    ? "Access denied. Please use your @bursor.com email address."
    : urlError 
      ? "An error occurred during sign in. Please try again."
      : null

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      })

      if (result?.error) {
        setError("Failed to sign in. Please try again.")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg2di0yaDMwek02IDIydjJIMjB2LTJINnptMjAgMHYyaDEwdi0ySDI2em0xNCAwdjJoMTR2LTJINDB6TTYgMTh2Mkg0NHYtMkg2em0wLTR2Mmg0NHYtMkg2em0wLTR2Mmg0NHYtMkg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      {/* Gradient Orbs */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <Card className="relative w-full max-w-md border-0 bg-white/80 px-2 py-8 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80 sm:rounded-2xl sm:px-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-8">
            {/* Logo and Title */}
            <div className="flex flex-col items-center space-y-4">
              <BFLogo className="h-16 w-16" />
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                  B&F Intelligence
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Legal Competitive Intelligence Platform
                </p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Welcome back
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sign in with your Bursor & Fisher account
              </p>
            </div>

            {/* Error Alert */}
            {(error || errorMessage) && (
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error || errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Sign In Button */}
            <div className="w-full space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="relative h-12 w-full gap-3 rounded-xl border-slate-200 bg-white text-base font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <GoogleLogo />
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>

              {/* Domain Notice */}
              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                Only @bursor.com accounts are authorized
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                By signing in, you agree to Bursor & Fisher's{" "}
                <a href="#" className="underline underline-offset-2 hover:text-slate-600 dark:hover:text-slate-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-2 hover:text-slate-600 dark:hover:text-slate-300">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-400 dark:text-slate-500">
        B&F Intelligence Platform v1.0
      </div>
    </div>
  )
}
