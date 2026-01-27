"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ExternalLink,
  Globe,
  Play,
  ImageIcon,
  FileText,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Target,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SlideOver from "@/components/slide-over"
import type { CompetitorAdSummary } from "@/types/database"

// Mock data for law firms with their ad data
const mockCompetitorData: CompetitorAdSummary[] = [
  {
    firm: {
      id: 1,
      uuid: "firm-1",
      name: "Morgan & Morgan",
      website: "forthepeople.com",
      headquarters_city: "Orlando",
      headquarters_state: "FL",
      firm_size: "biglaw",
      specialties: ["mass tort", "personal injury", "class action"],
      reputation_score: 92,
      created_at: "2020-01-01",
      updated_at: "2024-01-15",
    },
    google_ads: [
      {
        id: 1,
        uuid: "gad-1",
        firm_id: 1,
        advertiser_name: "Morgan & Morgan",
        advertiser_id: "AR12345678",
        ad_creative_text:
          "Injured? Call Morgan & Morgan. Over $20 Billion Recovered. Free Consultation. No Fee Unless We Win.",
        format: "responsive",
        date_range_start: "2024-01-01",
        date_range_end: "2024-01-31",
        geographic_targeting: { regions: ["Florida", "Georgia", "Texas", "California"], cities: [] },
        keywords_detected: ["personal injury lawyer", "car accident attorney", "slip and fall lawyer"],
        is_active: true,
        created_at: "2024-01-01",
        updated_at: "2024-01-15",
      },
      {
        id: 2,
        uuid: "gad-2",
        firm_id: 1,
        advertiser_name: "Morgan & Morgan",
        advertiser_id: "AR12345678",
        ad_creative_text:
          "Camp Lejeune Water Contamination - Were You or a Loved One Stationed at Camp Lejeune? You May Be Entitled to Compensation.",
        format: "text",
        date_range_start: "2024-01-05",
        geographic_targeting: { regions: ["Nationwide"], cities: [] },
        keywords_detected: ["Camp Lejeune", "water contamination", "military lawsuit"],
        is_active: true,
        created_at: "2024-01-05",
        updated_at: "2024-01-15",
      },
    ],
    meta_ads: [
      {
        id: 1,
        uuid: "meta-1",
        firm_id: 1,
        page_name: "Morgan & Morgan",
        page_id: "123456789",
        ad_creative_body:
          "Have you or a loved one been diagnosed with cancer after using Roundup weed killer? You may be entitled to significant compensation. Call now for a free case review.",
        ad_creative_link_title: "Free Roundup Lawsuit Consultation",
        ad_snapshot_url: "https://facebook.com/ads/library/?id=123",
        landing_page_url: "https://forthepeople.com/roundup",
        spend_range_lower: 50000,
        spend_range_upper: 100000,
        impressions_range_lower: 5000000,
        impressions_range_upper: 10000000,
        ad_delivery_start: "2024-01-01",
        is_active: true,
        keywords_detected: ["Roundup", "cancer", "lawsuit", "compensation"],
        created_at: "2024-01-01",
        updated_at: "2024-01-15",
      },
    ],
    linkedin_ads: [
      {
        id: 1,
        uuid: "li-1",
        firm_id: 1,
        advertiser_name: "Morgan & Morgan",
        advertiser_url: "https://linkedin.com/company/morgan-morgan",
        ad_id: "li-ad-123",
        body: "Looking for experienced attorneys to join our mass tort litigation team. Competitive salary and benefits.",
        headline: "Join America's Largest Injury Law Firm",
        click_url: "https://forthepeople.com/careers",
        format: "SINGLE_IMAGE",
        ctas: ["Apply Now"],
        is_active: true,
        keywords_detected: ["hiring", "attorney", "mass tort"],
        created_at: "2024-01-10",
        updated_at: "2024-01-15",
      },
    ],
    website_traffic: {
      id: 1,
      uuid: "traffic-1",
      firm_id: 1,
      domain: "forthepeople.com",
      global_rank: 15234,
      total_visits: 4500000,
      monthly_visits_trend: { "2023-11": 4200000, "2023-12": 4350000, "2024-01": 4500000 },
      traffic_by_country: { US: 92, CA: 3, UK: 2, Other: 3 },
      top_keywords: [
        { keyword: "morgan and morgan", cpc: 12.5, volume: 165000 },
        { keyword: "personal injury lawyer", cpc: 85.0, volume: 74000 },
        { keyword: "car accident attorney", cpc: 95.0, volume: 49500 },
      ],
      traffic_sources: { direct: 35, search: 45, social: 8, referral: 5, paid: 6, mail: 1 },
      engagement_metrics: { bounce_rate: 42, pages_per_visit: 3.2, time_on_site: 185 },
      collected_at: "2024-01-15",
      created_at: "2024-01-15",
    },
    total_ad_spend_estimate: 2500000,
    total_impressions_estimate: 150000000,
    active_campaigns: 47,
    top_keywords: ["personal injury", "car accident", "Camp Lejeune", "Roundup"],
    practice_areas_targeted: ["Mass Tort", "Personal Injury", "Product Liability"],
  },
  {
    firm: {
      id: 2,
      uuid: "firm-2",
      name: "Keller Lenkner",
      website: "kellerlenkner.com",
      headquarters_city: "Chicago",
      headquarters_state: "IL",
      firm_size: "medium",
      specialties: ["mass arbitration", "class action", "consumer protection"],
      reputation_score: 88,
      created_at: "2018-01-01",
      updated_at: "2024-01-15",
    },
    google_ads: [
      {
        id: 3,
        uuid: "gad-3",
        firm_id: 2,
        advertiser_name: "Keller Lenkner",
        advertiser_id: "AR87654321",
        ad_creative_text:
          "Data Breach Victim? You May Be Entitled to Compensation. Keller Lenkner Has Recovered Over $1 Billion.",
        format: "text",
        date_range_start: "2024-01-01",
        geographic_targeting: { regions: ["Nationwide"], cities: [] },
        keywords_detected: ["data breach lawyer", "privacy lawsuit", "consumer rights"],
        is_active: true,
        created_at: "2024-01-01",
        updated_at: "2024-01-15",
      },
    ],
    meta_ads: [
      {
        id: 2,
        uuid: "meta-2",
        firm_id: 2,
        page_name: "Keller Lenkner LLC",
        page_id: "987654321",
        ad_creative_body:
          "Rideshare driver or delivery worker? You deserve fair pay. Join thousands in our fight for gig worker rights.",
        ad_creative_link_title: "Gig Worker Rights - Free Case Review",
        ad_snapshot_url: "https://facebook.com/ads/library/?id=456",
        landing_page_url: "https://kellerlenkner.com/gig-workers",
        spend_range_lower: 25000,
        spend_range_upper: 50000,
        impressions_range_lower: 2000000,
        impressions_range_upper: 4000000,
        ad_delivery_start: "2024-01-08",
        is_active: true,
        keywords_detected: ["gig worker", "rideshare", "fair pay", "arbitration"],
        created_at: "2024-01-08",
        updated_at: "2024-01-15",
      },
    ],
    linkedin_ads: [],
    website_traffic: {
      id: 2,
      uuid: "traffic-2",
      firm_id: 2,
      domain: "kellerlenkner.com",
      global_rank: 89234,
      total_visits: 850000,
      monthly_visits_trend: { "2023-11": 720000, "2023-12": 780000, "2024-01": 850000 },
      traffic_by_country: { US: 96, CA: 2, Other: 2 },
      top_keywords: [
        { keyword: "keller lenkner", cpc: 8.5, volume: 12000 },
        { keyword: "mass arbitration lawyer", cpc: 45.0, volume: 8500 },
        { keyword: "data breach attorney", cpc: 65.0, volume: 22000 },
      ],
      traffic_sources: { direct: 25, search: 55, social: 10, referral: 5, paid: 4, mail: 1 },
      engagement_metrics: { bounce_rate: 38, pages_per_visit: 4.1, time_on_site: 220 },
      collected_at: "2024-01-15",
      created_at: "2024-01-15",
    },
    total_ad_spend_estimate: 750000,
    total_impressions_estimate: 45000000,
    active_campaigns: 23,
    top_keywords: ["mass arbitration", "data breach", "gig worker", "consumer rights"],
    practice_areas_targeted: ["Mass Arbitration", "Consumer Protection", "Employment"],
  },
  {
    firm: {
      id: 3,
      uuid: "firm-3",
      name: "Napoli Shkolnik",
      website: "napolilaw.com",
      headquarters_city: "New York",
      headquarters_state: "NY",
      firm_size: "large",
      specialties: ["mass tort", "environmental", "pharmaceutical"],
      reputation_score: 90,
      created_at: "2015-01-01",
      updated_at: "2024-01-15",
    },
    google_ads: [
      {
        id: 4,
        uuid: "gad-4",
        firm_id: 3,
        advertiser_name: "Napoli Shkolnik PLLC",
        advertiser_id: "AR11223344",
        ad_creative_text:
          "PFAS Water Contamination Lawsuits - Free Case Review. Napoli Shkolnik - Leaders in Environmental Litigation.",
        format: "responsive",
        date_range_start: "2024-01-01",
        geographic_targeting: { regions: ["New York", "New Jersey", "Pennsylvania", "Connecticut"], cities: [] },
        keywords_detected: ["PFAS lawsuit", "water contamination", "environmental attorney"],
        is_active: true,
        created_at: "2024-01-01",
        updated_at: "2024-01-15",
      },
    ],
    meta_ads: [
      {
        id: 3,
        uuid: "meta-3",
        firm_id: 3,
        page_name: "Napoli Shkolnik PLLC",
        page_id: "456789123",
        ad_creative_body:
          "Exposed to toxic chemicals at work or home? Our environmental litigation team has recovered billions for victims. Free consultation.",
        ad_creative_link_title: "Toxic Exposure Lawyers",
        ad_snapshot_url: "https://facebook.com/ads/library/?id=789",
        landing_page_url: "https://napolilaw.com/toxic-exposure",
        spend_range_lower: 35000,
        spend_range_upper: 70000,
        impressions_range_lower: 3000000,
        impressions_range_upper: 6000000,
        ad_delivery_start: "2024-01-03",
        is_active: true,
        keywords_detected: ["toxic exposure", "environmental", "chemical exposure"],
        created_at: "2024-01-03",
        updated_at: "2024-01-15",
      },
    ],
    linkedin_ads: [],
    website_traffic: {
      id: 3,
      uuid: "traffic-3",
      firm_id: 3,
      domain: "napolilaw.com",
      global_rank: 125678,
      total_visits: 620000,
      monthly_visits_trend: { "2023-11": 580000, "2023-12": 600000, "2024-01": 620000 },
      traffic_by_country: { US: 94, CA: 3, Other: 3 },
      top_keywords: [
        { keyword: "napoli shkolnik", cpc: 6.0, volume: 8000 },
        { keyword: "pfas lawsuit", cpc: 55.0, volume: 33000 },
        { keyword: "water contamination lawyer", cpc: 72.0, volume: 18000 },
      ],
      traffic_sources: { direct: 30, search: 50, social: 8, referral: 7, paid: 4, mail: 1 },
      engagement_metrics: { bounce_rate: 40, pages_per_visit: 3.8, time_on_site: 195 },
      collected_at: "2024-01-15",
      created_at: "2024-01-15",
    },
    total_ad_spend_estimate: 1200000,
    total_impressions_estimate: 72000000,
    active_campaigns: 31,
    top_keywords: ["PFAS", "water contamination", "toxic exposure", "environmental"],
    practice_areas_targeted: ["Environmental", "Mass Tort", "Pharmaceutical"],
  },
]

