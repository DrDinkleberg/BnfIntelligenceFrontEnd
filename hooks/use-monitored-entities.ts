// React hooks for monitored entities data

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { MonitoredEntity, PaginationParams, FilterParams } from "@/types/database"

export function useMonitoredEntities(params?: PaginationParams & FilterParams) {
  return useQuery({
    queryKey: ["monitored-entities", params],
    queryFn: () => apiClient.getMonitoredEntities(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMonitoredEntity(id: string | number) {
  return useQuery({
    queryKey: ["monitored-entity", id],
    queryFn: () => apiClient.getMonitoredEntityById(id),
    enabled: !!id,
  })
}

export function useEntityRiskAssessment(entityId: string | number) {
  return useQuery({
    queryKey: ["entity-risk-assessment", entityId],
    queryFn: () => apiClient.getEntityRiskAssessment(entityId),
    enabled: !!entityId,
  })
}

export function useCreateMonitoredEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<MonitoredEntity>) => apiClient.create("/monitored-entities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitored-entities"] })
    },
  })
}
