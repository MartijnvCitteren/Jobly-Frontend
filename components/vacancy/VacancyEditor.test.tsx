/**
 * VacancyEditor Component Tests
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VacancyEditor } from './VacancyEditor'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'

describe('VacancyEditor', () => {
  const mockVacancy: GeneratedVacancy = {
    summary: 'Test samenvatting',
    companyDescription: 'Test bedrijfsbeschrijving',
    teamDescription: 'Test team',
    dayToDayDescription: 'Test dagelijks',
    jobDescription: 'Test functie',
    jobUniqueSellingPoints: 'Test USPs',
    requirements: 'Test vereisten',
    offer: 'Test aanbod',
    contactInformation: 'Test contact',
  }

  it('renders all editable sections', () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    expect(screen.getByText('📝')).toBeInTheDocument()
    expect(screen.getByText('Samenvatting')).toBeInTheDocument()
    expect(screen.getByText('🏢')).toBeInTheDocument()
    expect(screen.getByText('Over het Bedrijf')).toBeInTheDocument()
  })

  it('renders textareas with vacancy content', () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    const summaryTextarea = screen.getByDisplayValue('Test samenvatting')
    expect(summaryTextarea).toBeInTheDocument()

    const companyTextarea = screen.getByDisplayValue('Test bedrijfsbeschrijving')
    expect(companyTextarea).toBeInTheDocument()
  })

  it('updates content when typing in textarea', () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    const summaryTextarea = screen.getByDisplayValue('Test samenvatting')
    fireEvent.change(summaryTextarea, { target: { value: 'Nieuwe samenvatting' } })

    expect(screen.getByDisplayValue('Nieuwe samenvatting')).toBeInTheDocument()
  })

  it('shows character count for each section', () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    // "Test samenvatting" = 17 characters
    expect(screen.getByText('17 karakters')).toBeInTheDocument()
  })

  it('enables save button when changes are made', async () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    const saveButtons = screen.getAllByText(/Opslaan/)
    // De save button is initieel disabled
    expect(saveButtons[0]).toBeDisabled()

    const summaryTextarea = screen.getByDisplayValue('Test samenvatting')
    fireEvent.change(summaryTextarea, { target: { value: 'Nieuwe tekst' } })

    await waitFor(() => {
      const enabledSaveButtons = screen.getAllByText(/Opslaan/)
      expect(enabledSaveButtons[0]).not.toBeDisabled()
    })
  })

  it('calls onSave with updated vacancy when save is clicked', async () => {
    const onSave = jest.fn()
    render(<VacancyEditor vacancy={mockVacancy} onSave={onSave} />)

    const summaryTextarea = screen.getByDisplayValue('Test samenvatting')
    fireEvent.change(summaryTextarea, { target: { value: 'Nieuwe samenvatting' } })

    const saveButtons = screen.getAllByText(/Opslaan/)
    fireEvent.click(saveButtons[0])

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: 'Nieuwe samenvatting',
        })
      )
    })
  })

  it('shows reset button when changes are made', async () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    expect(screen.queryByText('↺ Reset')).not.toBeInTheDocument()

    const summaryTextarea = screen.getByDisplayValue('Test samenvatting')
    fireEvent.change(summaryTextarea, { target: { value: 'Nieuwe tekst' } })

    await waitFor(() => {
      expect(screen.getByText('↺ Reset')).toBeInTheDocument()
    })
  })

  it('resets changes when reset button is clicked', async () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    const summaryTextarea = screen.getByDisplayValue('Test samenvatting')
    fireEvent.change(summaryTextarea, { target: { value: 'Nieuwe tekst' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwe tekst')).toBeInTheDocument()
    })

    const resetButton = screen.getByText('↺ Reset')
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test samenvatting')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Nieuwe tekst')).not.toBeInTheDocument()
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn()
    render(<VacancyEditor vacancy={mockVacancy} onCancel={onCancel} />)

    const cancelButtons = screen.getAllByText('Annuleren')
    fireEvent.click(cancelButtons[0])

    expect(onCancel).toHaveBeenCalled()
  })

  it('shows unsaved changes indicator when editing', async () => {
    render(<VacancyEditor vacancy={mockVacancy} />)

    expect(screen.queryByText('Niet opgeslagen wijzigingen')).not.toBeInTheDocument()

    const summaryTextarea = screen.getByDisplayValue('Test samenvatting')
    fireEvent.change(summaryTextarea, { target: { value: 'Nieuwe tekst' } })

    await waitFor(() => {
      expect(screen.getByText('Niet opgeslagen wijzigingen')).toBeInTheDocument()
    })
  })

  it('renders empty textareas for undefined sections', () => {
    const partialVacancy: GeneratedVacancy = {
      summary: 'Test',
    }

    render(<VacancyEditor vacancy={partialVacancy} />)

    const textareas = screen.getAllByRole('textbox')
    // Alle 9 secties moeten textareas hebben, ook als ze leeg zijn
    expect(textareas.length).toBe(9)
  })
})
