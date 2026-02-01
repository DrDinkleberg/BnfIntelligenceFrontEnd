"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Search,
  Plus,
  Grid3X3,
  List,
  ExternalLink,
  MapPin,
  Globe,
  Target,
  Building2,
  ArrowLeft,
  MoreHorizontal,
  Download,
  ChevronDown,
  Satellite,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useToast } from "@/hooks/use-toast"
import { useBoardStore, createCompetitorBoardItem } from "@/lib/stores/board-store"
import { useAllLawFirms } from "@/hooks/use-law-firms"
import {
  mapLawFirmToCompetitor,
  getTierLabel,
  getEntityLabel,
} from "@/lib/mappers/law-firm"
import type { Competitor } from "@/lib/mappers/law-firm"
import type { BackendLawFirmList } from "@/types/law-firm"

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "1", label: "Tier 1" },
  { key: "2", label: "Tier 2" },
  { key: "3", label: "Tier 3" },
  { key: "tracked", label: "Tracked" },
  { key: "agencies", label: "Agencies & Lead Gen" },
] as const

const SORT_OPTIONS = [
  { key: "tier", label: "Tier" },
  { key: "name", label: "Name (A–Z)" },
  { key: "ads", label: "Most Ads" },
  { key: "sources", label: "Most Coverage" },
] as const

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 items-center">
        <div className="h-9 w-72 bg-secondary/50 rounded-md animate-pulse" />
        <div className="h-9 w-24 bg-secondary/50 rounded-md animate-pulse" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-16 bg-secondary/50 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/50" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 bg-secondary/50 rounded" />
                  <div className="h-3 w-24 bg-secondary/50 rounded" />
                </div>
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-20 bg-secondary/50 rounded" />
                <div className="h-5 w-16 bg-secondary/50 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-secondary/50 rounded" />
                <div className="h-12 bg-secondary/50 rounded" />
                <div className="h-12 bg-secondary/50 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <XCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Failed to load firms</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        {error.message || "Something went wrong while fetching competitor data."}
      </p>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}

function EmptyFilterState({ searchQuery, filterTier }: { searchQuery: string; filterTier: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      <Building2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold mb-2">No firms found</h3>
      <p className="text-sm text-muted-foreground">
        {searchQuery
          ? `No results for "${searchQuery}"${filterTier !== "all" ? " with the current filter" : ""}.`
          : "No firms match the selected filter."}
      </p>
    </div>
  )
}

