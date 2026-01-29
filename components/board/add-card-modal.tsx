'use client'

import { useState } from 'react'
import {
  Search,
  Plus,
  AlertTriangle,
  FileText,
  Newspaper,
  Radio,
  Target,
  Clock,
  Check,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MarketIntelItem {
  id: string
  title: string
  description: string
  type: 'ad' | 'regulatory' | 'filing' | 'social' | 'news'
  source: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
}

interface AddCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItems: (items: MarketIntelItem[]) => void
  columnId: string
  columnName: string
}

// Mock Market Intel items - in production, fetch from API
const mockMarketIntelItems: MarketIntelItem[] = [
  {
    id: 'mi-1',
    title: 'FDA Issues Warning Letter to BioTech Labs',
    description: 'Manufacturing violations found during inspection',
    type: 'regulatory',
    source: 'FDA',
    severity: 'critical',
    timestamp: '2h ago',
  },
  {
    id: 'mi-2',
    title: 'Morgan & Morgan Launches New PFAS Campaign',
    description: '$1.5M Google Ads spend detected targeting midwest markets',
    type: 'ad',
    source: 'Google Ads',
    severity: 'high',
    timestamp: '4h ago',
  },
  {
    id: 'mi-3',
    title: 'Class Action Filed: TechCorp Data Breach',
    description: 'SDNY filing alleges negligent data security practices',
    type: 'filing',
    source: 'PACER',
    severity: 'high',
    timestamp: '6h ago',
  },
  {
    id: 'mi-4',
    title: 'Reddit Discussion: Ozempic Side Effects',
    description: '1,200+ comments discussing adverse reactions',
    type: 'social',
    source: 'Reddit',
    severity: 'medium',
    timestamp: '8h ago',
  },
  {
    id: 'mi-5',
    title: 'WSJ: Mass Tort Advertising Reaches Record Levels',
    description: 'Legal advertising spend up 34% year over year',
    type: 'news',
    source: 'WSJ',
    timestamp: '1d ago',
  },
  {
    id: 'mi-6',
    title: 'SEC Charges Investment Fund with Fraud',
    description: '$500M investor losses alleged in Ponzi scheme',
    type: 'regulatory',
    source: 'SEC',
    severity: 'critical',
    timestamp: '1d ago',
  },
  {
    id: 'mi-7',
    title: 'Weitz & Luxenberg Expands Talc Campaign',
    description: 'New TV spots detected in 15 additional markets',
    type: 'ad',
    source: 'TV Monitoring',
    severity: 'medium',
    timestamp: '2d ago',
  },
  {
    id: 'mi-8',
    title: 'NHTSA Recall: Airbag Defect in 2M Vehicles',
    description: 'Potential deployment failure under certain conditions',
    type: 'regulatory',
    source: 'NHTSA',
    severity: 'critical',
    timestamp: '2d ago',
  },
]

const typeConfig = {
  ad: { icon: Target, label: 'Ad Intel', color: 'text-primary' },
  regulatory: { icon: AlertTriangle, label: 'Regulatory', color: 'text-red-500' },
  filing: { icon: FileText, label: 'Filing', color: 'text-blue-500' },
  social: { icon: Radio, label: 'Social', color: 'text-green-500' },
  news: { icon: Newspaper, label: 'News', color: 'text-zinc-500' },
}

const severityConfig = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
}

export function AddCardModal({
  open,
  onOpenChange,
  onAddItems,
  columnId,
  columnName,
}: AddCardModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')

  const filteredItems = mockMarketIntelItems.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab =
      activeTab === 'all' ||
      item.type === activeTab

    return matchesSearch && matchesTab
  })

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleAdd = () => {
    const itemsToAdd = mockMarketIntelItems.filter((item) =>
      selectedItems.includes(item.id)
    )
    onAddItems(itemsToAdd)
    setSelectedItems([])
    setSearchQuery('')
    onOpenChange(false)
  }

  const handleClose = () => {
    setSelectedItems([])
    setSearchQuery('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>
            Add to "{columnName}"
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search market intel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 border-b border-border">
            <TabsList className="h-10 w-full justify-start bg-transparent p-0 gap-2">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-secondary rounded-md px-3 py-1.5 text-xs"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="regulatory"
                className="data-[state=active]:bg-secondary rounded-md px-3 py-1.5 text-xs"
              >
                Regulatory
              </TabsTrigger>
              <TabsTrigger
                value="ad"
                className="data-[state=active]:bg-secondary rounded-md px-3 py-1.5 text-xs"
              >
                Ads
              </TabsTrigger>
              <TabsTrigger
                value="filing"
                className="data-[state=active]:bg-secondary rounded-md px-3 py-1.5 text-xs"
              >
                Filings
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="data-[state=active]:bg-secondary rounded-md px-3 py-1.5 text-xs"
              >
                Social
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="data-[state=active]:bg-secondary rounded-md px-3 py-1.5 text-xs"
              >
                News
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[320px]">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No items found</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredItems.map((item) => {
                    const config = typeConfig[item.type]
                    const Icon = config.icon
                    const isSelected = selectedItems.includes(item.id)

                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-secondary/50 ${
                          isSelected ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {/* Selection indicator */}
                        <div
                          className={`shrink-0 mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-primary border-primary'
                              : 'border-border'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>

                        {/* Icon */}
                        <div className={`shrink-0 mt-0.5 ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] h-5">
                              {item.source}
                            </Badge>
                            {item.severity && (
                              <Badge className={`text-[10px] h-5 ${severityConfig[item.severity]}`}>
                                {item.severity}
                              </Badge>
                            )}
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
          <p className="text-sm text-muted-foreground">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={selectedItems.length === 0}>
              <Plus className="h-4 w-4 mr-1" />
              Add {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
