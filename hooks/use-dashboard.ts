// React hooks for dashboard data

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiClient.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useTrendingTopics(params?: { days?: number }) {
  return useQuery({
    queryKey: ["trending-topics", params],
    queryFn: () => apiClient.getTrendingTopics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useActivitySummary(params?: { firm_id?: number; entity_id?: number; days?: number }) {
  return useQuery({
    queryKey: ["activity-summary", params],
    queryFn: () => apiClient.getActivitySummary(params),
    staleTime: 2 * 60 * 1000,
  })
}
