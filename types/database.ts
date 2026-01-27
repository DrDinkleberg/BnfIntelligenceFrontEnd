// Database type definitions based on your schema

export interface LawFirm {
  id: number
  uuid: string
  name: string
  website?: string
  headquarters_city?: string
  headquarters_state?: string
  firm_size?: "solo" | "small" | "medium" | "large" | "biglaw"
  specialties?: string[]
  contact_info?: Record<string, any>
  reputation_score?: number
  created_at: string
  updated_at: string
}

export interface MonitoredEntity {
  id: number
  uuid: string
  name: string
  type: "drug" | "device" | "company" | "product" | "service" | "financial_product" | "vehicle" | "food"
  description?: string
  fda_identifier?: string
  ndc_number?: string
  company_name?: string
  industry?: string
  status: "active" | "inactive" | "archived"
  created_at: string
  updated_at: string
  created_by?: string
}

export interface RegulatoryEvent {
  id: number
  uuid: string
  entity_id: number
  source:
    | "fda_adverse"
    | "fda_recall"
    | "fda_warning"
    | "sec_filing"
    | "news"
    | "patent"
    | "doj_action"
    | "ftc_action"
    | "cfpb_complaint"
    | "nhtsa_complaint"
    | "nhtsa_recall"
    | "court_filing"
    | "social_media"
    | "uspto"
    | "epa"
    | "osha"
    | "state_ag"
    | "other"
  event_type: string
  title?: string
  description?: string
  severity_score?: number
  event_date?: string
  source_url?: string
  source_reference?: string
  raw_data?: Record<string, any>
  processed: boolean
  detected_at: string
  processed_at?: string
}

export interface FirmActivity {
  id: number
  uuid: string
  firm_id: number
  entity_id?: number
  activity_type: "facebook_ad" | "google_ad" | "website_content" | "news_mention" | "court_filing"
  platform?: string
  campaign_title?: string
  ad_content?: string
  targeting_keywords?: string[]
  geographic_targeting?: Record<string, any>
  ad_spend_estimate?: number
  impressions_estimate?: number
  activity_date?: string
  first_seen: string
  last_seen: string
  source_url?: string
  raw_data?: Record<string, any>
  is_active: boolean
}

