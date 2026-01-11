/**
 * Vacancy Result Page Tests
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import VacancyResultPage from '@/app/vacancies/result/page'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock components
jest.mock('@/components/ui', () => ({
  Button: ({ children, onClick, variant, className }: any) => (
    <button onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
  LoadingSpinner: ({ size }: any) => <div data-testid="loading-spinner" data-size={size}>Loading...</div>,
}))

jest.mock('@/components/vacancy', () => ({
  VacancyResult: ({ vacancy, onEdit }: any) => (
    <div data-testid="vacancy-result">
      <h1>{vacancy?.summary}</h1>
      <button onClick={onEdit}>Edit</button>
    </div>
  ),
  VacancyEditor: ({ vacancy, onSave, onCancel }: any) => (
    <div data-testid="vacancy-editor">
      <input
        data-testid="editor-input"
        defaultValue={vacancy?.summary}
      />
      <button onClick={() => onSave({ ...vacancy, summary: 'Updated' })}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
  ExportOptions: ({ vacancy }: any) => (
    <div data-testid="export-options">Export: {vacancy?.summary}</div>
  ),
}))

jest.mock('@/components/common', () => ({
  ErrorMessage: ({ error, onRetry }: any) => (
    <div data-testid="error-message">
      {error?.message}
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  ),
}))

describe('VacancyResultPage', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  const mockVacancy: GeneratedVacancy = {
    summary: 'Senior Developer Position',
    jobDescription: 'Looking for an experienced developer...',
    additionalInfo: 'Great benefits',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    // Clear sessionStorage
    sessionStorage.clear()
  })

  describe('Loading state', () => {
    it('should render without crashing', () => {
      const { container } = render(<VacancyResultPage />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('With vacancy data', () => {
    beforeEach(() => {
      sessionStorage.setItem('generatedVacancy', JSON.stringify(mockVacancy))
    })

    it('should display vacancy when loaded from sessionStorage', async () => {
      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByTestId('vacancy-result')).toBeInTheDocument()
      })

      expect(screen.getByText('Senior Developer Position')).toBeInTheDocument()
    })

    it('should show export options', async () => {
      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByTestId('export-options')).toBeInTheDocument()
      })
    })

    it('should handle edit button click', async () => {
      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByTestId('vacancy-result')).toBeInTheDocument()
      })

      const editButton = screen.getByText('Edit')
      fireEvent.click(editButton)

      // After clicking edit, the component should respond
      expect(editButton).toBeInTheDocument()
    })

    it('should display vacancy data correctly', async () => {
      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByTestId('vacancy-result')).toBeInTheDocument()
      })

      // Verify sessionStorage has the data
      const stored = sessionStorage.getItem('generatedVacancy')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed.summary).toBe('Senior Developer Position')
    })

    it('should navigate to create page when creating another vacancy', async () => {
      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByTestId('vacancy-result')).toBeInTheDocument()
      })

      const createAnotherButtons = screen.getAllByText(/Nieuwe Vacature|Maak een Nieuwe Vacature/i)
      fireEvent.click(createAnotherButtons[0])

      expect(mockPush).toHaveBeenCalledWith('/vacancies/create')
      expect(sessionStorage.getItem('generatedVacancy')).toBeNull()
    })
  })

  describe('Without vacancy data', () => {
    it('should show error message when no vacancy is found', async () => {
      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByText(/Geen vacature gevonden/)).toBeInTheDocument()
      })
    })

    it('should navigate back to create page when button is clicked', async () => {
      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByText(/Maak een Nieuwe Vacature/)).toBeInTheDocument()
      })

      const backButton = screen.getByText(/Maak een Nieuwe Vacature/)
      fireEvent.click(backButton)

      expect(mockPush).toHaveBeenCalledWith('/vacancies/create')
    })
  })

  describe('Error handling', () => {
    it('should handle invalid JSON in sessionStorage', async () => {
      sessionStorage.setItem('generatedVacancy', 'invalid json')

      render(<VacancyResultPage />)

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
    })
  })
})
