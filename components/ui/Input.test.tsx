import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input with placeholder', () => {
      render(<Input placeholder="Enter your name" />)

      const input = screen.getByPlaceholderText('Enter your name')
      expect(input).toBeInTheDocument()
    })

    it('should render input with label', () => {
      render(<Input label="Full Name" />)

      const label = screen.getByText('Full Name')
      const input = screen.getByLabelText('Full Name')

      expect(label).toBeInTheDocument()
      expect(input).toBeInTheDocument()
    })

    it('should render input without label', () => {
      render(<Input placeholder="No label" />)

      const input = screen.getByPlaceholderText('No label')
      expect(input).toBeInTheDocument()
    })

    it('should render helper text', () => {
      render(<Input label="Email" helperText="We'll never share your email" />)

      const helperText = screen.getByText("We'll never share your email")
      expect(helperText).toBeInTheDocument()
    })

    it('should render error message', () => {
      render(<Input label="Email" error="Email is required" />)

      const errorMessage = screen.getByText('Email is required')
      expect(errorMessage).toBeInTheDocument()
    })

    it('should not show helper text when error is present', () => {
      render(<Input label="Email" error="Email is required" helperText="Helper text" />)

      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('should render with left icon', () => {
      const icon = <span data-testid="left-icon">🔍</span>
      render(<Input leftIcon={icon} placeholder="Search" />)

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    })

    it('should render with right icon', () => {
      const icon = <span data-testid="right-icon">✓</span>
      render(<Input rightIcon={icon} placeholder="Username" />)

      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })

    it('should render with both icons', () => {
      const leftIcon = <span data-testid="left-icon">🔍</span>
      const rightIcon = <span data-testid="right-icon">✓</span>

      render(<Input leftIcon={leftIcon} rightIcon={rightIcon} placeholder="Search" />)

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input label="Disabled Input" disabled />)

      const input = screen.getByLabelText('Disabled Input')
      expect(input).toBeDisabled()
    })

    it('should have error styles when error is present', () => {
      render(<Input label="Email" error="Invalid email" />)

      const input = screen.getByLabelText('Email')
      expect(input).toHaveClass('border-red-300', 'bg-red-50')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should have normal styles when no error', () => {
      render(<Input label="Email" />)

      const input = screen.getByLabelText('Email')
      expect(input).toHaveClass('border-slate-200')
      expect(input).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Interactions', () => {
    it('should call onChange handler when value changes', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()

      render(<Input label="Name" onChange={handleChange} />)

      const input = screen.getByLabelText('Name')
      await user.type(input, 'John')

      expect(handleChange).toHaveBeenCalled()
    })

    it('should update value when typing', async () => {
      const user = userEvent.setup()

      render(<Input label="Name" />)

      const input = screen.getByLabelText('Name') as HTMLInputElement
      await user.type(input, 'John Doe')

      expect(input.value).toBe('John Doe')
    })

    it('should not allow interaction when disabled', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()

      render(<Input label="Name" onChange={handleChange} disabled />)

      const input = screen.getByLabelText('Name')
      await user.type(input, 'John')

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Input label="Name" className="custom-class" />)

      const input = screen.getByLabelText('Name')
      expect(input).toHaveClass('custom-class')
    })

    it('should forward HTML input attributes', () => {
      render(
        <Input
          label="Email"
          type="email"
          data-testid="email-input"
          autoComplete="email"
          required
        />
      )

      const input = screen.getByTestId('email-input')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('autocomplete', 'email')
      expect(input).toBeRequired()
    })

    it('should support ref forwarding', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input label="Name" ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('Accessibility', () => {
    it('should link label to input via id', () => {
      render(<Input label="Full Name" />)

      const input = screen.getByLabelText('Full Name')
      expect(input).toHaveAttribute('id', 'full-name')
    })

    it('should use custom id when provided', () => {
      render(<Input label="Full Name" id="custom-id" />)

      const input = screen.getByLabelText('Full Name')
      expect(input).toHaveAttribute('id', 'custom-id')
    })

    it('should link error message with aria-describedby', () => {
      render(<Input label="Email" error="Invalid email" />)

      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('aria-describedby', 'email-error')
    })

    it('should link helper text with aria-describedby', () => {
      render(<Input label="Email" helperText="Enter your email" />)

      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('aria-describedby', 'email-helper')
    })
  })
})
