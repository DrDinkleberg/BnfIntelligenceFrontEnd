import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================
// Debounce Hooks for Performance Optimization
// ============================================

/**
 * Debounce a value - returns the debounced value after delay
 * 
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 300)
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     fetchResults(debouncedSearch)
 *   }
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounce a callback function
 * 
 * @example
 * const handleSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query)
 * }, 300)
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}

/**
 * Debounced state - combines useState with debouncing
 * Returns both immediate and debounced values
 * 
 * @example
 * const [search, debouncedSearch, setSearch] = useDebouncedState('', 300)
 * 
 * // search updates immediately (for UI feedback)
 * // debouncedSearch updates after delay (for API calls)
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue)
  const debouncedValue = useDebounce(value, delay)

  return [value, debouncedValue, setValue]
}

/**
 * Throttle a callback - executes at most once per interval
 * Unlike debounce, throttle ensures the function runs at regular intervals
 * 
 * @example
 * const handleScroll = useThrottledCallback(() => {
 *   // Handle scroll event
 * }, 100)
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number = 100
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback)
  const lastCallRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastCall = now - lastCallRef.current

      if (timeSinceLastCall >= interval) {
        lastCallRef.current = now
        callbackRef.current(...args)
      } else {
        // Schedule a trailing call
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now()
          callbackRef.current(...args)
        }, interval - timeSinceLastCall)
      }
    },
    [interval]
  )
}

// ============================================
// Debounced Search Input Component
// ============================================

import { Input } from '@/components/ui/input'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DebouncedSearchInputProps {
  value: string
  onChange: (value: string) => void
  onDebouncedChange?: (value: string) => void
  placeholder?: string
  delay?: number
  isLoading?: boolean
  className?: string
  showClear?: boolean
  autoFocus?: boolean
}

export function DebouncedSearchInput({
  value,
  onChange,
  onDebouncedChange,
  placeholder = 'Search...',
  delay = 300,
  isLoading = false,
  className,
  showClear = true,
  autoFocus = false,
}: DebouncedSearchInputProps) {
  const debouncedValue = useDebounce(value, delay)

  // Call onDebouncedChange when debounced value changes
  useEffect(() => {
    onDebouncedChange?.(debouncedValue)
  }, [debouncedValue, onDebouncedChange])

  const handleClear = () => {
    onChange('')
    onDebouncedChange?.('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        autoFocus={autoFocus}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : showClear && value ? (
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

// ============================================
// Example Usage with React Query
// ============================================

/*
import { useQuery } from '@tanstack/react-query'
import { useDebouncedState, DebouncedSearchInput } from '@/hooks/use-debounce'

function SearchComponent() {
  const [search, debouncedSearch, setSearch] = useDebouncedState('', 300)

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => fetchSearchResults(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  })

  return (
    <div>
      <DebouncedSearchInput
        value={search}
        onChange={setSearch}
        isLoading={isLoading}
        placeholder="Search competitors..."
      />
      
      {data && (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
*/
