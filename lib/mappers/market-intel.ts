/**
 * Market Intel Source Mappers
 *
 * Transforms each backend API response into the unified MarketIntelItem
 * shape consumed by the UI. Each mapper derives severity from source-specific
 * fields rather than hardcoding.
 *
 * Severity derivation:
 *   FDA Class I / NHTSA recall → critical
 *   FDA Class II / NHTSA crash-injury / CFPB disputed → high
 *   FDA Class III / CFPB routine / FTC HSR / SEC → medium
 *   FTC DNC / ads → low
 */

import type { MarketIntelItem, IntelSeverity } from "@/types/market-intel"

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  if (isNaN(date)) return ""
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)

  if (minutes < 1) return "now"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  if (weeks < 4) return `${weeks}w`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/**
 * Extract array of items from a paginated API response.
 * Handles different key names across backend endpoints.
 */
export function extractItems(data: any, ...preferredKeys: string[]): any[] {
  if (!data) return []
  for (const key of preferredKeys) {
    if (Array.isArray(data[key])) return data[key]
  }
  // Fallbacks
  if (Array.isArray(data.items)) return data.items
  if (Array.isArray(data.results)) return data.results
  if (Array.isArray(data)) return data
  return []
}

function truncate(text: string | null | undefined, max: number): string {
  if (!text) return ""
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + "…"
}

function filterEntities(arr: (string | null | undefined)[]): string[] {
  return arr.filter((s): s is string => !!s && s.trim() !== "")
}

// ─────────────────────────────────────────────
// FDA Enforcement/Recall → MarketIntelItem
// ─────────────────────────────────────────────

function fdaSeverity(classification: string | null | undefined): IntelSeverity {
  if (!classification) return "critical" // enforcement action = assume critical
  const c = classification.toLowerCase()
  if (c.includes("class i") && !c.includes("class ii") && !c.includes("class iii")) return "critical"
  if (c.includes("class ii") && !c.includes("class iii")) return "high"
  if (c.includes("class iii")) return "medium"
  return "critical"
}

