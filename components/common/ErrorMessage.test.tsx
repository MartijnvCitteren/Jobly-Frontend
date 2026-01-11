/**
 * Tests voor ErrorMessage component
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorMessage, InlineErrorMessage } from './ErrorMessage'
import { ErrorType, AppError } from '@/lib/utils/error-handler'

describe('ErrorMessage', () => {
  const mockError: AppError = {
    type: ErrorType.API,
    message: 'API Error',
    userMessage: 'Er is een fout opgetreden bij het verwerken van je verzoek.',
    timestamp: new Date().toISOString(),
  }

  it('should render error message', () => {
    render(<ErrorMessage error={mockError} />)

    expect(screen.getByText('Er is iets misgegaan')).toBeInTheDocument()
    expect(
      screen.getByText('Er is een fout opgetreden bij het verwerken van je verzoek.')
    ).toBeInTheDocument()
  })

  it('should render custom title', () => {
    render(<ErrorMessage error={mockError} title="Custom Error Title" />)

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument()
  })

  it('should render string error', () => {
    render(<ErrorMessage error="Simple error message" />)

    expect(screen.getByText('Simple error message')).toBeInTheDocument()
  })

  it('should return null when error is null', () => {
    const { container } = render(<ErrorMessage error={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should show retry button when showRetry is true', () => {
    const onRetry = jest.fn()
    render(<ErrorMessage error={mockError} showRetry onRetry={onRetry} />)

    expect(screen.getByText('Probeer opnieuw')).toBeInTheDocument()
  })

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()
    render(<ErrorMessage error={mockError} showRetry onRetry={onRetry} />)

    const retryButton = screen.getByText('Probeer opnieuw')
    await user.click(retryButton)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should not show retry button when showRetry is false', () => {
    render(<ErrorMessage error={mockError} showRetry={false} />)

    expect(screen.queryByText('Probeer opnieuw')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<ErrorMessage error={mockError} className="custom-class" />)

    const errorDiv = container.querySelector('.custom-class')
    expect(errorDiv).toBeInTheDocument()
  })

  it('should use yellow styling for VALIDATION errors', () => {
    const validationError: AppError = {
      type: ErrorType.VALIDATION,
      message: 'Validation failed',
      userMessage: 'De ingevoerde gegevens zijn ongeldig.',
      timestamp: new Date().toISOString(),
    }

    const { container } = render(<ErrorMessage error={validationError} />)
    const errorDiv = container.querySelector('.border-yellow-500')
    expect(errorDiv).toBeInTheDocument()
  })

  it('should use orange styling for NETWORK errors', () => {
    const networkError: AppError = {
      type: ErrorType.NETWORK,
      message: 'Network error',
      userMessage: 'Er is een probleem met de netwerkverbinding.',
      timestamp: new Date().toISOString(),
    }

    const { container } = render(<ErrorMessage error={networkError} />)
    const errorDiv = container.querySelector('.border-orange-500')
    expect(errorDiv).toBeInTheDocument()
  })

  it('should use orange styling for TIMEOUT errors', () => {
    const timeoutError: AppError = {
      type: ErrorType.TIMEOUT,
      message: 'Timeout',
      userMessage: 'De aanvraag duurde te lang.',
      timestamp: new Date().toISOString(),
    }

    const { container } = render(<ErrorMessage error={timeoutError} />)
    const errorDiv = container.querySelector('.border-orange-500')
    expect(errorDiv).toBeInTheDocument()
  })

  it('should use red styling for other errors', () => {
    const { container } = render(<ErrorMessage error={mockError} />)
    const errorDiv = container.querySelector('.border-red-500')
    expect(errorDiv).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<ErrorMessage error={mockError} />)

    const errorDiv = screen.getByRole('alert')
    expect(errorDiv).toHaveAttribute('aria-live', 'polite')
  })
})

describe('InlineErrorMessage', () => {
  it('should render inline error message', () => {
    render(<InlineErrorMessage message="This field is required" />)

    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('should have proper styling', () => {
    const { container } = render(<InlineErrorMessage message="Error" />)
    const errorP = container.querySelector('.text-red-600')
    expect(errorP).toBeInTheDocument()
  })

  it('should have alert role', () => {
    render(<InlineErrorMessage message="Error" />)
    const errorP = screen.getByRole('alert')
    expect(errorP).toBeInTheDocument()
  })
})
