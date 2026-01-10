import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VacancyWizard, VacancyWizardContainer } from './VacancyWizard'
import { WizardStep } from '@/lib/hooks/useFormWizard'

interface TestFormData {
  name: string
  email: string
  preferences: string[]
}

describe('VacancyWizard', () => {
  // Store form data in outer scope so validate functions can access it
  let testFormData: TestFormData = {
    name: '',
    email: '',
    preferences: [],
  }

  const getMockSteps = (): WizardStep[] => [
    {
      id: 'personal',
      label: 'Persoonlijke Info',
      validate: () => testFormData.name.length > 0,
    },
    {
      id: 'contact',
      label: 'Contact Info',
      validate: () => testFormData.email.length > 0,
    },
    {
      id: 'preferences',
      label: 'Voorkeuren',
    },
  ]

  const mockInitialData: TestFormData = {
    name: '',
    email: '',
    preferences: [],
  }

  beforeEach(() => {
    // Reset test data before each test
    testFormData = { ...mockInitialData }
  })

  const mockRenderStep = jest.fn(({ stepId, formData, updateFormData }) => {
    // Update test data when form data changes
    testFormData = formData

    switch (stepId) {
      case 'personal':
        return (
          <div>
            <h3>Personal Info Step</h3>
            <input
              data-testid="name-input"
              value={formData.name}
              onChange={(e) => {
                const newData = { name: e.target.value }
                testFormData = { ...formData, ...newData }
                updateFormData(newData)
              }}
            />
          </div>
        )
      case 'contact':
        return (
          <div>
            <h3>Contact Info Step</h3>
            <input
              data-testid="email-input"
              value={formData.email}
              onChange={(e) => {
                const newData = { email: e.target.value }
                testFormData = { ...formData, ...newData }
                updateFormData(newData)
              }}
            />
          </div>
        )
      case 'preferences':
        return (
          <div>
            <h3>Preferences Step</h3>
            <p>Review your information</p>
          </div>
        )
      default:
        return <div>Unknown step</div>
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('rendert wizard met titel en beschrijving', () => {
      const onSubmit = jest.fn()
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
          title="Test Wizard"
          description="This is a test wizard"
        />
      )

      expect(screen.getByText('Test Wizard')).toBeInTheDocument()
      expect(screen.getByText('This is a test wizard')).toBeInTheDocument()
    })

    it('rendert zonder titel en beschrijving', () => {
      const onSubmit = jest.fn()
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Moet nog steeds de eerste stap tonen
      expect(screen.getByText('Personal Info Step')).toBeInTheDocument()
    })

    it('rendert progress indicator met correcte stappen', () => {
      const onSubmit = jest.fn()
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Check of step labels zichtbaar zijn
      expect(screen.getByText('Persoonlijke Info')).toBeInTheDocument()
      expect(screen.getByText('Contact Info')).toBeInTheDocument()
      expect(screen.getByText('Voorkeuren')).toBeInTheDocument()
    })

    it('rendert de eerste stap initieel', () => {
      const onSubmit = jest.fn()
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      expect(screen.getByText('Personal Info Step')).toBeInTheDocument()
      expect(mockRenderStep).toHaveBeenCalledWith(
        expect.objectContaining({
          stepId: 'personal',
          stepIndex: 0,
        })
      )
    })

    it('toont voortgang tekst', () => {
      const onSubmit = jest.fn()
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      expect(screen.getByText(/Stap 1 van 3/)).toBeInTheDocument()
      expect(screen.getByText(/33% voltooid/)).toBeInTheDocument()
    })
  })

  describe('Navigatie', () => {
    it('navigeert naar volgende stap', async () => {
      const onSubmit = jest.fn()
      const initialData = { ...mockInitialData, name: 'John' }
      testFormData = initialData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={initialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Start bij stap 1
      expect(screen.getByText('Personal Info Step')).toBeInTheDocument()

      // Klik Next (validatie is OK omdat name is ingevuld)
      const nextButton = screen.getByText('Volgende')
      fireEvent.click(nextButton)

      // Moet nu stap 2 zijn
      await waitFor(() => {
        expect(screen.getByText('Contact Info Step')).toBeInTheDocument()
      })
    })

    it('navigeert terug naar vorige stap', async () => {
      const onSubmit = jest.fn()
      const initialData = { ...mockInitialData, name: 'John', email: 'john@test.com' }
      testFormData = initialData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={initialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Ga naar stap 2
      fireEvent.click(screen.getByText('Volgende'))
      await waitFor(() => {
        expect(screen.getByText('Contact Info Step')).toBeInTheDocument()
      })

      // Ga terug
      fireEvent.click(screen.getByText('Vorige'))
      await waitFor(() => {
        expect(screen.getByText('Personal Info Step')).toBeInTheDocument()
      })
    })

    it('disabled Next button wanneer validatie faalt', () => {
      const onSubmit = jest.fn()
      testFormData = mockInitialData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData} // name is leeg
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      const nextButton = screen.getByText('Volgende').closest('button')
      expect(nextButton).toBeDisabled()
    })

    it('enabled Next button wanneer validatie slaagt', () => {
      const onSubmit = jest.fn()
      const initialData = { ...mockInitialData, name: 'John' }
      testFormData = initialData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={initialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      const nextButton = screen.getByText('Volgende').closest('button')
      expect(nextButton).not.toBeDisabled()
    })
  })

  describe('Form data updates', () => {
    it('update form data via input', async () => {
      const onSubmit = jest.fn()
      testFormData = mockInitialData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      const nameInput = screen.getByTestId('name-input') as HTMLInputElement
      
      // Type in input
      fireEvent.change(nameInput, { target: { value: 'Jane' } })

      // Check of value is geupdate
      await waitFor(() => {
        expect(nameInput.value).toBe('Jane')
      })
    })

    it('behoudt form data bij navigatie', async () => {
      const onSubmit = jest.fn()
      testFormData = mockInitialData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Vul naam in
      const nameInput = screen.getByTestId('name-input') as HTMLInputElement
      fireEvent.change(nameInput, { target: { value: 'Jane' } })

      // Ga naar volgende stap
      await waitFor(() => {
        const nextButton = screen.getByText('Volgende')
        expect(nextButton).not.toBeDisabled()
      })
      fireEvent.click(screen.getByText('Volgende'))

      // Ga terug
      await waitFor(() => {
        fireEvent.click(screen.getByText('Vorige'))
      })

      // Check of data behouden is
      await waitFor(() => {
        const nameInputAfter = screen.getByTestId('name-input') as HTMLInputElement
        expect(nameInputAfter.value).toBe('Jane')
      })
    })
  })

  describe('Submit', () => {
    it('roept onSubmit aan op laatste stap', async () => {
      const onSubmit = jest.fn()
      const filledData = { name: 'John', email: 'john@test.com', preferences: [] }
      testFormData = filledData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={filledData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Navigeer naar laatste stap
      fireEvent.click(screen.getByText('Volgende'))
      await waitFor(() => {
        fireEvent.click(screen.getByText('Volgende'))
      })

      // Submit
      await waitFor(() => {
        const submitButton = screen.getByText('Vacature Genereren')
        fireEvent.click(submitButton)
      })

      // Check of onSubmit is aangeroepen met correcte data
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(filledData)
      })
    })

    it('toont loading state tijdens submit', async () => {
      const onSubmit = jest.fn(
        (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 100))
      )
      const filledData = { name: 'John', email: 'john@test.com', preferences: [] }
      testFormData = filledData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={filledData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Ga naar laatste stap
      fireEvent.click(screen.getByText('Volgende'))
      await waitFor(() => {
        fireEvent.click(screen.getByText('Volgende'))
      })

      // Submit
      await waitFor(() => {
        fireEvent.click(screen.getByText('Vacature Genereren'))
      })

      // Check loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('handelt async onSubmit errors af', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const onSubmit = jest.fn((): Promise<void> => Promise.reject(new Error('Submit failed')))
      const filledData = { name: 'John', email: 'john@test.com', preferences: [] }
      testFormData = filledData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={filledData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Ga naar laatste stap en submit
      fireEvent.click(screen.getByText('Volgende'))
      await waitFor(() => {
        fireEvent.click(screen.getByText('Volgende'))
      })
      await waitFor(() => {
        fireEvent.click(screen.getByText('Vacature Genereren'))
      })

      // Error moet gelogd worden
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled()
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Progress indicator interactie', () => {
    it('kan naar voltooide stap klikken', async () => {
      const onSubmit = jest.fn()
      const filledData = { name: 'John', email: 'john@test.com', preferences: [] }
      testFormData = filledData
      
      render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={filledData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
        />
      )

      // Ga naar stap 2
      fireEvent.click(screen.getByText('Volgende'))
      await waitFor(() => {
        expect(screen.getByText('Contact Info Step')).toBeInTheDocument()
      })

      // Klik op stap 1 in progress indicator
      const step1Button = screen.getAllByRole('button')[0] // Eerste button in progress
      fireEvent.click(step1Button)

      // Moet terug zijn bij stap 1
      await waitFor(() => {
        expect(screen.getByText('Personal Info Step')).toBeInTheDocument()
      })
    })
  })

  describe('Custom className', () => {
    it('past custom className toe', () => {
      const onSubmit = jest.fn()
      testFormData = mockInitialData
      const { container } = render(
        <VacancyWizard
          steps={getMockSteps()}
          initialData={mockInitialData}
          onSubmit={onSubmit}
          renderStep={mockRenderStep}
          className="custom-wizard-class"
        />
      )

      expect(container.firstChild).toHaveClass('custom-wizard-class')
    })
  })
})

describe('VacancyWizardContainer', () => {
  const containerMockSteps: WizardStep[] = [
    { id: 'step1', label: 'Step 1' },
    { id: 'step2', label: 'Step 2' },
  ]

  const containerMockInitialData = { value: '' }

  it('rendert met children render prop', () => {
    const onSubmit = jest.fn()
    
    render(
      <VacancyWizardContainer
        steps={containerMockSteps}
        initialData={containerMockInitialData}
        onSubmit={onSubmit}
      >
        {(wizard) => (
          <div>
            <p>Current Step: {wizard.currentStep.id}</p>
            <button onClick={wizard.nextStep}>Next</button>
          </div>
        )}
      </VacancyWizardContainer>
    )

    expect(screen.getByText('Current Step: step1')).toBeInTheDocument()
  })

  it('geeft wizard object door aan children', () => {
    const onSubmit = jest.fn()
    const childrenFn = jest.fn(() => <div>Content</div>)
    
    render(
      <VacancyWizardContainer
        steps={containerMockSteps}
        initialData={containerMockInitialData}
        onSubmit={onSubmit}
      >
        {childrenFn}
      </VacancyWizardContainer>
    )

    expect(childrenFn).toHaveBeenCalledWith(
      expect.objectContaining({
        currentStepIndex: 0,
        currentStep: expect.objectContaining({ id: 'step1' }),
        formData: containerMockInitialData,
        handleSubmit: expect.any(Function),
        isSubmitting: false,
      })
    )
  })

  it('verbergt progress wanneer showProgress=false', () => {
    const onSubmit = jest.fn()
    
    render(
      <VacancyWizardContainer
        steps={containerMockSteps}
        initialData={containerMockInitialData}
        onSubmit={onSubmit}
        showProgress={false}
      >
        {() => <div>Content</div>}
      </VacancyWizardContainer>
    )

    // Step labels mogen niet zichtbaar zijn
    expect(screen.queryByText('Step 1')).not.toBeInTheDocument()
  })
})