export function mapFDARecall(item: any): MarketIntelItem {
  const firm = item.recalling_firm || "Unknown Firm"
  const productType = item.product_type || ""
  const classification = item.classification || ""
  const brandNames = (item.openfda_brand_name || []).slice(0, 2).join(", ")

  let title = `FDA ${classification || "Recall"}: ${firm}`
  if (brandNames) title = `FDA ${classification || "Recall"}: ${brandNames} (${firm})`

  const dateField = item.report_date || item.recall_initiation_date || item.created_at

  return {
    id: `fda-${item.id || item.recall_number}`,
    title: truncate(title, 120),
    description: truncate(item.reason_for_recall || item.product_description || "FDA enforcement action.", 300),
    type: "regulatory",
    source: "FDA",
    sourceKey: "fda",
    severity: fdaSeverity(item.classification),
    entities: filterEntities([
      firm,
      productType !== "drug" && productType !== "device" ? undefined : productType,
      ...(item.openfda_brand_name || []).slice(0, 2),
    ]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    url: `/regulatory/fda/${item.recall_number || item.id}`,
    meta: {
      classification: item.classification,
      status: item.status,
      productType: item.product_type,
      recallNumber: item.recall_number,
      state: item.state,
    },
  }
}

// ─────────────────────────────────────────────
// NHTSA Recall → MarketIntelItem
// ─────────────────────────────────────────────

export function mapNHTSARecall(item: any): MarketIntelItem {
  const make = item.make || ""
  const model = item.model || ""
  const year = item.model_year || ""
  const component = item.component || ""

  const title = `NHTSA Recall: ${make} ${model}${year ? ` (${year})` : ""}${component ? ` — ${component}` : ""}`
  const dateField = item.recall_date || item.created_at

  return {
    id: `nhtsa-recall-${item.id || item.campaign_number}`,
    title: truncate(title, 120),
    description: truncate(item.consequence || item.summary || "Vehicle safety recall issued.", 300),
    type: "regulatory",
    source: "NHTSA",
    sourceKey: "nhtsa-recalls",
    severity: "critical", // All recalls are critical
    entities: filterEntities([make, model, component, item.manufacturer]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    url: `/regulatory/nhtsa/recalls/${item.campaign_number || item.id}`,
    meta: {
      campaignNumber: item.campaign_number,
      make,
      model,
      modelYear: year,
      remedy: item.remedy,
      affectedUnits: item.potentially_affected,
    },
  }
}

// ─────────────────────────────────────────────
// NHTSA Complaint → MarketIntelItem
// ─────────────────────────────────────────────

function nhtsaComplaintSeverity(item: any): IntelSeverity {
  if (item.has_death || item.deaths > 0) return "critical"
  if (item.has_crash || item.crash || item.has_fire || item.fire) return "high"
  if (item.has_injury || item.injuries > 0) return "high"
  return "medium"
}

export function mapNHTSAComplaint(item: any): MarketIntelItem {
  const make = item.make || ""
  const model = item.model || ""
  const year = item.model_year || ""
  const component = item.component || ""

  const title = `Consumer Complaint: ${make} ${model}${year ? ` ${year}` : ""}${component ? ` — ${component}` : ""}`
  const dateField = item.date_of_incident || item.date_of_complaint || item.created_at

  const flags: string[] = []
  if (item.has_crash || item.crash) flags.push("Crash")
  if (item.has_fire || item.fire) flags.push("Fire")
  if (item.has_injury || item.injuries > 0) flags.push("Injury")
  if (item.has_death || item.deaths > 0) flags.push("Death")

  return {
    id: `nhtsa-complaint-${item.id || item.nhtsa_id}`,
    title: truncate(title, 120),
    description: truncate(item.summary || item.failure_description || "Consumer vehicle safety complaint.", 300),
    type: "regulatory",
    source: "NHTSA",
    sourceKey: "nhtsa-complaints",
    severity: nhtsaComplaintSeverity(item),
    entities: filterEntities([make, model, component, ...flags]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    url: `/regulatory/nhtsa/complaints/${item.id}`,
    meta: {
      make,
      model,
      modelYear: year,
      state: item.state,
      hasCrash: item.has_crash || item.crash,
      hasFire: item.has_fire || item.fire,
      hasInjury: item.has_injury,
    },
  }
}

// ─────────────────────────────────────────────
// CFPB Complaint → MarketIntelItem
// ─────────────────────────────────────────────

export function mapCFPBComplaint(item: any): MarketIntelItem {
  const company = item.company || "Unknown Company"
  const product = item.product || ""
  const issue = item.issue || ""

  const title = issue
    ? `${company}: ${issue}`
    : `${company} — ${product || "Consumer Complaint"}`

  const dateField = item.date_received || item.created_at

  return {
    id: `cfpb-${item.id || item.complaint_id}`,
    title: truncate(title, 120),
    description: truncate(
      [item.sub_issue, item.company_response].filter(Boolean).join(" — ")
        || `Consumer complaint regarding ${product || "financial product"}.`,
      300
    ),
    type: "regulatory",
    source: "CFPB",
    sourceKey: "cfpb",
    severity: item.consumer_disputed === "Yes" || item.consumer_disputed === true ? "high" : "medium",
    entities: filterEntities([company, product, item.sub_product]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    url: `/regulatory/cfpb/${item.complaint_id || item.id}`,
    meta: {
      complaintId: item.complaint_id,
      product,
      subProduct: item.sub_product,
      companyResponse: item.company_response,
      state: item.state,
      disputed: item.consumer_disputed,
      practiceArea: item.detected_practice_area,
    },
  }
}

// ─────────────────────────────────────────────
// FTC DNC Complaint → MarketIntelItem
// ─────────────────────────────────────────────

export function mapFTCDNCComplaint(item: any): MarketIntelItem {
  const company = item.company_name || item.subject || "Unknown"
  const dateField = item.violation_date || item.created_date || item.created_at

  return {
    id: `ftc-dnc-${item.id || item.complaint_id}`,
    title: truncate(`Do Not Call Violation: ${company}`, 120),
    description: truncate(
      item.description || `Do Not Call Registry violation reported against ${company}.`,
      300
    ),
    type: "regulatory",
    source: "FTC",
    sourceKey: "ftc-dnc",
    severity: "low",
    entities: filterEntities([company]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    meta: {
      violationDate: item.violation_date,
      state: item.consumer_state || item.state,
    },
  }
}

// ─────────────────────────────────────────────
// FTC HSR Notice → MarketIntelItem
// ─────────────────────────────────────────────

export function mapFTCHSRNotice(item: any): MarketIntelItem {
  const acquiring = item.acquiring_party || item.acquiring_person || "Unknown"
  const acquired = item.acquired_party || item.acquired_entity || "Unknown"
  const dateField = item.early_termination_date || item.created_at

  return {
    id: `ftc-hsr-${item.id || item.transaction_number}`,
    title: truncate(`HSR Filing: ${acquiring} / ${acquired}`, 120),
    description: truncate(
      `Pre-merger notification: ${acquiring} acquiring ${acquired}.`,
      300
    ),
    type: "filing",
    source: "FTC",
    sourceKey: "ftc-hsr",
    severity: "medium",
    entities: filterEntities([acquiring, acquired]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    meta: {
      transactionNumber: item.transaction_number,
    },
  }
}

// ─────────────────────────────────────────────
// SEC EDGAR Filing → MarketIntelItem
// ─────────────────────────────────────────────

export function mapSECFiling(item: any): MarketIntelItem {
  const company = item.company_name || item.entity_name || "Unknown"
  const formType = item.form_type || item.filing_type || ""
  const dateField = item.filed_date || item.filing_date || item.created_at

  return {
    id: `sec-${item.id || item.accession_number}`,
    title: truncate(`SEC ${formType}: ${company}`, 120),
    description: truncate(
      item.description || `${formType} filing submitted by ${company}.`,
      300
    ),
    type: "filing",
    source: "SEC",
    sourceKey: "sec",
    severity: formType.includes("8-K") || formType.includes("10-K") ? "high" : "medium",
    entities: filterEntities([company, formType]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    meta: {
      formType,
      accessionNumber: item.accession_number,
      cik: item.cik,
    },
  }
}

// ─────────────────────────────────────────────
// Facebook Ad → MarketIntelItem
// ─────────────────────────────────────────────

export function mapFacebookAd(item: any): MarketIntelItem {
  const advertiser = item.page_name || item.advertiser_name || "Unknown Advertiser"
  const dateField = item.ad_creation_time || item.created_at

  return {
    id: `fb-ad-${item.id || item.ad_id}`,
    title: truncate(`${advertiser} — Meta Ad`, 120),
    description: truncate(
      item.ad_creative_body || item.ad_creative_link_title || "Meta advertising activity detected.",
      300
    ),
    type: "ad",
    source: "Meta",
    sourceKey: "facebook-ads",
    severity: "low",
    entities: filterEntities([advertiser]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    meta: {
      adId: item.ad_id,
      pageName: item.page_name,
      platform: "facebook",
    },
  }
}

// ─────────────────────────────────────────────
// LinkedIn Ad → MarketIntelItem
// ─────────────────────────────────────────────

export function mapLinkedInAd(item: any): MarketIntelItem {
  const advertiser = item.advertiser_name || item.company_name || "Unknown Advertiser"
  const dateField = item.start_date || item.created_at

  return {
    id: `li-ad-${item.id || item.ad_id}`,
    title: truncate(`${advertiser} — LinkedIn Ad`, 120),
    description: truncate(
      item.ad_text || item.description || "LinkedIn advertising activity detected.",
      300
    ),
    type: "ad",
    source: "LinkedIn",
    sourceKey: "linkedin-ads",
    severity: "low",
    entities: filterEntities([advertiser]),
    date: dateField || new Date().toISOString(),
    timestamp: relativeTime(dateField),
    meta: {
      adId: item.ad_id,
      platform: "linkedin",
    },
  }
}
