import type { ComponentType } from 'react'

export type RouteKey = 
  | 'home'
  | 'board'
  | 'competitors'
  | 'competitorDetail'
  | 'marketIntel'
  | 'alerts'
  | 'settings'
  | 'profile'

export interface NavigationItem {
  id: RouteKey
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
  badge?: number
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
