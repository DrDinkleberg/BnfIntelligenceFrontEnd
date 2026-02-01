/**
 * Law Firm → Competitor Mapper
 *
 * Transforms backend LawFirmResponse into the Competitor shape consumed
 * by competitors-view.tsx. Generates derived fields (initials, colors,
 * ad source counts) and marks pipeline-dependent fields as null ("Coming soon").
 */

import type { BackendLawFirm } from "@/types/law-firm"

// ─────────────────────────────────────────────
// Competitor interface (consumed by UI)
// ─────────────────────────────────────────────

export interface Competitor {
  id: string
  backendId: number
  uuid: string
  name: string
  initials: string
  color: string
  location: string
  practiceAreas: string[]
  tier: number
  entityType: string
  practiceFocus: string | null
  adsCount: number
  isTracked: boolean
  isActive: boolean
  website: string
  firmSize: string
  // Monitoring coverage
  googleAdUrl: string | null
  metaAdLibraryUrl: string | null
  linkedinAdUrl: string | null
  googleAdvertiserId: string | null
  facebookPageId: string | null
  adSourceCount: number
  // Coming soon — pipeline data not yet available
  totalAdSpend: number | null
  activeCampaigns: number | null
  filingsYTD: number | null
  newsMentions: number | null
  socialMentions: number | null
  reputationScore: number | null
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const TIER_COLORS: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-blue-500",
  3: "bg-slate-400",
}

const TIER_LABELS: Record<number, string> = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
}

const ENTITY_LABELS: Record<string, string> = {
  law_firm: "Law Firm",
  marketing_agency: "Agency",
  lead_gen: "Lead Gen",
}

function generateInitials(name: string): string {
  // Strip common suffixes for cleaner initials
  const cleaned = name
    .replace(/\b(LLP|LLC|PC|PLLC|PA|PLC|Inc\.?|Co\.?)\b/gi, "")
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function buildLocation(city: string | null, state: string | null): string {
  if (city && state) return `${city}, ${state}`
  if (city) return city
  if (state) return state
  return ""
}

function derivePracticeAreas(firm: BackendLawFirm): string[] {
  // Prefer specialties array, fall back to practice_focus
  if (firm.specialties && firm.specialties.length > 0) {
    return firm.specialties
  }
  if (firm.practice_focus) {
    return [firm.practice_focus]
  }
  return []
}

function countAdSources(firm: BackendLawFirm): number {
  let count = 0
  if (firm.google_advertiser_id || firm.google_ad_url) count++
  if (firm.facebook_page_id || firm.meta_ad_library_url) count++
  if (firm.linkedin_ad_url) count++
  return count
}

// ─────────────────────────────────────────────
// Main mapper
// ─────────────────────────────────────────────

export function mapLawFirmToCompetitor(firm: BackendLawFirm): Competitor {
  return {
    id: String(firm.id),
    backendId: firm.id,
    uuid: firm.uuid,
    name: firm.name,
    initials: generateInitials(firm.name),
    color: TIER_COLORS[firm.tier] || TIER_COLORS[3],
    location: buildLocation(firm.headquarters_city, firm.headquarters_state),
    practiceAreas: derivePracticeAreas(firm),
    tier: firm.tier,
    entityType: firm.entity_type || "law_firm",
    practiceFocus: firm.practice_focus,
    adsCount: firm.total_ads_found,
    isTracked: firm.tier === 1, // T1 firms auto-tracked
    isActive: firm.is_active,
    website: firm.website || "",
    firmSize: firm.firm_size || "",
    // Monitoring
    googleAdUrl: firm.google_ad_url,
    metaAdLibraryUrl: firm.meta_ad_library_url,
    linkedinAdUrl: firm.linkedin_ad_url,
    googleAdvertiserId: firm.google_advertiser_id,
    facebookPageId: firm.facebook_page_id,
    adSourceCount: countAdSources(firm),
    // Coming soon
    totalAdSpend: null,
    activeCampaigns: null,
    filingsYTD: null,
    newsMentions: null,
    socialMentions: null,
    reputationScore: null,
  }
}

// ─────────────────────────────────────────────
// Label helpers (for UI display)
// ─────────────────────────────────────────────

export function getTierLabel(tier: number): string {
  return TIER_LABELS[tier] || `Tier ${tier}`
}

export function getTierColor(tier: number): string {
  return TIER_COLORS[tier] || TIER_COLORS[3]
}

export function getEntityLabel(entityType: string): string {
  return ENTITY_LABELS[entityType] || entityType
}
