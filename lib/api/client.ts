/**
 * API Client
 *
 * Base fetch wrapper met error handling en type safety
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api/v1'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Base fetch functie met error handling
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options

  const url = `${API_BASE_URL}${endpoint}`

  // Timeout implementatie
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    clearTimeout(timeoutId)

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`
      let errorData

      try {
        errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        // Response body niet parseable als JSON
      }

      throw new ApiError(errorMessage, response.status, errorData)
    }

    // Parse JSON response
    const data = await response.json()
    return data as T
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) {
      throw error
    }

    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Request timeout', 408)
    }

    throw new ApiError('Network error: Unable to connect to the server', 0, error)
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
export async function put<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request helper
 */
export async function del<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: 'DELETE' })
}
