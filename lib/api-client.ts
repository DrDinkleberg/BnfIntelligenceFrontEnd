// Centralized API client for all database operations

import type { ApiResponse, PaginationParams, FilterParams } from "@/types/database"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Generic CRUD operations
  async get<T>(endpoint: string, params?: PaginationParams & FilterParams): Promise<ApiResponse<T[]>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v.toString()))
          } else {
            searchParams.append(key, value.toString())
          }
        }
      })
    }

    const queryString = searchParams.toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint

    return this.request<T[]>(url)
  }

  async getById<T>(endpoint: string, id: string | number): Promise<ApiResponse<T>> {
    return this.request<T>(`${endpoint}/${id}`)
  }

  async create<T>(endpoint: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async update<T>(endpoint: string, id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.request<T>(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint: string, id: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`${endpoint}/${id}`, {
      method: "DELETE",
    })
  }

  // Specific endpoint methods

  // Law Firms
  async getLawFirms(params?: PaginationParams & FilterParams) {
    return this.get("/law-firms", params)
  }

  async getLawFirmById(id: string | number) {
    return this.getById("/law-firms", id)
  }

  async getLawFirmActivity(firmId: string | number, params?: PaginationParams) {
    return this.get(`/law-firms/${firmId}/activity`, params)
  }

  // Monitored Entities
  async getMonitoredEntities(params?: PaginationParams & FilterParams) {
    return this.get("/monitored-entities", params)
  }

  async getMonitoredEntityById(id: string | number) {
    return this.getById("/monitored-entities", id)
  }

  async getEntityRiskAssessment(entityId: string | number) {
    return this.get(`/monitored-entities/${entityId}/risk-assessment`)
  }

  // Regulatory Events
  async getRegulatoryEvents(params?: PaginationParams & FilterParams) {
    return this.get("/regulatory-events", params)
  }

  async getRegulatoryEventById(id: string | number) {
    return this.getById("/regulatory-events", id)
  }

  // Firm Activity
  async getFirmActivity(params?: PaginationParams & FilterParams) {
    return this.get("/firm-activity", params)
  }

  async getFirmActivityByFirm(firmId: string | number, params?: PaginationParams) {
    return this.get(`/firm-activity/by-firm/${firmId}`, params)
  }

  async getFirmActivityByEntity(entityId: string | number, params?: PaginationParams) {
    return this.get(`/firm-activity/by-entity/${entityId}`, params)
  }

  // Alerts
  async getAlertHistory(params?: PaginationParams & FilterParams) {
    return this.get("/alerts/history", params)
  }

  async getAlertConfigs(params?: PaginationParams) {
    return this.get("/alerts/configs", params)
  }

  async createAlertConfig(data: any) {
    return this.create("/alerts/configs", data)
  }

  async acknowledgeAlert(alertId: string | number) {
    return this.update("/alerts/history", alertId, { acknowledged_at: new Date().toISOString() })
  }

  // Risk Assessments
  async getRiskAssessments(params?: PaginationParams & FilterParams) {
    return this.get("/risk-assessments", params)
  }

  async getRiskAssessmentByEntity(entityId: string | number) {
    return this.get(`/risk-assessments/by-entity/${entityId}`)
  }

  // Court Cases
  async getCourtCases(params?: PaginationParams & FilterParams) {
    return this.get("/court-cases", params)
  }

  async getCourtCaseById(id: string | number) {
    return this.getById("/court-cases", id)
  }

  // Enforcement Actions
  async getEnforcementActions(params?: PaginationParams & FilterParams) {
    return this.get("/enforcement-actions", params)
  }

  async getEnforcementActionById(id: string | number) {
    return this.getById("/enforcement-actions", id)
  }

  // Consumer Complaints
  async getConsumerComplaints(params?: PaginationParams & FilterParams) {
    return this.get("/consumer-complaints", params)
  }

  async getConsumerComplaintsByEntity(entityId: string | number, params?: PaginationParams) {
    return this.get(`/consumer-complaints/by-entity/${entityId}`, params)
  }

  // Vehicle Data
  async getVehicleComplaints(params?: PaginationParams & FilterParams) {
    return this.get("/vehicle-complaints", params)
  }

  async getVehicleRecalls(params?: PaginationParams & FilterParams) {
    return this.get("/vehicle-recalls", params)
  }

  // Dashboard Analytics
  async getDashboardStats() {
    return this.get("/dashboard/stats")
  }

  async getTrendingTopics(params?: { days?: number }) {
    return this.get("/dashboard/trending", params)
  }

  async getActivitySummary(params?: { firm_id?: number; entity_id?: number; days?: number }) {
    return this.get("/dashboard/activity-summary", params)
  }
}

export const apiClient = new ApiClient()
export default apiClient
