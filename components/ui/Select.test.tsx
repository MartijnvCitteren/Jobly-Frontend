import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from '@/components/ui/Select'

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  describe('Rendering', () => {
    it('should render select with options', () => {
      render(<Select options={mockOptions} />)

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()

      // Check placeholder
      expect(screen.getByText('Selecteer een optie...')).toBeInTheDocument()

      // Check options
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Select label="Country" options={mockOptions} />)

      const label = screen.getByText('Country')
      const select = screen.getByLabelText('Country')

      expect(label).toBeInTheDocument()
      expect(select).toBeInTheDocument()
    })

    it('should render with custom placeholder', () => {
      render(<Select options={mockOptions} placeholder="Choose an option" />)

      expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    it('should render helper text', () => {
      render(<Select label="Country" options={mockOptions} helperText="Select your country" />)

      expect(screen.getByText('Select your country')).toBeInTheDocument()
    })

    it('should render error message', () => {
      render(<Select label="Country" options={mockOptions} error="Country is required" />)

      expect(screen.getByText('Country is required')).toBeInTheDocument()
    })

    it('should not show helper text when error is present', () => {
      render(
        <Select
          label="Country"
          options={mockOptions}
          error="Country is required"
          helperText="Helper text"
        />
      )

      expect(screen.getByText('Country is required')).toBeInTheDocument()
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    })
  })

  describe('Options', () => {
    it('should render disabled options', () => {
      const optionsWithDisabled = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2 (Disabled)', disabled: true },
        { value: 'option3', label: 'Option 3' },
      ]

      render(<Select options={optionsWithDisabled} />)

      const option2 = screen.getByRole('option', { name: 'Option 2 (Disabled)' })
      expect(option2).toBeDisabled()
    })

    it('should render all options with unique keys', () => {
      render(<Select options={mockOptions} />)

      const options = screen.getAllByRole('option')
      // +1 for placeholder option
      expect(options).toHaveLength(mockOptions.length + 1)
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Select label="Country" options={mockOptions} disabled />)

      const select = screen.getByLabelText('Country')
      expect(select).toBeDisabled()
    })

    it('should have error styles when error is present', () => {
      render(<Select label="Country" options={mockOptions} error="Invalid selection" />)

      const select = screen.getByLabelText('Country')
      expect(select).toHaveClass('border-red-300', 'bg-red-50')
      expect(select).toHaveAttribute('aria-invalid', 'true')
    })

    it('should have normal styles when no error', () => {
      render(<Select label="Country" options={mockOptions} />)

      const select = screen.getByLabelText('Country')
      expect(select).toHaveClass('border-slate-200')
      expect(select).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Interactions', () => {
    it('should call onChange handler when selection changes', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()

      render(<Select label="Country" options={mockOptions} onChange={handleChange} />)

      const select = screen.getByLabelText('Country')
      await user.selectOptions(select, 'option2')

      expect(handleChange).toHaveBeenCalled()
    })

    it('should update selected value when option is chosen', async () => {
      const user = userEvent.setup()

      render(<Select label="Country" options={mockOptions} />)

      const select = screen.getByLabelText('Country') as HTMLSelectElement
      await user.selectOptions(select, 'option2')

      expect(select.value).toBe('option2')
    })

    it('should not allow interaction when disabled', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()

      render(<Select label="Country" options={mockOptions} onChange={handleChange} disabled />)

      const select = screen.getByLabelText('Country')
      await user.selectOptions(select, 'option2')

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Select label="Country" options={mockOptions} className="custom-class" />)

      const select = screen.getByLabelText('Country')
      expect(select).toHaveClass('custom-class')
    })

    it('should forward HTML select attributes', () => {
      render(
        <Select
          label="Country"
          options={mockOptions}
          data-testid="country-select"
          required
          name="country"
        />
      )

      const select = screen.getByTestId('country-select')
      expect(select).toBeRequired()
      expect(select).toHaveAttribute('name', 'country')
    })

    it('should support ref forwarding', () => {
      const ref = React.createRef<HTMLSelectElement>()
      render(<Select label="Country" options={mockOptions} ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLSelectElement)
    })
  })

  describe('Accessibility', () => {
    it('should link label to select via id', () => {
      render(<Select label="Country" options={mockOptions} />)

      const select = screen.getByLabelText('Country')
      expect(select).toHaveAttribute('id', 'country')
    })

    it('should use custom id when provided', () => {
      render(<Select label="Country" options={mockOptions} id="custom-id" />)

      const select = screen.getByLabelText('Country')
      expect(select).toHaveAttribute('id', 'custom-id')
    })

    it('should link error message with aria-describedby', () => {
      render(<Select label="Country" options={mockOptions} error="Country is required" />)

      const select = screen.getByLabelText('Country')
      expect(select).toHaveAttribute('aria-describedby', 'country-error')
    })

    it('should link helper text with aria-describedby', () => {
      render(<Select label="Country" options={mockOptions} helperText="Select your country" />)

      const select = screen.getByLabelText('Country')
      expect(select).toHaveAttribute('aria-describedby', 'country-helper')
    })

    it('should render chevron icon', () => {
      render(<Select label="Country" options={mockOptions} />)

      const chevron = screen.getByLabelText('Country').parentElement?.querySelector('svg')
      expect(chevron).toBeInTheDocument()
    })
  })
})
