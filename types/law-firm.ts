/**
 * Backend Law Firm Types
 *
 * These interfaces match the Pydantic schemas in the FastAPI backend:
 *   - app/schemas/law_firm.py → LawFirmResponse, LawFirmList
 *
 * Used by the api-client and React Query hooks to type API responses.
 */

export interface BackendLawFirm {
  id: number
  uuid: string
  name: string
  website: string | null
  facebook_page_id: string | null
  headquarters_city: string | null
  headquarters_state: string | null
  firm_size: string | null
  tier: number
  specialties: string[]
  is_active: boolean
  total_ads_found: number
  created_at: string
  // Monitoring / collector fields (added in seed_001 migration)
  google_advertiser_id: string | null
  google_ad_url: string | null
  meta_ad_library_url: string | null
  linkedin_ad_url: string | null
  practice_focus: string | null
  entity_type: string | null
}

export interface BackendLawFirmList {
  items: BackendLawFirm[]
  total: number
  page: number
  pages: number
}
