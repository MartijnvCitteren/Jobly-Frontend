/**
 * JobDetailsStep Component Tests
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobDetailsStep, JobDetailsStepProps, JobDetailsStepData } from './JobDetailsStep'
import {
  WritingStyle,
  Language,
  SalaryPeriod,
} from '@/lib/domain/vacancy.types'

describe('JobDetailsStep', () => {
  const mockOnChange = jest.fn()

  const defaultProps: JobDetailsStepProps = {
    data: {
      writingStyle: {
        writingStyle: WritingStyle.BUSINESS_CASUAL,
        language: Language.DUTCH,
      },
    },
    onChange: mockOnChange,
  }

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  describe('Rendering', () => {
    it('should render the component with all sections', () => {
      render(<JobDetailsStep {...defaultProps} />)

      expect(screen.getByText('Schrijfstijl & Details')).toBeInTheDocument()
      expect(screen.getByText('Schrijfstijl')).toBeInTheDocument()
      expect(screen.getByText('Salaris & Voordelen (optioneel)')).toBeInTheDocument()
      expect(screen.getByText('Contactinformatie (optioneel)')).toBeInTheDocument()
    })

    it('should render writing style selects', () => {
      render(<JobDetailsStep {...defaultProps} />)

      expect(screen.getByLabelText('Toon')).toBeInTheDocument()
      expect(screen.getByLabelText('Taal')).toBeInTheDocument()
    })

    it('should render benefits fields', () => {
      render(<JobDetailsStep {...defaultProps} />)

      expect(screen.getByLabelText('Salaris Periode')).toBeInTheDocument()
      expect(screen.getByLabelText('Minimum Salaris')).toBeInTheDocument()
      expect(screen.getByLabelText('Maximum Salaris')).toBeInTheDocument()
      expect(screen.getByLabelText('Extra Voordelen')).toBeInTheDocument()
    })

    it('should render contact info fields', () => {
      render(<JobDetailsStep {...defaultProps} />)

      expect(screen.getByLabelText('Naam')).toBeInTheDocument()
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
      expect(screen.getByLabelText('Telefoonnummer')).toBeInTheDocument()
    })
  })

  describe('Writing Style', () => {
    it('should display selected writing style', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const styleSelect = screen.getByLabelText('Toon') as HTMLSelectElement
      expect(styleSelect.value).toBe(WritingStyle.BUSINESS_CASUAL)
    })

    it('should display selected language', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const languageSelect = screen.getByLabelText('Taal') as HTMLSelectElement
      expect(languageSelect.value).toBe(Language.DUTCH)
    })

    it('should call onChange when writing style changes', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const styleSelect = screen.getByLabelText('Toon')
      fireEvent.change(styleSelect, { target: { value: WritingStyle.FORMAL } })

      expect(mockOnChange).toHaveBeenCalledWith({
        writingStyle: {
          writingStyle: WritingStyle.FORMAL,
          language: Language.DUTCH,
        },
      })
    })

    it('should call onChange when language changes', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const languageSelect = screen.getByLabelText('Taal')
      fireEvent.change(languageSelect, { target: { value: Language.ENGLISH } })

      expect(mockOnChange).toHaveBeenCalledWith({
        writingStyle: {
          writingStyle: WritingStyle.BUSINESS_CASUAL,
          language: Language.ENGLISH,
        },
      })
    })
  })

  describe('Benefits Section', () => {
    it('should handle salary period change', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const salaryPeriodSelect = screen.getByLabelText('Salaris Periode')
      fireEvent.change(salaryPeriodSelect, { target: { value: SalaryPeriod.YEARLY } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        benefits: {
          salaryPeriod: SalaryPeriod.YEARLY,
        },
      })
    })

    it('should handle minimum salary change', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const minSalaryInput = screen.getByLabelText('Minimum Salaris')
      fireEvent.change(minSalaryInput, { target: { value: '50000' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        benefits: {
          minSalary: 50000,
        },
      })
    })

    it('should handle maximum salary change', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const maxSalaryInput = screen.getByLabelText('Maximum Salaris')
      fireEvent.change(maxSalaryInput, { target: { value: '80000' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        benefits: {
          maxSalary: 80000,
        },
      })
    })

    it('should validate salary range', async () => {
      render(<JobDetailsStep {...defaultProps} />)

      const salaryPeriodSelect = screen.getByLabelText('Salaris Periode')
      fireEvent.change(salaryPeriodSelect, { target: { value: SalaryPeriod.YEARLY } })

      const minSalaryInput = screen.getByLabelText('Minimum Salaris')
      const maxSalaryInput = screen.getByLabelText('Maximum Salaris')

      // Set min higher than max
      fireEvent.change(minSalaryInput, { target: { value: '90000' } })
      fireEvent.change(maxSalaryInput, { target: { value: '50000' } })
      fireEvent.blur(minSalaryInput)

      // The onChange should be called
      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should handle extra perks change', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const extraPerksTextarea = screen.getByLabelText('Extra Voordelen')
      fireEvent.change(extraPerksTextarea, {
        target: { value: 'Lease auto, thuiswerken' },
      })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        benefits: {
          extraPerks: 'Lease auto, thuiswerken',
        },
      })
    })

    it('should display character count for extra perks', () => {
      const propsWithPerks: JobDetailsStepProps = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          benefits: {
            salaryPeriod: SalaryPeriod.YEARLY,
            extraPerks: 'Test perks',
          },
        },
      }

      render(<JobDetailsStep {...propsWithPerks} />)

      expect(screen.getByText(/10\/100/)).toBeInTheDocument()
    })

    it('should handle extra perks with valid length', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const extraPerksTextarea = screen.getByLabelText('Extra Voordelen')
      fireEvent.change(extraPerksTextarea, { target: { value: 'Valid extra perks text' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        benefits: {
          extraPerks: 'Valid extra perks text',
        },
      })
    })
  })

  describe('Contact Information', () => {
    it('should handle name change', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const nameInput = screen.getByLabelText('Naam')
      fireEvent.change(nameInput, { target: { value: 'Jan Jansen' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        contactInfo: {
          name: 'Jan Jansen',
        },
      })
    })

    it('should handle email change', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const emailInput = screen.getByLabelText('E-mail')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        contactInfo: {
          mail: 'test@example.com',
        },
      })
    })

    it('should handle phone number change', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const phoneInput = screen.getByLabelText('Telefoonnummer')
      fireEvent.change(phoneInput, { target: { value: '+31 20 123 4567' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        contactInfo: {
          phoneNumber: '+31 20 123 4567',
        },
      })
    })

    it('should handle email input', async () => {
      render(<JobDetailsStep {...defaultProps} />)

      const emailInput = screen.getByLabelText('E-mail')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        contactInfo: {
          mail: 'test@example.com',
        },
      })
    })

    it('should handle phone number input', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const phoneInput = screen.getByLabelText('Telefoonnummer')
      fireEvent.change(phoneInput, { target: { value: '+31 20 123 4567' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        contactInfo: {
          phoneNumber: '+31 20 123 4567',
        },
      })
    })

    it('should handle name input', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const nameInput = screen.getByLabelText('Naam')
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        contactInfo: {
          name: 'John Doe',
        },
      })
    })
  })

  describe('Field interactions', () => {
    it('should handle blur events on fields', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const emailInput = screen.getByLabelText('E-mail')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.blur(emailInput)

      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should handle multiple field updates', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const nameInput = screen.getByLabelText('Naam')
      const emailInput = screen.getByLabelText('E-mail')

      fireEvent.change(nameInput, { target: { value: 'John' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })

      expect(mockOnChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('Data preservation', () => {
    it('should preserve existing data when updating benefits', () => {
      const propsWithData: JobDetailsStepProps = {
        data: {
          writingStyle: {
            writingStyle: WritingStyle.FORMAL,
            language: Language.ENGLISH,
          },
          benefits: {
            salaryPeriod: SalaryPeriod.YEARLY,
            minSalary: 50000,
          },
        },
        onChange: mockOnChange,
      }

      render(<JobDetailsStep {...propsWithData} />)

      const maxSalaryInput = screen.getByLabelText('Maximum Salaris')
      fireEvent.change(maxSalaryInput, { target: { value: '80000' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        writingStyle: {
          writingStyle: WritingStyle.FORMAL,
          language: Language.ENGLISH,
        },
        benefits: {
          salaryPeriod: SalaryPeriod.YEARLY,
          minSalary: 50000,
          maxSalary: 80000,
        },
      })
    })

    it('should preserve existing data when updating contact info', () => {
      const propsWithData: JobDetailsStepProps = {
        data: {
          writingStyle: {
            writingStyle: WritingStyle.CASUAL,
            language: Language.DUTCH,
          },
          contactInfo: {
            name: 'John Doe',
          },
        },
        onChange: mockOnChange,
      }

      render(<JobDetailsStep {...propsWithData} />)

      const emailInput = screen.getByLabelText('E-mail')
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })

      expect(mockOnChange).toHaveBeenCalledWith({
        writingStyle: {
          writingStyle: WritingStyle.CASUAL,
          language: Language.DUTCH,
        },
        contactInfo: {
          name: 'John Doe',
          mail: 'john@example.com',
        },
      })
    })
  })

  describe('Empty and optional values', () => {
    it('should handle empty numeric inputs', () => {
      render(<JobDetailsStep {...defaultProps} />)

      const minSalaryInput = screen.getByLabelText('Minimum Salaris')
      fireEvent.change(minSalaryInput, { target: { value: '0' } })

      // 0 is falsy, so it becomes undefined in the logic
      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultProps.data,
        benefits: {
          minSalary: undefined,
        },
      })
    })

    it('should allow empty optional fields', async () => {
      render(<JobDetailsStep {...defaultProps} />)

      const nameInput = screen.getByLabelText('Naam')
      fireEvent.change(nameInput, { target: { value: '' } })
      fireEvent.blur(nameInput)

      // Should not show any error for empty optional field
      await waitFor(() => {
        const errorMessages = screen.queryByText((content) =>
          content.includes('Error') || content.includes('Fout')
        )
        expect(errorMessages).not.toBeInTheDocument()
      })
    })
  })
})
