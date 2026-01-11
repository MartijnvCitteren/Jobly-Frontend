/**
 * API Client
 *
 * Base fetch wrapper met error handling, logging en type safety.
 * Volgt best practices voor security en maintainability.
 */

import { env } from '@/lib/config/env'
import { API_CONFIG, HTTP_STATUS } from '@/lib/config/constants'
import { createLogger } from '@/lib/utils/logger'

const logger = createLogger('ApiClient')

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'

    // Maintain proper stack trace (only for V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}

/**
 * Fetch options met timeout support
 */
export interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Security headers die altijd toegevoegd worden
 */
function getSecurityHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // CSRF protection header (pas aan voor je backend)
    // 'X-CSRF-Token': getCsrfToken(),
  }
}

/**
 * Sanitize URL voor logging (verwijder gevoelige data)
 */
function sanitizeUrlForLogging(url: string): string {
  try {
    const urlObj = new URL(url)
    // Verwijder potentieel gevoelige query parameters
    const sensitiveParams = ['token', 'key', 'secret', 'password', 'api_key']
    sensitiveParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '[REDACTED]')
      }
    })
    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Parse error response body
 */
async function parseErrorResponse(response: Response): Promise<{ message: string; data?: unknown }> {
  try {
    const data = await response.json()
    const message = data.message || data.error || `HTTP Error: ${response.status}`
    return { message, data }
  } catch {
    // Response body niet parseable als JSON
    return { message: `HTTP Error: ${response.status} ${response.statusText}` }
  }
}

/**
 * Base fetch functie met error handling, timeout en logging
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = API_CONFIG.DEFAULT_TIMEOUT, ...fetchOptions } = options

  const url = `${env.API_URL}${endpoint}`
  const sanitizedUrl = sanitizeUrlForLogging(url)
  const method = fetchOptions.method || 'GET'

  // Log request
  logger.apiRequest(method, sanitizedUrl, {
    endpoint,
    hasBody: !!fetchOptions.body,
  })

  // Timeout implementatie via AbortController
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        ...getSecurityHeaders(),
        ...fetchOptions.headers,
      },
    })

    clearTimeout(timeoutId)

    // Log response
    logger.apiResponse(method, sanitizedUrl, response.status)

    // Handle non-OK responses
    if (!response.ok) {
      const { message, data } = await parseErrorResponse(response)
      throw new ApiError(message, response.status, data)
    }

    // Parse JSON response
    const data = await response.json()
    return data as T
  } catch (error) {
    clearTimeout(timeoutId)

    // Handle abort errors (timeout)
    if ((error as Error).name === 'AbortError') {
      const timeoutError = new ApiError(
        'Request timeout',
        HTTP_STATUS.REQUEST_TIMEOUT
      )
      logger.apiError(method, sanitizedUrl, timeoutError)
      throw timeoutError
    }

    // Handle API errors
    if (error instanceof ApiError) {
      logger.apiError(method, sanitizedUrl, {
        status: error.status,
        message: error.message,
        response: error.response,
      })
      throw error
    }

    // Handle network errors
    const networkError = new ApiError(
      'Network error: Unable to connect to the server',
      0,
      error
    )
    logger.apiError(method, sanitizedUrl, networkError)
    throw networkError
  }
}

/**
 * GET request helper
 */
export async function get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: 'GET' })
}

/**
 * POST request helper
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT request helper
 */
export async function put<T>(
  endpoint: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PATCH request helper
 */
export async function patch<T>(
  endpoint: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request helper
 */
export async function del<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: 'DELETE' })
}

/**
 * Health check helper
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await get('/health')
    return true
  } catch {
    return false
  }
}
