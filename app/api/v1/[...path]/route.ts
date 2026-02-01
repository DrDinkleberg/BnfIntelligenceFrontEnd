/**
 * BFF Proxy Route - Catch-all for /api/v1/*
 * 
 * This is the security boundary between browser and backend.
 * 
 * Flow:
 *   Browser → /api/v1/facebook-ads?page=1
 *   → This route validates NextAuth session
 *   → Forwards to https://api.pulsebiz.io/api/v1/facebook-ads?page=1
 *   → Attaches service API key (NEVER sent to browser)
 *   → Attaches user email for audit trail
 *   → Returns backend response to browser
 * 
 * Security guarantees:
 *   ✅ BACKEND_SERVICE_KEY never leaves server
 *   ✅ BACKEND_URL never exposed to client
 *   ✅ User email forwarded only over internal network
 *   ✅ Unauthenticated requests rejected before hitting backend
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Server-only env vars (no NEXT_PUBLIC_ prefix)
const BACKEND_URL = process.env.BACKEND_URL || "https://api.pulsebiz.io"
const BACKEND_SERVICE_KEY = process.env.BACKEND_SERVICE_KEY || ""

// Timeout for backend requests (ms)
const REQUEST_TIMEOUT = 30000

// Methods we proxy
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"]

// Paths that should NOT be proxied (handled by other Next.js routes)
const EXCLUDED_PATHS = ["/api/v1/auth/google"] // Backend auth handled separately


/**
 * Generic handler for all HTTP methods
 */
async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // 1. Validate method
  if (!ALLOWED_METHODS.includes(request.method)) {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    )
  }

  // 2. Check service key is configured
  if (!BACKEND_SERVICE_KEY) {
    console.error("[BFF] BACKEND_SERVICE_KEY not configured")
    return NextResponse.json(
      { error: "Service configuration error" },
      { status: 500 }
    )
  }

  // 3. Validate NextAuth session
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }

  // 4. Build backend URL
  const pathSegments = params.path.join("/")
  const backendPath = `/api/v1/${pathSegments}`

  // Check excluded paths
  if (EXCLUDED_PATHS.includes(backendPath)) {
    return NextResponse.json(
      { error: "This endpoint is not available through the proxy" },
      { status: 403 }
    )
  }

  // Preserve query parameters
  const url = new URL(request.url)
  const queryString = url.searchParams.toString()
  const backendUrl = `${BACKEND_URL}${backendPath}${queryString ? `?${queryString}` : ""}`

  // 5. Build headers for backend request
  const headers: Record<string, string> = {
    // Service authentication (NEVER sent to browser)
    "X-API-Key": BACKEND_SERVICE_KEY,

    // User attribution for audit trail
    "X-Forwarded-User-Email": session.user.email,
    "X-Forwarded-User-IP": request.headers.get("x-forwarded-for") || 
                            request.headers.get("x-real-ip") || 
                            "unknown",

    // Request tracing
    "X-Request-ID": request.headers.get("x-request-id") || crypto.randomUUID(),

    // Standard proxy headers
    "X-Forwarded-Host": url.hostname,
    "X-Forwarded-Proto": "https",
  }

  // Forward content-type for POST/PUT/PATCH
  const contentType = request.headers.get("content-type")
  if (contentType) {
    headers["Content-Type"] = contentType
  }

  // Forward accept header
  const accept = request.headers.get("accept")
  if (accept) {
    headers["Accept"] = accept
  }

  // 6. Build fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  }

  // Forward request body for POST/PUT/PATCH
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    try {
      const body = await request.text()
      if (body) {
        fetchOptions.body = body
      }
    } catch {
      // No body - that's fine for some requests
    }
  }

  // 7. Make backend request
  try {
    const backendResponse = await fetch(backendUrl, fetchOptions)

    // 8. Build response to browser
    const responseHeaders = new Headers()

    // Forward specific headers from backend
    const forwardHeaders = [
      "content-type",
      "x-total-count",
      "x-page",
      "x-per-page",
      "x-request-id",
    ]

    for (const header of forwardHeaders) {
      const value = backendResponse.headers.get(header)
      if (value) {
        responseHeaders.set(header, value)
      }
    }

    // SECURITY: Strip any headers that might leak backend info
    // We only forward the explicit whitelist above

    // Get response body
    const responseBody = await backendResponse.text()

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    })

  } catch (error: unknown) {
    // Handle timeout
    if (error instanceof DOMException && error.name === "TimeoutError") {
      console.error(`[BFF] Timeout: ${request.method} ${backendPath} (${REQUEST_TIMEOUT}ms)`)
      return NextResponse.json(
        { error: "Backend request timed out" },
        { status: 504 }
      )
    }

    // Handle network errors
    if (error instanceof TypeError && (error.message.includes("fetch") || error.message.includes("network"))) {
      console.error(`[BFF] Network error: ${request.method} ${backendPath}`, error.message)
      return NextResponse.json(
        { error: "Backend service unavailable" },
        { status: 502 }
      )
    }

    // Unknown error
    console.error(`[BFF] Unexpected error: ${request.method} ${backendPath}`, error)
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 }
    )
  }
}

// Export handlers for all HTTP methods
export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
