/**
 * VacancyResult Component Tests
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VacancyResult } from './VacancyResult'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'

describe('VacancyResult', () => {
  const mockVacancy: GeneratedVacancy = {
    summary: 'Test samenvatting',
    companyDescription: 'Test bedrijfsbeschrijving',
    teamDescription: 'Test team beschrijving',
    dayToDayDescription: 'Test dagelijkse werkzaamheden',
    jobDescription: 'Test functieomschrijving',
    jobUniqueSellingPoints: 'Test USPs',
    requirements: 'Test vereisten',
    offer: 'Test aanbod',
    contactInformation: 'Test contact',
  }

  it('renders all vacancy sections when provided', () => {
    render(<VacancyResult vacancy={mockVacancy} />)

    expect(screen.getByText('📝 Samenvatting')).toBeInTheDocument()
    expect(screen.getByText('Test samenvatting')).toBeInTheDocument()
    expect(screen.getByText('🏢 Over het Bedrijf')).toBeInTheDocument()
    expect(screen.getByText('Test bedrijfsbeschrijving')).toBeInTheDocument()
    expect(screen.getByText('👥 Het Team')).toBeInTheDocument()
    expect(screen.getByText('📅 Dagelijkse Werkzaamheden')).toBeInTheDocument()
    expect(screen.getByText('💼 Functieomschrijving')).toBeInTheDocument()
    expect(screen.getByText('✨ Waarom deze Functie?')).toBeInTheDocument()
    expect(screen.getByText('🎯 Vereisten')).toBeInTheDocument()
    expect(screen.getByText('🎁 Wat wij Bieden')).toBeInTheDocument()
    expect(screen.getByText('📞 Contact')).toBeInTheDocument()
  })

  it('does not render sections without content', () => {
    const partialVacancy: GeneratedVacancy = {
      summary: 'Test samenvatting',
      companyDescription: undefined,
      teamDescription: undefined,
    }

    render(<VacancyResult vacancy={partialVacancy} />)

    expect(screen.getByText('📝 Samenvatting')).toBeInTheDocument()
    expect(screen.queryByText('🏢 Over het Bedrijf')).not.toBeInTheDocument()
    expect(screen.queryByText('👥 Het Team')).not.toBeInTheDocument()
  })

  it('renders in read-only mode by default', () => {
    render(<VacancyResult vacancy={mockVacancy} />)

    const textareas = screen.queryAllByRole('textbox')
    expect(textareas).toHaveLength(0)
  })

  it('renders textareas when editable is true', () => {
    const onEdit = jest.fn()
    render(<VacancyResult vacancy={mockVacancy} editable={true} onEdit={onEdit} />)

    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThan(0)
  })

  it('highlights summary section', () => {
    const { container } = render(<VacancyResult vacancy={mockVacancy} />)

    // De summary card heeft een speciale border class
    const summaryCard = container.querySelector('.border-indigo-200')
    expect(summaryCard).toBeInTheDocument()
  })

  it('preserves whitespace in content', () => {
    const vacancyWithWhitespace: GeneratedVacancy = {
      summary: 'Line 1\nLine 2\n\nLine 3',
    }

    const { container } = render(<VacancyResult vacancy={vacancyWithWhitespace} />)

    // Find the p tag with whitespace-pre-wrap class
    const paragraphs = container.querySelectorAll('.whitespace-pre-wrap')
    expect(paragraphs.length).toBeGreaterThan(0)
    expect(paragraphs[0]).toHaveClass('whitespace-pre-wrap')
    expect(paragraphs[0].textContent).toBe('Line 1\nLine 2\n\nLine 3')
  })

  it('renders with animation class', () => {
    const { container } = render(<VacancyResult vacancy={mockVacancy} />)

    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('animate-fade-in')
  })
})
