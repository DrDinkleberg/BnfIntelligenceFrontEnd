'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { routes, buildFilteredUrl } from '@/lib/navigation'

/**
 * Hook for navigating to routes with filters.
 * Use this from dashboard/home page to navigate to filtered views.
 */
export function useNavigateWithFilters() {
  const router = useRouter()

  const navigateTo = useCallback((
    path: string,
    filters?: Record<string, string | undefined>
  ) => {
    const url = filters ? buildFilteredUrl(path, filters) : path
    router.push(url)
  }, [router])

  // Convenience methods for common navigation patterns
  const navigation = {
    // Navigate to competitors with optional filters
    // view: 'firms' | 'ads' - controls which sub-tab is shown
    toCompetitors: (filters?: { 
      view?: 'firms' | 'ads'
      firm?: string
      tier?: string
      platform?: string 
      practiceArea?: string
      search?: string
    }) => navigateTo(routes.competitors, filters),

    // Navigate to specific competitor detail page
    toCompetitorDetail: (id: string) => 
      navigateTo(routes.competitorDetail(id)),

    // Navigate to market intel with optional filters
    toMarketIntel: (filters?: {
      practiceArea?: string
      topic?: string
      source?: string
      dateRange?: string
    }) => navigateTo(routes.marketIntel, filters),

    // Navigate to alerts with optional filters
    toAlerts: (filters?: {
      category?: string
      severity?: string
      source?: string
      dateRange?: string
    }) => navigateTo(routes.alerts, filters),

    // Navigate to board with optional filters
    toBoard: (filters?: {
      status?: string
      priority?: string
      assignee?: string
    }) => navigateTo(routes.board, filters),

    // Navigate to dashboard home
    toDashboard: () => navigateTo(routes.home),

    // Navigate to settings
    toSettings: () => navigateTo(routes.settings),

    // Navigate to profile
    toProfile: () => navigateTo(routes.profile),

    // Generic navigation with any filters
    to: navigateTo,
  }

  return { navigateTo, ...navigation }
}

// Type for the return value of the hook
export type NavigateWithFilters = ReturnType<typeof useNavigateWithFilters>
