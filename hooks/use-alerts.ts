// React hooks for alerts data

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { AlertConfig, PaginationParams, FilterParams } from "@/types/database"

export function useAlertHistory(params?: PaginationParams & FilterParams) {
  return useQuery({
    queryKey: ["alert-history", params],
    queryFn: () => apiClient.getAlertHistory(params),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  })
}

export function useAlertConfigs(params?: PaginationParams) {
  return useQuery({
    queryKey: ["alert-configs", params],
    queryFn: () => apiClient.getAlertConfigs(params),
  })
}

export function useCreateAlertConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<AlertConfig>) => apiClient.createAlertConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-configs"] })
    },
  })
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (alertId: string | number) => apiClient.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-history"] })
    },
  })
}
