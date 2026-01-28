import { Home, LayoutGrid, Building2, Globe, Bell, Settings } from 'lucide-react'

// ============================================
// Route Definitions
// ============================================

export const routes = {
  home: '/',
  board: '/board',
  competitors: '/competitors',
  competitorDetail: (id: string) => `/competitors/${id}`,
  marketIntel: '/market-intel',
  alerts: '/alerts',
  settings: '/settings',
  profile: '/profile',
  login: '/login',
} as const

// ============================================
// URL Building Utilities
// ============================================

/**
 * Build a URL with query parameters from a filters object.
 * Removes undefined, null, empty string, and 'all' values.
 */
export function buildFilteredUrl(
  basePath: string,
  filters: Record<string, string | number | boolean | undefined | null>
): string {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all'
    ) {
      params.set(key, String(value))
    }
  })

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Parse query string into an object.
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
}

// ============================================
// Navigation Items Configuration
// ============================================

export const mainNavItems = [
  { 
    id: 'home' as const, 
    label: 'Home', 
    href: routes.home, 
    icon: Home 
  },
  { 
    id: 'board' as const, 
    label: 'Board', 
    href: routes.board, 
    icon: LayoutGrid 
  },
  { 
    id: 'competitors' as const, 
    label: 'Competitors', 
    href: routes.competitors, 
    icon: Building2 
  },
  { 
    id: 'marketIntel' as const, 
    label: 'Market Intel', 
    href: routes.marketIntel, 
    icon: Globe 
  },
  { 
    id: 'alerts' as const, 
    label: 'Alerts', 
    href: routes.alerts, 
    icon: Bell 
  },
]

// ============================================
// Active Route Detection
// ============================================

/**
 * Check if a route is currently active.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/'
  }
  return pathname.startsWith(href)
}

/**
 * Get the current nav item based on pathname.
 */
export function getCurrentNavItem(pathname: string) {
  return mainNavItems.find(item => isRouteActive(pathname, item.href))
}