const practiceAreas = [
  "Mass Tort",
  "Personal Injury",
  "Class Action",
  "Mass Arbitration",
  "Environmental",
  "Consumer Protection",
]

interface CompetitorAdsProps {
  preSelectedPracticeArea?: string | null
}

export default function CompetitorAds({ preSelectedPracticeArea }: CompetitorAdsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>(
    preSelectedPracticeArea ? [preSelectedPracticeArea] : [],
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFirm, setSelectedFirm] = useState<CompetitorAdSummary | null>(null)
  const [selectedFirmSizes, setSelectedFirmSizes] = useState<string[]>([])
  const itemsPerPage = 9

  useEffect(() => {
    if (preSelectedPracticeArea) {
      setSelectedPracticeAreas([preSelectedPracticeArea])
      setCurrentPage(1)
    }
  }, [preSelectedPracticeArea])

  const filteredData = mockCompetitorData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.top_keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPracticeArea =
      selectedPracticeAreas.length === 0 ||
      item.practice_areas_targeted.some((pa) => selectedPracticeAreas.includes(pa))

    return matchesSearch && matchesPracticeArea
  })

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  const getAdFormatIcon = (format: string) => {
    switch (format) {
      case "video":
      case "VIDEO":
        return <Play className="h-4 w-4" />
      case "image":
      case "SINGLE_IMAGE":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="p-6 space-y-4">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search law firms or keywords..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 h-9 text-sm bg-secondary/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {practiceAreas.map((area) => (
            <button
              key={area}
              onClick={() => {
                if (selectedPracticeAreas.includes(area)) {
                  setSelectedPracticeAreas(selectedPracticeAreas.filter((a) => a !== area))
                } else {
                  setSelectedPracticeAreas([...selectedPracticeAreas, area])
                }
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                selectedPracticeAreas.includes(area)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {area}
            </button>
          ))}
          {selectedPracticeAreas.length > 0 && (
            <button
              onClick={() => {
                setSelectedPracticeAreas([])
                setCurrentPage(1)
              }}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{totalItems} firms tracked</span>
        </div>
        <Badge variant="secondary" className="text-xs">Updated today</Badge>
      </div>

      {/* Firm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedData.map((item) => (
          <Card
            key={item.firm.id}
            className="cursor-pointer hover:border-primary/50 transition-colors bg-card border-border group"
            onClick={() => setSelectedFirm(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.firm.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {item.firm.headquarters_city}, {item.firm.headquarters_state}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px] capitalize">
                  {item.firm.firm_size}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-secondary/50 rounded-md p-2 text-center">
                  <div className="text-sm font-semibold text-emerald-400">{formatCurrency(item.total_ad_spend_estimate)}</div>
                  <div className="text-[10px] text-muted-foreground">Spend</div>
                </div>
                <div className="bg-secondary/50 rounded-md p-2 text-center">
                  <div className="text-sm font-semibold text-blue-400">{formatNumber(item.total_impressions_estimate)}</div>
                  <div className="text-[10px] text-muted-foreground">Impressions</div>
                </div>
                <div className="bg-secondary/50 rounded-md p-2 text-center">
                  <div className="text-sm font-semibold text-primary">{item.active_campaigns}</div>
                  <div className="text-[10px] text-muted-foreground">Campaigns</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.top_keywords.slice(0, 3).map((keyword) => (
                  <Badge key={keyword} variant="outline" className="text-[10px] border-border text-muted-foreground">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Firm Detail Slide-Over */}
      <SlideOver
        open={!!selectedFirm}
        onClose={() => setSelectedFirm(null)}
        title={selectedFirm?.firm.name}
      >
        {selectedFirm && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="capitalize text-xs">
                    {selectedFirm.firm.firm_size}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Score: {selectedFirm.firm.reputation_score}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedFirm.firm.headquarters_city}, {selectedFirm.firm.headquarters_state}
                  </span>
                  <a
                    href={`https://${selectedFirm.firm.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {selectedFirm.firm.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedFirm.total_ad_spend_estimate)}</div>
                <div className="text-xs text-muted-foreground mt-1">Est. Ad Spend</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{formatNumber(selectedFirm.total_impressions_estimate)}</div>
                <div className="text-xs text-muted-foreground mt-1">Impressions</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{selectedFirm.active_campaigns}</div>
                <div className="text-xs text-muted-foreground mt-1">Active Campaigns</div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="google" className="mt-4">
              <TabsList className="grid w-full grid-cols-4 h-9">
                <TabsTrigger value="google" className="text-xs">Google</TabsTrigger>
                <TabsTrigger value="meta" className="text-xs">Meta</TabsTrigger>
                <TabsTrigger value="linkedin" className="text-xs">LinkedIn</TabsTrigger>
                <TabsTrigger value="traffic" className="text-xs">Traffic</TabsTrigger>
              </TabsList>

              <TabsContent value="google" className="mt-4 space-y-3">
                {selectedFirm.google_ads.map((ad) => (
                  <Card key={ad.id} className="bg-secondary/30 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getAdFormatIcon(ad.format)}
                        <Badge variant="outline" className="text-[10px]">{ad.format}</Badge>
                        {ad.is_active && <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Active</Badge>}
                      </div>
                      <p className="text-sm text-foreground mb-3">{ad.ad_creative_text}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {ad.keywords_detected?.map((kw) => (
                          <Badge key={kw} variant="secondary" className="text-[10px]">{kw}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ad.date_range_start}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ad.geographic_targeting?.regions?.slice(0, 2).join(", ")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="meta" className="mt-4 space-y-3">
                {selectedFirm.meta_ads.map((ad) => (
                  <Card key={ad.id} className="bg-secondary/30 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{ad.page_name}</Badge>
                          {ad.is_active && <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Active</Badge>}
                        </div>
                        <a
                          href={ad.ad_snapshot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-[10px] flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </a>
                      </div>
                      <h4 className="font-medium text-sm text-foreground mb-1">{ad.ad_creative_link_title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{ad.ad_creative_body}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Spend: {formatCurrency(ad.spend_range_lower || 0)} - {formatCurrency(ad.spend_range_upper || 0)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="linkedin" className="mt-4 space-y-3">
                {selectedFirm.linkedin_ads.length > 0 ? (
                  selectedFirm.linkedin_ads.map((ad) => (
                    <Card key={ad.id} className="bg-secondary/30 border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[10px]">{ad.format}</Badge>
                          {ad.is_active && <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Active</Badge>}
                        </div>
                        <h4 className="font-medium text-sm text-foreground mb-1">{ad.headline}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{ad.body}</p>
                        {ad.ctas && ad.ctas.length > 0 && (
                          <div className="flex gap-1">
                            {ad.ctas.map((cta) => (
                              <Badge key={cta} className="bg-blue-500/20 text-blue-400 text-[10px]">{cta}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">No LinkedIn ads detected</div>
                )}
              </TabsContent>

              <TabsContent value="traffic" className="mt-4">
                {selectedFirm.website_traffic && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-secondary/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-400">#{formatNumber(selectedFirm.website_traffic.global_rank)}</div>
                        <div className="text-[10px] text-muted-foreground">Global Rank</div>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-emerald-400">{formatNumber(selectedFirm.website_traffic.total_visits)}</div>
                        <div className="text-[10px] text-muted-foreground">Monthly Visits</div>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-orange-400">{selectedFirm.website_traffic.engagement_metrics.bounce_rate}%</div>
                        <div className="text-[10px] text-muted-foreground">Bounce Rate</div>
                      </div>
                    </div>

                    <Card className="bg-secondary/30 border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Traffic Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(selectedFirm.website_traffic.traffic_sources).map(([source, value]) => (
                            <div key={source} className="flex items-center gap-2">
                              <span className="text-xs capitalize w-16 text-muted-foreground">{source}</span>
                              <div className="flex-1 bg-secondary rounded-full h-1.5">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${value}%` }} />
                              </div>
                              <span className="text-xs font-medium w-10 text-right text-foreground">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-secondary/30 border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Top Keywords</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedFirm.website_traffic.top_keywords.map((kw) => (
                            <div key={kw.keyword} className="flex items-center justify-between text-xs">
                              <span className="text-foreground">{kw.keyword}</span>
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <span>{formatNumber(kw.volume)} vol</span>
                                <span className="font-medium text-foreground">${kw.cpc.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SlideOver>
    </div>
  )
}
