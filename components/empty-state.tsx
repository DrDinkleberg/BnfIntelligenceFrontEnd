'use client'

import React from 'react'
import {
  Search,
  FileText,
  Users,
  Target,
  Bell,
  Inbox,
  FolderOpen,
  Filter,
  AlertTriangle,
  TrendingUp,
  LayoutGrid,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================
// Base Empty State Component
// ============================================

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-6',
    md: 'py-12',
    lg: 'py-16',
  }

  const iconSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const iconContainerClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', sizeClasses[size], className)}>
      {icon && (
        <div className={cn(
          'rounded-full bg-muted/50 flex items-center justify-center mb-4',
          iconContainerClasses[size]
        )}>
          <div className={cn('text-muted-foreground', iconSizeClasses[size])}>
            {icon}
          </div>
        </div>
      )}
      
      <h3 className={cn(
        'font-semibold text-foreground',
        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          'text-muted-foreground mt-1 max-w-sm',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-4">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Preset Empty States
// ============================================

interface PresetEmptyStateProps {
  onAction?: () => void
  actionLabel?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// No Search Results
export function EmptySearchResults({
  onAction,
  actionLabel = 'Clear Search',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<Search className="h-full w-full" />}
      title="No results found"
      description="Try adjusting your search terms or filters to find what you're looking for."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Data / Generic Empty
export function EmptyData({
  onAction,
  actionLabel = 'Refresh',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<Inbox className="h-full w-full" />}
      title="No data available"
      description="There's nothing here yet. Data will appear once it's available."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Competitors
export function EmptyCompetitors({
  onAction,
  actionLabel = 'Add Competitor',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<Users className="h-full w-full" />}
      title="No competitors tracked"
      description="Start tracking competitors to monitor their advertising, filings, and market activity."
      action={onAction ? { label: actionLabel, onClick: onAction } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Board Items
export function EmptyBoardColumn({
  onAction,
  actionLabel = 'Add Card',
  className,
  size = 'sm',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<Plus className="h-full w-full" />}
      title="No items"
      description="Add cards to this column to start organizing."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Boards
export function EmptyBoards({
  onAction,
  actionLabel = 'Create Board',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<LayoutGrid className="h-full w-full" />}
      title="No boards yet"
      description="Create your first board to start organizing market intel, competitors, and opportunities."
      action={onAction ? { label: actionLabel, onClick: onAction } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Alerts
export function EmptyAlerts({
  onAction,
  actionLabel = 'Configure Alerts',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<Bell className="h-full w-full" />}
      title="No alerts"
      description="You're all caught up! New alerts will appear here when there's activity."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Market Intel
export function EmptyMarketIntel({
  onAction,
  actionLabel = 'Clear Filters',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<TrendingUp className="h-full w-full" />}
      title="No intel found"
      description="No market intelligence matches your current filters. Try broadening your search."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Files/Documents
export function EmptyDocuments({
  onAction,
  actionLabel = 'Upload Document',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<FileText className="h-full w-full" />}
      title="No documents"
      description="Upload documents to analyze and track relevant filings and reports."
      action={onAction ? { label: actionLabel, onClick: onAction } : undefined}
      className={className}
      size={size}
    />
  )
}

// Empty Folder
export function EmptyFolder({
  onAction,
  actionLabel = 'Add Items',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<FolderOpen className="h-full w-full" />}
      title="This folder is empty"
      description="Add items to this folder to keep things organized."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Filtered Results
export function EmptyFilteredResults({
  onAction,
  actionLabel = 'Reset Filters',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<Filter className="h-full w-full" />}
      title="No matching results"
      description="No items match your current filter criteria. Try adjusting or resetting filters."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// Error State (can be used as empty state alternative)
export function EmptyError({
  onAction,
  actionLabel = 'Try Again',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-full w-full" />}
      title="Unable to load"
      description="Something went wrong while loading this content. Please try again."
      action={onAction ? { label: actionLabel, onClick: onAction } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Tracked Entities
export function EmptyTrackedEntities({
  onAction,
  actionLabel = 'Browse Market Intel',
  className,
  size = 'sm',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<Target className="h-full w-full" />}
      title="No tracked entities"
      description="Track entities to receive alerts about related events."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// No Activity
export function EmptyActivity({
  onAction,
  actionLabel = 'Refresh',
  className,
  size = 'md',
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<RefreshCw className="h-full w-full" />}
      title="No recent activity"
      description="Activity will appear here as you use the platform."
      action={onAction ? { label: actionLabel, onClick: onAction, variant: 'outline' } : undefined}
      className={className}
      size={size}
    />
  )
}

// ============================================
// Empty State with Custom Illustration
// ============================================

interface IllustratedEmptyStateProps extends Omit<EmptyStateProps, 'icon'> {
  illustration?: 'search' | 'empty' | 'error' | 'success'
}

export function IllustratedEmptyState({
  illustration = 'empty',
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: IllustratedEmptyStateProps) {
  // SVG illustrations based on type
  const illustrations = {
    search: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="4" className="text-muted-foreground/30" />
        <line x1="72" y1="72" x2="100" y2="100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-muted-foreground/30" />
        <circle cx="50" cy="50" r="10" fill="currentColor" className="text-muted-foreground/20" />
      </svg>
    ),
    empty: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="20" y="30" width="80" height="60" rx="4" stroke="currentColor" strokeWidth="3" className="text-muted-foreground/30" />
        <line x1="35" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-muted-foreground/20" />
        <line x1="35" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-muted-foreground/20" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="3" className="text-destructive/30" />
        <line x1="45" y1="45" x2="75" y2="75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-destructive/40" />
        <line x1="75" y1="45" x2="45" y2="75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-destructive/40" />
      </svg>
    ),
    success: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="3" className="text-green-500/30" />
        <path d="M40 60L55 75L80 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-green-500/50" />
      </svg>
    ),
  }

  return (
    <EmptyState
      icon={<div className="w-full h-full">{illustrations[illustration]}</div>}
      title={title}
      description={description}
      action={action}
      secondaryAction={secondaryAction}
      className={className}
      size={size}
    />
  )
}
