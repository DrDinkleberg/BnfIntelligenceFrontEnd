'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

interface FilterBarProps {
  filters: Record<string, string | number | undefined>
  config: FilterConfig[]
  onChange: (filters: Record<string, string | undefined>) => void
  onReset: () => void
  hasActiveFilters: boolean
  isPending?: boolean
}

export function FilterBar({
  filters,
  config,
  onChange,
  onReset,
  hasActiveFilters,
  isPending,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
      {config.map((filter) => (
        <Select
          key={filter.key}
          value={String(filters[filter.key] || 'all')}
          onValueChange={(value) => onChange({ [filter.key]: value })}
          disabled={isPending}
        >
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground"
          disabled={isPending}
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}

      {isPending && (
        <Badge variant="secondary" className="ml-auto">
          Loading...
        </Badge>
      )}
    </div>
  )
}
