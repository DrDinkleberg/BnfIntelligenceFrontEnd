"use client"

import { useState } from "react"
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
import SlideOver from "@/components/slide-over"

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
    description: "Detected $2.3M spend increase across Google and Meta platforms. Campaign now targeting 12 new markets with focus on municipal water contamination claims.",
    type: "ad",
    source: "Google Ads",
    entities: ["Morgan & Morgan", "PFAS", "Mass Torts"],
    timestamp: "1d",
    date: "Jan 26, 2026",
  },
  {
    id: "6",
    title: "DOJ settles with PharmaCorp for $2.3B",
    description: "Settlement resolves allegations of off-label marketing and kickbacks to physicians. Company admits no wrongdoing. Whistleblower to receive $180M award.",
    type: "regulatory",
    source: "DOJ",
    severity: "medium",
    entities: ["PharmaCorp", "DOJ", "Whistleblower"],
    timestamp: "1d",
    date: "Jan 26, 2026",
  },
  {
    id: "7",
    title: "Law360: 2026 mass tort outlook",
    description: "Annual trends report highlights 40% YoY growth in PFAS filings, declining talc docket, and emerging litigation around AI employment discrimination.",
    type: "news",
    source: "Law360",
    sentiment: "neutral",
    entities: ["Mass Torts", "PFAS", "AI Litigation"],
    timestamp: "2d",
    date: "Jan 25, 2026",
  },
  {
    id: "8",
    title: "Camp Lejeune explainer goes viral",
    description: "TikTok attorney @lawbylisa video explaining eligibility criteria reaches 2M views. Comments show high intent with users asking about filing deadlines.",
    type: "social",
    source: "TikTok",
    sentiment: "positive",
    engagement: { likes: 234000, comments: 8900, shares: 45000 },
    entities: ["Camp Lejeune", "Legal Marketing", "TikTok"],
    timestamp: "2d",
    date: "Jan 25, 2026",
  },
]

const mockTrending = [
  { name: "PFAS water contamination", mentions: 1234, trend: "up" },
  { name: "Camp Lejeune settlement", mentions: 892, trend: "up" },
  { name: "Hair relaxer MDL", mentions: 567, trend: "up" },
  { name: "Talcum powder", mentions: 456, trend: "down" },
  { name: "Paraquat herbicide", mentions: 345, trend: "stable" },
]

const mockSavedSearches = [
  { name: "PFAS class actions", active: true },
  { name: "FDA warnings", active: false },
  { name: "Camp Lejeune social", active: true },
]

const typeConfig = {
  regulatory: { color: "border-l-red-500", icon: AlertTriangle, label: "Regulatory", bgColor: "bg-red-500/10" },
  filing: { color: "border-l-blue-500", icon: FileText, label: "Filing", bgColor: "bg-blue-500/10" },
  news: { color: "border-l-orange-500", icon: Newspaper, label: "News", bgColor: "bg-orange-500/10" },
  social: { color: "border-l-green-500", icon: Radio, label: "Social", bgColor: "bg-green-500/10" },
  ad: { color: "border-l-primary", icon: Target, label: "Ad Intel", bgColor: "bg-primary/10" },
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
                      <h3 className="font-medium text-foreground mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{item.source}</Badge>
                        {item.severity && (
                          <Badge className={`text-[10px] ${severityConfig[item.severity]}`}>
                            {item.severity}
                          </Badge>
                        )}
                        {item.sentiment && (
                          <Badge className={`text-[10px] ${sentimentConfig[item.sentiment]}`}>
                            {item.sentiment}
                          </Badge>
                        )}
                        {item.engagement && (
                          <span className="text-[10px] text-muted-foreground">
                            {formatNumber(item.engagement.likes)} likes
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                          <Clock className="h-3 w-3" />
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                        <Plus className="h-4 w-4" />
                      </Button>
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
            Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-transparent"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
              className="bg-transparent"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border p-4 space-y-4 overflow-y-auto hidden xl:block">
        {/* Trending */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockTrending.map((topic) => (
              <button
                key={topic.name}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors text-left"
                onClick={() => setSearchQuery(topic.name)}
              >
                <span className="text-sm text-foreground">{topic.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formatNumber(topic.mentions)}</span>
                  {topic.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {topic.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                </div>
              </button>
            ))}
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
                {selectedItem.entities.map((entity) => (
                  <Badge key={entity} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                    {entity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add to Board
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Target className="h-4 w-4" />
                Track Entity
              </Button>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  )
}