export interface AlertConfig {
  id: number
  uuid: string
  user_id: string
  name: string
  entity_id?: number
  alert_type: "risk_threshold" | "new_event" | "firm_activity" | "custom"
  conditions: Record<string, any>
  notification_channels: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AlertHistory {
  id: number
  uuid: string
  alert_config_id: number
  entity_id?: number
  trigger_event_id?: number
  alert_level: "info" | "warning" | "critical"
  message: string
  metadata?: Record<string, any>
  sent_at: string
  acknowledged_at?: string
  acknowledged_by?: string
}

export interface RiskAssessment {
  id: number
  uuid: string
  entity_id: number
  risk_score: number
  confidence_level?: number
  risk_category: "low" | "medium" | "high" | "critical"
  contributing_factors?: Record<string, any>
  methodology_version: string
  notes?: string
  assessed_at: string
  expires_at?: string
  assessed_by: string
}

export interface CourtCase {
  id: number
  uuid: string
  case_number: string
  case_title: string
  court_name: string
  jurisdiction: string
  case_type?: string
  filing_date?: string
  status?: string
  judge_name?: string
  description?: string
  case_summary?: string
  outcome?: string
  settlement_amount?: number
  raw_data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface EnforcementAction {
  id: number
  uuid: string
  entity_id?: number
  regulatory_event_id?: number
  agency: "DOJ" | "FTC" | "FDA" | "SEC" | "CFPB" | "NHTSA" | "EPA" | "OTHER"
  action_type: string
  case_number?: string
  filing_date?: string
  resolution_date?: string
  monetary_penalty?: number
  currency: string
  description?: string
  legal_basis?: string
  outcome_status?: "pending" | "settled" | "dismissed" | "ongoing" | "appealed"
  public_document_url?: string
  court_jurisdiction?: string
  lead_attorney?: string
  case_summary?: string
  impact_assessment?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ConsumerComplaint {
  id: number
  uuid: string
  entity_id?: number
  complaint_id?: string
  product?: string
  sub_product?: string
  issue?: string
  sub_issue?: string
  complaint_narrative?: string
  company_response?: string
  consumer_disputed?: boolean
  date_received?: string
  date_sent_to_company?: string
  company_name?: string
  state?: string
  zip_code?: string
  tags?: string[]
  consumer_consent_provided?: boolean
  submitted_via?: string
  timely_response?: boolean
  raw_data?: Record<string, any>
  created_at: string
  regulatory_event_id?: number
  complaint_what_happened?: string
  company_response_to_consumer?: string
  severity_score?: number
  mass_tort_indicators?: string[]
  processed: boolean
}

export interface VehicleComplaint {
  id: number
  uuid: string
  entity_id?: number
  regulatory_event_id?: number
  odi_id?: string
  make?: string
  model?: string
  year?: number
  vin?: string
  component_description?: string
  complaint_description?: string
  incident_date?: string
  mileage?: number
  crash: boolean
  fire: boolean
  injured: number
  deaths: number
  severity_score?: number
  high_risk_component: boolean
  raw_data?: Record<string, any>
  processed: boolean
  created_at: string
  updated_at: string
}

export interface VehicleRecall {
  id: number
  uuid: string
  entity_id?: number
  nhtsa_campaign_number?: string
  manufacturer?: string
  make?: string
  model?: string
  model_year?: number
  recall_type?: string
  potentially_affected?: number
  component?: string
  summary?: string
  consequence?: string
  remedy?: string
  notes?: string
  recall_date?: string
  report_received_date?: string
  record_creation_date?: string
  regulation_part?: string
  federal_motor_vehicle_safety_standard?: string
  defect_summary?: string
  raw_data?: Record<string, any>
  created_at: string
  regulatory_event_id?: number
  component_name?: string
  recall_description?: string
  risk_rating?: string
  severity_score?: number
  mass_tort_potential: boolean
  processed: boolean
}

// Social Listening types for Reddit and TikTok data
export interface SocialPost {
  id: number
  uuid: string
  platform: "reddit" | "tiktok" | "twitter" | "facebook" | "instagram"
  post_id: string
  author_username: string
  author_id?: string
  content: string
  title?: string // For Reddit posts
  subreddit?: string // For Reddit
  hashtags?: string[]
  mentions?: string[]
  url: string
  engagement: {
    likes: number
    comments: number
    shares: number
    views?: number
  }
  sentiment_score?: number // -1 to 1
  sentiment_label?: "negative" | "neutral" | "positive"
  keywords_matched: string[]
  entity_mentions?: string[] // Monitored entities mentioned
  entity_ids?: number[]
  is_reply: boolean
  parent_post_id?: string
  media_urls?: string[]
  posted_at: string
  collected_at: string
  raw_data?: Record<string, any>
}

export interface SocialProfile {
  id: number
  uuid: string
  platform: "reddit" | "tiktok" | "twitter" | "facebook" | "instagram"
  username: string
  display_name?: string
  bio?: string
  profile_url: string
  avatar_url?: string
  followers_count: number
  following_count?: number
  posts_count: number
  verified: boolean
  account_created?: string
  last_active?: string
  relevance_score?: number
  tracked_since: string
  is_influencer: boolean
  topics?: string[]
}

export interface SocialTrend {
  id: number
  keyword: string
  platform: "reddit" | "tiktok" | "all"
  mention_count: number
  sentiment_avg: number
  growth_rate: number // percentage change
  peak_date: string
  related_entities: string[]
  sample_posts: SocialPost[]
}

export interface SocialSearchQuery {
  id: number
  uuid: string
  user_id: string
  query_type: "keyword" | "profile" | "hashtag" | "subreddit"
  query_value: string
  platforms: string[]
  filters?: Record<string, any>
  is_saved: boolean
  last_run?: string
  created_at: string
}

export interface GoogleAd {
  id: number
  uuid: string
  firm_id: number
  advertiser_name: string
  advertiser_id: string
  ad_creative_text?: string
  ad_creative_image_url?: string
  ad_creative_video_url?: string
  ad_variants?: Record<string, any>[]
  format: "text" | "image" | "video" | "responsive"
  date_range_start?: string
  date_range_end?: string
  geographic_targeting?: Record<string, any>
  keywords_detected?: string[]
  is_active: boolean
  raw_data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MetaAd {
  id: number
  uuid: string
  firm_id: number
  page_name: string
  page_id: string
  ad_creative_body?: string
  ad_creative_link_title?: string
  ad_snapshot_url?: string
  landing_page_url?: string
  spend_range_lower?: number
  spend_range_upper?: number
  impressions_range_lower?: number
  impressions_range_upper?: number
  ad_delivery_start?: string
  ad_delivery_end?: string
  is_active: boolean
  keywords_detected?: string[]
  raw_data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface LinkedInAd {
  id: number
  uuid: string
  firm_id: number
  advertiser_name: string
  advertiser_url?: string
  advertiser_logo_url?: string
  ad_id: string
  ad_library_url?: string
  body?: string
  headline?: string
  click_url?: string
  image_url?: string
  format: "SINGLE_IMAGE" | "VIDEO" | "CAROUSEL" | "TEXT"
  ctas?: string[]
  paid_by?: string
  keywords_detected?: string[]
  is_active: boolean
  raw_data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface WebsiteTraffic {
  id: number
  uuid: string
  firm_id: number
  domain: string
  global_rank?: number
  total_visits?: number
  monthly_visits_trend?: Record<string, number>
  traffic_by_country?: Record<string, number>
  top_keywords?: { keyword: string; cpc?: number; volume?: number }[]
  traffic_sources: {
    direct?: number
    search?: number
    social?: number
    referral?: number
    paid?: number
    mail?: number
  }
  engagement_metrics: {
    bounce_rate?: number
    pages_per_visit?: number
    time_on_site?: number
  }
  site_preview_desktop?: string
  site_preview_mobile?: string
  raw_data?: Record<string, any>
  collected_at: string
  created_at: string
}

export interface CompetitorAdSummary {
  firm: LawFirm
  google_ads: GoogleAd[]
  meta_ads: MetaAd[]
  linkedin_ads: LinkedInAd[]
  website_traffic?: WebsiteTraffic
  total_ad_spend_estimate: number
  total_impressions_estimate: number
  active_campaigns: number
  top_keywords: string[]
  practice_areas_targeted: string[]
}

export interface NewsArticle {
  id: number
  uuid: string
  title: string
  description?: string
  content?: string
  source_name: string
  source_url: string
  author?: string
  image_url?: string
  published_at: string
  category?: string
  tags?: string[]
  entity_mentions?: string[]
  entity_ids?: number[]
  firm_mentions?: string[]
  firm_ids?: number[]
  sentiment_score?: number
  relevance_score?: number
  is_breaking: boolean
  raw_data?: Record<string, any>
  created_at: string
}

export interface NewsSource {
  id: number
  name: string
  url: string
  category: "legal" | "regulatory" | "industry" | "mainstream" | "trade"
  is_active: boolean
  last_fetched?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface FilterParams {
  search?: string
  firm_size?: string[]
  specialties?: string[]
  risk_category?: string[]
  entity_type?: string[]
  alert_level?: string[]
  date_from?: string
  date_to?: string
  [key: string]: any
}

export interface FiledComplaint {
  id: number
  uuid: string
  firm_id: number
  firm_name: string
  case_number: string
  case_title: string
  court_name: string
  court_type: "federal" | "state" | "bankruptcy" | "appellate"
  jurisdiction: string
  filing_date: string
  case_type: "class_action" | "mass_tort" | "individual" | "mdl" | "arbitration"
  practice_area: string
  defendant_name: string
  plaintiff_count?: number
  alleged_damages?: number
  case_status: "filed" | "pending" | "discovery" | "trial" | "settled" | "dismissed" | "appealed"
  description?: string
  key_allegations?: string[]
  related_entities?: string[]
  entity_ids?: number[]
  document_url?: string
  pacer_link?: string
  lead_counsel?: string
  co_counsel?: string[]
  judge_name?: string
  next_hearing_date?: string
  settlement_amount?: number
  raw_data?: Record<string, any>
  created_at: string
  updated_at: string
}
