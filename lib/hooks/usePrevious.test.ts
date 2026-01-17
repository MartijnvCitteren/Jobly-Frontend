/**
 * Tests voor usePrevious hook
 */

import { renderHook } from '@testing-library/react'
import { usePrevious } from './usePrevious'

describe('usePrevious', () => {
  it('should return undefined on initial render', () => {
    const { result } = renderHook(() => usePrevious(10))

    expect(result.current).toBeUndefined()
  })

  it('should return previous value after update', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 10 } }
    )

    expect(result.current).toBeUndefined()

    // Update value
    rerender({ value: 20 })

    // Should return previous value
    expect(result.current).toBe(10)
  })

  it('should track multiple updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 1 } }
    )

    expect(result.current).toBeUndefined()

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)

    rerender({ value: 4 })
    expect(result.current).toBe(3)
  })

  it('should work with string values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })
    expect(result.current).toBe('first')

    rerender({ value: 'third' })
    expect(result.current).toBe('second')
  })

  it('should work with object values', () => {
    const obj1 = { id: 1, name: 'first' }
    const obj2 = { id: 2, name: 'second' }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } }
    )

    rerender({ value: obj2 })
    expect(result.current).toBe(obj1)
  })

  it('should work with array values', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: arr1 } }
    )

    rerender({ value: arr2 })
    expect(result.current).toBe(arr1)
  })

  it('should not update if value does not change', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'same' } }
    )

    expect(result.current).toBeUndefined()

    // Re-render with same value
    rerender({ value: 'same' })

    // Should still be undefined (not updated)
    expect(result.current).toBeUndefined()

    // Now change value
    rerender({ value: 'different' })

    // Should now have previous value
    expect(result.current).toBe('same')
  })

  it('should work with boolean values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: false } }
    )

    rerender({ value: true })
    expect(result.current).toBe(false)

    rerender({ value: false })
    expect(result.current).toBe(true)
  })

  it('should work with null and undefined', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: null as null | string } }
    )

    expect(result.current).toBeUndefined()

    rerender({ value: 'value' })
    expect(result.current).toBeNull()

    rerender({ value: null })
    expect(result.current).toBe('value')
  })

  it('should work with number 0', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 0 } }
    )

    rerender({ value: 1 })
    expect(result.current).toBe(0)
  })

  it('should work with empty string', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: '' } }
    )

    rerender({ value: 'text' })
    expect(result.current).toBe('')
  })

  it('should handle reference equality correctly', () => {
    const obj = { id: 1 }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj } }
    )

    // Rerender with same object reference
    rerender({ value: obj })

    // Should not update (same reference)
    expect(result.current).toBeUndefined()

    // Rerender with different object (different reference)
    rerender({ value: { id: 1 } })

    // Should update (different reference, even if equal value)
    expect(result.current).toBe(obj)
  })

  it('should work in counter scenario', () => {
    const { result, rerender } = renderHook(
      ({ count }) => {
        const prevCount = usePrevious(count)
        return { count, prevCount }
      },
      { initialProps: { count: 0 } }
    )

    expect(result.current).toEqual({ count: 0, prevCount: undefined })

    rerender({ count: 1 })
    expect(result.current).toEqual({ count: 1, prevCount: 0 })

    rerender({ count: 2 })
    expect(result.current).toEqual({ count: 2, prevCount: 1 })
  })

  it('should work with form state scenario', () => {
    const { result, rerender } = renderHook(
      ({ formData }) => usePrevious(formData),
      { initialProps: { formData: { name: '', email: '' } } }
    )

    const formData2 = { name: 'John', email: '' }
    rerender({ formData: formData2 })

    expect(result.current).toEqual({ name: '', email: '' })

    const formData3 = { name: 'John', email: 'john@example.com' }
    rerender({ formData: formData3 })

    expect(result.current).toEqual(formData2)
  })
})
