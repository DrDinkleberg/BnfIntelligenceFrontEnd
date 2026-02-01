/**
 * React Query hooks for Law Firms
 *
 * useAllLawFirms() — Fetches all firms in one call for client-side filtering
 * useLawFirms()    — Paginated fetch with server-side params
 * useLawFirm()     — Single firm by ID
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { BackendLawFirmList, BackendLawFirm } from "@/types/law-firm"

/**
 * Fetch ALL law firms in a single call (per_page=500).
 * Best for datasets < 1000 records — enables instant client-side search/filter.
 */
export function useAllLawFirms() {
  return useQuery<BackendLawFirmList>({
    queryKey: ["law-firms", "all"],
    queryFn: () => apiClient.getLawFirms({ per_page: 100 }) as Promise<BackendLawFirmList>,
    staleTime: 5 * 60 * 1000, // 5 min — firms don't change often
    gcTime: 30 * 60 * 1000,   // Keep in cache 30 min
    retry: 2,
  })
}

/**
 * Paginated law firms with optional server-side filters.
 * Use when dataset exceeds ~1000 records.
 */
export function useLawFirms(params?: {
  page?: number
  per_page?: number
  tier?: number
  search?: string
}) {
  return useQuery<BackendLawFirmList>({
    queryKey: ["law-firms", params],
    queryFn: () => apiClient.getLawFirms(params) as Promise<BackendLawFirmList>,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Single law firm by ID.
 */
export function useLawFirm(id: string | number) {
  return useQuery<BackendLawFirm>({
    queryKey: ["law-firm", id],
    queryFn: () => apiClient.getLawFirmById(id) as Promise<BackendLawFirm>,
    enabled: !!id,
  })
}

/**
 * Firm activity feed (when endpoint is ready).
 */
export function useLawFirmActivity(
  firmId: string | number,
  params?: { page?: number; per_page?: number }
) {
  return useQuery({
    queryKey: ["law-firm-activity", firmId, params],
    queryFn: () => apiClient.getLawFirmActivity(firmId, params),
    enabled: !!firmId,
  })
}

/**
 * Create a new law firm.
 */
export function useCreateLawFirm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<BackendLawFirm>) =>
      apiClient.create<BackendLawFirm>("/law-firms", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["law-firms"] })
    },
  })
}

/**
 * Update an existing law firm.
 */
export function useUpdateLawFirm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<BackendLawFirm> }) =>
      apiClient.update<BackendLawFirm>("/law-firms", id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["law-firms"] })
      queryClient.invalidateQueries({ queryKey: ["law-firm", id] })
    },
  })
}
