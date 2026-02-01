"use client"

import { useState, useMemo, useCallback } from "react"
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
  RefreshCw,
  XCircle,
  Loader2,
  ExternalLink,
  Activity,
  Shield,
  Database,
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
import { useMarketIntelFeed, useMarketIntelSummaries } from "@/hooks/use-market-intel"
import { formatDate } from "@/lib/mappers/market-intel"
import type { MarketIntelItem, IntelType, IntelSeverity } from "@/types/market-intel"
import { SOURCE_LABELS, COMING_SOON_SOURCES } from "@/types/market-intel"

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const typeConfig: Record<IntelType, {
  icon: typeof AlertTriangle
  label: string
  color: string
  bgColor: string
}> = {
  regulatory: { icon: AlertTriangle, label: "Regulatory", color: "border-l-red-500", bgColor: "bg-red-500/10 text-red-500" },
  news: { icon: Newspaper, label: "News", color: "border-l-zinc-500", bgColor: "bg-zinc-500/10 text-zinc-400" },
  social: { icon: Radio, label: "Social", color: "border-l-green-500", bgColor: "bg-green-500/10 text-green-500" },
  filing: { icon: FileText, label: "Filing", color: "border-l-blue-500", bgColor: "bg-blue-500/10 text-blue-500" },
  ad: { icon: Target, label: "Ad Intel", color: "border-l-primary", bgColor: "bg-primary/10 text-primary" },
}

const severityConfig: Record<IntelSeverity, string> = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
}

