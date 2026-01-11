import { render, screen } from '@testing-library/react'
import { LoadingSpinner, FullPageLoading } from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner Component', () => {
  describe('Rendering', () => {
    it('should render spinner', () => {
      render(<LoadingSpinner />)

      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<LoadingSpinner label="Loading data..." />)

      const labels = screen.getAllByText('Loading data...')
      expect(labels.length).toBeGreaterThan(0)
    })

    it('should have accessible sr-only text', () => {
      render(<LoadingSpinner />)

      const srText = screen.getByText('Laden...')
      expect(srText).toHaveClass('sr-only')
    })

    it('should use label for sr-only text when provided', () => {
      render(<LoadingSpinner label="Processing..." />)

      const allTexts = screen.getAllByText('Processing...')
      const srText = allTexts.find((el) => el.classList.contains('sr-only'))
      expect(srText).toHaveClass('sr-only')
    })
  })

  describe('Sizes', () => {
    it('should apply medium size by default', () => {
      render(<LoadingSpinner />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('h-8', 'w-8')
    })

    it('should apply small size', () => {
      render(<LoadingSpinner size="sm" />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('h-4', 'w-4')
    })

    it('should apply large size', () => {
      render(<LoadingSpinner size="lg" />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('h-12', 'w-12')
    })

    it('should apply extra large size', () => {
      render(<LoadingSpinner size="xl" />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('h-16', 'w-16')
    })
  })

  describe('Colors', () => {
    it('should apply primary color by default', () => {
      render(<LoadingSpinner />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('text-indigo-500')
    })

    it('should apply secondary color', () => {
      render(<LoadingSpinner color="secondary" />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('text-slate-400')
    })

    it('should apply white color', () => {
      render(<LoadingSpinner color="white" />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('text-white')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<LoadingSpinner className="custom-class" />)

      const spinner = screen.getByRole('status').querySelector('svg')
      expect(spinner).toHaveClass('custom-class')
    })
  })

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<LoadingSpinner />)

      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })

    it('should have aria-live="polite"', () => {
      render(<LoadingSpinner />)

      const spinner = screen.getByRole('status')
      expect(spinner).toHaveAttribute('aria-live', 'polite')
    })

    it('should have aria-hidden on svg', () => {
      render(<LoadingSpinner />)

      const svg = screen.getByRole('status').querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })
})

describe('FullPageLoading Component', () => {
  describe('Rendering', () => {
    it('should render full page loading overlay', () => {
      render(<FullPageLoading />)

      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })

    it('should render with default message', () => {
      render(<FullPageLoading />)

      const messages = screen.getAllByText('Aan het laden...')
      expect(messages.length).toBeGreaterThan(0)
    })

    it('should render with custom message', () => {
      render(<FullPageLoading message="Verwerken..." />)

      const messages = screen.getAllByText('Verwerken...')
      expect(messages.length).toBeGreaterThan(0)
    })

    it('should have fixed positioning', () => {
      const { container } = render(<FullPageLoading />)

      const overlay = container.firstChild
      expect(overlay).toHaveClass('fixed', 'inset-0')
    })

    it('should have backdrop blur', () => {
      const { container } = render(<FullPageLoading />)

      const overlay = container.firstChild
      expect(overlay).toHaveClass('backdrop-blur-sm')
    })

    it('should have high z-index', () => {
      const { container } = render(<FullPageLoading />)

      const overlay = container.firstChild
      expect(overlay).toHaveClass('z-50')
    })
  })
})
