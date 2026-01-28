'use client'

import { Suspense } from 'react'
import { useFilters } from '@/hooks/use-filters'
import { CompetitorFiltersSchema } from '@/types/filters'
import { FilterBar } from '@/components/filters/filter-bar'
import CompetitorsView from '@/components/competitors-view'
import CompetitorAds from '@/components/competitor-ads'
import { Building2, Megaphone } from 'lucide-react'

const filterConfig = [
  {
    key: 'tier',
    label: 'Tier',
    options: [
      { value: 'all', label: 'All Tiers' },
      { value: '1', label: 'Tier 1' },
      { value: '2', label: 'Tier 2' },
      { value: '3', label: 'Tier 3' },
    ],
  },
  {
    key: 'practiceArea',
    label: 'Practice Area',
    options: [
      { value: 'all', label: 'All Areas' },
      { value: 'class-action', label: 'Class Action' },
      { value: 'mass-torts', label: 'Mass Torts' },
      { value: 'mass-arbitration', label: 'Mass Arbitration' },
    ],
  },
  {
    key: 'platform',
    label: 'Platform',
    options: [
      { value: 'all', label: 'All Platforms' },
      { value: 'google', label: 'Google' },
      { value: 'meta', label: 'Meta' },
      { value: 'linkedin', label: 'LinkedIn' },
    ],
  },
  {
    key: 'timeRange',
    label: 'Time Range',
    options: [
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' },
      { value: '90d', label: 'Last 90 days' },
      { value: '1y', label: 'Last year' },
    ],
  },
]

function CompetitorsPageContent() {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    hasActiveFilters,
    isPending 
  } = useFilters({ schema: CompetitorFiltersSchema })

  const currentView = filters.view || 'firms'

  const handleViewChange = (view: 'firms' | 'ads') => {
    setFilters({ view })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Active filter indicator */}
      {filters.firm && (
        <div className="px-4 py-2 bg-primary/10 border-b border-primary/20">
          <span className="text-sm text-primary">
            Showing results for: <strong>{filters.firm}</strong>
          </span>
        </div>
      )}

      {/* Sub-tabs for Firms / Ads Feed */}
      <div className="border-b border-border bg-background">
        <div className="flex items-center px-4">
          <button
            onClick={() => handleViewChange('firms')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              currentView === 'firms'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Firms
          </button>
          <button
            onClick={() => handleViewChange('ads')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              currentView === 'ads'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Megaphone className="h-4 w-4" />
            Ads Feed
          </button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        config={filterConfig}
        onChange={setFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        isPending={isPending}
      />

      <div className="flex-1 overflow-auto">
        {currentView === 'firms' ? (
          <CompetitorsView />
        ) : (
          <CompetitorAds preSelectedPracticeArea={null} />
        )}
      </div>
    </div>
  )
}

export default function CompetitorsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <CompetitorsPageContent />
    </Suspense>
  )
}
