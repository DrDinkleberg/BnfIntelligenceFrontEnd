'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import HomeDashboard from '@/components/home-dashboard'
import { routes, buildFilteredUrl } from '@/lib/navigation'

export default function DashboardPage() {
  const router = useRouter()

  // Bridge handlers for legacy HomeDashboard props
  // These translate old tab-based navigation to new URL-based routing
  const handleNavigate = useCallback((tab: string) => {
    switch (tab) {
      case 'home':
        router.push(routes.home)
        break
      case 'board':
        router.push(routes.board)
        break
      case 'competitors':
        router.push(routes.competitors)
        break
      case 'market-intel':
        router.push(routes.marketIntel)
        break
      case 'alerts':
        router.push(routes.alerts)
        break
      default:
        router.push(routes.home)
    }
  }, [router])

  const handleNavigateToPracticeArea = useCallback((area: string) => {
    // Navigate to market intel with practice area filter
    const url = buildFilteredUrl(routes.marketIntel, { practiceArea: area })
    router.push(url)
  }, [router])

  return (
    <HomeDashboard 
      onNavigate={handleNavigate} 
      onNavigateToPracticeArea={handleNavigateToPracticeArea}
    />
  )
}
