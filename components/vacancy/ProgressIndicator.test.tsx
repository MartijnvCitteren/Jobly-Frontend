import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressIndicator } from './ProgressIndicator'

describe('ProgressIndicator', () => {
  const defaultProps = {
    totalSteps: 4,
    currentStep: 1,
  }

  describe('Rendering', () => {
    it('rendert het juiste aantal stap indicatoren', () => {
      render(<ProgressIndicator {...defaultProps} />)

      // Check voor alle stap buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(4)

      // Check voor stap labels
      expect(screen.getByText('Stap 1')).toBeInTheDocument()
      expect(screen.getByText('Stap 2')).toBeInTheDocument()
      expect(screen.getByText('Stap 3')).toBeInTheDocument()
      expect(screen.getByText('Stap 4')).toBeInTheDocument()
    })

    it('toont checkmarks voor voltooide stappen', () => {
      render(<ProgressIndicator {...defaultProps} currentStep={2} />)

      // Stap 0 en 1 zijn voltooid, moeten checkmarks hebben
      const buttons = screen.getAllByRole('button')

      // Check dat eerste stappen een checkmark SVG hebben
      const firstButton = buttons[0]
      const svg = firstButton.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('toont custom step labels wanneer opgegeven', () => {
      const labels = ['Basis Info', 'Details', 'Extra', 'Review']
      render(<ProgressIndicator {...defaultProps} stepLabels={labels} />)

      labels.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument()
      })
    })

    it('toont default labels wanneer geen stepLabels opgegeven', () => {
      render(<ProgressIndicator {...defaultProps} />)

      expect(screen.getByText('Stap 1')).toBeInTheDocument()
      expect(screen.getByText('Stap 2')).toBeInTheDocument()
      expect(screen.getByText('Stap 3')).toBeInTheDocument()
      expect(screen.getByText('Stap 4')).toBeInTheDocument()
    })

    it('toont nummers voor current en upcoming stappen', () => {
      render(<ProgressIndicator {...defaultProps} currentStep={1} />)

      // Stap 0 is completed (checkmark), stap 1 is current (nummer 2), stap 2-3 zijn upcoming (nummers 3-4)
      expect(screen.getByText('2')).toBeInTheDocument() // Current step
      expect(screen.getByText('3')).toBeInTheDocument() // Upcoming
      expect(screen.getByText('4')).toBeInTheDocument() // Upcoming
    })
  })

  describe('Interactie', () => {
    it('roept onStepClick aan wanneer op een voltooide stap wordt geklikt', () => {
      const onStepClick = jest.fn()
      render(
        <ProgressIndicator
          {...defaultProps}
          currentStep={2}
          onStepClick={onStepClick}
        />
      )

      const buttons = screen.getAllByRole('button')

      // Klik op eerste stap (voltooid)
      fireEvent.click(buttons[0])
      expect(onStepClick).toHaveBeenCalledWith(0)

      // Klik op tweede stap (voltooid)
      fireEvent.click(buttons[1])
      expect(onStepClick).toHaveBeenCalledWith(1)
    })

    it('roept onStepClick aan voor huidige stap', () => {
      const onStepClick = jest.fn()
      render(
        <ProgressIndicator
          {...defaultProps}
          currentStep={1}
          onStepClick={onStepClick}
        />
      )

      const buttons = screen.getAllByRole('button')

      // Klik op huidige stap (index 1)
      fireEvent.click(buttons[1])
      expect(onStepClick).toHaveBeenCalledWith(1)
    })

    it('roept GEEN onStepClick aan voor toekomstige stappen wanneer onlyCompletedClickable=true', () => {
      const onStepClick = jest.fn()
      render(
        <ProgressIndicator
          {...defaultProps}
          currentStep={1}
          onStepClick={onStepClick}
          onlyCompletedClickable={true}
        />
      )

      const buttons = screen.getAllByRole('button')

      // Klik op toekomstige stap (index 2)
      fireEvent.click(buttons[2])
      expect(onStepClick).not.toHaveBeenCalled()

      // Klik op toekomstige stap (index 3)
      fireEvent.click(buttons[3])
      expect(onStepClick).not.toHaveBeenCalled()
    })

    it('roept WEL onStepClick aan voor toekomstige stappen wanneer onlyCompletedClickable=false', () => {
      const onStepClick = jest.fn()
      render(
        <ProgressIndicator
          {...defaultProps}
          currentStep={1}
          onStepClick={onStepClick}
          onlyCompletedClickable={false}
        />
      )

      const buttons = screen.getAllByRole('button')

      // Klik op toekomstige stap
      fireEvent.click(buttons[2])
      expect(onStepClick).toHaveBeenCalledWith(2)
    })

    it('doet niets wanneer geen onStepClick callback is opgegeven', () => {
      render(<ProgressIndicator {...defaultProps} currentStep={1} />)

      const buttons = screen.getAllByRole('button')

      // Moet geen error gooien
      expect(() => fireEvent.click(buttons[0])).not.toThrow()
    })
  })

  describe('Visuele states', () => {
    it('geeft completed styling aan voltooide stappen', () => {
      render(<ProgressIndicator {...defaultProps} currentStep={2} />)

      const buttons = screen.getAllByRole('button')

      // Stap 0 en 1 zijn completed
      expect(buttons[0]).toHaveClass('bg-indigo-500')
      expect(buttons[1]).toHaveClass('bg-indigo-500')
    })

    it('geeft current styling aan de huidige stap', () => {
      render(<ProgressIndicator {...defaultProps} currentStep={1} />)

      const buttons = screen.getAllByRole('button')

      // Stap 1 is current
      const currentButton = buttons[1]
      expect(currentButton.className).toContain('ring-4')
      expect(currentButton.className).toContain('scale-110')
    })

    it('geeft upcoming styling aan toekomstige stappen', () => {
      render(<ProgressIndicator {...defaultProps} currentStep={1} />)

      const buttons = screen.getAllByRole('button')

      // Stap 2 en 3 zijn upcoming
      expect(buttons[2]).toHaveClass('border-slate-300')
      expect(buttons[3]).toHaveClass('border-slate-300')
    })
  })

  describe('Accessibility', () => {
    it('heeft correcte ARIA labels', () => {
      const labels = ['Basis', 'Details', 'Extra', 'Review']
      render(
        <ProgressIndicator
          {...defaultProps}
          stepLabels={labels}
          currentStep={1}
        />
      )

      // Controleer ARIA labels
      expect(screen.getByLabelText('Basis - voltooid')).toBeInTheDocument()
      expect(screen.getByLabelText('Details - huidige stap')).toBeInTheDocument()
      expect(screen.getByLabelText('Extra - toekomstige stap')).toBeInTheDocument()
    })

    it('heeft aria-current op huidige stap', () => {
      render(<ProgressIndicator {...defaultProps} currentStep={2} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons[2]).toHaveAttribute('aria-current', 'step')
    })

    it('disabled niet-klikbare buttons', () => {
      const onStepClick = jest.fn()
      render(
        <ProgressIndicator
          {...defaultProps}
          currentStep={1}
          onStepClick={onStepClick}
          onlyCompletedClickable={true}
        />
      )

      const buttons = screen.getAllByRole('button')

      // Toekomstige stappen moeten disabled zijn
      expect(buttons[2]).toBeDisabled()
      expect(buttons[3]).toBeDisabled()

      // Voltooide en huidige niet
      expect(buttons[0]).not.toBeDisabled()
      expect(buttons[1]).not.toBeDisabled()
    })
  })

  describe('Edge cases', () => {
    it('handelt single step wizard af', () => {
      render(<ProgressIndicator totalSteps={1} currentStep={0} />)

      // Single step wordt als current getoond
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(1)
    })

    it('handelt lege stepLabels array af', () => {
      render(<ProgressIndicator {...defaultProps} stepLabels={[]} />)

      // Moet default labels tonen
      expect(screen.getByText('Stap 1')).toBeInTheDocument()
    })

    it('past custom className toe', () => {
      const { container } = render(
        <ProgressIndicator {...defaultProps} className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })
})
