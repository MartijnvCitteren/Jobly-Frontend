import { render, screen, fireEvent } from '@testing-library/react'
import { WizardNavigation, WizardNavigationSimple } from './WizardNavigation'

describe('WizardNavigation', () => {
  const defaultProps = {
    hasPreviousStep: false,
    hasNextStep: true,
    isFirstStep: true,
    isLastStep: false,
    isCurrentStepValid: true,
    onPrevious: jest.fn(),
    onNext: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('toont Next button op eerste stap', () => {
      render(<WizardNavigation {...defaultProps} />)

      expect(screen.getByText('Volgende')).toBeInTheDocument()
      expect(screen.queryByText('Vorige')).not.toBeInTheDocument()
    })

    it('toont beide buttons op middenstap', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasPreviousStep={true}
          isFirstStep={false}
        />
      )

      expect(screen.getByText('Volgende')).toBeInTheDocument()
      expect(screen.getByText('Vorige')).toBeInTheDocument()
    })

    it('toont Submit button op laatste stap', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasNextStep={false}
          isLastStep={true}
          hasPreviousStep={true}
          isFirstStep={false}
        />
      )

      expect(screen.getByText('Vacature Genereren')).toBeInTheDocument()
      expect(screen.getByText('Vorige')).toBeInTheDocument()
    })

    it('toont custom button teksten', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasPreviousStep={true}
          nextButtonText="Ga door"
          previousButtonText="Terug"
          submitButtonText="Verzenden"
        />
      )

      expect(screen.getByText('Ga door')).toBeInTheDocument()
      expect(screen.getByText('Terug')).toBeInTheDocument()
    })
  })

  describe('Interactie', () => {
    it('roept onNext aan wanneer Next wordt geklikt', () => {
      const onNext = jest.fn()
      render(<WizardNavigation {...defaultProps} onNext={onNext} />)

      fireEvent.click(screen.getByText('Volgende'))
      expect(onNext).toHaveBeenCalledTimes(1)
    })

    it('roept onPrevious aan wanneer Previous wordt geklikt', () => {
      const onPrevious = jest.fn()
      render(
        <WizardNavigation
          {...defaultProps}
          hasPreviousStep={true}
          isFirstStep={false}
          onPrevious={onPrevious}
        />
      )

      fireEvent.click(screen.getByText('Vorige'))
      expect(onPrevious).toHaveBeenCalledTimes(1)
    })

    it('roept onSubmit aan op laatste stap wanneer Next wordt geklikt', () => {
      const onSubmit = jest.fn()
      render(
        <WizardNavigation
          {...defaultProps}
          hasNextStep={false}
          isLastStep={true}
          onSubmit={onSubmit}
        />
      )

      fireEvent.click(screen.getByText('Vacature Genereren'))
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it('roept onNext NIET aan op laatste stap als onSubmit is opgegeven', () => {
      const onNext = jest.fn()
      const onSubmit = jest.fn()
      render(
        <WizardNavigation
          {...defaultProps}
          hasNextStep={false}
          isLastStep={true}
          onNext={onNext}
          onSubmit={onSubmit}
        />
      )

      fireEvent.click(screen.getByText('Vacature Genereren'))
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onNext).not.toHaveBeenCalled()
    })
  })

  describe('Disabled states', () => {
    it('disabled Next button wanneer current step niet valide is', () => {
      render(
        <WizardNavigation {...defaultProps} isCurrentStepValid={false} />
      )

      const nextButton = screen.getByText('Volgende').closest('button')
      expect(nextButton).toBeDisabled()
    })

    it('disabled beide buttons tijdens loading', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasPreviousStep={true}
          isLoading={true}
        />
      )

      const prevButton = screen.getByText('Vorige').closest('button')
      expect(prevButton).toBeDisabled()
      
      // Loading button toont "Loading..."
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('toont loading state op Next button', () => {
      render(<WizardNavigation {...defaultProps} isLoading={true} />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('heeft correcte aria-labels', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasPreviousStep={true}
          isFirstStep={false}
        />
      )

      expect(screen.getByLabelText('Ga naar vorige stap')).toBeInTheDocument()
      expect(screen.getByLabelText('Ga naar volgende stap')).toBeInTheDocument()
    })

    it('heeft correct aria-label voor submit button', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasNextStep={false}
          isLastStep={true}
        />
      )

      expect(screen.getByLabelText('Dien formulier in')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('toont helper text op niet-laatste stap', () => {
      render(<WizardNavigation {...defaultProps} />)

      expect(screen.getByText('Ga verder')).toBeInTheDocument()
    })

    it('toont "Laatste stap" text op laatste stap', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasNextStep={false}
          isLastStep={true}
        />
      )

      expect(screen.getByText('Laatste stap')).toBeInTheDocument()
    })

    it('past custom className toe', () => {
      const { container } = render(
        <WizardNavigation {...defaultProps} className="custom-nav-class" />
      )

      expect(container.firstChild).toHaveClass('custom-nav-class')
    })
  })

  describe('Icons', () => {
    it('toont pijl icons in buttons', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasPreviousStep={true}
          isFirstStep={false}
        />
      )

      // Check of SVG icons aanwezig zijn
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        const svg = button.querySelector('svg')
        expect(svg).toBeTruthy()
      })
    })

    it('toont checkmark icon op submit button', () => {
      render(
        <WizardNavigation
          {...defaultProps}
          hasNextStep={false}
          isLastStep={true}
        />
      )

      const submitButton = screen.getByText('Vacature Genereren').closest('button')
      const svg = submitButton?.querySelector('svg')
      expect(svg).toBeTruthy()
    })
  })
})

