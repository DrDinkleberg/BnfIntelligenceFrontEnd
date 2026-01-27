"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Grid3X3,
  List,
  ChevronDown,
  ExternalLink,
  MapPin,
  Globe,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
  MoreHorizontal,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

interface Competitor {
  id: string
  name: string
  initials: string
  color: string
  location: string
  practiceAreas: string[]
  adsCount: number
  filingsCount: number
  mentionsCount: number
  isTracked: boolean
  lastActivity: string
  isActive: boolean
  website: string
  firmSize: string
  totalAdSpend: number
  activeCampaigns: number
  filingsYTD: number
  newsMentions: number
  socialMentions: number
  reputationScore: number
}

const mockCompetitors: Competitor[] = [
  {
    id: "1",
    name: "Morgan & Morgan",
    initials: "MM",
    color: "bg-blue-500",
    location: "Orlando, FL",
    practiceAreas: ["Mass Torts", "Personal Injury", "Class Action"],
    adsCount: 156,
    filingsCount: 42,
    mentionsCount: 892,
    isTracked: true,
    lastActivity: "Active today",
    isActive: true,
    website: "forthepeople.com",
    firmSize: "Large",
    totalAdSpend: 2500000,
    activeCampaigns: 24,
    filingsYTD: 156,
    newsMentions: 234,
    socialMentions: 892,
    reputationScore: 87,
  },
  {
    id: "2",
    name: "Weitz & Luxenberg",
    initials: "WL",
    color: "bg-purple-500",
    location: "New York, NY",
    practiceAreas: ["Mass Torts", "Asbestos", "Pharmaceutical"],
    adsCount: 89,
    filingsCount: 67,
    mentionsCount: 456,
    isTracked: true,
    lastActivity: "Active 2h ago",
    isActive: true,
    website: "weitzlux.com",
    firmSize: "Large",
    totalAdSpend: 1800000,
    activeCampaigns: 18,
    filingsYTD: 234,
    newsMentions: 156,
    socialMentions: 456,
    reputationScore: 92,
  },
  {
    id: "3",
    name: "Simmons Hanly Conroy",
    initials: "SH",
    color: "bg-green-500",
    location: "Alton, IL",
    practiceAreas: ["Mass Torts", "Environmental", "Class Action"],
    adsCount: 112,
    filingsCount: 89,
    mentionsCount: 567,
    isTracked: true,
    lastActivity: "Active yesterday",
    isActive: false,
    website: "simmonsfirm.com",
    firmSize: "Large",
    totalAdSpend: 2100000,
    activeCampaigns: 21,
    filingsYTD: 198,
    newsMentions: 189,
    socialMentions: 567,
    reputationScore: 89,
  },
  {
    id: "4",
    name: "Parker Waichman",
    initials: "PW",
    color: "bg-orange-500",
    location: "Port Washington, NY",
    practiceAreas: ["Class Action", "Pharmaceutical", "Medical Devices"],
    adsCount: 67,
    filingsCount: 34,
    mentionsCount: 234,
    isTracked: false,
    lastActivity: "Last active 3d ago",
    isActive: false,
    website: "yourlawyer.com",
    firmSize: "Medium",
    totalAdSpend: 950000,
    activeCampaigns: 12,
    filingsYTD: 89,
    newsMentions: 78,
    socialMentions: 234,
    reputationScore: 78,
  },
  {
    id: "5",
    name: "Napoli Shkolnik",
    initials: "NS",
    color: "bg-red-500",
    location: "New York, NY",
    practiceAreas: ["Mass Torts", "Environmental", "Pharmaceutical"],
    adsCount: 78,
    filingsCount: 56,
    mentionsCount: 345,
    isTracked: true,
    lastActivity: "Active today",
    isActive: true,
    website: "napolilaw.com",
    firmSize: "Large",
    totalAdSpend: 1600000,
    activeCampaigns: 15,
    filingsYTD: 167,
    newsMentions: 145,
    socialMentions: 345,
    reputationScore: 85,
  },
  {
    id: "6",
    name: "Ben Crump Law",
    initials: "BC",
    color: "bg-teal-500",
    location: "Tallahassee, FL",
    practiceAreas: ["Civil Rights", "Personal Injury", "Class Action"],
    adsCount: 134,
    filingsCount: 28,
    mentionsCount: 1234,
    isTracked: true,
    lastActivity: "Active 4h ago",
    isActive: true,
    website: "bencrump.com",
    firmSize: "Medium",
    totalAdSpend: 1200000,
    activeCampaigns: 16,
    filingsYTD: 78,
    newsMentions: 567,
    socialMentions: 1234,
    reputationScore: 91,
  },
]

