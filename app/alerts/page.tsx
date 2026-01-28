'use client'

import { Suspense } from 'react'
import { useFilters } from '@/hooks/use-filters'
import { AlertFiltersSchema } from '@/types/filters'
import { FilterBar } from '@/components/filters/filter-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Bell, FileText, TrendingUp, Clock } from 'lucide-react'

const filterConfig = [
  {
    key: 'category',
    label: 'Category',
    options: [
      { value: 'all', label: 'All Categories' },
      { value: 'FDA', label: 'FDA' },
      { value: 'SEC', label: 'SEC' },
      { value: 'FTC', label: 'FTC' },
      { value: 'CFPB', label: 'CFPB' },
      { value: 'NHTSA', label: 'NHTSA' },
      { value: 'CPSC', label: 'CPSC' },
      { value: 'Ads', label: 'Ads' },
      { value: 'Filing', label: 'Filings' },
      { value: 'News', label: 'News' },
    ],
  },
  {
    key: 'severity',
    label: 'Severity',
    options: [
      { value: 'all', label: 'All Severities' },
      { value: 'critical', label: 'Critical' },
      { value: 'warning', label: 'Warning' },
      { value: 'info', label: 'Info' },
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

// Mock alerts data - will be replaced with API data
const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    category: 'FDA',
    title: 'FDA Warning: Acme Pharmaceuticals',
    description: 'Quality control violations at Newark facility - potential mass tort opportunity',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    category: 'Ads',
    title: 'Morgan & Morgan expands PFAS campaign',
    description: '$2.3M spend increase across 12 new markets in the past week',
    time: '4 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    category: 'Filing',
    title: 'DataCorp class action filed',
    description: 'SDNY securities fraud case, seeking $450M in damages',
    time: '6 hours ago',
    read: false,
  },
  {
    id: 4,
    type: 'warning',
    category: 'SEC',
    title: 'SEC opens CryptoLend probe',
    description: 'Unregistered securities investigation - potential class action opportunity',
    time: '8 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    category: 'News',
    title: 'Camp Lejeune trending on Reddit',
    description: '500+ users discussing settlement in r/LegalAdvice thread',
    time: '12 hours ago',
    read: true,
  },
  {
    id: 6,
    type: 'critical',
    category: 'NHTSA',
    title: 'NHTSA recalls 500K vehicles',
    description: 'Major automaker brake system defect - high injury potential',
    time: '1 day ago',
    read: true,
  },
]

const severityColors: Record<string, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
}

const categoryIcons: Record<string, React.ReactNode> = {
  FDA: <AlertTriangle className="h-4 w-4" />,
  SEC: <FileText className="h-4 w-4" />,
  FTC: <FileText className="h-4 w-4" />,
  CFPB: <FileText className="h-4 w-4" />,
  NHTSA: <AlertTriangle className="h-4 w-4" />,
  CPSC: <AlertTriangle className="h-4 w-4" />,
  Ads: <TrendingUp className="h-4 w-4" />,
  Filing: <FileText className="h-4 w-4" />,
  News: <Bell className="h-4 w-4" />,
}

function AlertsPageContent() {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    hasActiveFilters,
    isPending 
  } = useFilters({ schema: AlertFiltersSchema })

  // Filter alerts based on current filters
  const filteredAlerts = mockAlerts.filter(alert => {
    if (filters.category && filters.category !== 'all' && alert.category !== filters.category) {
      return false
    }
    if (filters.severity && filters.severity !== 'all' && alert.type !== filters.severity) {
      return false
    }
    return true
  })

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <FilterBar
        filters={filters}
        config={filterConfig}
        onChange={setFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        isPending={isPending}
      />

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Alerts</h1>
            <Badge variant="secondary">{filteredAlerts.length} alerts</Badge>
          </div>

          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No alerts match your current filters.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    !alert.read ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-2 w-2 rounded-full mt-2 ${severityColors[alert.type]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{alert.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {categoryIcons[alert.category]}
                            <span className="ml-1">{alert.category}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <AlertsPageContent />
    </Suspense>
  )
}