describe('WizardNavigationSimple', () => {
  const defaultProps = {
    onPrevious: jest.fn(),
    onNext: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('toont beide buttons standaard', () => {
      render(<WizardNavigationSimple {...defaultProps} />)

      expect(screen.getByText('Vorige')).toBeInTheDocument()
      expect(screen.getByText('Volgende')).toBeInTheDocument()
    })

    it('verbergt Previous button wanneer showPrevious=false', () => {
      render(<WizardNavigationSimple {...defaultProps} showPrevious={false} />)

      expect(screen.queryByText('Vorige')).not.toBeInTheDocument()
      expect(screen.getByText('Volgende')).toBeInTheDocument()
    })

    it('verbergt Next button wanneer showNext=false', () => {
      render(<WizardNavigationSimple {...defaultProps} showNext={false} />)

      expect(screen.getByText('Vorige')).toBeInTheDocument()
      expect(screen.queryByText('Volgende')).not.toBeInTheDocument()
    })

    it('verbergt beide buttons', () => {
      render(
        <WizardNavigationSimple
          {...defaultProps}
          showPrevious={false}
          showNext={false}
        />
      )

      expect(screen.queryByText('Vorige')).not.toBeInTheDocument()
      expect(screen.queryByText('Volgende')).not.toBeInTheDocument()
    })
  })

  describe('Interactie', () => {
    it('roept onPrevious aan', () => {
      const onPrevious = jest.fn()
      render(<WizardNavigationSimple {...defaultProps} onPrevious={onPrevious} />)

      fireEvent.click(screen.getByText('Vorige'))
      expect(onPrevious).toHaveBeenCalledTimes(1)
    })

    it('roept onNext aan', () => {
      const onNext = jest.fn()
      render(<WizardNavigationSimple {...defaultProps} onNext={onNext} />)

      fireEvent.click(screen.getByText('Volgende'))
      expect(onNext).toHaveBeenCalledTimes(1)
    })
  })

  describe('Disabled states', () => {
    it('disabled Next button wanneer nextDisabled=true', () => {
      render(<WizardNavigationSimple {...defaultProps} nextDisabled={true} />)

      expect(screen.getByText('Volgende')).toBeDisabled()
    })

    it('enabled Next button standaard', () => {
      render(<WizardNavigationSimple {...defaultProps} />)

      expect(screen.getByText('Volgende')).not.toBeDisabled()
    })
  })

  describe('Layout', () => {
    it('past custom className toe', () => {
      const { container } = render(
        <WizardNavigationSimple {...defaultProps} className="simple-nav" />
      )

      expect(container.firstChild).toHaveClass('simple-nav')
    })
  })
})
