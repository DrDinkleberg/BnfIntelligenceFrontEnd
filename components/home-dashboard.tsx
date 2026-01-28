"use client"

import { TrendingUp, TrendingDown, Users, Clock, Zap, ChevronRight, ExternalLink, Megaphone } from "lucide-react"
import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mini sparkline chart component
function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const height = 28
  const width = 64
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
      <polygon fill={`url(#gradient-${color.replace("#", "")})`} points={`0,${height} ${points} ${width},${height}`} />
    </svg>
  )
}

// Stat card component
function StatCard({
  label,
  value,
  change,
  trend,
  chartData,
  chartColor,
}: {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  chartData: number[]
  chartColor: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
      <div>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-xl font-bold text-foreground">{value}</span>
          <span className={`text-[10px] font-medium flex items-center gap-0.5 ${trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
            {trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {change}
          </span>
        </div>
      </div>
      <MiniChart data={chartData} color={chartColor} />
    </div>
  )
}

// Alert item for "What Changed Today"
function AlertItem({
  title,
  description,
  time,
  severity,
  category,
  onClick,
}: {
  title: string
  description: string
  time: string
  severity: "critical" | "warning" | "info"
  category: string
  onClick?: () => void
}) {
  const severityColors = {
    critical: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  }

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${severityColors[severity]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-medium text-foreground truncate">{title}</h4>
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 shrink-0">
            {category}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {time}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  )
}

// Competitor card
function CompetitorCard({
  name,
  location,
  spend,
  spendChange,
  campaigns,
  lastActivity,
  onClick,
}: {
  name: string
  location: string
  spend: string
  spendChange: string
  campaigns: number
  lastActivity: string
  onClick?: () => void
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <Avatar className="h-9 w-9 border border-border">
        <AvatarFallback className="text-[10px] bg-secondary text-foreground">
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{name}</h4>
        <p className="text-[11px] text-muted-foreground">{location}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-foreground">{spend}</p>
        <p className="text-[10px] text-emerald-400">{spendChange}</p>
      </div>
    </div>
  )
}

// Trending topic row
function TrendingTopicRow({
  topic,
  mentions,
  trend,
  riskLevel,
  onClick,
}: {
  topic: string
  mentions: number
  trend: number
  riskLevel: "critical" | "high" | "medium" | "low"
  onClick?: () => void
}) {
  const riskColors = {
    critical: "bg-red-500/20 text-red-400",
    high: "bg-amber-500/20 text-amber-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-emerald-500/20 text-emerald-400",
  }

  return (
    <div
      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{topic}</h4>
        <p className="text-[10px] text-muted-foreground">{mentions.toLocaleString()} mentions</p>
      </div>
      <Badge className={`text-[10px] px-1.5 py-0 h-5 ${riskColors[riskLevel]}`}>{riskLevel}</Badge>
      <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-0.5">
        <TrendingUp className="h-3 w-3" />+{trend}%
      </span>
    </div>
  )
}

interface HomeDashboardProps {
  onNavigate: (tab: string) => void
  onNavigateToPracticeArea: (area: string) => void
}

export default function HomeDashboard({ onNavigate, onNavigateToPracticeArea }: HomeDashboardProps) {
  const generateChartData = () => Array.from({ length: 10 }, () => Math.random() * 100 + 50)

  const todayAlerts = [
    {
      title: "FDA warning letter: Acme Pharmaceuticals",
      description: "Quality control violations cited including inadequate batch testing and contamination protocols at Newark facility",
      time: "2h ago",
      severity: "critical" as const,
      category: "FDA",
    },
    {
      title: "Morgan & Morgan expands PFAS campaign",
      description: "Detected $2.3M ad spend increase across Google and Meta platforms targeting 12 new markets",
      time: "4h ago",
      severity: "warning" as const,
      category: "Ads",
    },
    {
      title: "New class action: DataCorp securities fraud",
      description: "SDNY filing alleges material misstatements, seeks $450M on behalf of investors",
      time: "6h ago",
      severity: "info" as const,
      category: "Filing",
    },
    {
      title: "SEC opens investigation: CryptoLend",
      description: "Formal investigation announced into lending platform over unregistered securities offerings",
      time: "8h ago",
      severity: "critical" as const,
      category: "SEC",
    },
    {
      title: "Talc MDL consolidated to D.N.J.",
      description: "JPML orders transfer of 4,200 pending cases for coordinated pretrial proceedings",
      time: "10h ago",
      severity: "info" as const,
      category: "MDL",
    },
  ]

  const topCompetitors = [
    { name: "Morgan & Morgan", location: "Orlando, FL", spend: "$2.4M", spendChange: "+18%", campaigns: 45, lastActivity: "2h" },
    { name: "Keller Postman", location: "Chicago, IL", spend: "$1.8M", spendChange: "+12%", campaigns: 32, lastActivity: "4h" },
    { name: "Napoli Shkolnik", location: "New York, NY", spend: "$1.2M", spendChange: "+8%", campaigns: 28, lastActivity: "6h" },
    { name: "Weitz & Luxenberg", location: "New York, NY", spend: "$980K", spendChange: "+5%", campaigns: 22, lastActivity: "1d" },
  ]

  const trendingTopics = [
    { topic: "PFAS water contamination", mentions: 1247, trend: 89, riskLevel: "critical" as const },
    { topic: "Social media youth harm", mentions: 892, trend: 156, riskLevel: "high" as const },
    { topic: "Crypto lending fraud", mentions: 634, trend: 67, riskLevel: "high" as const },
    { topic: "AI employment discrimination", mentions: 423, trend: 234, riskLevel: "medium" as const },
  ]

  const newAds = [
    { firm: "Morgan & Morgan", platform: "Google", campaign: "Camp Lejeune", spend: "$89K", time: "2h" },
    { firm: "Keller Postman", platform: "Meta", campaign: "PFAS Water", spend: "$45K", time: "4h" },
    { firm: "Napoli Shkolnik", platform: "Google", campaign: "Talc Powder", spend: "$32K", time: "6h" },
    { firm: "Weitz & Luxenberg", platform: "TV", campaign: "Mesothelioma", spend: "$120K", time: "8h" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Firms tracked" value="729" change="+12" trend="up" chartData={generateChartData()} chartColor="#8B5CF6" />
        <StatCard label="Active cases" value="48.6K" change="+2.4K" trend="up" chartData={generateChartData()} chartColor="#3B82F6" />
        <StatCard label="Ads detected" value="23.6K" change="+892" trend="up" chartData={generateChartData()} chartColor="#10B981" />
        <StatCard label="Monthly spend" value="$36M" change="+$4.2M" trend="up" chartData={generateChartData()} chartColor="#F59E0B" />
      </div>

      {/* Main Content Grid - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Alerts */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Today</CardTitle>
                <Badge variant="secondary" className="text-[10px] h-5">{todayAlerts.length} new</Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                See all
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border/50">
              {todayAlerts.slice(0, 4).map((alert, index) => (
                <AlertItem
                  key={index}
                  title={alert.title}
                  description={alert.description}
                  time={alert.time}
                  severity={alert.severity}
                  category={alert.category}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Ads */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">New ads</CardTitle>
                <Badge variant="secondary" className="text-[10px] h-5">{newAds.length} detected</Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                See all
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border/50">
              {newAds.map((ad, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors cursor-pointer group"
                  onClick={() => onNavigate("competitors")}
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="text-[10px] bg-secondary text-foreground">
                      {ad.firm.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground truncate">{ad.firm}</h4>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-border shrink-0">
                        {ad.platform}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{ad.campaign}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground">{ad.spend}</p>
                    <p className="text-[10px] text-muted-foreground">{ad.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Trending</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] h-5 border-border">7d</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {trendingTopics.map((topic, index) => (
                <TrendingTopicRow
                  key={index}
                  topic={topic.topic}
                  mentions={topic.mentions}
                  trend={topic.trend}
                  riskLevel={topic.riskLevel}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Top Competitors */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Top spenders</CardTitle>
              <Badge variant="secondary" className="text-[10px] h-5">30d</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
              See all
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {topCompetitors.map((competitor, index) => (
              <CompetitorCard
                key={index}
                name={competitor.name}
                location={competitor.location}
                spend={competitor.spend}
                spendChange={competitor.spendChange}
                campaigns={competitor.campaigns}
                lastActivity={competitor.lastActivity}
                onClick={() => onNavigate("competitors")}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Areas Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Class Action", firms: 342, cases: "1.2K", spend: "$12.4M", trend: "+23%", color: "bg-blue-500" },
          { title: "Mass Torts", firms: 289, cases: "2.1K", spend: "$18.9M", trend: "+34%", color: "bg-purple-500" },
          { title: "Mass Arbitration", firms: 98, cases: "45.2K", spend: "$3.2M", trend: "+156%", color: "bg-amber-500" },
        ].map((area) => (
          <Card
            key={area.title}
            className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer group"
            onClick={() => onNavigate("market-intel")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${area.color}`} />
                  <h3 className="font-semibold text-foreground">{area.title}</h3>
                </div>
                <span className="text-xs font-medium text-emerald-400">{area.trend}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-md bg-secondary/50">
                  <p className="text-lg font-bold text-foreground">{area.firms}</p>
                  <p className="text-[10px] text-muted-foreground">Firms</p>
                </div>
                <div className="text-center p-2 rounded-md bg-secondary/50">
                  <p className="text-lg font-bold text-foreground">{area.cases}</p>
                  <p className="text-[10px] text-muted-foreground">Cases</p>
                </div>
                <div className="text-center p-2 rounded-md bg-secondary/50">
                  <p className="text-lg font-bold text-foreground">{area.spend}</p>
                  <p className="text-[10px] text-muted-foreground">Spend</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
