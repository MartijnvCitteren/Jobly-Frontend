/**
 * useLocalStorage Hook
 *
 * Type-safe localStorage hook met SSR support.
 * Automatically syncs state met localStorage.
 */

import { useState, useEffect, useCallback } from 'react'
import { isBrowser } from '@/lib/config/env'
import { createLogger } from '@/lib/utils/logger'

const logger = createLogger('useLocalStorage')

/**
 * Type-safe localStorage hook
 *
 * @param key - Storage key
 * @param initialValue - Initial value indien key niet bestaat
 * @returns [value, setValue, removeValue]
 *
 * @example
 * ```typescript
 * const [user, setUser, removeUser] = useLocalStorage<User>('user', null)
 *
 * // Set user
 * setUser({ id: '1', name: 'John' })
 *
 * // Remove user
 * removeUser()
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State om waarde op te slaan
  // Pass initial state functie voor lazy initialization
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue
    }

    try {
      // Get uit localStorage
      const item = window.localStorage.getItem(key)

      // Parse stored json of return initialValue
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      logger.warn(`Error reading localStorage key "${key}"`, error)
      return initialValue
    }
  })

  /**
   * Return wrapped version van setValue die localStorage bijwerkt
   */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be functie zoals useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to localStorage
        if (isBrowser) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        logger.error(`Error setting localStorage key "${key}"`, error)
      }
    },
    [key, storedValue]
  )

  /**
   * Remove value from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)

      if (isBrowser) {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      logger.error(`Error removing localStorage key "${key}"`, error)
    }
  }, [key, initialValue])

  // Sync tussen tabs
  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T)
        } catch (error) {
          logger.warn(`Error parsing storage event for key "${key}"`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue, removeValue]
}
