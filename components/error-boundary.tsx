'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// ============================================
// Error Boundary Class Component
// ============================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Call optional error handler (for logging to service like Sentry)
    this.props.onError?.(error, errorInfo)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error)
      console.error('Component stack:', errorInfo.componentStack)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          showDetails={this.props.showDetails}
        />
      )
    }

    return this.props.children
  }
}

// ============================================
// Error Fallback UI Component
// ============================================

interface ErrorFallbackProps {
  error?: Error | null
  errorInfo?: ErrorInfo | null
  onRetry?: () => void
  showDetails?: boolean
  title?: string
  description?: string
}

export function ErrorFallback({
  error,
  errorInfo,
  onRetry,
  showDetails = process.env.NODE_ENV === 'development',
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
}: ErrorFallbackProps) {
  const [showStack, setShowStack] = React.useState(false)

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-lg border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
            </div>

            {/* Error Message (if available) */}
            {error?.message && (
              <div className="w-full p-3 rounded-md bg-destructive/5 border border-destructive/20">
                <p className="text-sm text-destructive font-mono">{error.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {onRetry && (
                <Button onClick={onRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Stack Trace (Development) */}
            {showDetails && (error?.stack || errorInfo?.componentStack) && (
              <div className="w-full pt-4 border-t border-border">
                <button
                  onClick={() => setShowStack(!showStack)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Bug className="h-3 w-3" />
                  {showStack ? 'Hide' : 'Show'} technical details
                  {showStack ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                {showStack && (
                  <div className="mt-3 p-3 rounded-md bg-muted/50 text-left overflow-auto max-h-48">
                    <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                      {error?.stack || errorInfo?.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Support Link */}
            <p className="text-xs text-muted-foreground pt-2">
              If this problem persists, please{' '}
              <a href="mailto:support@bursor.com" className="text-primary hover:underline">
                contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// Inline Error Component (for smaller sections)
// ============================================

interface InlineErrorProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function InlineError({
  message = 'Failed to load content',
  onRetry,
  className,
}: InlineErrorProps) {
  return (
    <div className={`flex items-center justify-center gap-3 p-4 rounded-md bg-destructive/5 border border-destructive/20 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
      <span className="text-sm text-destructive">{message}</span>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="h-7 text-xs">
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  )
}

// ============================================
// Error Card Component (for card-level errors)
// ============================================

interface ErrorCardProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorCard({
  title = 'Error',
  message = 'Something went wrong loading this content.',
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <Card className={`border-destructive/30 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <h3 className="font-medium text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-3 w-3" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================
// Higher-Order Component for Error Handling
// ============================================

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// ============================================
// Hook for Error Handling (for functional components)
// ============================================

interface UseErrorHandlerReturn {
  error: Error | null
  setError: (error: Error | null) => void
  clearError: () => void
  handleError: (error: unknown) => void
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = React.useState<Error | null>(null)

  const clearError = React.useCallback(() => setError(null), [])

  const handleError = React.useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error)
    } else if (typeof error === 'string') {
      setError(new Error(error))
    } else {
      setError(new Error('An unknown error occurred'))
    }
  }, [])

  return { error, setError, clearError, handleError }
}
