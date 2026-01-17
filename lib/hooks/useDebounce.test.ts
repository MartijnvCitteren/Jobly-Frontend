/**
 * Tests voor useDebounce hook
 */

import { renderHook, act } from '@testing-library/react'
import { useDebounce, useDebounceCallback } from './useDebounce'

jest.useFakeTimers()

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 500 })

    // Value should not update immediately
    expect(result.current).toBe('initial')

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Now value should be updated
    expect(result.current).toBe('updated')
  })

  it('should cancel previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    // Rapid changes
    rerender({ value: 'change1' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'change2' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'final' })

    // Only last value should be set after full delay
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('final')
  })

  it('should work with different types', () => {
    // Test with number
    const { result: numberResult } = renderHook(() => useDebounce(42, 300))
    expect(numberResult.current).toBe(42)

    // Test with object
    const obj = { id: 1, name: 'test' }
    const { result: objectResult } = renderHook(() => useDebounce(obj, 300))
    expect(objectResult.current).toEqual(obj)

    // Test with array
    const arr = [1, 2, 3]
    const { result: arrayResult } = renderHook(() => useDebounce(arr, 300))
    expect(arrayResult.current).toEqual(arr)
  })

  it('should use default delay when not provided', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })

    // Default delay from UI.DEBOUNCE_DELAY (300ms)
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('updated')
  })
})

describe('useDebounceCallback', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should debounce callback execution', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebounceCallback(callback, 500))

    // Call debounced function
    act(() => {
      result.current('arg1')
    })

    // Callback should not be called immediately
    expect(callback).not.toHaveBeenCalled()

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Now callback should be called
    expect(callback).toHaveBeenCalledWith('arg1')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should cancel previous timeout on rapid calls', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebounceCallback(callback, 500))

    // Rapid calls
    act(() => {
      result.current('call1')
      jest.advanceTimersByTime(200)

      result.current('call2')
      jest.advanceTimersByTime(200)

      result.current('call3')
    })

    // Fast-forward full delay
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Only last call should execute
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('call3')
  })

  it('should work with multiple arguments', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebounceCallback(callback, 500))

    act(() => {
      result.current('arg1', 'arg2', 'arg3')
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })

  it('should work with no arguments', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebounceCallback(callback, 500))

    act(() => {
      result.current()
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledWith()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should use default delay when not provided', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebounceCallback(callback))

    act(() => {
      result.current('test')
    })

    // Default delay from UI.DEBOUNCE_DELAY (300ms)
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(callback).toHaveBeenCalledWith('test')
  })

  it('should handle callback that returns a value', () => {
    const callback = jest.fn().mockReturnValue('result')
    const { result } = renderHook(() => useDebounceCallback(callback, 500))

    act(() => {
      result.current('input')
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledWith('input')
    expect(callback).toHaveReturnedWith('result')
  })
})
