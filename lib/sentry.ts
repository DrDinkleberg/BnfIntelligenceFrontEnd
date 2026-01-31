// ============================================
// Sentry Configuration for BNF Intelligence Platform
// ============================================

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured - error tracking disabled')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Release tracking (set in CI/CD)
    release: process.env.NEXT_PUBLIC_RELEASE_VERSION || 'development',

    // Sample rate for performance monitoring (1.0 = 100%)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Sample rate for session replays
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Enable debug in development
    debug: process.env.NODE_ENV === 'development',

    // Integrations
    integrations: [
      // Automatically instrument browser requests
      Sentry.browserTracingIntegration(),
      // Session replay for debugging
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Filter out noisy errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.teletrader.cz/',
      'atomicFindClose',
      
      // Facebook blocked
      /fb_xd_fragment/,
      
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      
      // Safari extensions
      /safari-web-extension/i,
      
      // Generic errors that aren't actionable
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      
      // Network errors
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'NetworkError',
      
      // User cancellation
      'AbortError',
      'The operation was aborted',
    ],

    // Filter out transactions from certain URLs
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      
      // Firefox extensions
      /^moz-extension:\/\//i,
      
      // Safari extensions
      /^safari-extension:\/\//i,
      /^safari-web-extension:\/\//i,
      
      // Google Tag Manager / Analytics
      /googletagmanager\.com/i,
      /google-analytics\.com/i,
    ],

    // Before sending, enrich/filter the event
    beforeSend(event, hint) {
      // Don't send errors in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
        console.log('Sentry event (not sent in dev):', event)
        return null
      }

      // Filter out certain error types
      const error = hint.originalException
      if (error instanceof Error) {
        // Don't report user-cancelled requests
        if (error.name === 'AbortError') {
          return null
        }
        
        // Don't report 401/403 errors (expected for auth)
        if (error.message?.includes('401') || error.message?.includes('403')) {
          return null
        }
      }

      return event
    },

    // Before sending breadcrumbs, filter sensitive data
    beforeBreadcrumb(breadcrumb) {
      // Remove sensitive URL parameters
      if (breadcrumb.data?.url) {
        const url = new URL(breadcrumb.data.url, 'http://localhost')
        url.searchParams.delete('token')
        url.searchParams.delete('key')
        url.searchParams.delete('password')
        breadcrumb.data.url = url.pathname + url.search
      }

      return breadcrumb
    },
  })
}

// ============================================
// Utility functions for manual error tracking
// ============================================

/**
 * Capture an error with additional context
 */
export function captureError(
  error: Error,
  context?: {
    tags?: Record<string, string>
    extra?: Record<string, unknown>
    user?: { id: string; email?: string }
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      for (const [key, value] of Object.entries(context.tags)) {
        scope.setTag(key, value)
      }
    }

    if (context?.extra) {
      for (const [key, value] of Object.entries(context.extra)) {
        scope.setExtra(key, value)
      }
    }

    if (context?.user) {
      scope.setUser(context.user)
    }

    Sentry.captureException(error)
  })
}

/**
 * Capture a message (non-error event)
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
) {
  Sentry.withScope((scope) => {
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value)
      }
    }

    Sentry.captureMessage(message, level)
  })
}

/**
 * Set the current user for error tracking
 */
export function setUser(user: { id: string; email?: string; name?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    })
  } else {
    Sentry.setUser(null)
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
    timestamp: Date.now() / 1000,
  })
}

/**
 * Start a performance transaction
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startSpan({ name, op }, () => {})
}
