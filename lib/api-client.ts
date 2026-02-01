/**
 * Centralized API Client for BNF Intelligence Platform
 *
 * All requests go through the BFF proxy at /api/v1/[...path]
 * which handles:
 *   - Session validation (NextAuth)
 *   - Service key injection (BACKEND_SERVICE_KEY)
 *   - User attribution headers (X-Forwarded-User-Email)
 *   - Proxying to https://api.pulsebiz.io/api/v1/*
 *
 * The browser NEVER talks directly to api.pulsebiz.io.
 */

import type { ApiResponse, PaginationParams, FilterParams } from "@/types/database"

// BFF proxy base — same-origin requests, cookies sent automatically
const API_BASE_URL = "/api/v1"

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      credentials: "same-origin", // Send NextAuth session cookie
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401) {
        // Session expired — redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new Error("Authentication required")
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "")
        throw new Error(
          `API error ${response.status}: ${response.statusText}${errorBody ? ` — ${errorBody}` : ""}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${url}`, error)
      throw error
    }
  }

  // ─────────────────────────────────────────
  // Generic CRUD
  // ─────────────────────────────────────────

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
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

    return this.request<T>(url)
  }

  async getById<T>(endpoint: string, id: string | number): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`)
  }

  async create<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async update<T>(endpoint: string, id: string | number, data: unknown): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, id: string | number): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`, {
      method: "DELETE",
    })
  }

  // ─────────────────────────────────────────
  // Law Firms
  // ─────────────────────────────────────────

  async getLawFirms(params?: Record<string, any>) {
    return this.get("/law-firms", params)
  }

  async getLawFirmById(id: string | number) {
    return this.getById("/law-firms", id)
  }

  async getLawFirmActivity(firmId: string | number, params?: Record<string, any>) {
    return this.get(`/law-firms/${firmId}/activity`, params)
  }

  // ─────────────────────────────────────────
  // Monitored Entities
  // ─────────────────────────────────────────

  async getMonitoredEntities(params?: Record<string, any>) {
    return this.get("/monitored-entities", params)
  }

  async getMonitoredEntityById(id: string | number) {
    return this.getById("/monitored-entities", id)
  }

  async getEntityRiskAssessment(entityId: string | number) {
    return this.get(`/monitored-entities/${entityId}/risk-assessment`)
  }

  // ─────────────────────────────────────────
  // Regulatory Events
  // ─────────────────────────────────────────

  async getRegulatoryEvents(params?: Record<string, any>) {
    return this.get("/regulatory-events", params)
  }

  async getRegulatoryEventById(id: string | number) {
    return this.getById("/regulatory-events", id)
  }

  // ─────────────────────────────────────────
  // Firm Activity
  // ─────────────────────────────────────────

  async getFirmActivity(params?: Record<string, any>) {
    return this.get("/firm-activity", params)
  }

  async getFirmActivityByFirm(firmId: string | number, params?: Record<string, any>) {
    return this.get(`/firm-activity/by-firm/${firmId}`, params)
  }

  async getFirmActivityByEntity(entityId: string | number, params?: Record<string, any>) {
    return this.get(`/firm-activity/by-entity/${entityId}`, params)
  }

  // ─────────────────────────────────────────
  // Alerts
  // ─────────────────────────────────────────

  async getAlertHistory(params?: Record<string, any>) {
    return this.get("/alerts/history", params)
  }

  async getAlertConfigs(params?: Record<string, any>) {
    return this.get("/alerts/configs", params)
  }

  async createAlertConfig(data: unknown) {
    return this.create("/alerts/configs", data)
  }

  async acknowledgeAlert(alertId: string | number) {
    return this.update("/alerts/history", alertId, { acknowledged_at: new Date().toISOString() })
  }

  // ─────────────────────────────────────────
  // Risk Assessments
  // ─────────────────────────────────────────

  async getRiskAssessments(params?: Record<string, any>) {
    return this.get("/risk-assessments", params)
  }

  async getRiskAssessmentByEntity(entityId: string | number) {
    return this.get(`/risk-assessments/by-entity/${entityId}`)
  }

  // ─────────────────────────────────────────
  // Court Cases
  // ─────────────────────────────────────────

  async getCourtCases(params?: Record<string, any>) {
    return this.get("/court-cases", params)
  }

  async getCourtCaseById(id: string | number) {
    return this.getById("/court-cases", id)
  }

  // ─────────────────────────────────────────
  // Enforcement Actions
  // ─────────────────────────────────────────

  async getEnforcementActions(params?: Record<string, any>) {
    return this.get("/enforcement-actions", params)
  }

  async getEnforcementActionById(id: string | number) {
    return this.getById("/enforcement-actions", id)
  }

  // ─────────────────────────────────────────
  // Consumer Complaints (CFPB)
  // ─────────────────────────────────────────

  async getConsumerComplaints(params?: Record<string, any>) {
    return this.get("/consumer-complaints", params)
  }

  async getConsumerComplaintsByEntity(entityId: string | number, params?: Record<string, any>) {
    return this.get(`/consumer-complaints/by-entity/${entityId}`, params)
  }

  // ─────────────────────────────────────────
  // Vehicle Data (NHTSA)
  // ─────────────────────────────────────────

  async getVehicleComplaints(params?: Record<string, any>) {
    return this.get("/vehicle-complaints", params)
  }

  async getVehicleRecalls(params?: Record<string, any>) {
    return this.get("/vehicle-recalls", params)
  }

  // ─────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────

  async getDashboardStats() {
    return this.get("/dashboard/stats")
  }

  async getTrendingTopics(params?: { days?: number }) {
    return this.get("/dashboard/trending", params)
  }

  async getActivitySummary(params?: { firm_id?: number; entity_id?: number; days?: number }) {
    return this.get("/dashboard/activity-summary", params)
  }

  // ─────────────────────────────────────────
  // Facebook Ads
  // ─────────────────────────────────────────

  async getFacebookAds(params?: Record<string, any>) {
    return this.get("/facebook-ads", params)
  }

  async getFacebookAdById(id: string | number) {
    return this.getById("/facebook-ads", id)
  }

  // ─────────────────────────────────────────
  // LinkedIn Ads
  // ─────────────────────────────────────────

  async getLinkedInAds(params?: Record<string, any>) {
    return this.get("/linkedin-ads", params)
  }

  async getLinkedInAdById(id: string | number) {
    return this.getById("/linkedin-ads", id)
  }

  // ─────────────────────────────────────────
  // CFPB
  // ─────────────────────────────────────────

  async getCFPBComplaints(params?: Record<string, any>) {
    return this.get("/cfpb/complaints", params)
  }

  async getCFPBSummary() {
    return this.get("/cfpb/summary")
  }

  // ─────────────────────────────────────────
  // SEC EDGAR
  // ─────────────────────────────────────────

  async getSECFilings(params?: Record<string, any>) {
    return this.get("/sec/filings", params)
  }

  // ─────────────────────────────────────────
  // FDA
  // ─────────────────────────────────────────

  async getFDAEnforcements(params?: Record<string, any>) {
    return this.get("/fda/recalls", params)
  }

  async getFDARecalls(params?: Record<string, any>) {
    return this.get("/fda/recalls", params)
  }

  async getFDADeviceRecalls(params?: Record<string, any>) {
    return this.get("/fda/device-recalls", params)
  }

  async getFDASummary() {
    return this.get("/fda/summary")
  }

  // ─────────────────────────────────────────
  // NHTSA
  // ─────────────────────────────────────────

  async getNHTSARecalls(params?: Record<string, any>) {
    return this.get("/nhtsa/recalls", params)
  }

  async getNHTSAComplaints(params?: Record<string, any>) {
    return this.get("/nhtsa/complaints", params)
  }

  async getNHTSASummary() {
    return this.get("/nhtsa/summary")
  }

  // ─────────────────────────────────────────
  // FTC
  // ─────────────────────────────────────────

  async getFTCDNCComplaints(params?: Record<string, any>) {
    return this.get("/ftc/dnc-complaints", params)
  }

  async getFTCHSRNotices(params?: Record<string, any>) {
    return this.get("/ftc/hsr-notices", params)
  }

  async getFTCSummary() {
    return this.get("/ftc/summary")
  }
}

export const apiClient = new ApiClient()
export default apiClient
