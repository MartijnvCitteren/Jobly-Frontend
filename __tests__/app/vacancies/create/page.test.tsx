/**
 * Create Vacancy Page Tests
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import CreateVacancyPage from '@/app/vacancies/create/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock de VacancyWizard component
jest.mock('@/components/vacancy/VacancyWizard', () => ({
  VacancyWizard: ({ children, title }: any) => (
    <div data-testid="vacancy-wizard">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

// Mock de step components
jest.mock('@/components/vacancy/steps', () => ({
  CompanyInfoStep: () => <div data-testid="company-info-step">Company Info Step</div>,
  JobBasicsStep: () => <div data-testid="job-basics-step">Job Basics Step</div>,
  JobRequirementsStep: () => <div data-testid="job-requirements-step">Job Requirements Step</div>,
  JobDetailsStep: () => <div data-testid="job-details-step">Job Details Step</div>,
  ReviewStep: () => <div data-testid="review-step">Review Step</div>,
}))

describe('CreateVacancyPage', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('should render the page with VacancyWizard', () => {
    render(<CreateVacancyPage />)

    expect(screen.getByTestId('vacancy-wizard')).toBeInTheDocument()
    expect(screen.getByText('Maak een Vacature')).toBeInTheDocument()
  })

  it('should render the wizard with steps', () => {
    const { container } = render(<CreateVacancyPage />)

    expect(screen.getByTestId('vacancy-wizard')).toBeInTheDocument()
    expect(container).toBeInTheDocument()
  })

  it('should initialize with empty form data', () => {
    const { container } = render(<CreateVacancyPage />)
    expect(container).toBeInTheDocument()
  })
})
