"use client"

import { useState, useCallback } from "react"
import {
  Search,
  AlertTriangle,
  FileText,
  Newspaper,
  Radio,
  Target,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  Bookmark,
  X,
  Plus,
  LayoutGrid,
  Check,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SlideOver from "@/components/slide-over"
import { useToast } from "@/hooks/use-toast"
import { useBoardStore } from "@/lib/stores/board-store"

interface IntelItem {
  id: string
  title: string
  description: string
  type: "regulatory" | "news" | "social" | "filing" | "ad"
  source: string
  severity?: "critical" | "high" | "medium" | "low"
  sentiment?: "positive" | "neutral" | "negative"
  engagement?: { likes: number; comments: number; shares: number }
  entities: string[]
  timestamp: string
  date: string
}

// Tracked entities store (in production, this would be a proper store or API)
interface TrackedEntity {
  id: string
  name: string
  type: string
  addedAt: string
}

const mockIntelItems: IntelItem[] = [
  {
    id: "1",
    title: "FDA warning letter: Acme Pharmaceuticals",
    description: "Warning letter issued for quality control violations at Newark facility including inadequate batch testing protocols and contamination concerns during routine inspection.",
    type: "regulatory",
    source: "FDA",
    severity: "critical",
    entities: ["Acme Pharma", "FDA", "Quality Control"],
    timestamp: "2h",
    date: "Jan 27, 2026",
  },
  {
    id: "2",
    title: "SEC opens investigation into CryptoLend",
    description: "Formal investigation announced following whistleblower complaints alleging unregistered securities offerings and misleading investor communications.",
    type: "regulatory",
    source: "SEC",
    severity: "high",
    entities: ["CryptoLend", "SEC", "Securities"],
    timestamp: "4h",
    date: "Jan 27, 2026",
  },
  {
    id: "3",
    title: "DataCorp class action filed in SDNY",
    description: "Securities fraud class action alleges material misstatements in quarterly earnings. Seeks $450M on behalf of investors who purchased shares between Jan-Sep 2025.",
    type: "filing",
    source: "SDNY",
    entities: ["DataCorp", "SDNY", "Securities Fraud"],
    timestamp: "6h",
    date: "Jan 27, 2026",
  },
  {
    id: "4",
    title: "Camp Lejeune settlement thread trending",
    description: "r/LegalAdvice thread with 500+ participants sharing settlement experiences and discussing symptom timelines. Multiple users report delays in claim processing.",
    type: "social",
    source: "Reddit",
    sentiment: "negative",
    engagement: { likes: 2340, comments: 567, shares: 123 },
    entities: ["Camp Lejeune", "Veterans", "Settlement"],
    timestamp: "8h",
    date: "Jan 27, 2026",
  },
  {
    id: "5",
    title: "Morgan & Morgan expands PFAS campaign",
    description: "Detected $2.3M spend increase across Google and Meta platforms. New creative emphasizes water contamination and health impacts. Targeting expanded to 15 additional DMAs.",
    type: "ad",
    source: "Ad Intel",
    severity: "high",
    entities: ["Morgan & Morgan", "PFAS", "Water Contamination"],
    timestamp: "12h",
    date: "Jan 27, 2026",
  },
  {
    id: "6",
    title: "Reuters: Mass tort advertising hits record levels",
    description: "Annual report shows legal advertising spend up 34% YoY. PFAS, Camp Lejeune, and Ozempic lead categories. Digital channels now represent 67% of total spend.",
    type: "news",
    source: "Reuters",
    sentiment: "neutral",
    entities: ["Legal Advertising", "Mass Torts", "Industry Trends"],
    timestamp: "1d",
    date: "Jan 26, 2026",
  },
  {
    id: "7",
    title: "NHTSA recall: Airbag defect affects 2.3M vehicles",
    description: "Takata-manufactured airbags in 2019-2022 models may fail to deploy properly. Manufacturers include Honda, Toyota, and Ford. Remedy parts expected Q2 2026.",
    type: "regulatory",
    source: "NHTSA",
    severity: "critical",
    entities: ["Takata", "Airbags", "Vehicle Safety"],
    timestamp: "1d",
    date: "Jan 26, 2026",
  },
  {
    id: "8",
    title: "TikTok trend: Ozempic face concerns",
    description: "Viral content with 45M views discussing facial aging side effects. Medical professionals responding with clarifications. Potential for coordinated legal interest.",
    type: "social",
    source: "TikTok",
    sentiment: "negative",
    engagement: { likes: 45000, comments: 8900, shares: 12000 },
    entities: ["Ozempic", "Side Effects", "Pharmaceutical"],
    timestamp: "2d",
    date: "Jan 25, 2026",
  },
]

const mockSavedSearches = [
  { name: "PFAS Water", active: true },
  { name: "Pharmaceutical Recalls", active: false },
  { name: "Class Action Filings", active: true },
]

const typeConfig = {
  regulatory: { icon: AlertTriangle, label: "Regulatory", color: "border-l-red-500", bgColor: "bg-red-500/10 text-red-500" },
  news: { icon: Newspaper, label: "News", color: "border-l-zinc-500", bgColor: "bg-zinc-500/10 text-zinc-400" },
  social: { icon: Radio, label: "Social", color: "border-l-green-500", bgColor: "bg-green-500/10 text-green-500" },
  filing: { icon: FileText, label: "Filing", color: "border-l-blue-500", bgColor: "bg-blue-500/10 text-blue-500" },
  ad: { icon: Target, label: "Ad Intel", color: "border-l-primary", bgColor: "bg-primary/10 text-primary" },
}

const severityConfig = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
}

