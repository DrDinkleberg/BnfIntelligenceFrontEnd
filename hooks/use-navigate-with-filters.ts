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
    toCompetitors: (filters?: { 
      firm?: string
      tier?: string
      platform?: string 
      practiceArea?: string
    }) => navigateTo(routes.competitors, filters),

    toCompetitorDetail: (id: string) => 
      navigateTo(routes.competitorDetail(id)),

    toMarketIntel: (filters?: {
      practiceArea?: string
      topic?: string
    }) => navigateTo(routes.marketIntel, filters),

    toAlerts: (filters?: {
      category?: string
      severity?: string
    }) => navigateTo(routes.alerts, filters),

    toBoard: (filters?: {
      status?: string
      priority?: string
    }) => navigateTo(routes.board, filters),

    toDashboard: () => navigateTo(routes.home),
  }

  return { navigateTo, ...navigation }
}
