/**
 * Tests voor error-handler utilities
 */

import {
  ErrorType,
  getErrorType,
  getUserFriendlyMessage,
  normalizeError,
  handleError,
  retryWithBackoff,
  isRecoverableError,
} from './error-handler'
import { ApiError } from '../api/client'

// Mock console.error
const originalConsoleError = console.error
beforeEach(() => {
  console.error = jest.fn()
})

afterEach(() => {
  console.error = originalConsoleError
})

describe('error-handler', () => {
  describe('getErrorType', () => {
    it('should detect NETWORK error', () => {
      const error = new ApiError('Network error', 0)
      expect(getErrorType(error)).toBe(ErrorType.NETWORK)
    })

    it('should detect TIMEOUT error', () => {
      const error = new ApiError('Request timeout', 408)
      expect(getErrorType(error)).toBe(ErrorType.TIMEOUT)
    })

    it('should detect API error', () => {
      const error = new ApiError('Server error', 500)
      expect(getErrorType(error)).toBe(ErrorType.API)
    })

    it('should detect VALIDATION error', () => {
      const error = new Error('Validation failed')
      error.name = 'ValidationError'
      expect(getErrorType(error)).toBe(ErrorType.VALIDATION)
    })

    it('should return UNKNOWN for unrecognized errors', () => {
      const error = new Error('Some error')
      expect(getErrorType(error)).toBe(ErrorType.UNKNOWN)
    })
  })

  describe('getUserFriendlyMessage', () => {
    it('should return friendly message for NETWORK error', () => {
      const error = new ApiError('Network error', 0)
      const message = getUserFriendlyMessage(error)
      expect(message).toContain('netwerkverbinding')
    })

    it('should return friendly message for TIMEOUT error', () => {
      const error = new ApiError('Request timeout', 408)
      const message = getUserFriendlyMessage(error)
      expect(message).toContain('duurde te lang')
    })

    it('should return friendly message for 400 error', () => {
      const error = new ApiError('Bad request', 400)
      const message = getUserFriendlyMessage(error)
      expect(message).toContain('ongeldig')
    })

    it('should return friendly message for 404 error', () => {
      const error = new ApiError('Not found', 404)
      const message = getUserFriendlyMessage(error)
      expect(message).toContain('niet worden gevonden')
    })

    it('should return friendly message for 500 error', () => {
      const error = new ApiError('Internal server error', 500)
      const message = getUserFriendlyMessage(error)
      expect(message).toContain('serverfout')
    })

    it('should use API error message for other status codes', () => {
      const error = new ApiError('Custom error message', 418)
      const message = getUserFriendlyMessage(error)
      expect(message).toBe('Custom error message')
    })

    it('should return friendly message for VALIDATION error', () => {
      const error = new Error('Field is required')
      error.name = 'ValidationError'
      const message = getUserFriendlyMessage(error)
      expect(message).toBe('Field is required')
    })

    it('should return friendly message for UNKNOWN error', () => {
      const error = new Error('Unknown error')
      const message = getUserFriendlyMessage(error)
      expect(message).toContain('onverwachte fout')
    })
  })

  describe('normalizeError', () => {
    it('should normalize ApiError', () => {
      const error = new ApiError('API Error', 500, { details: 'test' })
      const normalized = normalizeError(error)

      expect(normalized.type).toBe(ErrorType.API)
      expect(normalized.message).toBe('API Error')
      expect(normalized.statusCode).toBe(500)
      expect(normalized.originalError).toEqual({ details: 'test' })
      expect(normalized.userMessage).toBeTruthy()
    })

    it('should normalize regular Error', () => {
      const error = new Error('Regular error')
      const normalized = normalizeError(error)

      expect(normalized.type).toBe(ErrorType.UNKNOWN)
      expect(normalized.message).toBe('Regular error')
      expect(normalized.originalError).toBe(error)
      expect(normalized.userMessage).toBeTruthy()
    })

    it('should normalize string error', () => {
      const error = 'String error'
      const normalized = normalizeError(error)

      expect(normalized.type).toBe(ErrorType.UNKNOWN)
      expect(normalized.message).toBe('String error')
      expect(normalized.originalError).toBe(error)
      expect(normalized.userMessage).toBeTruthy()
    })
  })

  describe('handleError', () => {
    it('should handle error with context', () => {
      const error = handleError(new Error('Test error'), 'Test context')

      expect(error).toHaveProperty('type')
      expect(error).toHaveProperty('message')
      expect(error).toHaveProperty('userMessage')
      expect(error).toHaveProperty('timestamp')
    })

    it('should normalize and log errors', () => {
      const error = handleError(new Error('Test error'), 'Test context')

      // Verify console.error was called (door logger)
      expect(console.error).toHaveBeenCalled()
      expect(error.type).toBe(ErrorType.UNKNOWN)
      expect(error.message).toBe('Test error')
    })
  })

  describe('handleError', () => {
    it('should normalize, log and return error', () => {
      const error = new Error('Test error')
      const handled = handleError(error, 'Test context')

      expect(handled.type).toBe(ErrorType.UNKNOWN)
      expect(handled.message).toBe('Test error')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('retryWithBackoff', () => {
    it('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      const result = await retryWithBackoff(fn, 3, 100)

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new ApiError('Server error', 500))
        .mockRejectedValueOnce(new ApiError('Server error', 500))
        .mockResolvedValue('success')

      const result = await retryWithBackoff(fn, 3, 10)

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should not retry on 4xx errors', async () => {
      const fn = jest.fn().mockRejectedValue(new ApiError('Bad request', 400))

      await expect(retryWithBackoff(fn, 3, 10)).rejects.toThrow('Bad request')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should throw after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new ApiError('Server error', 500))

      await expect(retryWithBackoff(fn, 2, 10)).rejects.toThrow('Server error')
      expect(fn).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('isRecoverableError', () => {
    it('should return true for NETWORK error', () => {
      const error = new ApiError('Network error', 0)
      expect(isRecoverableError(error)).toBe(true)
    })

    it('should return true for TIMEOUT error', () => {
      const error = new ApiError('Timeout', 408)
      expect(isRecoverableError(error)).toBe(true)
    })

    it('should return true for 5xx errors', () => {
      const error = new ApiError('Server error', 500)
      expect(isRecoverableError(error)).toBe(true)
    })

    it('should return false for 4xx errors', () => {
      const error = new ApiError('Bad request', 400)
      expect(isRecoverableError(error)).toBe(false)
    })

    it('should return false for validation errors', () => {
      const error = new Error('Validation error')
      error.name = 'ValidationError'
      expect(isRecoverableError(error)).toBe(false)
    })

    it('should return false for unknown errors', () => {
      const error = new Error('Unknown error')
      expect(isRecoverableError(error)).toBe(false)
    })
  })
})
