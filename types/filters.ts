import { z } from 'zod'

// ============================================
// Shared Enums
// ============================================

export const TimeRangeEnum = z.enum(['7d', '30d', '90d', '1y', 'all'])
export type TimeRange = z.infer<typeof TimeRangeEnum>

export const PracticeAreaEnum = z.enum([
  'class-action',
  'mass-torts', 
  'mass-arbitration',
  'all'
])
export type PracticeArea = z.infer<typeof PracticeAreaEnum>

export const PlatformEnum = z.enum([
  'google',
  'meta',
  'linkedin',
  'tiktok',
  'tv',
  'all'
])
export type Platform = z.infer<typeof PlatformEnum>

export const TierEnum = z.enum(['1', '2', '3', 'all'])
export type Tier = z.infer<typeof TierEnum>

export const SeverityEnum = z.enum(['critical', 'warning', 'info', 'all'])
export type Severity = z.infer<typeof SeverityEnum>

export const AlertCategoryEnum = z.enum([
  'FDA', 'SEC', 'FTC', 'CFPB', 'NHTSA', 'CPSC',
  'Ads', 'Filing', 'MDL', 'News', 'all'
])
export type AlertCategory = z.infer<typeof AlertCategoryEnum>

// Competitor view types
export const CompetitorViewEnum = z.enum(['firms', 'ads'])
export type CompetitorView = z.infer<typeof CompetitorViewEnum>

// ============================================
// Page-Specific Filter Schemas
// ============================================

export const CompetitorFiltersSchema = z.object({
  view: CompetitorViewEnum.optional().default('firms'),
  firm: z.string().optional(),
  tier: TierEnum.optional().default('all'),
  practiceArea: PracticeAreaEnum.optional().default('all'),
  platform: PlatformEnum.optional().default('all'),
  timeRange: TimeRangeEnum.optional().default('30d'),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})
export type CompetitorFilters = z.infer<typeof CompetitorFiltersSchema>

export const MarketIntelFiltersSchema = z.object({
  practiceArea: PracticeAreaEnum.optional().default('all'),
  topic: z.string().optional(),
  timeRange: TimeRangeEnum.optional().default('30d'),
  source: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})
export type MarketIntelFilters = z.infer<typeof MarketIntelFiltersSchema>

export const AlertFiltersSchema = z.object({
  category: AlertCategoryEnum.optional().default('all'),
  severity: SeverityEnum.optional().default('all'),
  timeRange: TimeRangeEnum.optional().default('7d'),
  read: z.enum(['true', 'false', 'all']).optional().default('all'),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})
export type AlertFilters = z.infer<typeof AlertFiltersSchema>

export const BoardFiltersSchema = z.object({
  status: z.enum(['new', 'reviewing', 'approved', 'rejected', 'all']).optional().default('all'),
  assignee: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low', 'all']).optional().default('all'),
  practiceArea: PracticeAreaEnum.optional().default('all'),
  search: z.string().optional(),
})
export type BoardFilters = z.infer<typeof BoardFiltersSchema>

// ============================================
// Filter Utilities
// ============================================

export function parseFilters<T extends z.ZodSchema>(
  schema: T,
  params: Record<string, string>
): z.infer<T> {
  const result = schema.safeParse(params)
  if (result.success) {
    return result.data
  }
  // Return defaults on parse failure
  return schema.parse({})
}

export function filtersToParams(
  filters: Record<string, unknown>
): Record<string, string> {
  const params: Record<string, string> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params[key] = String(value)
    }
  })
  
  return params
}
