/**
 * Tests voor useLocalStorage hook
 */

import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-key'

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
    const [value] = result.current

    expect(value).toBe('initial')
  })

  it('should return stored value from localStorage', () => {
    // Pre-populate localStorage
    localStorage.setItem(TEST_KEY, JSON.stringify('stored-value'))

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
    const [value] = result.current

    expect(value).toBe('stored-value')
  })

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
    const [, setValue] = result.current

    act(() => {
      setValue('new-value')
    })

    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('new-value'))
    expect(result.current[0]).toBe('new-value')
  })

  it('should work with function updater', () => {
    const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 5))
    const [, setValue] = result.current

    act(() => {
      setValue((prev) => prev + 10)
    })

    expect(result.current[0]).toBe(15)
    expect(localStorage.getItem(TEST_KEY)).toBe('15')
  })

  it('should remove value from localStorage', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify('stored-value'))

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
    const [, , removeValue] = result.current

    act(() => {
      removeValue()
    })

    expect(localStorage.getItem(TEST_KEY)).toBeNull()
    expect(result.current[0]).toBe('initial')
  })

  it('should work with complex objects', () => {
    const complexObject = {
      id: 1,
      name: 'Test',
      nested: { value: 42 },
      array: [1, 2, 3]
    }

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, complexObject))
    const [, setValue] = result.current

    act(() => {
      setValue({ ...complexObject, name: 'Updated' })
    })

    const stored = JSON.parse(localStorage.getItem(TEST_KEY) || '{}')
    expect(stored.name).toBe('Updated')
    expect(stored.nested.value).toBe(42)
    expect(result.current[0].name).toBe('Updated')
  })

  it('should work with arrays', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>(TEST_KEY, []))
    const [, setValue] = result.current

    act(() => {
      setValue([1, 2, 3])
    })

    expect(result.current[0]).toEqual([1, 2, 3])
    expect(JSON.parse(localStorage.getItem(TEST_KEY) || '[]')).toEqual([1, 2, 3])
  })

  it('should handle invalid JSON in localStorage gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

    // Set invalid JSON
    localStorage.setItem(TEST_KEY, 'invalid-json{')

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'))

    // Should fall back to initial value
    expect(result.current[0]).toBe('default')

    consoleSpy.mockRestore()
  })

  it('should handle storage event for cross-tab sync', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent('storage', {
        key: TEST_KEY,
        newValue: JSON.stringify('from-other-tab'),
        oldValue: JSON.stringify('initial')
      })
      window.dispatchEvent(event)
    })

    expect(result.current[0]).toBe('from-other-tab')
  })

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
    const initialValue = result.current[0]

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'different-key',
        newValue: JSON.stringify('other-value')
      })
      window.dispatchEvent(event)
    })

    expect(result.current[0]).toBe(initialValue)
  })

  it('should work with null values', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>(TEST_KEY, null))
    const [, setValue] = result.current

    expect(result.current[0]).toBeNull()

    act(() => {
      setValue('not-null')
    })

    expect(result.current[0]).toBe('not-null')

    act(() => {
      setValue(null)
    })

    expect(result.current[0]).toBeNull()
  })

  it('should work with boolean values', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, false))
    const [, setValue] = result.current

    act(() => {
      setValue(true)
    })

    expect(result.current[0]).toBe(true)
    expect(localStorage.getItem(TEST_KEY)).toBe('true')
  })

  it('should handle storage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    // Mock localStorage.setItem to throw
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('QuotaExceededError')
    })

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
    const [, setValue] = result.current

    // Should not throw
    act(() => {
      setValue('new-value')
    })

    // Restore
    Storage.prototype.setItem = originalSetItem
    consoleSpy.mockRestore()
  })

  it('should maintain separate state for different keys', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'))
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'))

    expect(result1.current[0]).toBe('value1')
    expect(result2.current[0]).toBe('value2')

    act(() => {
      result1.current[1]('updated1')
    })

    expect(result1.current[0]).toBe('updated1')
    expect(result2.current[0]).toBe('value2') // Should not change
  })
})
