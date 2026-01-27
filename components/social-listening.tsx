"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  TrendingUp,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  User,
  Hash,
  ExternalLink,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

// Reddit icon component
const RedditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
)

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const mockPosts = [
  {
    id: 1,
    platform: "reddit",
    author_username: "concerned_consumer",
    content:
      "Has anyone else experienced side effects from the new medication? I've been having headaches for weeks now.",
    title: "Experiencing side effects - seeking advice",
    subreddit: "r/medications",
    hashtags: [],
    url: "https://reddit.com/r/medications/abc123",
    engagement: { likes: 234, comments: 89, shares: 12 },
    sentiment_label: "negative",
    entity_mentions: ["Pharma Corp Drug X"],
    posted_at: "2024-01-15T14:30:00Z",
  },
  {
    id: 2,
    platform: "tiktok",
    author_username: "health_advocate",
    content:
      "Warning about this product! Multiple reports of issues. Do your research before buying! #productwarning #consumeralert",
    hashtags: ["productwarning", "consumeralert", "healthtips"],
    url: "https://tiktok.com/@health_advocate/video/789",
    engagement: { likes: 15420, comments: 892, shares: 3201, views: 125000 },
    sentiment_label: "negative",
    entity_mentions: ["Consumer Product Y"],
    posted_at: "2024-01-14T10:15:00Z",
  },
  {
    id: 3,
    platform: "reddit",
    author_username: "auto_enthusiast",
    content:
      "Just got the recall notice for my vehicle. Apparently the braking system has issues. Anyone else dealing with this?",
    title: "Vehicle recall - braking system concerns",
    subreddit: "r/cars",
    hashtags: [],
    url: "https://reddit.com/r/cars/def456",
    engagement: { likes: 567, comments: 234, shares: 45 },
    sentiment_label: "negative",
    entity_mentions: ["AutoMaker Z"],
    posted_at: "2024-01-13T09:45:00Z",
  },
  {
    id: 4,
    platform: "tiktok",
    author_username: "lawyer_tips",
    content:
      "If you've been affected by this recall, you may be entitled to compensation. Here's what you need to know... #legaladvice #classaction",
    hashtags: ["legaladvice", "classaction", "recall", "compensation"],
    url: "https://tiktok.com/@lawyer_tips/video/101",
    engagement: { likes: 8930, comments: 412, shares: 1567, views: 89000 },
    sentiment_label: "neutral",
    entity_mentions: ["AutoMaker Z"],
    posted_at: "2024-01-12T16:20:00Z",
  },
  {
    id: 5,
    platform: "reddit",
    author_username: "finance_watcher",
    content: "The CFPB just issued a warning about predatory lending practices. This affects millions of consumers.",
    title: "CFPB Warning: Predatory Lending Alert",
    subreddit: "r/personalfinance",
    hashtags: [],
    url: "https://reddit.com/r/personalfinance/ghi789",
    engagement: { likes: 1234, comments: 456, shares: 189 },
    sentiment_label: "negative",
    entity_mentions: ["Big Bank Corp"],
    posted_at: "2024-01-11T11:30:00Z",
  },
  {
    id: 6,
    platform: "tiktok",
    author_username: "mass_tort_news",
    content: "Breaking: New lawsuit filed against major pharmaceutical company. Thousands affected. #lawsuit #pharma",
    hashtags: ["lawsuit", "pharma", "masstort", "legal"],
    url: "https://tiktok.com/@mass_tort_news/video/202",
    engagement: { likes: 23400, comments: 1892, shares: 5670, views: 450000 },
    sentiment_label: "negative",
    entity_mentions: ["PharmaCo Inc"],
    posted_at: "2024-01-10T08:00:00Z",
  },
  {
    id: 7,
    platform: "reddit",
    author_username: "class_action_update",
    content:
      "Settlement approved! If you purchased this product between 2019-2023, you may be eligible for compensation.",
    title: "Class Action Settlement Approved - Check Your Eligibility",
    subreddit: "r/classaction",
    hashtags: [],
    url: "https://reddit.com/r/classaction/jkl012",
    engagement: { likes: 2890, comments: 678, shares: 432 },
    sentiment_label: "positive",
    entity_mentions: ["Consumer Goods Co"],
    posted_at: "2024-01-09T15:45:00Z",
  },
  {
    id: 8,
    platform: "reddit",
    author_username: "injury_lawyer",
    content: "Important update on the ongoing litigation. Discovery phase reveals new evidence of negligence.",
    title: "Litigation Update - New Evidence Emerges",
    subreddit: "r/legaladvice",
    hashtags: [],
    url: "https://reddit.com/r/legaladvice/mno345",
    engagement: { likes: 1567, comments: 234, shares: 89 },
    sentiment_label: "neutral",
    entity_mentions: ["Medical Device Corp"],
    posted_at: "2024-01-08T12:30:00Z",
  },
]

