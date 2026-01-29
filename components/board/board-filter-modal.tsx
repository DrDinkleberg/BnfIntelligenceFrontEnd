'use client'

import { useState } from 'react'
import {
  Filter,
  X,
  AlertTriangle,
  FileText,
  Newspaper,
  Radio,
  Target,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface BoardFilters {
  types: string[]
  severities: string[]
  assignees: string[]
}

interface TeamMember {
  initials: string
  name: string
}

interface BoardFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: BoardFilters
  onApplyFilters: (filters: BoardFilters) => void
  teamMembers: TeamMember[]
}

const typeOptions = [
  { id: 'ad', label: 'Ad Intel', icon: Target },
  { id: 'regulatory', label: 'Regulatory', icon: AlertTriangle },
  { id: 'filing', label: 'Filing', icon: FileText },
  { id: 'social', label: 'Social', icon: Radio },
  { id: 'news', label: 'News', icon: Newspaper },
]

const severityOptions = [
  { id: 'critical', label: 'Critical', color: 'bg-red-500' },
  { id: 'high', label: 'High', color: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'low', label: 'Low', color: 'bg-green-500' },
]

export function BoardFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  teamMembers,
}: BoardFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<BoardFilters>(filters)

  const toggleType = (typeId: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter((t) => t !== typeId)
        : [...prev.types, typeId],
    }))
  }

  const toggleSeverity = (severityId: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      severities: prev.severities.includes(severityId)
        ? prev.severities.filter((s) => s !== severityId)
        : [...prev.severities, severityId],
    }))
  }

  const toggleAssignee = (initials: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(initials)
        ? prev.assignees.filter((a) => a !== initials)
        : [...prev.assignees, initials],
    }))
  }

  const clearFilters = () => {
    setLocalFilters({ types: [], severities: [], assignees: [] })
  }

  const handleApply = () => {
    onApplyFilters(localFilters)
    onOpenChange(false)
  }

  const activeFilterCount =
    localFilters.types.length +
    localFilters.severities.length +
    localFilters.assignees.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter Cards
            </DialogTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => {
                const Icon = type.icon
                const isSelected = localFilters.types.includes(type.id)
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Severity Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Severity</Label>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((severity) => {
                const isSelected = localFilters.severities.includes(severity.id)
                return (
                  <button
                    key={severity.id}
                    onClick={() => toggleSeverity(severity.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${severity.color}`} />
                    {severity.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Assignee Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Assignee</Label>
            <div className="space-y-2">
              {teamMembers.map((member) => {
                const isSelected = localFilters.assignees.includes(member.initials)
                return (
                  <div
                    key={member.initials}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleAssignee(member.initials)}
                  >
                    <Checkbox checked={isSelected} />
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </div>
                )
              })}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleAssignee('unassigned')}
              >
                <Checkbox checked={localFilters.assignees.includes('unassigned')} />
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-secondary text-muted-foreground text-[10px]">
                    ?
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">Unassigned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
