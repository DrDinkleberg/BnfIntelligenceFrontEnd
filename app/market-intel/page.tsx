'use client'

import { Suspense } from 'react'
import { useFilters } from '@/hooks/use-filters'
import { MarketIntelFiltersSchema } from '@/types/filters'
import { FilterBar } from '@/components/filters/filter-bar'
import MarketIntel from '@/components/market-intel'

const filterConfig = [
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
    key: 'timeRange',
    label: 'Time Range',
    options: [
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' },
      { value: '90d', label: 'Last 90 days' },
    ],
  },
]

function MarketIntelPageContent() {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    hasActiveFilters,
    isPending 
  } = useFilters({ schema: MarketIntelFiltersSchema })

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Topic indicator */}
      {filters.topic && (
        <div className="px-4 py-2 bg-primary/10 border-b border-primary/20">
          <span className="text-sm text-primary">
            Topic: <strong>{filters.topic}</strong>
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
        <MarketIntel />
      </div>
    </div>
  )
}

export default function MarketIntelPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <MarketIntelPageContent />
    </Suspense>
  )
}