const mockProfiles = [
  {
    id: 1,
    platform: "reddit",
    username: "consumer_advocate_group",
    display_name: "Consumer Advocacy Network",
    bio: "Fighting for consumer rights since 2010. Tracking product safety issues.",
    profile_url: "https://reddit.com/user/consumer_advocate_group",
    followers_count: 45000,
    posts_count: 1234,
    verified: false,
    relevance_score: 0.92,
    is_influencer: true,
    topics: ["consumer rights", "product safety", "recalls"],
  },
  {
    id: 2,
    platform: "tiktok",
    username: "legal_eagle",
    display_name: "Legal Eagle",
    bio: "Attorney explaining complex legal topics. Class action updates.",
    profile_url: "https://tiktok.com/@legal_eagle",
    avatar_url: "/lawyer-avatar.png",
    followers_count: 2500000,
    posts_count: 567,
    verified: true,
    relevance_score: 0.88,
    is_influencer: true,
    topics: ["legal", "class action", "consumer law"],
  },
  {
    id: 3,
    platform: "reddit",
    username: "mass_tort_tracker",
    display_name: "Mass Tort Tracker",
    bio: "Monitoring mass tort litigation across the US. Daily updates on major cases.",
    profile_url: "https://reddit.com/user/mass_tort_tracker",
    followers_count: 28000,
    posts_count: 2456,
    verified: false,
    relevance_score: 0.95,
    is_influencer: true,
    topics: ["mass tort", "litigation", "settlements"],
  },
]

const mockTrends = [
  {
    id: 1,
    keyword: "vehicle recall",
    platform: "all",
    mention_count: 12500,
    growth_rate: 156,
    related_entities: ["AutoMaker Z", "AutoMaker Y"],
  },
  {
    id: 2,
    keyword: "medication side effects",
    platform: "reddit",
    mention_count: 8900,
    growth_rate: 89,
    related_entities: ["Pharma Corp", "Drug X"],
  },
  {
    id: 3,
    keyword: "class action lawsuit",
    platform: "tiktok",
    mention_count: 23400,
    growth_rate: 234,
    related_entities: ["Various"],
  },
  {
    id: 4,
    keyword: "PFAS contamination",
    platform: "all",
    mention_count: 15600,
    growth_rate: 178,
    related_entities: ["Water Companies", "Chemical Corps"],
  },
  {
    id: 5,
    keyword: "product liability",
    platform: "reddit",
    mention_count: 6700,
    growth_rate: 67,
    related_entities: ["Consumer Products"],
  },
  {
    id: 6,
    keyword: "settlement payout",
    platform: "tiktok",
    mention_count: 19200,
    growth_rate: 145,
    related_entities: ["Multiple Defendants"],
  },
]

const sentiments = ["positive", "neutral", "negative"]
const platforms = ["reddit", "tiktok"]

