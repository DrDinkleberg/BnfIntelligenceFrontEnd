/**
 * Market Intel Types
 *
 * Unified feed item consumed by the market-intel UI component,
 * plus agency summary types from each /summary endpoint.
 */

// ─────────────────────────────────────────────
// Unified Feed Item (what the UI renders)
// ─────────────────────────────────────────────

export type IntelType = "regulatory" | "news" | "social" | "filing" | "ad"
export type IntelSeverity = "critical" | "high" | "medium" | "low"
export type IntelSentiment = "positive" | "neutral" | "negative"

export interface MarketIntelItem {
  id: string
  title: string
  description: string
  type: IntelType
  source: string          // Display label: "FDA", "NHTSA", "CFPB", etc.
  sourceKey: string       // Internal key: "fda", "nhtsa-recalls", "cfpb", etc.
  severity: IntelSeverity
  sentiment?: IntelSentiment
  entities: string[]
  date: string            // ISO datetime
  timestamp: string       // Relative: "2h", "1d", "3d"
  url?: string            // Deep link to source detail page
  meta?: Record<string, any>  // Source-specific metadata
}

// ─────────────────────────────────────────────
// Agency Summaries (from /summary endpoints)
// ─────────────────────────────────────────────

export interface CFPBSummary {
  total_complaints: number
  complaints_last_7_days: number
  complaints_last_30_days: number
  unique_companies: number
  top_company?: string
  top_company_count?: number
  top_product?: string
  top_product_count?: number
  last_sync_at?: string
  last_sync_status?: string
}

export interface FDASummary {
  total_recalls?: number
  recalls_last_7_days?: number
  recalls_last_30_days?: number
  class_i_count?: number
  class_ii_count?: number
  class_iii_count?: number
  top_firm?: string
  last_sync_at?: string
  last_sync_status?: string
  [key: string]: any  // Flexible — backend shape may vary
}

export interface NHTSASummary {
  total_recalls?: number
  total_complaints?: number
  recalls_last_7_days?: number
  recalls_last_30_days?: number
  complaints_last_7_days?: number
  top_manufacturer?: string
  last_sync_at?: string
  last_sync_status?: string
  [key: string]: any
}

export interface FTCSummary {
  total_dnc_complaints?: number
  total_hsr_notices?: number
  dnc_last_7_days?: number
  dnc_last_30_days?: number
  last_sync_at?: string
  last_sync_status?: string
  [key: string]: any
}

export interface AllSummaries {
  cfpb: CFPBSummary | null
  fda: FDASummary | null
  nhtsa: NHTSASummary | null
  ftc: FTCSummary | null
}

// ─────────────────────────────────────────────
// Source Configuration
// ─────────────────────────────────────────────

export interface SourceConfig {
  key: string
  label: string
  type: IntelType
  active: boolean
}

export const ACTIVE_SOURCES: SourceConfig[] = [
  { key: "fda", label: "FDA", type: "regulatory", active: true },
  { key: "nhtsa-recalls", label: "NHTSA", type: "regulatory", active: true },
  { key: "nhtsa-complaints", label: "NHTSA", type: "regulatory", active: true },
  { key: "cfpb", label: "CFPB", type: "regulatory", active: true },
  { key: "ftc-dnc", label: "FTC", type: "regulatory", active: true },
  { key: "ftc-hsr", label: "FTC", type: "filing", active: true },
  { key: "sec", label: "SEC", type: "filing", active: true },
  { key: "facebook-ads", label: "Meta", type: "ad", active: true },
  { key: "linkedin-ads", label: "LinkedIn", type: "ad", active: true },
]

export const SOURCE_LABELS = ["FDA", "CFPB", "NHTSA", "FTC", "SEC", "Meta", "LinkedIn"] as const

export const COMING_SOON_SOURCES = ["News", "Reddit", "TikTok"] as const