function MonitoringRow({
  name,
  active,
  url,
}: {
  name: string
  active: boolean
  url: string | null
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        {active ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground/30" />
        )}
        <span className={`text-sm ${active ? "text-foreground" : "text-muted-foreground/50"}`}>
          {name}
        </span>
      </div>
      {active && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          View <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Competitor Card (grid view)
// ─────────────────────────────────────────────

function CompetitorCard({
  competitor,
  onSelect,
}: {
  competitor: Competitor
  onSelect: () => void
}) {
  return (
    <Card
      className="group hover:border-primary/50 transition-all cursor-pointer"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className={`${competitor.color} text-white text-xs font-medium`}>
              {competitor.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{competitor.name}</h3>
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 ${
                  competitor.tier === 1
                    ? "border-red-500/50 text-red-400"
                    : competitor.tier === 2
                      ? "border-blue-500/50 text-blue-400"
                      : "border-slate-500/50 text-slate-400"
                }`}
              >
                T{competitor.tier}
              </Badge>
            </div>
            {competitor.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {competitor.location}
              </p>
            )}
          </div>
          {competitor.isTracked && (
            <Badge variant="secondary" className="text-[10px] shrink-0">
              Tracked
            </Badge>
          )}
        </div>

        {/* Practice areas */}
        <div className="flex flex-wrap gap-1 mb-3 min-h-[24px]">
          {competitor.practiceAreas.slice(0, 2).map((area) => (
            <Badge
              key={area}
              variant="outline"
              className="text-[10px] border-border text-muted-foreground"
            >
              {area}
            </Badge>
          ))}
          {competitor.practiceAreas.length > 2 && (
            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
              +{competitor.practiceAreas.length - 2}
            </Badge>
          )}
          {competitor.entityType !== "law_firm" && (
            <Badge
              variant="outline"
              className="text-[10px] border-amber-500/50 text-amber-500"
            >
              {getEntityLabel(competitor.entityType)}
            </Badge>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center bg-secondary/50 rounded-md py-2">
            <div className="text-sm font-semibold flex items-center justify-center gap-1">
              <Target className="h-3 w-3 text-primary" />
              {competitor.adsCount}
            </div>
            <div className="text-[10px] text-muted-foreground">ads found</div>
          </div>
          <div className="text-center bg-secondary/50 rounded-md py-2">
            <div className="text-sm font-semibold flex items-center justify-center gap-1">
              <Satellite className="h-3 w-3 text-blue-400" />
              {competitor.adSourceCount}
            </div>
            <div className="text-[10px] text-muted-foreground">platforms</div>
          </div>
          <div className="text-center bg-secondary/50 rounded-md py-2">
            <div
              className={`text-sm font-semibold flex items-center justify-center gap-1 ${
                competitor.tier === 1
                  ? "text-red-400"
                  : competitor.tier === 2
                    ? "text-blue-400"
                    : "text-slate-400"
              }`}
            >
              <Shield className="h-3 w-3" />
              T{competitor.tier}
            </div>
            <div className="text-[10px] text-muted-foreground">tier</div>
          </div>
        </div>

        {/* Footer */}
        {competitor.website && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
            <Globe className="h-3 w-3 shrink-0" />
            <span className="truncate">{competitor.website}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────
// Competitor Detail (profile view)
// ─────────────────────────────────────────────

function CompetitorDetail({
  competitor,
  onBack,
  onToggleTracked,
  onAddToBoard,
  onViewWebsite,
  onExport,
}: {
  competitor: Competitor
  onBack: () => void
  onToggleTracked: () => void
  onAddToBoard: () => void
  onViewWebsite: () => void
  onExport: () => void
}) {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to all firms
      </Button>

      {/* Profile header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 shrink-0">
          <AvatarFallback className={`${competitor.color} text-white text-lg font-medium`}>
            {competitor.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-2xl font-bold">{competitor.name}</h2>
            <Badge
              variant="outline"
              className={`${
                competitor.tier === 1
                  ? "border-red-500/50 text-red-400"
                  : competitor.tier === 2
                    ? "border-blue-500/50 text-blue-400"
                    : "border-slate-500/50 text-slate-400"
              }`}
            >
              {getTierLabel(competitor.tier)}
            </Badge>
            {competitor.isTracked && <Badge variant="secondary">Tracked</Badge>}
            {competitor.entityType !== "law_firm" && (
              <Badge variant="outline" className="border-amber-500/50 text-amber-500">
                {getEntityLabel(competitor.entityType)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            {competitor.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {competitor.location}
              </span>
            )}
            {competitor.website && (
              <a
                href={`https://${competitor.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                {competitor.website}
              </a>
            )}
            {competitor.firmSize && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {competitor.firmSize}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {competitor.practiceAreas.map((area) => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onToggleTracked}>
            {competitor.isTracked ? "Untrack" : "Track"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddToBoard}>
                <Plus className="h-4 w-4 mr-2" /> Add to Board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewWebsite}>
                <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" /> Export Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats — real data */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{competitor.adsCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Ads Found</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {competitor.adSourceCount}
              <span className="text-sm font-normal text-muted-foreground">/3</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Platforms Monitored</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div
              className={`text-2xl font-bold ${
                competitor.tier === 1
                  ? "text-red-400"
                  : competitor.tier === 2
                    ? "text-blue-400"
                    : "text-slate-400"
              }`}
            >
              {getTierLabel(competitor.tier)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Coverage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Monitoring Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <MonitoringRow
            name="Google Ads Transparency"
            active={!!(competitor.googleAdvertiserId || competitor.googleAdUrl)}
            url={competitor.googleAdUrl}
          />
          <MonitoringRow
            name="Meta Ad Library"
            active={!!(competitor.facebookPageId || competitor.metaAdLibraryUrl)}
            url={competitor.metaAdLibraryUrl}
          />
          <MonitoringRow
            name="LinkedIn Ad Library"
            active={!!competitor.linkedinAdUrl}
            url={competitor.linkedinAdUrl}
          />
        </CardContent>
      </Card>

      {/* Coming Soon — Analytics */}
      <Card className="border-dashed border-muted-foreground/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Analytics &amp; Metrics — Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ad spend tracking, filing counts, news mentions, social monitoring, and reputation
            scoring will appear here once the data pipelines are connected.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function CompetitorsView() {
  // ── Data ──────────────────────────────────
  const { data, isLoading, error, refetch } = useAllLawFirms()

  // ── UI state ──────────────────────────────
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("tier")
  const [filterTier, setFilterTier] = useState<string>("all")
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)

  // ── Tracked state (local until backend supports it) ─
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set())
  const [trackedInitialized, setTrackedInitialized] = useState(false)

  // ── Board dialog state ────────────────────
  const [addToBoardOpen, setAddToBoardOpen] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string>("")
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")
  const [competitorToAdd, setCompetitorToAdd] = useState<Competitor | null>(null)

  const { toast } = useToast()
  const { boards, addItemToBoard, getColumnsByBoardId } = useBoardStore()

  // ── Map backend data ──────────────────────
  const allCompetitors = useMemo(() => {
    const firms = data as BackendLawFirmList | undefined
    if (!firms?.items) return []
    return firms.items.map(mapLawFirmToCompetitor)
  }, [data])

  // Initialize tracked IDs from T1 firms on first load
  useEffect(() => {
    if (allCompetitors.length > 0 && !trackedInitialized) {
      const t1Ids = new Set(allCompetitors.filter((c) => c.tier === 1).map((c) => c.id))
      setTrackedIds(t1Ids)
      setTrackedInitialized(true)
    }
  }, [allCompetitors, trackedInitialized])

  // Merge tracked status
  const competitorsWithTracking = useMemo(() => {
    return allCompetitors.map((c) => ({
      ...c,
      isTracked: trackedIds.has(c.id),
    }))
  }, [allCompetitors, trackedIds])

  // ── Summary stats ─────────────────────────
  const stats = useMemo(() => {
    if (!allCompetitors.length) return null
    return {
      total: allCompetitors.length,
      tier1: allCompetitors.filter((c) => c.tier === 1).length,
      tier2: allCompetitors.filter((c) => c.tier === 2).length,
      tier3: allCompetitors.filter((c) => c.tier === 3).length,
      withGoogle: allCompetitors.filter((c) => c.googleAdvertiserId).length,
      withMeta: allCompetitors.filter((c) => c.facebookPageId || c.metaAdLibraryUrl).length,
      withLinkedIn: allCompetitors.filter((c) => c.linkedinAdUrl).length,
    }
  }, [allCompetitors])

  // ── Filter + search (client-side) ─────────
  const filteredCompetitors = useMemo(() => {
    return competitorsWithTracking.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.practiceFocus || "").toLowerCase().includes(searchQuery.toLowerCase())

      let matchesTier = true
      switch (filterTier) {
        case "all":
          matchesTier = true
          break
        case "tracked":
          matchesTier = c.isTracked
          break
        case "agencies":
          matchesTier = c.entityType !== "law_firm"
          break
        default:
          matchesTier = c.tier === Number(filterTier)
      }

      return matchesSearch && matchesTier
    })
  }, [competitorsWithTracking, searchQuery, filterTier])

  // ── Sort ───────────────────────────────────
  const sortedCompetitors = useMemo(() => {
    const sorted = [...filteredCompetitors]
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "tier":
        sorted.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))
        break
      case "ads":
        sorted.sort((a, b) => b.adsCount - a.adsCount || a.name.localeCompare(b.name))
        break
      case "sources":
        sorted.sort((a, b) => b.adSourceCount - a.adSourceCount || a.name.localeCompare(b.name))
        break
    }
    return sorted
  }, [filteredCompetitors, sortBy])

  // ── Handlers ───────────────────────────────

  const handleToggleTracked = useCallback(
    (competitorId: string, competitorName: string) => {
      setTrackedIds((prev) => {
        const next = new Set(prev)
        const wasTracked = next.has(competitorId)
        if (wasTracked) {
          next.delete(competitorId)
        } else {
          next.add(competitorId)
        }
        toast({
          title: wasTracked ? "Competitor Untracked" : "Competitor Tracked",
          description: wasTracked
            ? `${competitorName} removed from tracked competitors.`
            : `${competitorName} added to tracked competitors.`,
        })
        return next
      })
      // Also update selectedCompetitor if it matches
      setSelectedCompetitor((prev) =>
        prev && prev.id === competitorId ? { ...prev, isTracked: !prev.isTracked } : prev
      )
    },
    [toast]
  )

  const handleOpenAddToBoard = useCallback((competitor: Competitor) => {
    setCompetitorToAdd(competitor)
    setSelectedBoardId("")
    setSelectedColumnId("")
    setAddToBoardOpen(true)
  }, [])

  const selectedBoardColumns = selectedBoardId ? getColumnsByBoardId(selectedBoardId) : []
  const selectedBoard = boards.find((b) => b.id === selectedBoardId)

  const handleConfirmAddToBoard = useCallback(() => {
    if (!selectedBoardId || !selectedColumnId || !competitorToAdd) return

    const boardItem = createCompetitorBoardItem({
      id: competitorToAdd.id,
      name: competitorToAdd.name,
      location: competitorToAdd.location,
      website: competitorToAdd.website,
      practiceAreas: competitorToAdd.practiceAreas,
      isTracked: competitorToAdd.isTracked,
      totalAdSpend: competitorToAdd.totalAdSpend ?? 0,
      activeCampaigns: competitorToAdd.activeCampaigns ?? 0,
    })

    addItemToBoard(selectedBoardId, selectedColumnId, boardItem)

    const columnName =
      selectedBoardColumns.find((c) => c.id === selectedColumnId)?.title || selectedColumnId
    const boardName = selectedBoard?.name || "Board"

    toast({
      title: "Added to Board",
      description: `${competitorToAdd.name} added to "${boardName}" → "${columnName}".`,
    })

    setAddToBoardOpen(false)
    setCompetitorToAdd(null)
  }, [
    selectedBoardId,
    selectedColumnId,
    competitorToAdd,
    selectedBoardColumns,
    selectedBoard,
    addItemToBoard,
    toast,
  ])

  const handleViewWebsite = useCallback((website: string) => {
    if (website) window.open(`https://${website}`, "_blank", "noopener,noreferrer")
  }, [])

  const handleExportProfile = useCallback(
    (competitor: Competitor) => {
      const exportData = {
        name: competitor.name,
        website: competitor.website,
        location: competitor.location,
        tier: competitor.tier,
        entityType: competitor.entityType,
        practiceAreas: competitor.practiceAreas,
        practiceFocus: competitor.practiceFocus,
        adsFound: competitor.adsCount,
        adSourceCount: competitor.adSourceCount,
        monitoring: {
          google: competitor.googleAdUrl,
          meta: competitor.metaAdLibraryUrl,
          linkedin: competitor.linkedinAdUrl,
        },
        exportedAt: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${competitor.name.toLowerCase().replace(/\s+/g, "-")}-profile.json`
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: "Profile Exported", description: `${competitor.name} profile downloaded.` })
    },
    [toast]
  )

  // ── Loading ────────────────────────────────
  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorState error={error as Error} onRetry={() => refetch()} />

  // ── Detail View ────────────────────────────
  if (selectedCompetitor) {
    return (
      <>
        <CompetitorDetail
          competitor={selectedCompetitor}
          onBack={() => setSelectedCompetitor(null)}
          onToggleTracked={() =>
            handleToggleTracked(selectedCompetitor.id, selectedCompetitor.name)
          }
          onAddToBoard={() => handleOpenAddToBoard(selectedCompetitor)}
          onViewWebsite={() => handleViewWebsite(selectedCompetitor.website)}
          onExport={() => handleExportProfile(selectedCompetitor)}
        />

        {/* Add to Board dialog */}
        <Dialog open={addToBoardOpen} onOpenChange={setAddToBoardOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Board</DialogTitle>
              <DialogDescription>
                Add {competitorToAdd?.name} to a board for tracking.
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
      </>
    )
  }

  // ── List View ──────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search firms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-secondary/30"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-9">
                {SORT_OPTIONS.find((s) => s.key === sortBy)?.label || "Sort"}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={sortBy === option.key ? "bg-secondary" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      {stats && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{stats.total} firms</span>
          <span>·</span>
          <span className="text-red-400">{stats.tier1} Tier 1</span>
          <span>·</span>
          <span className="text-blue-400">{stats.tier2} Tier 2</span>
          <span>·</span>
          <span className="text-slate-400">{stats.tier3} Tier 3</span>
          <span className="mx-1">|</span>
          <span>{stats.withGoogle} Google</span>
          <span>·</span>
          <span>{stats.withMeta} Meta</span>
          <span>·</span>
          <span>{stats.withLinkedIn} LinkedIn</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterTier(filter.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filterTier === filter.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}
          >
            {filter.label}
            {filter.key !== "all" && (
              <span className="ml-1 opacity-70">
                {filter.key === "tracked"
                  ? trackedIds.size
                  : filter.key === "agencies"
                    ? allCompetitors.filter((c) => c.entityType !== "law_firm").length
                    : allCompetitors.filter((c) => c.tier === Number(filter.key)).length}
              </span>
            )}
          </button>
        ))}
        {searchQuery && (
          <span className="text-xs text-muted-foreground ml-2">
            {sortedCompetitors.length} result{sortedCompetitors.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      {sortedCompetitors.length === 0 ? (
        <EmptyFilterState searchQuery={searchQuery} filterTier={filterTier} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedCompetitors.map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onSelect={() => setSelectedCompetitor(competitor)}
            />
          ))}
        </div>
      ) : (
        /* List view — table layout */
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">Firm</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Location</th>
                <th className="text-center px-4 py-3 font-medium">Tier</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Practice</th>
                <th className="text-center px-4 py-3 font-medium">Ads</th>
                <th className="text-center px-4 py-3 font-medium">Platforms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedCompetitors.map((competitor) => (
                <tr
                  key={competitor.id}
                  className="hover:bg-secondary/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedCompetitor(competitor)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`${competitor.color} text-white text-[10px] font-medium`}
                        >
                          {competitor.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {competitor.name}
                          {competitor.isTracked && (
                            <Badge variant="secondary" className="text-[9px] py-0 px-1">
                              Tracked
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{competitor.website}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {competitor.location || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        competitor.tier === 1
                          ? "border-red-500/50 text-red-400"
                          : competitor.tier === 2
                            ? "border-blue-500/50 text-blue-400"
                            : "border-slate-500/50 text-slate-400"
                      }`}
                    >
                      T{competitor.tier}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {competitor.practiceAreas.slice(0, 2).map((area) => (
                        <Badge
                          key={area}
                          variant="outline"
                          className="text-[10px] border-border text-muted-foreground"
                        >
                          {area}
                        </Badge>
                      ))}
                      {competitor.practiceAreas.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{competitor.practiceAreas.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium">
                    {competitor.adsCount}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    <span className="text-blue-400">{competitor.adSourceCount}</span>
                    <span className="text-muted-foreground/50">/3</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
