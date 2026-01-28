'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo, useTransition } from 'react'
import { z } from 'zod'

interface UseFiltersOptions<T extends z.ZodSchema> {
  schema: T
  /** Debounce delay for filter updates (ms) */
  debounce?: number
  /** Scroll to top on filter change */
  scrollToTop?: boolean
}

interface UseFiltersReturn<T> {
  /** Current validated filters */
  filters: T
  /** Raw URL params (unvalidated) */
  rawParams: Record<string, string>
  /** Update one or more filters */
  setFilters: (newFilters: Partial<T>) => void
  /** Reset all filters to defaults */
  resetFilters: () => void
  /** Check if any non-default filters are active */
  hasActiveFilters: boolean
  /** Navigation pending state */
  isPending: boolean
}

export function useFilters<T extends z.ZodSchema>(
  options: UseFiltersOptions<T>
): UseFiltersReturn<z.infer<T>> {
  const { schema, scrollToTop = true } = options
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // Parse raw params from URL
  const rawParams = useMemo(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  // Validate and parse filters
  const filters = useMemo(() => {
    const result = schema.safeParse(rawParams)
    return result.success ? result.data : schema.parse({})
  }, [rawParams, schema])

  // Get default values for comparison
  const defaultFilters = useMemo(() => schema.parse({}), [schema])

  // Check if any non-default filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(rawParams).some(key => {
      const value = rawParams[key]
      const defaultValue = defaultFilters[key]
      return value !== undefined && value !== '' && value !== String(defaultValue)
    })
  }, [rawParams, defaultFilters])

  // Update filters
  const setFilters = useCallback((newFilters: Partial<z.infer<T>>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || value === 'all') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      // Reset to page 1 when filters change (unless page is being set)
      if (!('page' in newFilters) && params.has('page')) {
        params.set('page', '1')
      }

      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: scrollToTop })
    })
  }, [searchParams, router, pathname, scrollToTop])

  // Reset all filters
  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: scrollToTop })
    })
  }, [router, pathname, scrollToTop])

  return {
    filters,
    rawParams,
    setFilters,
    resetFilters,
    hasActiveFilters,
    isPending,
  }
}
