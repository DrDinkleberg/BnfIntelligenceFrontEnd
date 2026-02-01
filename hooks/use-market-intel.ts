/**
 * Market Intel React Query Hooks
 *
 * useMarketIntelFeed()      — Fetches last 7 days from all sources in parallel,
 *                              normalizes to MarketIntelItem[], sorted by date desc.
 * useMarketIntelSummaries() — Fetches summary stats from each agency endpoint.
 *
 * Each source query is independent — if one fails, others still render.
 */

import { useQuery, useQueries } from "@tanstack/react-query"
import { useMemo } from "react"
import { apiClient } from "@/lib/api-client"
import {
  extractItems,
  mapFDARecall,
  mapNHTSARecall,
  mapNHTSAComplaint,
  mapCFPBComplaint,
  mapFTCDNCComplaint,
  mapFTCHSRNotice,
  mapSECFiling,
  mapFacebookAd,
  mapLinkedInAd,
} from "@/lib/mappers/market-intel"
import type { MarketIntelItem, AllSummaries, CFPBSummary } from "@/types/market-intel"

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// Safely map items — if mapper throws on a single item, skip it
function safeMap<T>(items: any[], mapper: (item: any) => T): T[] {
  const results: T[] = []
  for (const item of items) {
    try {
      results.push(mapper(item))
    } catch (e) {
      console.warn("Market intel mapper error, skipping item:", e)
    }
  }
  return results
}

// ─────────────────────────────────────────────
// Source Query Definitions
// ─────────────────────────────────────────────

interface SourceQuery {
  key: string
  queryFn: () => Promise<any>
  extractKey: string[]        // Keys to try when extracting items array
  mapper: (item: any) => MarketIntelItem
}

function buildSourceQueries(sinceDate: string): SourceQuery[] {
  return [
    {
      key: "fda",
      queryFn: () => apiClient.get("/fda/recalls", { per_page: 10, since_date: sinceDate }),
      extractKey: ["recalls"],
      mapper: mapFDARecall,
    },
    {
      key: "nhtsa-recalls",
      queryFn: () => apiClient.get("/nhtsa/recalls", { per_page: 10, since_date: sinceDate }),
      extractKey: ["recalls"],
      mapper: mapNHTSARecall,
    },
    {
      key: "nhtsa-complaints",
      queryFn: () => apiClient.get("/nhtsa/complaints", { per_page: 10, since_date: sinceDate }),
      extractKey: ["complaints"],
      mapper: mapNHTSAComplaint,
    },
    {
      key: "cfpb",
      queryFn: () => apiClient.get("/cfpb/complaints", { per_page: 10 }),
      extractKey: ["complaints"],
      mapper: mapCFPBComplaint,
    },
    {
      key: "ftc-dnc",
      queryFn: () => apiClient.get("/ftc/dnc-complaints", { per_page: 10 }),
      extractKey: ["complaints"],
      mapper: mapFTCDNCComplaint,
    },
    {
      key: "ftc-hsr",
      queryFn: () => apiClient.get("/ftc/hsr-notices", { per_page: 10 }),
      extractKey: ["notices"],
      mapper: mapFTCHSRNotice,
    },
    {
      key: "sec",
      queryFn: () => apiClient.get("/sec-edgar/filings", { per_page: 10 }),
      extractKey: ["items", "filings"],
      mapper: mapSECFiling,
    },
    {
      key: "facebook-ads",
      queryFn: () => apiClient.get("/facebook-ads", { per_page: 10 }),
      extractKey: ["ads"],
      mapper: mapFacebookAd,
    },
    {
      key: "linkedin-ads",
      queryFn: () => apiClient.get("/linkedin-ads", { per_page: 10 }),
      extractKey: ["ads"],
      mapper: mapLinkedInAd,
    },
  ]
}

// ─────────────────────────────────────────────
// useMarketIntelFeed
// ─────────────────────────────────────────────

export interface FeedSourceStatus {
  key: string
  isLoading: boolean
  isError: boolean
  error?: Error | null
  itemCount: number
}

export function useMarketIntelFeed(options?: { days?: number }) {
  const days = options?.days ?? 7
  const sinceDate = useMemo(() => daysAgo(days), [days])
  const sourceQueries = useMemo(() => buildSourceQueries(sinceDate), [sinceDate])

  const results = useQueries({
    queries: sourceQueries.map((sq) => ({
      queryKey: ["market-intel", "feed", sq.key, sinceDate],
      queryFn: sq.queryFn,
      staleTime: 3 * 60 * 1000,   // 3 min
      gcTime: 15 * 60 * 1000,     // 15 min cache
      retry: 1,                    // Only retry once — don't block UI
      refetchOnWindowFocus: false,
    })),
  })

  // Merge all source results into a unified feed
  const feed = useMemo(() => {
    const allItems: MarketIntelItem[] = []

    results.forEach((result, index) => {
      if (result.data) {
        const sq = sourceQueries[index]
        const items = extractItems(result.data, ...sq.extractKey)
        allItems.push(...safeMap(items, sq.mapper))
      }
    })

    // Sort by date descending (most recent first)
    allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return allItems
  }, [results, sourceQueries])

  // Per-source status for UI indicators
  const sourceStatuses: FeedSourceStatus[] = useMemo(() => {
    return results.map((result, index) => {
      const sq = sourceQueries[index]
      const items = result.data ? extractItems(result.data, ...sq.extractKey) : []
      return {
        key: sq.key,
        isLoading: result.isLoading,
        isError: result.isError,
        error: result.error as Error | null,
        itemCount: items.length,
      }
    })
  }, [results, sourceQueries])

  const isLoading = results.some((r) => r.isLoading)
  const isAllLoaded = results.every((r) => !r.isLoading)
  const loadedCount = results.filter((r) => !r.isLoading).length
  const errorCount = results.filter((r) => r.isError).length

  const refetchAll = () => {
    results.forEach((r) => r.refetch())
  }

  return {
    feed,
    isLoading,
    isAllLoaded,
    loadedCount,
    totalSources: sourceQueries.length,
    errorCount,
    sourceStatuses,
    refetchAll,
  }
}

// ─────────────────────────────────────────────
// useMarketIntelSummaries
// ─────────────────────────────────────────────

export function useMarketIntelSummaries() {
  const cfpb = useQuery<CFPBSummary>({
    queryKey: ["cfpb-summary"],
    queryFn: () => apiClient.get("/cfpb/summary"),
  })

  const fda = useQuery({
    queryKey: ["market-intel", "summary", "fda"],
    queryFn: () => apiClient.get("/fda/summary") as Promise<any>,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const nhtsa = useQuery({
    queryKey: ["market-intel", "summary", "nhtsa"],
    queryFn: () => apiClient.get("/nhtsa/summary") as Promise<any>,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const ftc = useQuery({
    queryKey: ["market-intel", "summary", "ftc"],
    queryFn: () => apiClient.get("/ftc/summary") as Promise<any>,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const summaries: AllSummaries = useMemo(
    () => ({
      cfpb: cfpb.data ?? null,
      fda: fda.data ?? null,
      nhtsa: nhtsa.data ?? null,
      ftc: ftc.data ?? null,
    }),
    [cfpb.data, fda.data, nhtsa.data, ftc.data]
  )

  const isLoading = cfpb.isLoading || fda.isLoading || nhtsa.isLoading || ftc.isLoading

  return { summaries, isLoading }
}
