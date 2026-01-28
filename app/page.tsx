'use client'

import { useCallback } from 'react'
import HomeDashboard from '@/components/home-dashboard'
import { useNavigateWithFilters } from '@/hooks/use-navigate-with-filters'

export default function DashboardPage() {
  const { toCompetitors, toAlerts, toMarketIntel, toBoard, toDashboard } = useNavigateWithFilters()

  // Bridge handlers for HomeDashboard props
  // These translate tab-based navigation to URL-based routing with filters
  const handleNavigate = useCallback((tab: string) => {
    switch (tab) {
      case 'home':
        toDashboard()
        break
      case 'board':
        toBoard()
        break
      case 'competitors':
        toCompetitors()
        break
      case 'competitors-ads':
        // Navigate to competitors with ads view
        toCompetitors({ view: 'ads' })
        break
      case 'market-intel':
        toMarketIntel()
        break
      case 'alerts':
        toAlerts()
        break
      default:
        toDashboard()
    }
  }, [toDashboard, toBoard, toCompetitors, toMarketIntel, toAlerts])

  // Navigate to market intel with practice area filter
  const handleNavigateToPracticeArea = useCallback((area: string) => {
    // Normalize practice area names for URL params
    const practiceAreaMap: Record<string, string> = {
      'Class Action': 'class-action',
      'Mass Torts': 'mass-torts',
      'Mass Arbitration': 'mass-arbitration',
    }
    const normalizedArea = practiceAreaMap[area] || area.toLowerCase().replace(/\s+/g, '-')
    toMarketIntel({ practiceArea: normalizedArea })
  }, [toMarketIntel])

  return (
    <HomeDashboard 
      onNavigate={handleNavigate} 
      onNavigateToPracticeArea={handleNavigateToPracticeArea}
    />
  )
}
