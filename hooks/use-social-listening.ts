"use client"

import { useState, useCallback } from "react"
import type { SocialPost, SocialProfile, SocialTrend, SocialSearchQuery } from "@/types/database"

interface SocialSearchFilters {
  platforms?: ("reddit" | "tiktok" | "twitter")[]
  sentiment?: ("negative" | "neutral" | "positive")[]
  dateFrom?: string
  dateTo?: string
  minEngagement?: number
  subreddit?: string
  hashtag?: string
}

interface UseSocialListeningResult {
  posts: SocialPost[]
  profiles: SocialProfile[]
  trends: SocialTrend[]
  savedSearches: SocialSearchQuery[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  searchKeyword: (keyword: string, filters?: SocialSearchFilters) => Promise<void>
  searchProfile: (username: string, platform: string) => Promise<void>
  loadTrends: () => Promise<void>
  saveSearch: (query: SocialSearchQuery) => Promise<void>
  setPage: (page: number) => void
}

// Mock data for demonstration
const mockPosts: SocialPost[] = [
  {
    id: 1,
    uuid: "sp-001",
    platform: "reddit",
    post_id: "abc123",
    author_username: "concerned_consumer",
    content:
      "Has anyone else experienced side effects from the new medication? I've been having headaches for weeks now.",
    title: "Experiencing side effects - seeking advice",
    subreddit: "r/medications",
    hashtags: [],
    mentions: [],
    url: "https://reddit.com/r/medications/abc123",
    engagement: { likes: 234, comments: 89, shares: 12 },
    sentiment_score: -0.6,
    sentiment_label: "negative",
    keywords_matched: ["side effects", "medication", "headaches"],
    entity_mentions: ["Pharma Corp Drug X"],
    entity_ids: [101],
    is_reply: false,
    posted_at: "2024-01-15T14:30:00Z",
    collected_at: "2024-01-15T15:00:00Z",
  },
  {
    id: 2,
    uuid: "sp-002",
    platform: "tiktok",
    post_id: "tiktok789",
    author_username: "health_advocate",
    content:
      "⚠️ Warning about this product! Multiple reports of issues. Do your research before buying! #productwarning #consumeralert",
    hashtags: ["productwarning", "consumeralert", "healthtips"],
    mentions: [],
    url: "https://tiktok.com/@health_advocate/video/789",
    engagement: { likes: 15420, comments: 892, shares: 3201, views: 125000 },
    sentiment_score: -0.8,
    sentiment_label: "negative",
    keywords_matched: ["warning", "product", "issues"],
    entity_mentions: ["Consumer Product Y"],
    entity_ids: [102],
    is_reply: false,
    posted_at: "2024-01-14T10:15:00Z",
    collected_at: "2024-01-14T11:00:00Z",
  },
  {
    id: 3,
    uuid: "sp-003",
    platform: "reddit",
    post_id: "def456",
    author_username: "auto_enthusiast",
    content:
      "Just got the recall notice for my vehicle. Apparently the braking system has issues. Anyone else dealing with this?",
    title: "Vehicle recall - braking system concerns",
    subreddit: "r/cars",
    hashtags: [],
    mentions: [],
    url: "https://reddit.com/r/cars/def456",
    engagement: { likes: 567, comments: 234, shares: 45 },
    sentiment_score: -0.4,
    sentiment_label: "negative",
    keywords_matched: ["recall", "vehicle", "braking", "issues"],
    entity_mentions: ["AutoMaker Z"],
    entity_ids: [103],
    is_reply: false,
    posted_at: "2024-01-13T09:45:00Z",
    collected_at: "2024-01-13T10:00:00Z",
  },
  {
    id: 4,
    uuid: "sp-004",
    platform: "tiktok",
    post_id: "tiktok101",
    author_username: "lawyer_tips",
    content:
      "If you've been affected by this recall, you may be entitled to compensation. Here's what you need to know... #legaladvice #classaction",
    hashtags: ["legaladvice", "classaction", "recall", "compensation"],
    mentions: [],
    url: "https://tiktok.com/@lawyer_tips/video/101",
    engagement: { likes: 8930, comments: 412, shares: 1567, views: 89000 },
    sentiment_score: 0.2,
    sentiment_label: "neutral",
    keywords_matched: ["recall", "compensation", "class action"],
    entity_mentions: ["AutoMaker Z"],
    entity_ids: [103],
    is_reply: false,
    posted_at: "2024-01-12T16:20:00Z",
    collected_at: "2024-01-12T17:00:00Z",
  },
  {
    id: 5,
    uuid: "sp-005",
    platform: "reddit",
    post_id: "ghi789",
    author_username: "finance_watcher",
    content: "The CFPB just issued a warning about predatory lending practices. This affects millions of consumers.",
    title: "CFPB Warning: Predatory Lending Alert",
    subreddit: "r/personalfinance",
    hashtags: [],
    mentions: ["CFPB"],
    url: "https://reddit.com/r/personalfinance/ghi789",
    engagement: { likes: 1234, comments: 456, shares: 189 },
    sentiment_score: -0.3,
    sentiment_label: "negative",
    keywords_matched: ["CFPB", "warning", "predatory lending"],
    entity_mentions: ["Big Bank Corp"],
    entity_ids: [104],
    is_reply: false,
    posted_at: "2024-01-11T11:30:00Z",
    collected_at: "2024-01-11T12:00:00Z",
  },
]

const mockProfiles: SocialProfile[] = [
  {
    id: 1,
    uuid: "profile-001",
    platform: "reddit",
    username: "consumer_advocate_group",
    display_name: "Consumer Advocacy Network",
    bio: "Fighting for consumer rights since 2010. Tracking product safety issues.",
    profile_url: "https://reddit.com/user/consumer_advocate_group",
    followers_count: 45000,
    posts_count: 1234,
    verified: false,
    relevance_score: 0.92,
    tracked_since: "2023-06-15T00:00:00Z",
    is_influencer: true,
    topics: ["consumer rights", "product safety", "recalls"],
  },
  {
    id: 2,
    uuid: "profile-002",
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
    tracked_since: "2023-01-10T00:00:00Z",
    is_influencer: true,
    topics: ["legal", "class action", "consumer law"],
  },
]

const mockTrends: SocialTrend[] = [
  {
    id: 1,
    keyword: "vehicle recall",
    platform: "all",
    mention_count: 12500,
    sentiment_avg: -0.45,
    growth_rate: 156,
    peak_date: "2024-01-14",
    related_entities: ["AutoMaker Z", "AutoMaker Y"],
    sample_posts: [],
  },
  {
    id: 2,
    keyword: "medication side effects",
    platform: "reddit",
    mention_count: 8900,
    sentiment_avg: -0.62,
    growth_rate: 89,
    peak_date: "2024-01-13",
    related_entities: ["Pharma Corp", "Drug X"],
    sample_posts: [],
  },
  {
    id: 3,
    keyword: "class action lawsuit",
    platform: "tiktok",
    mention_count: 23400,
    sentiment_avg: -0.15,
    growth_rate: 234,
    peak_date: "2024-01-15",
    related_entities: ["Various"],
    sample_posts: [],
  },
]

export function useSocialListening(): UseSocialListeningResult {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts)
  const [profiles, setProfiles] = useState<SocialProfile[]>(mockProfiles)
  const [trends, setTrends] = useState<SocialTrend[]>(mockTrends)
  const [savedSearches, setSavedSearches] = useState<SocialSearchQuery[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: mockPosts.length,
    totalPages: Math.ceil(mockPosts.length / 10),
  })

  const searchKeyword = useCallback(async (keyword: string, filters?: SocialSearchFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Filter mock data based on keyword
      const filtered = mockPosts.filter(
        (post) =>
          post.content.toLowerCase().includes(keyword.toLowerCase()) ||
          post.keywords_matched.some((k) => k.toLowerCase().includes(keyword.toLowerCase())),
      )
      setPosts(filtered)
      setPagination((prev) => ({
        ...prev,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.limit),
      }))
    } catch (err) {
      setError("Failed to search posts")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchProfile = useCallback(async (username: string, platform: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const filtered = mockProfiles.filter(
        (profile) =>
          profile.username.toLowerCase().includes(username.toLowerCase()) &&
          (platform === "all" || profile.platform === platform),
      )
      setProfiles(filtered)
    } catch (err) {
      setError("Failed to search profiles")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadTrends = useCallback(async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setTrends(mockTrends)
    } catch (err) {
      setError("Failed to load trends")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveSearch = useCallback(async (query: SocialSearchQuery) => {
    setSavedSearches((prev) => [...prev, query])
  }, [])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  return {
    posts,
    profiles,
    trends,
    savedSearches,
    isLoading,
    error,
    pagination,
    searchKeyword,
    searchProfile,
    loadTrends,
    saveSearch,
    setPage,
  }
}
