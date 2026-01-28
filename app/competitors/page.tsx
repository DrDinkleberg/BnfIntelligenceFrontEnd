'use client'

import { Suspense } from 'react'
import { useFilters } from '@/hooks/use-filters'
import { CompetitorFiltersSchema } from '@/types/filters'
import { FilterBar } from '@/components/filters/filter-bar'
import CompetitorsView from '@/components/competitors-view'

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

      <FilterBar
        filters={filters}
        config={filterConfig}
        onChange={setFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        isPending={isPending}
      />

      <div className="flex-1 overflow-auto">
        <CompetitorsView />
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
