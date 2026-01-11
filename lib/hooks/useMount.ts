/**
 * Lifecycle Hooks
 *
 * Hooks voor component lifecycle events.
 */

import { useEffect, useRef } from 'react'

/**
 * useMount Hook
 *
 * Voer een effect uit alleen bij mount (componentDidMount equivalent)
 *
 * @param fn - Functie om uit te voeren
 *
 * @example
 * ```typescript
 * useMount(() => {
 *   console.log('Component mounted')
 *   fetchData()
 * })
 * ```
 */
export function useMount(fn: () => void): void {
  useEffect(() => {
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * useUnmount Hook
 *
 * Voer een effect uit alleen bij unmount (componentWillUnmount equivalent)
 *
 * @param fn - Cleanup functie om uit te voeren
 *
 * @example
 * ```typescript
 * useUnmount(() => {
 *   console.log('Component will unmount')
 *   cleanup()
 * })
 * ```
 */
export function useUnmount(fn: () => void): void {
  const fnRef = useRef(fn)

  // Update ref als fn changes
  fnRef.current = fn

  useEffect(() => {
    return () => {
      fnRef.current()
    }
  }, [])
}

/**
 * useUpdateEffect Hook
 *
 * Zoals useEffect maar skip de initial render (componentDidUpdate equivalent)
 *
 * @param effect - Effect functie
 * @param deps - Dependencies
 *
 * @example
 * ```typescript
 * useUpdateEffect(() => {
 *   console.log('Count updated:', count)
 * }, [count])
 * ```
 */
export function useUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