const sentimentConfig = {
  positive: "bg-green-500/20 text-green-400",
  neutral: "bg-zinc-500/20 text-zinc-400",
  negative: "bg-red-500/20 text-red-400",
}

export default function MarketIntel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [activeSource, setActiveSource] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<IntelItem | null>(null)
  
  // Add to Board modal state
  const [addToBoardOpen, setAddToBoardOpen] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string>("")
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")
  const [itemToAdd, setItemToAdd] = useState<IntelItem | null>(null)
  
  // Tracked entities state
  const [trackedEntities, setTrackedEntities] = useState<TrackedEntity[]>([])
  
  const { toast } = useToast()
  const { boards, addItemToBoard, getColumnsByBoardId } = useBoardStore()
  
  const itemsPerPage = 10
  const totalItems = mockIntelItems.length

  const primaryFilters = ["All", "Regulatory", "News", "Social", "Filings"]
  const sources = ["FDA", "SEC", "DOJ", "FTC", "CFPB", "EPA", "NHTSA", "Reddit", "TikTok", "News"]

  const filteredItems = mockIntelItems.filter((item) => {
    const matchesSearch = searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "All" ||
      (activeFilter === "Regulatory" && item.type === "regulatory") ||
      (activeFilter === "News" && item.type === "news") ||
      (activeFilter === "Social" && item.type === "social") ||
      (activeFilter === "Filings" && item.type === "filing")
    const matchesSource = activeSource.length === 0 || activeSource.includes(item.source)
    return matchesSearch && matchesFilter && matchesSource
  })

  const toggleSource = (source: string) => {
    if (activeSource.includes(source)) {
      setActiveSource(activeSource.filter((s) => s !== source))
    } else {
      setActiveSource([...activeSource, source])
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num)
  }

  // Get columns for selected board
  const selectedBoardColumns = selectedBoardId ? getColumnsByBoardId(selectedBoardId) : []
  const selectedBoard = boards.find(b => b.id === selectedBoardId)

  // Handle opening Add to Board modal
  const handleOpenAddToBoard = useCallback((item: IntelItem) => {
    setItemToAdd(item)
    setSelectedBoardId("")
    setSelectedColumnId("")
    setAddToBoardOpen(true)
  }, [])

  // Confirm adding to board
  const handleConfirmAddToBoard = useCallback(() => {
    if (!selectedBoardId || !selectedColumnId || !itemToAdd) return

    // Create the board item from intel data
    const boardItem = {
      id: `intel-${itemToAdd.id}-${Date.now()}`,
      title: itemToAdd.title,
      description: itemToAdd.description,
      type: itemToAdd.type as any,
      source: itemToAdd.source,
      severity: itemToAdd.severity,
      timestamp: itemToAdd.timestamp,
      comments: 0,
      assignee: undefined,
      metadata: {
        entities: itemToAdd.entities,
        sentiment: itemToAdd.sentiment,
        engagement: itemToAdd.engagement,
        date: itemToAdd.date,
      }
    }

    // Add to the board store
    addItemToBoard(selectedBoardId, selectedColumnId, boardItem)

    const columnName = selectedBoardColumns.find(c => c.id === selectedColumnId)?.title || selectedColumnId
    const boardName = selectedBoard?.name || "Board"

    toast({
      title: "Added to Board",
      description: `"${itemToAdd.title}" has been added to "${boardName}" in the "${columnName}" column.`,
    })
    
    setAddToBoardOpen(false)
    setItemToAdd(null)
    setSelectedBoardId("")
    setSelectedColumnId("")
  }, [selectedBoardId, selectedColumnId, itemToAdd, selectedBoardColumns, selectedBoard, addItemToBoard, toast])

  // Handle tracking an entity
  const handleTrackEntity = useCallback((entityName: string) => {
    const isAlreadyTracked = trackedEntities.some(e => e.name === entityName)
    
    if (isAlreadyTracked) {
      setTrackedEntities(prev => prev.filter(e => e.name !== entityName))
      toast({
        title: "Entity Untracked",
        description: `${entityName} has been removed from tracked entities.`,
      })
    } else {
      const newEntity: TrackedEntity = {
        id: `entity-${Date.now()}`,
        name: entityName,
        type: "auto-detected",
        addedAt: new Date().toISOString(),
      }
      setTrackedEntities(prev => [...prev, newEntity])
      toast({
        title: "Entity Tracked",
        description: `${entityName} is now being tracked. You'll receive alerts for related events.`,
      })
    }
  }, [trackedEntities, toast])

  // Check if entity is tracked
  const isEntityTracked = useCallback((entityName: string) => {
    return trackedEntities.some(e => e.name === entityName)
  }, [trackedEntities])

  // Track all entities from an item
  const handleTrackAllEntities = useCallback((item: IntelItem) => {
    const newEntities: TrackedEntity[] = []
    
    item.entities.forEach(entityName => {
      if (!trackedEntities.some(e => e.name === entityName)) {
        newEntities.push({
          id: `entity-${Date.now()}-${entityName}`,
          name: entityName,
          type: "auto-detected",
          addedAt: new Date().toISOString(),
        })
      }
    })

    if (newEntities.length > 0) {
      setTrackedEntities(prev => [...prev, ...newEntities])
      toast({
        title: "Entities Tracked",
        description: `${newEntities.length} new ${newEntities.length === 1 ? 'entity' : 'entities'} added to tracking.`,
      })
    } else {
      toast({
        title: "Already Tracking",
        description: "All entities from this item are already being tracked.",
      })
    }
  }, [trackedEntities, toast])

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, news, discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-secondary/30"
            />
          </div>

          {/* Primary Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {primaryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Source Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground mr-2">Sources:</span>
            {sources.map((source) => (
              <button
                key={source}
                onClick={() => toggleSource(source)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  activeSource.includes(source)
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-secondary/30 text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {source}
              </button>
            ))}
            {activeSource.length > 0 && (
              <button
                onClick={() => setActiveSource([])}
                className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Filters & Results Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeSource.map((source) => (
                <Badge key={source} variant="secondary" className="gap-1 pr-1">
                  {source}
                  <button onClick={() => toggleSource(source)} className="ml-1 hover:bg-secondary rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Showing {filteredItems.length} results
            </span>
          </div>
        </div>

        {/* Results Feed */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const config = typeConfig[item.type]
            const Icon = config.icon
            return (
              <Card
                key={item.id}
                className={`bg-card border-border hover:border-primary/50 transition-colors cursor-pointer border-l-2 ${config.color}`}
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${config.bgColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium text-foreground text-sm leading-tight">{item.title}</h3>
                        <span className="text-xs text-muted-foreground shrink-0">{item.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{item.source}</Badge>
                        {item.severity && (
                          <Badge className={`text-xs ${severityConfig[item.severity]}`}>
                            {item.severity}
                          </Badge>
                        )}
                        {item.sentiment && (
                          <Badge className={`text-xs ${sentimentConfig[item.sentiment]}`}>
                            {item.sentiment}
                          </Badge>
                        )}
                        {item.engagement && (
                          <span className="text-xs text-muted-foreground">
                            {formatNumber(item.engagement.likes)} likes • {formatNumber(item.engagement.comments)} comments
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * itemsPerPage >= totalItems}
              onClick={() => setCurrentPage(p => p + 1)}
              className="bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 border-l border-border p-4 space-y-4 overflow-y-auto hidden lg:block">
        {/* Trending Topics */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["PFAS Water Contamination", "Ozempic Side Effects", "Data Breach Litigation", "Camp Lejeune Updates"].map((topic) => (
              <button
                key={topic}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors text-left"
              >
                <span className="text-sm text-foreground">{topic}</span>
                <Badge variant="secondary" className="text-xs">+23%</Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Tracked Entities */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Tracked Entities
              {trackedEntities.length > 0 && (
                <Badge variant="secondary" className="text-xs ml-auto">
                  {trackedEntities.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trackedEntities.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No entities tracked yet. Click "Track Entity" on any item to start monitoring.
              </p>
            ) : (
              trackedEntities.slice(0, 5).map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-2 rounded-md bg-secondary/30"
                >
                  <span className="text-sm text-foreground">{entity.name}</span>
                  <button 
                    onClick={() => handleTrackEntity(entity.name)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
            {trackedEntities.length > 5 && (
              <button className="w-full text-xs text-primary hover:underline">
                View all {trackedEntities.length} entities
              </button>
            )}
          </CardContent>
        </Card>

        {/* Saved Searches */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-primary" />
              Saved Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockSavedSearches.map((search) => (
              <button
                key={search.name}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors text-left"
              >
                <span className="text-sm text-foreground">{search.name}</span>
                {search.active && <span className="h-2 w-2 rounded-full bg-green-500" />}
              </button>
            ))}
            <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors text-sm text-primary">
              <Plus className="h-4 w-4" />
              Save Current Search
            </button>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" size="sm" className="w-full justify-start text-xs">
              Critical only
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start text-xs">
              Unreviewed
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start text-xs">
              Class actions
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start text-xs">
              Mass torts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detail Slide-Over */}
      <SlideOver
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="p-6 space-y-6">
            {/* Type and Source */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                {(() => {
                  const config = typeConfig[selectedItem.type]
                  const Icon = config.icon
                  return (
                    <>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </>
                  )
                })()}
              </Badge>
              <Badge variant="outline">{selectedItem.source}</Badge>
              {selectedItem.severity && (
                <Badge className={severityConfig[selectedItem.severity]}>
                  {selectedItem.severity}
                </Badge>
              )}
              {selectedItem.sentiment && (
                <Badge className={sentimentConfig[selectedItem.sentiment]}>
                  {selectedItem.sentiment}
                </Badge>
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {selectedItem.date} ({selectedItem.timestamp})
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</h4>
              <p className="text-sm text-foreground leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Engagement (for social) */}
            {selectedItem.engagement && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Engagement</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 rounded-md p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{formatNumber(selectedItem.engagement.likes)}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div className="bg-secondary/50 rounded-md p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{formatNumber(selectedItem.engagement.comments)}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                  <div className="bg-secondary/50 rounded-md p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{formatNumber(selectedItem.engagement.shares)}</div>
                    <div className="text-xs text-muted-foreground">Shares</div>
                  </div>
                </div>
              </div>
            )}

            {/* Related Entities */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Related Entities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem.entities.map((entity) => {
                  const isTracked = isEntityTracked(entity)
                  return (
                    <Badge 
                      key={entity} 
                      variant={isTracked ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${isTracked ? 'bg-primary' : 'hover:bg-primary/20'}`}
                      onClick={() => handleTrackEntity(entity)}
                    >
                      {isTracked && <Check className="h-3 w-3 mr-1" />}
                      {entity}
                    </Badge>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">Click an entity to track/untrack it</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button size="sm" className="gap-2" onClick={() => handleOpenAddToBoard(selectedItem)}>
                <Plus className="h-4 w-4" />
                Add to Board
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-transparent"
                onClick={() => handleTrackAllEntities(selectedItem)}
              >
                <Target className="h-4 w-4" />
                Track All Entities
              </Button>
            </div>
          </div>
        )}
      </SlideOver>

      {/* Add to Board Modal */}
      <Dialog open={addToBoardOpen} onOpenChange={setAddToBoardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              Add to Board
            </DialogTitle>
            <DialogDescription>
              Add "{itemToAdd?.title}" to a board for tracking and collaboration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Board Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Board</label>
              {boards.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No boards available. Create a board first.
                </p>
              ) : (
                <div className="grid gap-2 max-h-48 overflow-y-auto">
                  {boards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => {
                        setSelectedBoardId(board.id)
                        setSelectedColumnId("")
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                        selectedBoardId === board.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Target className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium text-sm">{board.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Column Selection */}
            {selectedBoardId && selectedBoardColumns.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Column</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBoardColumns.map((column) => (
                    <button
                      key={column.id}
                      onClick={() => setSelectedColumnId(column.id)}
                      className={`p-2 rounded-md border text-sm transition-colors ${
                        selectedColumnId === column.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {column.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddToBoardOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAddToBoard}
              disabled={!selectedBoardId || !selectedColumnId}
            >
              Add to Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