export default function SocialListening() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"keyword" | "profile" | "hashtag">("keyword")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeView, setActiveView] = useState<"posts" | "profiles" | "trends">("posts")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const posts = mockPosts
  const profiles = mockProfiles
  const trends = mockTrends

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setCurrentPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(post.platform)
    const matchesSentiment =
      selectedSentiments.length === 0 || selectedSentiments.includes(post.sentiment_label || "neutral")
    const matchesSearch =
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesPlatform && matchesSentiment && matchesSearch
  })

  const totalItems = filteredPosts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-700"
      case "negative":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "reddit":
        return <RedditIcon className="h-4 w-4 text-orange-500" />
      case "tiktok":
        return <TikTokIcon className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

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
      {/* Filter Sidebar - Same width as other tabs (w-64) */}
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
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={
                    searchType === "keyword"
                      ? "Search keywords..."
                      : searchType === "profile"
                        ? "Search profiles..."
                        : "Search hashtags..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Button onClick={handleSearch} className="w-full h-9 text-sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Search Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Type</label>
              <div className="flex flex-col gap-1">
                <Button
                  variant={searchType === "keyword" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("keyword")}
                  className={`justify-start h-8 text-sm ${searchType !== "keyword" ? "bg-transparent" : ""}`}
                >
                  <Search className="h-3 w-3 mr-2" />
                  Keyword
                </Button>
                <Button
                  variant={searchType === "profile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("profile")}
                  className={`justify-start h-8 text-sm ${searchType !== "profile" ? "bg-transparent" : ""}`}
                >
                  <User className="h-3 w-3 mr-2" />
                  Profile
                </Button>
                <Button
                  variant={searchType === "hashtag" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("hashtag")}
                  className={`justify-start h-8 text-sm ${searchType !== "hashtag" ? "bg-transparent" : ""}`}
                >
                  <Hash className="h-3 w-3 mr-2" />
                  Hashtag
                </Button>
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <div className="space-y-1">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center gap-2">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPlatforms([...selectedPlatforms, platform])
                        } else {
                          setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`platform-${platform}`} className="text-sm cursor-pointer flex items-center gap-2">
                      {platform === "reddit" ? (
                        <RedditIcon className="h-4 w-4 text-orange-500" />
                      ) : (
                        <TikTokIcon className="h-4 w-4" />
                      )}
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sentiment</label>
              <div className="space-y-1">
                {sentiments.map((sentiment) => (
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
                    <label htmlFor={`sentiment-${sentiment}`} className="text-sm cursor-pointer capitalize">
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
                setSelectedPlatforms([])
                setSelectedSentiments([])
                setCurrentPage(1)
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>

        {/* Trending Topics Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              {trends.slice(0, 6).map((trend) => (
                <Button
                  key={trend.id}
                  variant="outline"
                  size="sm"
                  className="justify-between h-auto py-1.5 bg-transparent text-xs"
                  onClick={() => {
                    setSearchQuery(trend.keyword)
                    setCurrentPage(1)
                  }}
                >
                  <span className="text-xs truncate">{trend.keyword}</span>
                  <Badge
                    className={`text-xs ml-1 ${trend.growth_rate > 100 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    +{trend.growth_rate}%
                  </Badge>
                </Button>
              ))}
            </div>
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

        {/* View Tabs */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "posts" | "profiles" | "trends")}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <Badge variant="secondary">Last updated: Today</Badge>
          </div>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-4">
            <div className="space-y-4">
              {paginatedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{getPlatformIcon(post.platform)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-medium text-sm">@{post.author_username}</span>
                          {post.subreddit && <span className="text-gray-500 text-xs">{post.subreddit}</span>}
                          <Badge className={`text-xs ${getSentimentColor(post.sentiment_label)}`}>
                            {post.sentiment_label}
                          </Badge>
                          <span className="text-gray-400 text-xs">{formatDate(post.posted_at)}</span>
                        </div>
                        {post.title && <h3 className="font-semibold mb-2">{post.title}</h3>}
                        <p className="text-gray-700 text-sm mb-3">{post.content}</p>
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.hashtags.map((tag) => (
                              <span key={tag} className="text-blue-600 text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {formatNumber(post.engagement.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {formatNumber(post.engagement.comments)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" />
                            {formatNumber(post.engagement.shares)}
                          </span>
                          {post.engagement.views && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatNumber(post.engagement.views)}
                            </span>
                          )}
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline ml-auto"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </a>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
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
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="mt-4">
            <div className="space-y-4">
              {profiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">{getPlatformIcon(profile.platform)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{profile.display_name}</span>
                          {profile.verified && <Badge className="bg-blue-100 text-blue-700">Verified</Badge>}
                          {profile.is_influencer && <Badge className="bg-purple-100 text-purple-700">Influencer</Badge>}
                        </div>
                        <p className="text-gray-500 text-sm mb-2">@{profile.username}</p>
                        <p className="text-gray-700 text-sm mb-3">{profile.bio}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {profile.topics?.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatNumber(profile.followers_count)} followers</span>
                          <span>{formatNumber(profile.posts_count)} posts</span>
                          <span>Relevance: {Math.round(profile.relevance_score * 100)}%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trends.map((trend) => (
                <Card
                  key={trend.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSearchQuery(trend.keyword)
                    setActiveView("posts")
                    setCurrentPage(1)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">{trend.keyword}</h3>
                        <p className="text-gray-500 text-sm">{formatNumber(trend.mention_count)} mentions</p>
                      </div>
                      <Badge
                        className={trend.growth_rate > 100 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />+{trend.growth_rate}%
                      </Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Related Entities:</p>
                      <div className="flex flex-wrap gap-1">
                        {trend.related_entities.map((entity) => (
                          <Badge key={entity} variant="outline" className="text-xs">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
