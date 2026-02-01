// React hooks for law firms data

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { LawFirm, PaginationParams, FilterParams } from "@/types/database"

export function useLawFirms(params?: PaginationParams & FilterParams) {
  return useQuery({
    queryKey: ["law-firms", params],
    queryFn: () => apiClient.getLawFirms(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLawFirm(id: string | number) {
  return useQuery({
    queryKey: ["law-firm", id],
    queryFn: () => apiClient.getLawFirmById(id),
    enabled: !!id,
  })
}

export function useLawFirmActivity(firmId: string | number, params?: PaginationParams) {
  return useQuery({
    queryKey: ["law-firm-activity", firmId, params],
    queryFn: () => apiClient.getLawFirmActivity(firmId, params),
    enabled: !!firmId,
  })
}

export function useCreateLawFirm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<LawFirm>) => apiClient.create("/law-firms", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["law-firms"] })
    },
  })
}

export function useUpdateLawFirm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<LawFirm> }) =>
      apiClient.update("/law-firms", id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["law-firms"] })
      queryClient.invalidateQueries({ queryKey: ["law-firm", id] })
    },
  })
}
