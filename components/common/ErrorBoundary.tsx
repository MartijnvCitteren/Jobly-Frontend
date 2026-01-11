'use client'

/**
 * ErrorBoundary Component
 *
 * React Error Boundary voor het vangen van rendering errors
 * Let op: Error Boundaries moeten Client Components zijn in Next.js
 */

import React, { Component, ReactNode } from 'react'
import { handleError, AppError } from '@/lib/utils/error-handler'
import { createLogger } from '@/lib/utils/logger'
import { env } from '@/lib/config/env'

const logger = createLogger('ErrorBoundary')

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: AppError, reset: () => void) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: AppError | null
}

/**
 * Error Boundary Component
 *
 * Vangt errors tijdens rendering, in lifecycle methods, en in constructors
 * van het hele component tree eronder.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state zodat de volgende render de fallback UI toont
    return {
      hasError: true,
      error: handleError(error, 'ErrorBoundary'),
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log de error met proper logging service
    logger.error('Caught rendering error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })

    // Call custom error handler indien beschikbaar
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Gebruik custom fallback indien beschikbaar
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary)
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} reset={this.resetErrorBoundary} />
    }

    return this.props.children
  }
}

/**
 * Default fallback UI voor Error Boundary
 */
function DefaultErrorFallback({ error, reset }: { error: AppError; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="mt-4 text-xl font-bold text-gray-900 text-center">
          Er is iets misgegaan
        </h1>

        <p className="mt-2 text-sm text-gray-600 text-center">{error.userMessage}</p>

        {env.IS_DEVELOPMENT && (
          <details className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <summary className="cursor-pointer font-medium text-gray-700">
              Technische details (alleen in development)
            </summary>
            <pre className="mt-2 text-gray-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Probeer opnieuw
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Terug naar home
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook voor functionele componenten om errors te resetten
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}

export default ErrorBoundary
