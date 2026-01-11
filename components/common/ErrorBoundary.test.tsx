/**
 * Tests voor ErrorBoundary component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary, useErrorHandler } from './ErrorBoundary'

// Component die een error gooit
function ThrowError({ message }: { message: string }) {
  throw new Error(message)
}

// Component voor useErrorHandler hook testing
function ComponentWithErrorHandler({ shouldError }: { shouldError: boolean }) {
  const handleError = useErrorHandler()

  React.useEffect(() => {
    if (shouldError) {
      handleError(new Error('Error from hook'))
    }
  }, [shouldError, handleError])

  return <div>Component content</div>
}

// Mock console.error om de test output schoon te houden
const originalConsoleError = console.error
beforeEach(() => {
  console.error = jest.fn()
})

afterEach(() => {
  console.error = originalConsoleError
})

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should catch and display error', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Er is iets misgegaan')).toBeInTheDocument()
  })

  it('should show user friendly error message', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    )

    // De default error message voor unknown errors
    expect(
      screen.getByText(/Er is een onverwachte fout opgetreden/)
    ).toBeInTheDocument()
  })

  it('should render custom fallback when provided', () => {
    const customFallback = () => <div>Custom Error UI</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
  })

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.anything()
    )
  })

  it('should reset error boundary when retry button is clicked', async () => {
    const user = userEvent.setup()
    let shouldThrow = true

    function ConditionalError() {
      if (shouldThrow) {
        throw new Error('Conditional error')
      }
      return <div>Success content</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Er is iets misgegaan')).toBeInTheDocument()

    // Nu laten we de component niet meer erroren
    shouldThrow = false

    const retryButton = screen.getByText('Probeer opnieuw')
    await user.click(retryButton)

    expect(screen.getByText('Success content')).toBeInTheDocument()
  })

  it('should show technical details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Technische details/)).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('should not show technical details in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    )

    expect(screen.queryByText(/Technische details/)).not.toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('should provide reset function to custom fallback', () => {
    let resetFn: (() => void) | null = null

    const customFallback = (_error: any, reset: () => void) => {
      resetFn = reset
      return <div>Custom Error UI</div>
    }

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    )

    expect(resetFn).toBeTruthy()
    expect(typeof resetFn).toBe('function')
  })
})

describe('useErrorHandler', () => {
  it('should throw error when set', () => {
    expect(() => {
      render(<ComponentWithErrorHandler shouldError={true} />)
    }).toThrow('Error from hook')
  })

  it('should not throw error when not set', () => {
    expect(() => {
      render(<ComponentWithErrorHandler shouldError={false} />)
    }).not.toThrow()
  })

  it('should work with ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <ComponentWithErrorHandler shouldError={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Er is iets misgegaan')).toBeInTheDocument()
  })
})
