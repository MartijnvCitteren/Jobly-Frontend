/**
 * Error Handler Utilities
 *
 * Centrale error handling utilities voor de hele applicatie.
 * Volgt best practices voor error handling en user experience.
 */

import { ApiError } from '../api/client'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/config/constants'
import { createLogger } from './logger'

const logger = createLogger('ErrorHandler')

/**
 * Error types die we in de applicatie kunnen tegenkomen
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Gestandaardiseerd error object
 */
export interface AppError {
  type: ErrorType
  message: string
  userMessage: string // Vriendelijke message voor eindgebruiker
  originalError?: unknown
  statusCode?: number
  timestamp: string
}

/**
 * Bepaal het error type op basis van de error
 */
export function getErrorType(error: unknown): ErrorType {
  if (error instanceof ApiError) {
    if (error.status === HTTP_STATUS.REQUEST_TIMEOUT || error.message.includes('timeout')) {
      return ErrorType.TIMEOUT
    }
    if (error.status === 0) {
      return ErrorType.NETWORK
    }
    return ErrorType.API
  }

  if (error instanceof Error && error.name === 'ValidationError') {
    return ErrorType.VALIDATION
  }

  return ErrorType.UNKNOWN
}

/**
 * Krijg een gebruiksvriendelijke error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const type = getErrorType(error)

  switch (type) {
    case ErrorType.NETWORK:
      return ERROR_MESSAGES.NETWORK

    case ErrorType.TIMEOUT:
      return ERROR_MESSAGES.TIMEOUT

    case ErrorType.API:
      if (error instanceof ApiError) {
        if (error.status === HTTP_STATUS.BAD_REQUEST) {
          return ERROR_MESSAGES.BAD_REQUEST
        }
        if (error.status === HTTP_STATUS.NOT_FOUND) {
          return ERROR_MESSAGES.NOT_FOUND
        }
        if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          return ERROR_MESSAGES.SERVER_ERROR
        }
        // Gebruik de error message van de API indien beschikbaar
        return error.message
      }
      return ERROR_MESSAGES.SERVER_ERROR

    case ErrorType.VALIDATION:
      if (error instanceof Error) {
        return error.message
      }
      return ERROR_MESSAGES.VALIDATION

    case ErrorType.UNKNOWN:
    default:
      return ERROR_MESSAGES.UNKNOWN
  }
}

/**
 * Converteer elke error naar een gestandaardiseerd AppError object
 */
export function normalizeError(error: unknown): AppError {
  const type = getErrorType(error)
  const userMessage = getUserFriendlyMessage(error)

  if (error instanceof ApiError) {
    return {
      type,
      message: error.message,
      userMessage,
      originalError: error.response,
      statusCode: error.status,
      timestamp: new Date().toISOString(),
    }
  }

  if (error instanceof Error) {
    return {
      type,
      message: error.message,
      userMessage,
      originalError: error,
      timestamp: new Date().toISOString(),
    }
  }

  return {
    type,
    message: String(error),
    userMessage,
    originalError: error,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Handle error: normaliseer, log en retourneer user-friendly error
 */
export function handleError(error: unknown, context?: string): AppError {
  const normalizedError = normalizeError(error)

  logger.error(`Error in ${context || 'unknown context'}`, {
    type: normalizedError.type,
    message: normalizedError.message,
    statusCode: normalizedError.statusCode,
    timestamp: normalizedError.timestamp,
  })

  return normalizedError
}

/**
 * Retry functie met exponential backoff
 *
 * Gebruikt voor het herhalen van mislukte API calls.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Niet retries voor bepaalde errors
      if (error instanceof ApiError) {
        // Client errors (4xx) niet retrien
        if (error.status >= HTTP_STATUS.BAD_REQUEST && error.status < HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          throw error
        }
      }

      // Als dit de laatste poging was, throw error
      if (attempt === maxRetries) {
        throw error
      }

      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = initialDelay * Math.pow(2, attempt)
      logger.warn(`Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Check of een error "recoverable" is (kan opnieuw geprobeerd worden)
 */
export function isRecoverableError(error: unknown): boolean {
  const type = getErrorType(error)

  // Network en timeout errors zijn usually recoverable
  if (type === ErrorType.NETWORK || type === ErrorType.TIMEOUT) {
    return true
  }

  // API errors met 5xx status codes zijn recoverable
  if (error instanceof ApiError && error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return true
  }

  return false
}

/**
 * Create een user-friendly error message met suggesties
 */
export function createErrorWithSuggestion(error: unknown): { message: string; suggestion: string } {
  const appError = normalizeError(error)
  let suggestion = ''

  switch (appError.type) {
    case ErrorType.NETWORK:
      suggestion = 'Controleer je internetverbinding en probeer het opnieuw.'
      break
    case ErrorType.TIMEOUT:
      suggestion = 'De server reageert langzaam. Wacht even en probeer het opnieuw.'
      break
    case ErrorType.VALIDATION:
      suggestion = 'Controleer de ingevoerde gegevens en probeer het opnieuw.'
      break
    case ErrorType.API:
      if (appError.statusCode && appError.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        suggestion = 'Er is een probleem met de server. Probeer het later opnieuw.'
      } else {
        suggestion = 'Controleer je invoer en probeer het opnieuw.'
      }
      break
    default:
      suggestion = 'Als het probleem aanhoudt, neem contact op met support.'
  }

  return {
    message: appError.userMessage,
    suggestion,
  }
}
