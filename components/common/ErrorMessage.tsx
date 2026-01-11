/**
 * ErrorMessage Component
 *
 * Herbruikbaar component voor het tonen van error messages
 */

import { AppError, ErrorType } from '@/lib/utils/error-handler'

export interface ErrorMessageProps {
  error: AppError | string | null
  title?: string
  showRetry?: boolean
  onRetry?: () => void
  className?: string
}

/**
 * ErrorMessage component voor het tonen van errors
 */
export function ErrorMessage({
  error,
  title = 'Er is iets misgegaan',
  showRetry = false,
  onRetry,
  className = '',
}: ErrorMessageProps) {
  if (!error) {
    return null
  }

  const errorMessage = typeof error === 'string' ? error : error.userMessage
  const errorType = typeof error === 'string' ? ErrorType.UNKNOWN : error.type

  // Bepaal de juiste kleur/stijl op basis van error type
  const getColorClasses = () => {
    switch (errorType) {
      case ErrorType.VALIDATION:
        return 'border-yellow-500 bg-yellow-50 text-yellow-800'
      case ErrorType.NETWORK:
      case ErrorType.TIMEOUT:
        return 'border-orange-500 bg-orange-50 text-orange-800'
      default:
        return 'border-red-500 bg-red-50 text-red-800'
    }
  }

  // Bepaal het juiste icoon
  const getIcon = () => {
    switch (errorType) {
      case ErrorType.VALIDATION:
        return (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case ErrorType.NETWORK:
      case ErrorType.TIMEOUT:
        return (
          <svg
            className="w-5 h-5 text-orange-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
          </svg>
        )
      default:
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg ${getColorClasses()} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-1 text-sm">{errorMessage}</p>
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              type="button"
            >
              Probeer opnieuw
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Inline error message (smaller variant)
 */
export function InlineErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-600 mt-1" role="alert">
      {message}
    </p>
  )
}

export default ErrorMessage