const mockActivityFeed = [
  { id: "1", type: "ad", title: "Launched Camp Lejeune campaign on Google Ads", date: "2h ago" },
  { id: "2", type: "filing", title: "Filed securities class action in SDNY", date: "Yesterday" },
  { id: "3", type: "social", title: "Mentioned in 23 PFAS discussions on Reddit", date: "2d ago" },
  { id: "4", type: "news", title: "Quoted in Law360 mass tort trends report", date: "3d ago" },
  { id: "5", type: "ad", title: "Increased Meta spend by 35% ($420K)", date: "1w ago" },
]

export default function CompetitorsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("Most Active")
  const [filterPractice, setFilterPractice] = useState("All")
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)

  const practiceFilters = ["All", "Tracked", "Class Action", "Mass Torts", "Mass Arbitration"]

  const filteredCompetitors = mockCompetitors.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPractice = filterPractice === "All" ||
      (filterPractice === "Tracked" && c.isTracked) ||
      c.practiceAreas.some((p) => p.toLowerCase().includes(filterPractice.toLowerCase()))
    return matchesSearch && matchesPractice
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num)
  }

  // Competitor Profile View
  if (selectedCompetitor) {
    return (
      <div className="min-h-full bg-background">
        {/* Profile Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <button
              onClick={() => setSelectedCompetitor(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Competitors
            </button>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className={`h-16 w-16 ${selectedCompetitor.color}`}>
                  <AvatarFallback className="text-white text-xl font-bold bg-transparent">
                    {selectedCompetitor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{selectedCompetitor.name}</h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedCompetitor.location}
                    </span>
                    <span>{selectedCompetitor.firmSize} Firm</span>
                    <a
                      href={`https://${selectedCompetitor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      {selectedCompetitor.website}
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCompetitor.practiceAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tracked</span>
                  <Switch checked={selectedCompetitor.isTracked} />
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Add to Board
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Website</DropdownMenuItem>
                    <DropdownMenuItem>Export Profile</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedCompetitor.totalAdSpend)}</div>
                <div className="text-xs text-muted-foreground">Ad spend (est.)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedCompetitor.activeCampaigns}</div>
                <div className="text-xs text-muted-foreground">Active campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedCompetitor.filingsYTD}</div>
                <div className="text-xs text-muted-foreground">Filings YTD</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{selectedCompetitor.newsMentions}</div>
                <div className="text-xs text-muted-foreground">News (30d)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{formatNumber(selectedCompetitor.socialMentions)}</div>
                <div className="text-xs text-muted-foreground">Social (30d)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="advertising">Advertising</TabsTrigger>
              <TabsTrigger value="filings">Court Filings</TabsTrigger>
              <TabsTrigger value="mentions">News & Social</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Activity Timeline</h3>
                <div className="space-y-3">
                  {mockActivityFeed.map((item) => (
                    <Card key={item.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                              item.type === "ad" ? "bg-primary/20 text-primary" :
                              item.type === "filing" ? "bg-blue-500/20 text-blue-400" :
                              item.type === "social" ? "bg-green-500/20 text-green-400" :
                              "bg-orange-500/20 text-orange-400"
                            }`}>
                              {item.type === "ad" && <Target className="h-4 w-4" />}
                              {item.type === "filing" && <FileText className="h-4 w-4" />}
                              {item.type === "social" && <MessageSquare className="h-4 w-4" />}
                              {item.type === "news" && <Globe className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-sm text-foreground">{item.title}</p>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Add to Board
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advertising">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">45%</div>
                    <div className="text-xs text-muted-foreground">Google Ads</div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">35%</div>
                    <div className="text-xs text-muted-foreground">Meta Ads</div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">20%</div>
                    <div className="text-xs text-muted-foreground">LinkedIn Ads</div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground text-center py-8">Campaign details would be displayed here</p>
            </TabsContent>

            <TabsContent value="filings">
              <p className="text-sm text-muted-foreground text-center py-8">Court filings would be displayed here</p>
            </TabsContent>

            <TabsContent value="mentions">
              <p className="text-sm text-muted-foreground text-center py-8">News and social mentions would be displayed here</p>
            </TabsContent>

            <TabsContent value="notes">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <textarea
                    placeholder="Add notes about this competitor..."
                    className="w-full h-32 bg-transparent border-0 resize-none focus:outline-none text-sm"
                  />
                  <div className="flex justify-end mt-4">
                    <Button size="sm">Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Competitors List View
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
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add firm
          </Button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {practiceFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterPractice(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filterPractice === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent gap-1">
                {sortBy}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("Most Active")}>Most Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Recently Added")}>Recently Added</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Alphabetical")}>Alphabetical</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex border border-border rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        {filteredCompetitors.length} competitors
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitors.map((competitor) => (
            <Card
              key={competitor.id}
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => setSelectedCompetitor(competitor)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className={`h-10 w-10 ${competitor.color}`}>
                    <AvatarFallback className="text-white text-sm font-bold bg-transparent">
                      {competitor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {competitor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {competitor.location}
                    </p>
                  </div>
                  {competitor.isTracked && (
                    <Badge variant="secondary" className="text-[10px] shrink-0">Tracked</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {competitor.practiceAreas.slice(0, 2).map((area) => (
                    <Badge key={area} variant="outline" className="text-[10px] border-border text-muted-foreground">
                      {area}
                    </Badge>
                  ))}
                  {competitor.practiceAreas.length > 2 && (
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                      +{competitor.practiceAreas.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center bg-secondary/50 rounded-md py-2">
                    <div className="text-sm font-semibold text-foreground flex items-center justify-center gap-1">
                      <Target className="h-3 w-3 text-primary" />
                      {competitor.adsCount}
                    </div>
                    <div className="text-[10px] text-muted-foreground">ads</div>
                  </div>
                  <div className="text-center bg-secondary/50 rounded-md py-2">
                    <div className="text-sm font-semibold text-foreground flex items-center justify-center gap-1">
                      <FileText className="h-3 w-3 text-blue-400" />
                      {competitor.filingsCount}
                    </div>
                    <div className="text-[10px] text-muted-foreground">filings</div>
                  </div>
                  <div className="text-center bg-secondary/50 rounded-md py-2">
                    <div className="text-sm font-semibold text-foreground flex items-center justify-center gap-1">
                      <MessageSquare className="h-3 w-3 text-green-400" />
                      {competitor.mentionsCount}
                    </div>
                    <div className="text-[10px] text-muted-foreground">mentions</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {competitor.isActive ? (
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active today
                    </span>
                  ) : (
                    <span>{competitor.lastActivity}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left p-3 font-medium">Firm</th>
                <th className="text-left p-3 font-medium">Practice Areas</th>
                <th className="text-center p-3 font-medium">Active Ads</th>
                <th className="text-center p-3 font-medium">Filings</th>
                <th className="text-center p-3 font-medium">Mentions</th>
                <th className="text-left p-3 font-medium">Last Activity</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitors.map((competitor) => (
                <tr
                  key={competitor.id}
                  className="border-t border-border hover:bg-secondary/30 cursor-pointer"
                  onClick={() => setSelectedCompetitor(competitor)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className={`h-8 w-8 ${competitor.color}`}>
                        <AvatarFallback className="text-white text-xs font-bold bg-transparent">
                          {competitor.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{competitor.name}</div>
                        <div className="text-xs text-muted-foreground">{competitor.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {competitor.practiceAreas.slice(0, 2).map((area) => (
                        <Badge key={area} variant="outline" className="text-[10px]">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-center font-medium">{competitor.adsCount}</td>
                  <td className="p-3 text-center font-medium">{competitor.filingsCount}</td>
                  <td className="p-3 text-center font-medium">{competitor.mentionsCount}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {competitor.isActive && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                      {competitor.lastActivity}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
