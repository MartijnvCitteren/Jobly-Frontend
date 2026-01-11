/**
 * useDebounce Hook
 *
 * Debounce een waarde om te voorkomen dat functies te vaak worden aangeroepen.
 * Nuttig voor search inputs, API calls, etc.
 */

import { useState, useEffect } from 'react'
import { UI } from '@/lib/config/constants'

/**
 * Debounce een waarde
 *
 * @param value - De waarde die gedebounced moet worden
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced waarde
 *
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchAPI(debouncedSearchTerm)
 *   }
 * }, [debouncedSearchTerm])
 * ```
 */
export function useDebounce<T>(value: T, delay: number = UI.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set timeout om de waarde te updaten na delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup functie - cancel timeout als value verandert
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * useDebounceCallback Hook
 *
 * Debounce een callback functie
 *
 * @param callback - De functie die gedebounced moet worden
 * @param delay - Delay in milliseconds
 * @returns Debounced callback
 *
 * @example
 * ```typescript
 * const debouncedSearch = useDebounceCallback((term: string) => {
 *   searchAPI(term)
 * }, 500)
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebounceCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = UI.DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  return (...args: Parameters<T>) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }
}