const ITEMS_PER_PAGE = 15
const PRIMARY_FILTERS = ["All", "Regulatory", "Filing", "Ad Intel"] as const
const COMING_SOON_FILTERS = ["News", "Social"] as const

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {/* Summary skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-secondary/50 rounded-lg animate-pulse" />
        ))}
      </div>
      {/* Filter skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-secondary/50 rounded-full animate-pulse" />
        ))}
      </div>
      {/* Feed skeleton */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 bg-secondary/50 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

function ProgressBar({ loaded, total }: { loaded: number; total: number }) {
  if (loaded >= total) return null
  const pct = Math.round((loaded / total) * 100)
  return (
    <div className="flex items-center gap-3 px-6 py-2 bg-primary/5 border-b border-primary/10">
      <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
      <span className="text-xs text-muted-foreground">
        Loading sources… {loaded}/{total}
      </span>
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden max-w-xs">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Summary Cards
// ─────────────────────────────────────────────

function SummaryCards({ summaries, isLoading }: {
  summaries: ReturnType<typeof useMarketIntelSummaries>["summaries"]
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-secondary/50 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: "CFPB",
      icon: Shield,
      color: "text-blue-500",
      stat: summaries.cfpb?.complaints_last_7_days ?? "—",
      sub: summaries.cfpb?.top_company
        ? `Top: ${summaries.cfpb.top_company}`
        : summaries.cfpb ? `${summaries.cfpb?.total_complaints?.toLocaleString() ?? "—"} total` : "API coming soon",
    },
    {
      label: "FDA",
      icon: AlertTriangle,
      color: "text-red-500",
      stat: summaries.fda?.recalls_last_7_days ?? summaries.fda?.total_recalls ?? "—",
      sub: summaries.fda?.top_firm
        ? `Top: ${summaries.fda.top_firm}`
        : "Enforcement actions",
    },
    {
      label: "NHTSA",
      icon: Activity,
      color: "text-orange-500",
      stat: summaries.nhtsa?.recalls_last_7_days ?? summaries.nhtsa?.total_recalls ?? "—",
      sub: summaries.nhtsa?.top_manufacturer
        ? `Top: ${summaries.nhtsa.top_manufacturer}`
        : `${summaries.nhtsa?.total_complaints?.toLocaleString() ?? "—"} complaints`,
    },
    {
      label: "FTC",
      icon: Database,
      color: "text-purple-500",
      stat: summaries.ftc?.dnc_last_7_days ?? summaries.ftc?.total_dnc_complaints ?? "—",
      sub: summaries.ftc?.total_hsr_notices
        ? `${summaries.ftc.total_hsr_notices} HSR notices`
        : "DNC complaints",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="bg-secondary/30">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                <Badge variant="outline" className="text-[9px] ml-auto">7d</Badge>
              </div>
              <div className="text-xl font-bold">
                {typeof card.stat === "number" ? card.stat.toLocaleString() : card.stat}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">{card.sub}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// Intel Card (single feed item)
// ─────────────────────────────────────────────

function IntelCard({
  item,
  onSelect,
  onAddToBoard,
}: {
  item: MarketIntelItem
  onSelect: () => void
  onAddToBoard: () => void
}) {
  const config = typeConfig[item.type]
  const TypeIcon = config.icon

  return (
    <Card
      className={`border-l-4 ${config.color} hover:bg-secondary/30 cursor-pointer transition-colors`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${config.bgColor}`}>
            <TypeIcon className="h-4 w-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Title row */}
            <div className="flex items-start gap-2">
              <h3 className="text-sm font-semibold leading-tight flex-1">{item.title}</h3>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="outline" className="text-[10px]">{item.source}</Badge>
                <Badge className={`text-[10px] ${severityConfig[item.severity]}`}>
                  {item.severity}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>

            {/* Footer: entities + time */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                {item.entities.slice(0, 3).map((entity) => (
                  <Badge
                    key={entity}
                    variant="outline"
                    className="text-[10px] border-border text-muted-foreground"
                  >
                    {entity}
                  </Badge>
                ))}
                {item.entities.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{item.entities.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); onAddToBoard() }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.timestamp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────
// Detail Slide-Over
// ─────────────────────────────────────────────

function IntelDetailPanel({
  item,
  onClose,
  onAddToBoard,
}: {
  item: MarketIntelItem
  onClose: () => void
  onAddToBoard: () => void
}) {
  const config = typeConfig[item.type]
  const TypeIcon = config.icon

  return (
    <SlideOver open={true} onClose={onClose} title="Intel Detail">
      <div className="space-y-6 p-1">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${config.bgColor}`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <Badge variant="outline">{item.source}</Badge>
            <Badge className={severityConfig[item.severity]}>{item.severity}</Badge>
          </div>
          <h2 className="text-lg font-bold leading-tight">{item.title}</h2>
          <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Description</h4>
          <p className="text-sm leading-relaxed">{item.description}</p>
        </div>

        {/* Entities */}
        {item.entities.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Related Entities</h4>
            <div className="flex flex-wrap gap-1.5">
              {item.entities.map((entity) => (
                <Badge key={entity} variant="outline" className="text-xs">
                  {entity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Source metadata */}
        {item.meta && Object.keys(item.meta).length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Details</h4>
            <div className="space-y-1.5">
              {Object.entries(item.meta).map(([key, value]) => {
                if (!value) return null
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase())
                  .trim()
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium truncate max-w-[200px]">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onAddToBoard}>
            <LayoutGrid className="h-3.5 w-3.5" />
            Add to Board
          </Button>
          {item.url && (
            <Button size="sm" variant="outline" className="gap-1.5" asChild>
              <a href={item.url}>
                <ExternalLink className="h-3.5 w-3.5" />
                View Source
              </a>
            </Button>
          )}
        </div>
      </div>
    </SlideOver>
  )
}

// ─────────────────────────────────────────────
// Coming Soon Overlay
// ─────────────────────────────────────────────

function ComingSoonState({ filterName }: { filterName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
        <Clock className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{filterName} — Coming Soon</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {filterName === "News"
          ? "News monitoring from Reuters, Law360, Bloomberg Law and other sources will appear here once the pipeline is connected."
          : "Social media monitoring from Reddit, TikTok, and other platforms will appear here once the pipeline is connected."}
      </p>
    </div>
  )
}

function EmptyFeedState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold mb-2">No intel found</h3>
      <p className="text-sm text-muted-foreground">
        {searchQuery
          ? `No results for "${searchQuery}". Try a different search term.`
          : "No intelligence items match the current filters."}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function MarketIntel() {
  // ── Data ──────────────────────────────────
  const {
    feed,
    isLoading: feedLoading,
    isAllLoaded,
    loadedCount,
    totalSources,
    errorCount,
    sourceStatuses,
    refetchAll,
  } = useMarketIntelFeed({ days: 7 })

  const { summaries, isLoading: summariesLoading } = useMarketIntelSummaries()

  // ── UI state ──────────────────────────────
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [activeSources, setActiveSources] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<MarketIntelItem | null>(null)

  // ── Board dialog state ────────────────────
  const [addToBoardOpen, setAddToBoardOpen] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string>("")
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")
  const [itemToAdd, setItemToAdd] = useState<MarketIntelItem | null>(null)

  const { toast } = useToast()
  const { boards, addItemToBoard, getColumnsByBoardId } = useBoardStore()

  // ── Derived: available sources from actual data ───
  const availableSources = useMemo(() => {
    const sources = new Set<string>()
    feed.forEach((item) => sources.add(item.source))
    return Array.from(sources).sort()
  }, [feed])

  // ── Filter + search ───────────────────────
  const isComingSoon = activeFilter === "News" || activeFilter === "Social"

  const filteredFeed = useMemo(() => {
    if (isComingSoon) return []

    return feed.filter((item) => {
      // Search
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))

      // Type filter
      let matchesType = true
      switch (activeFilter) {
        case "Regulatory":
          matchesType = item.type === "regulatory"
          break
        case "Filing":
          matchesType = item.type === "filing"
          break
        case "Ad Intel":
          matchesType = item.type === "ad"
          break
        case "All":
        default:
          matchesType = true
      }

      // Source filter
      const matchesSource =
        activeSources.length === 0 || activeSources.includes(item.source)

      return matchesSearch && matchesType && matchesSource
    })
  }, [feed, searchQuery, activeFilter, activeSources, isComingSoon])

  // ── Pagination ────────────────────────────
  const totalPages = Math.ceil(filteredFeed.length / ITEMS_PER_PAGE)
  const paginatedFeed = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFeed.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredFeed, currentPage])

  // Reset page when filters change
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  // ── Source toggle ─────────────────────────
  const toggleSource = useCallback((source: string) => {
    setActiveSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    )
    setCurrentPage(1)
  }, [])

  // ── Add to Board ──────────────────────────
  const handleOpenAddToBoard = useCallback((item: MarketIntelItem) => {
    setItemToAdd(item)
    setSelectedBoardId("")
    setSelectedColumnId("")
    setAddToBoardOpen(true)
  }, [])

  const selectedBoardColumns = selectedBoardId ? getColumnsByBoardId(selectedBoardId) : []
  const selectedBoard = boards.find((b) => b.id === selectedBoardId)

  const handleConfirmAddToBoard = useCallback(() => {
    if (!selectedBoardId || !selectedColumnId || !itemToAdd) return

    const boardItem = {
      id: `intel-${itemToAdd.id}`,
      type: itemToAdd.type as "regulatory" | "filing" | "ad" | "news" | "social",
      title: itemToAdd.title,
      description: itemToAdd.description,
      source: itemToAdd.source,
      severity: itemToAdd.severity,
      date: itemToAdd.date,
      comments: 0,
      timestamp: new Date().toISOString(),
    }

    addItemToBoard(selectedBoardId, selectedColumnId, boardItem)

    const columnName =
      selectedBoardColumns.find((c) => c.id === selectedColumnId)?.title || selectedColumnId
    const boardName = selectedBoard?.name || "Board"

    toast({
      title: "Added to Board",
      description: `"${itemToAdd.title.slice(0, 50)}…" added to "${boardName}" → "${columnName}".`,
    })

    setAddToBoardOpen(false)
    setItemToAdd(null)
  }, [
    selectedBoardId,
    selectedColumnId,
    itemToAdd,
    selectedBoardColumns,
    selectedBoard,
    addItemToBoard,
    toast,
  ])

  // ── Initial loading state ─────────────────
  if (feedLoading && feed.length === 0) return <LoadingSkeleton />

  // ── Main render ───────────────────────────
  return (
    <div className="p-6 space-y-5">
      {/* Progress bar while sources still loading */}
      {!isAllLoaded && (
        <ProgressBar loaded={loadedCount} total={totalSources} />
      )}

      {/* Summary cards */}
      <SummaryCards summaries={summaries} isLoading={summariesLoading} />

      {/* Error banner */}
      {errorCount > 0 && isAllLoaded && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span className="text-xs text-red-400">
            {errorCount} source{errorCount > 1 ? "s" : ""} failed to load.
          </span>
          <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 ml-auto" onClick={refetchAll}>
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      )}

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search intelligence…"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 bg-secondary/30"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{filteredFeed.length} items</span>
          <span>·</span>
          <span>Last 7 days</span>
          {isAllLoaded && (
            <>
              <span>·</span>
              <span>{availableSources.length} active sources</span>
            </>
          )}
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {PRIMARY_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}
          >
            {filter}
            {filter !== "All" && (
              <span className="ml-1 opacity-70">
                {feed.filter((item) => {
                  if (filter === "Regulatory") return item.type === "regulatory"
                  if (filter === "Filing") return item.type === "filing"
                  if (filter === "Ad Intel") return item.type === "ad"
                  return false
                }).length}
              </span>
            )}
          </button>
        ))}

        {/* Coming soon filter tabs */}
        {COMING_SOON_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              activeFilter === filter
                ? "bg-muted text-muted-foreground ring-1 ring-border"
                : "bg-secondary/30 text-muted-foreground/50 hover:bg-secondary/50"
            }`}
          >
            {filter}
            <Clock className="h-2.5 w-2.5 inline ml-1 -mt-0.5" />
          </button>
        ))}
      </div>

      {/* Source pills */}
      {!isComingSoon && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground mr-1">Sources:</span>
          {[...SOURCE_LABELS].map((source) => {
            const isActive = activeSources.includes(source)
            const count = feed.filter((item) => item.source === source).length
            const hasData = count > 0
            return (
              <button
                key={source}
                onClick={() => toggleSource(source)}
                disabled={!hasData}
                className={`px-2 py-1 text-[10px] rounded-md border transition-colors ${
                  isActive
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : hasData
                      ? "border-border text-muted-foreground hover:border-primary/30"
                      : "border-border/50 text-muted-foreground/30 cursor-not-allowed"
                }`}
              >
                {source}
                {hasData && <span className="ml-1 opacity-70">{count}</span>}
              </button>
            )
          })}
          {/* Coming soon source pills */}
          {COMING_SOON_SOURCES.map((source) => (
            <span
              key={source}
              className="px-2 py-1 text-[10px] rounded-md border border-dashed border-border/50 text-muted-foreground/30"
            >
              {source} <Clock className="h-2 w-2 inline -mt-0.5" />
            </span>
          ))}
        </div>
      )}

      {/* Feed content */}
      {isComingSoon ? (
        <ComingSoonState filterName={activeFilter} />
      ) : paginatedFeed.length === 0 ? (
        <EmptyFeedState searchQuery={searchQuery} />
      ) : (
        <div className="space-y-3">
          {paginatedFeed.map((item) => (
            <IntelCard
              key={item.id}
              item={item}
              onSelect={() => setSelectedItem(item)}
              onAddToBoard={() => handleOpenAddToBoard(item)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isComingSoon && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages} · {filteredFeed.length} items
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail slide-over */}
      {selectedItem && (
        <IntelDetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToBoard={() => handleOpenAddToBoard(selectedItem)}
        />
      )}

      {/* Add to Board dialog */}
      <Dialog open={addToBoardOpen} onOpenChange={setAddToBoardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Board</DialogTitle>
            <DialogDescription>
              Add this intel item to a board for tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Board</label>
              <div className="grid grid-cols-2 gap-2">
                {boards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => {
                      setSelectedBoardId(board.id)
                      setSelectedColumnId("")
                    }}
                    className={`p-3 text-left rounded-lg border text-sm transition-colors ${
                      selectedBoardId === board.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {board.name}
                  </button>
                ))}
              </div>
              {boards.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No boards yet. Create one in the Board tab first.
                </p>
              )}
            </div>
            {selectedBoardId && selectedBoardColumns.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Select Column</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBoardColumns.map((column) => (
                    <button
                      key={column.id}
                      onClick={() => setSelectedColumnId(column.id)}
                      className={`p-3 text-left rounded-lg border text-sm transition-colors ${
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
