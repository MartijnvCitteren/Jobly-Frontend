/**
 * Tests voor useMount en useUnmount hooks
 */

import { renderHook } from '@testing-library/react'
import { useMount } from './useMount'
import { useEffect } from 'react'

// Create useUnmount for testing
function useUnmount(fn: () => void): void {
  useEffect(() => {
    return fn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

describe('useMount', () => {
  it('should call function on mount', () => {
    const mockFn = jest.fn()

    renderHook(() => useMount(mockFn))

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should not call function on re-render', () => {
    const mockFn = jest.fn()

    const { rerender } = renderHook(() => useMount(mockFn))

    expect(mockFn).toHaveBeenCalledTimes(1)

    // Re-render
    rerender()

    // Should still be called only once
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should work with async functions', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('success')

    renderHook(() => useMount(mockAsyncFn))

    expect(mockAsyncFn).toHaveBeenCalledTimes(1)

    await expect(mockAsyncFn()).resolves.toBe('success')
  })

  it('should handle functions that throw errors', () => {
    const mockErrorFn = jest.fn(() => {
      throw new Error('Test error')
    })

    // Should not throw, but the function will throw internally
    expect(() => {
      renderHook(() => useMount(mockErrorFn))
    }).toThrow('Test error')

    expect(mockErrorFn).toHaveBeenCalledTimes(1)
  })

  it('should call multiple mount hooks in order', () => {
    const calls: number[] = []

    renderHook(() => {
      useMount(() => calls.push(1))
      useMount(() => calls.push(2))
      useMount(() => calls.push(3))
    })

    expect(calls).toEqual([1, 2, 3])
  })
})

describe('useUnmount', () => {
  it('should call cleanup function on unmount', () => {
    const mockCleanup = jest.fn()

    const { unmount } = renderHook(() => useUnmount(mockCleanup))

    // Should not be called yet
    expect(mockCleanup).not.toHaveBeenCalled()

    // Unmount
    unmount()

    // Now should be called
    expect(mockCleanup).toHaveBeenCalledTimes(1)
  })

  it('should not call cleanup on re-render', () => {
    const mockCleanup = jest.fn()

    const { rerender, unmount } = renderHook(() => useUnmount(mockCleanup))

    // Re-render
    rerender()
    rerender()

    // Should not be called yet
    expect(mockCleanup).not.toHaveBeenCalled()

    // Only on unmount
    unmount()
    expect(mockCleanup).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple unmount hooks', () => {
    const cleanup1 = jest.fn()
    const cleanup2 = jest.fn()

    const { unmount } = renderHook(() => {
      useUnmount(cleanup1)
      useUnmount(cleanup2)
    })

    unmount()

    expect(cleanup1).toHaveBeenCalledTimes(1)
    expect(cleanup2).toHaveBeenCalledTimes(1)
  })

  it('should work with event listener cleanup', () => {
    const handler = jest.fn()
    const removeEventListener = jest.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => {
      useMount(() => {
        window.addEventListener('resize', handler)
      })
      useUnmount(() => {
        window.removeEventListener('resize', handler)
      })
    })

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('resize', handler)

    removeEventListener.mockRestore()
  })
})

describe('useMount + useUnmount integration', () => {
  it('should setup and cleanup properly', () => {
    const setup = jest.fn()
    const cleanup = jest.fn()

    const { unmount } = renderHook(() => {
      useMount(setup)
      useUnmount(cleanup)
    })

    // Setup should be called on mount
    expect(setup).toHaveBeenCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()

    // Cleanup should be called on unmount
    unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('should handle subscription pattern', () => {
    const subscribe = jest.fn().mockReturnValue('subscription-id')
    const unsubscribe = jest.fn()

    const { unmount } = renderHook(() => {
      let subscriptionId: string

      useMount(() => {
        subscriptionId = subscribe()
      })

      useUnmount(() => {
        unsubscribe(subscriptionId)
      })
    })

    expect(subscribe).toHaveBeenCalledTimes(1)

    unmount()

    // Note: subscriptionId might be undefined due to closure timing
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
