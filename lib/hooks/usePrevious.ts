/**
 * usePrevious Hook
 *
 * Keep track van de vorige waarde van een state/prop.
 */

import { useRef } from 'react'

/**
 * Hook om previous value bij te houden
 *
 * @param value - De waarde waarvan je de vorige versie wilt bijhouden
 * @returns Previous value
 *
 * @example
 * ```typescript
 * const [count, setCount] = useState(0)
 * const prevCount = usePrevious(count)
 *
 * console.log('Previous:', prevCount, 'Current:', count)
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<{ value: T; prev: T | undefined }>({
    value,
    prev: undefined,
  })

  const current = ref.current.value

  if (value !== current) {
    ref.current = {
      value,
      prev: current,
    }
  }

  return ref.current.prev
}
