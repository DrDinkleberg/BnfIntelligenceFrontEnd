"use client"

import { useState } from "react"
import {
  Search,
  ExternalLink,
  Clock,
  Tag,
  Filter,
  Newspaper,
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { NewsArticle } from "@/types/database"

// Mock data for news articles
const mockNewsArticles: NewsArticle[] = [
  {
    id: 1,
    uuid: "news-1",
    title: "DOJ Announces Major Settlement in Pharmaceutical Price-Fixing Case",
    description:
      "The Department of Justice reached a $2.3 billion settlement with major pharmaceutical companies over allegations of price-fixing generic medications.",
    source_name: "Reuters Legal",
    source_url: "https://reuters.com/legal",
    author: "Jane Smith",
    image_url: "/courthouse-justice.jpg",
    published_at: "2024-01-15T10:30:00Z",
    category: "regulatory",
    tags: ["DOJ", "pharmaceutical", "settlement", "antitrust"],
    entity_mentions: ["Generic Drug Corp", "PharmaCo Inc"],
    firm_mentions: ["Morgan & Morgan", "Lieff Cabraser"],
    sentiment_score: -0.3,
    relevance_score: 95,
    is_breaking: true,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    uuid: "news-2",
    title: "New PFAS Regulations Expected to Drive Wave of Environmental Litigation",
    description:
      "EPA's proposed PFAS drinking water standards could trigger thousands of lawsuits against manufacturers and municipalities.",
    source_name: "Law360",
    source_url: "https://law360.com",
    author: "Michael Chen",
    image_url: "/water-contamination-environmental.jpg",
    published_at: "2024-01-15T09:15:00Z",
    category: "regulatory",
    tags: ["EPA", "PFAS", "environmental", "mass tort"],
    entity_mentions: ["3M", "DuPont", "Chemours"],
    firm_mentions: ["Napoli Shkolnik", "Motley Rice"],
    sentiment_score: -0.5,
    relevance_score: 92,
    is_breaking: false,
    created_at: "2024-01-15T09:15:00Z",
  },
  {
    id: 3,
    uuid: "news-3",
    title: "Mass Arbitration Filings Against Rideshare Company Exceed 50,000 Claims",
    description:
      "A coordinated mass arbitration effort has resulted in over 50,000 individual claims filed against a major rideshare company.",
    source_name: "Bloomberg Law",
    source_url: "https://bloomberglaw.com",
    author: "Sarah Johnson",
    image_url: "/rideshare-arbitration-legal.jpg",
    published_at: "2024-01-14T16:45:00Z",
    category: "legal",
    tags: ["mass arbitration", "employment", "rideshare", "gig economy"],
    entity_mentions: ["RideShare Inc"],
    firm_mentions: ["Keller Lenkner", "Mass Arbitration Group"],
    sentiment_score: 0.1,
    relevance_score: 88,
    is_breaking: false,
    created_at: "2024-01-14T16:45:00Z",
  },
  {
    id: 4,
    uuid: "news-4",
    title: "FTC Proposes New Rules on Non-Compete Agreements",
    description:
      "The Federal Trade Commission has proposed a sweeping ban on non-compete clauses that could affect millions of workers.",
    source_name: "Wall Street Journal",
    source_url: "https://wsj.com",
    author: "David Brown",
    image_url: "/ftc-federal-trade-commission.jpg",
    published_at: "2024-01-14T14:20:00Z",
    category: "regulatory",
    tags: ["FTC", "non-compete", "employment", "regulations"],
    entity_mentions: [],
    firm_mentions: [],
    sentiment_score: 0.2,
    relevance_score: 85,
    is_breaking: false,
    created_at: "2024-01-14T14:20:00Z",
  },
  {
    id: 5,
    uuid: "news-5",
    title: "Social Media Platform Faces Class Action Over Youth Mental Health",
    description:
      "A coalition of attorneys general have joined a multi-district litigation against a major social media company.",
    source_name: "The American Lawyer",
    source_url: "https://americanlawyer.com",
    author: "Emily Williams",
    image_url: "/social-media-mental-health-lawsuit.jpg",
    published_at: "2024-01-14T11:00:00Z",
    category: "legal",
    tags: ["social media", "class action", "mental health", "MDL"],
    entity_mentions: ["SocialApp Inc"],
    firm_mentions: ["Baron & Budd", "Edelson PC"],
    sentiment_score: -0.6,
    relevance_score: 90,
    is_breaking: true,
    created_at: "2024-01-14T11:00:00Z",
  },
  {
    id: 6,
    uuid: "news-6",
    title: "NHTSA Issues Recall for 2 Million Vehicles Over Brake Defect",
    description:
      "The National Highway Traffic Safety Administration has ordered a recall affecting multiple vehicle manufacturers.",
    source_name: "Automotive News",
    source_url: "https://autonews.com",
    author: "Tom Wilson",
    image_url: "/car-recall-brake-defect.jpg",
    published_at: "2024-01-13T15:30:00Z",
    category: "regulatory",
    tags: ["NHTSA", "recall", "automotive", "safety"],
    entity_mentions: ["AutoMaker Corp", "BrakeTech Inc"],
    firm_mentions: [],
    sentiment_score: -0.4,
    relevance_score: 82,
    is_breaking: false,
    created_at: "2024-01-13T15:30:00Z",
  },
]

const categories = ["all", "regulatory", "legal", "industry", "breaking"]
const sources = [
  "Reuters Legal",
  "Law360",
  "Bloomberg Law",
  "Wall Street Journal",
  "The American Lawyer",
  "Automotive News",
]
const sentimentOptions = ["Positive", "Neutral", "Negative"]

export default function NewsFeed() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const itemsPerPage = 10

  const filteredArticles = mockNewsArticles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "breaking" ? article.is_breaking : article.category === selectedCategory)

    const matchesSource = selectedSources.length === 0 || selectedSources.includes(article.source_name)

    const matchesSentiment =
      selectedSentiments.length === 0 ||
      selectedSentiments.some((s) => {
        const score = article.sentiment_score || 0
        if (s === "Positive") return score > 0.2
        if (s === "Negative") return score < -0.2
        return score >= -0.2 && score <= 0.2
      })

    return matchesSearch && matchesCategory && matchesSource && matchesSentiment
  })

  const totalItems = filteredArticles.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getSentimentColor = (score?: number) => {
    if (!score) return "bg-gray-100 text-gray-600"
    if (score > 0.2) return "bg-green-100 text-green-700"
    if (score < -0.2) return "bg-red-100 text-red-700"
    return "bg-yellow-100 text-yellow-700"
  }

  const getSentimentLabel = (score?: number) => {
    if (!score) return "Neutral"
    if (score > 0.2) return "Positive"
    if (score < -0.2) return "Negative"
    return "Neutral"
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
    <div className="flex gap-6 p-4">
      {/* Filters Sidebar */}
      <div className={`w-64 shrink-0 space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search News</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={selectedCategory === cat}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategory(cat)
                          setCurrentPage(1)
                        }
                      }}
                    />
                    <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer capitalize">
                      {cat === "all" ? "All News" : cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sources</label>
              <div className="space-y-1">
                {sources.map((source) => (
                  <div key={source} className="flex items-center gap-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={selectedSources.includes(source)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSources([...selectedSources, source])
                        } else {
                          setSelectedSources(selectedSources.filter((s) => s !== source))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`source-${source}`} className="text-sm cursor-pointer">
                      {source}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sentiment</label>
              <div className="space-y-1">
                {sentimentOptions.map((sentiment) => (
                  <div key={sentiment} className="flex items-center gap-2">
                    <Checkbox
                      id={`sentiment-${sentiment}`}
                      checked={selectedSentiments.includes(sentiment)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSentiments([...selectedSentiments, sentiment])
                        } else {
                          setSelectedSentiments(selectedSentiments.filter((s) => s !== sentiment))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`sentiment-${sentiment}`} className="text-sm cursor-pointer">
                      {sentiment}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full h-9 text-sm bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedSources([])
                setSelectedSentiments([])
                setCurrentPage(1)
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{totalItems} articles</span>
          </div>
          <Badge variant="secondary">Last updated: Today</Badge>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {paginatedArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                {article.image_url && (
                  <div className="w-48 h-auto flex-shrink-0">
                    <img
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {article.is_breaking && (
                          <Badge className="bg-red-600 text-white">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Breaking
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <Badge className={getSentimentColor(article.sentiment_score)}>
                          {getSentimentLabel(article.sentiment_score)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags?.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(article.published_at)}
                        </span>
                        <span>{article.source_name}</span>
                        {article.author && <span>by {article.author}</span>}
                      </div>
                      {((article.firm_mentions && article.firm_mentions.length > 0) ||
                        (article.entity_mentions && article.entity_mentions.length > 0)) && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          {article.firm_mentions && article.firm_mentions.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-gray-600">
                                {article.firm_mentions.slice(0, 2).join(", ")}
                              </span>
                            </div>
                          )}
                          {article.entity_mentions && article.entity_mentions.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3 text-orange-600" />
                              <span className="text-xs text-gray-600">
                                {article.entity_mentions.slice(0, 2).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex gap-1">
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 p-0 ${currentPage !== page ? "bg-transparent" : ""}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="bg-transparent"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
