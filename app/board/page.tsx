'use client'

import { Suspense } from 'react'
import { useFilters } from '@/hooks/use-filters'
import { BoardFiltersSchema } from '@/types/filters'
import BoardView from '@/components/board-view'

function BoardPageContent() {
  const { filters, setFilters } = useFilters({ 
    schema: BoardFiltersSchema 
  })

  // BoardView component can be updated later to accept filters as props
  // For now, just render the existing component
  return <BoardView />
}

export default function BoardPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <BoardPageContent />
    </Suspense>
  )
}
