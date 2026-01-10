import { render, screen } from '@testing-library/react'
import { WizardStep, WizardStepSection } from './WizardStep'

describe('WizardStep', () => {
  const defaultProps = {
    id: 'test-step',
    title: 'Test Step',
    isActive: true,
    children: <div>Step content</div>,
  }

  describe('Rendering', () => {
    it('rendert title en content wanneer actief', () => {
      render(<WizardStep {...defaultProps} />)

      expect(screen.getByText('Test Step')).toBeInTheDocument()
      expect(screen.getByText('Step content')).toBeInTheDocument()
    })

    it('rendert beschrijving wanneer opgegeven', () => {
      render(
        <WizardStep {...defaultProps} description="This is a test description" />
      )

      expect(screen.getByText('This is a test description')).toBeInTheDocument()
    })

    it('rendert NIETS wanneer niet actief', () => {
      render(<WizardStep {...defaultProps} isActive={false} />)

      expect(screen.queryByText('Test Step')).not.toBeInTheDocument()
      expect(screen.queryByText('Step content')).not.toBeInTheDocument()
    })

    it('past custom className toe', () => {
      const { container } = render(
        <WizardStep {...defaultProps} className="custom-class" />
      )

      const stepElement = container.querySelector('[id^="wizard-step-"]')
      expect(stepElement).toHaveClass('custom-class')
    })
  })

  describe('Accessibility', () => {
    it('heeft correcte ARIA attributes', () => {
      render(<WizardStep {...defaultProps} />)

      const stepElement = screen.getByRole('tabpanel')
      expect(stepElement).toHaveAttribute('aria-labelledby', 'step-test-step-label')
    })

    it('heeft een unieke ID gebaseerd op step id', () => {
      render(<WizardStep {...defaultProps} id="unique-id" />)

      expect(document.getElementById('wizard-step-unique-id')).toBeInTheDocument()
    })

    it('heeft een label ID voor de title', () => {
      render(<WizardStep {...defaultProps} />)

      const title = screen.getByText('Test Step')
      expect(title).toHaveAttribute('id', 'step-test-step-label')
    })
  })

  describe('Animatie', () => {
    it('heeft fade-in animatie class', () => {
      const { container } = render(<WizardStep {...defaultProps} />)

      const stepElement = container.querySelector('[id^="wizard-step-"]')
      expect(stepElement).toHaveClass('animate-fade-in')
    })
  })
})

describe('WizardStepSection', () => {
  describe('Rendering', () => {
    it('rendert children', () => {
      render(
        <WizardStepSection>
          <div>Section content</div>
        </WizardStepSection>
      )

      expect(screen.getByText('Section content')).toBeInTheDocument()
    })

    it('rendert title wanneer opgegeven', () => {
      render(
        <WizardStepSection title="Section Title">
          <div>Content</div>
        </WizardStepSection>
      )

      expect(screen.getByText('Section Title')).toBeInTheDocument()
    })

    it('rendert beschrijving wanneer opgegeven', () => {
      render(
        <WizardStepSection description="Section description">
          <div>Content</div>
        </WizardStepSection>
      )

      expect(screen.getByText('Section description')).toBeInTheDocument()
    })

    it('rendert title en description samen', () => {
      render(
        <WizardStepSection title="Title" description="Description">
          <div>Content</div>
        </WizardStepSection>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('rendert alleen children zonder title/description', () => {
      render(
        <WizardStepSection>
          <div>Just content</div>
        </WizardStepSection>
      )

      expect(screen.getByText('Just content')).toBeInTheDocument()
      
      // Geen h3 heading zonder title
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
    })

    it('past custom className toe', () => {
      const { container } = render(
        <WizardStepSection className="custom-section-class">
          <div>Content</div>
        </WizardStepSection>
      )

      expect(container.firstChild).toHaveClass('custom-section-class')
    })
  })

  describe('Layout', () => {
    it('heeft correcte spacing classes', () => {
      const { container } = render(
        <WizardStepSection>
          <div>Content</div>
        </WizardStepSection>
      )

      expect(container.firstChild).toHaveClass('space-y-4')
    })
  })

  describe('Nested sections', () => {
    it('kan meerdere secties naast elkaar renderen', () => {
      render(
        <div>
          <WizardStepSection title="Section 1">
            <div>Content 1</div>
          </WizardStepSection>
          <WizardStepSection title="Section 2">
            <div>Content 2</div>
          </WizardStepSection>
        </div>
      )

      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Section 2')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('kan genest worden binnen WizardStep', () => {
      render(
        <WizardStep id="test" title="Test Step" isActive={true}>
          <WizardStepSection title="Nested Section">
            <div>Nested content</div>
          </WizardStepSection>
        </WizardStep>
      )

      expect(screen.getByText('Test Step')).toBeInTheDocument()
      expect(screen.getByText('Nested Section')).toBeInTheDocument()
      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })
  })
})
