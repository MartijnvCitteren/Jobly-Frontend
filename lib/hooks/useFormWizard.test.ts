/**
 * Tests voor useFormWizard hook
 */

import { renderHook, act } from '@testing-library/react'
import { useFormWizard, WizardStep } from './useFormWizard'

interface TestFormData {
  name: string
  email: string
  age: number
}

describe('useFormWizard', () => {
  const mockSteps: WizardStep[] = [
    {
      id: 'personal',
      label: 'Personal Info',
      description: 'Enter your personal information',
      validate: () => true,
    },
    {
      id: 'contact',
      label: 'Contact Info',
      description: 'Enter your contact details',
    },
    {
      id: 'review',
      label: 'Review',
      description: 'Review your information',
    },
  ]

  const initialData: TestFormData = {
    name: '',
    email: '',
    age: 0,
  }

  describe('Initialization', () => {
    it('should initialize with first step', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      expect(result.current.currentStepIndex).toBe(0)
      expect(result.current.currentStep).toEqual(mockSteps[0])
      expect(result.current.formData).toEqual(initialData)
      expect(result.current.isFirstStep).toBe(true)
      expect(result.current.isLastStep).toBe(false)
      expect(result.current.progress).toBe(33) // Math.round((1/3) * 100)
    })

    it('should initialize with custom initial step', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData, initialStepIndex: 1 })
      )

      expect(result.current.currentStepIndex).toBe(1)
      expect(result.current.currentStep).toEqual(mockSteps[1])
      expect(result.current.progress).toBe(67) // Math.round((2/3) * 100)
    })

    it('should throw error if steps array is empty', () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = jest.fn()

      expect(() => {
        renderHook(() => useFormWizard({ steps: [], initialData }))
      }).toThrow('useFormWizard: steps array cannot be empty')

      console.error = originalError
    })

    it('should throw error if initialStepIndex is out of bounds', () => {
      const originalError = console.error
      console.error = jest.fn()

      expect(() => {
        renderHook(() =>
          useFormWizard({ steps: mockSteps, initialData, initialStepIndex: 10 })
        )
      }).toThrow('useFormWizard: initialStepIndex 10 is out of bounds')

      expect(() => {
        renderHook(() =>
          useFormWizard({ steps: mockSteps, initialData, initialStepIndex: -1 })
        )
      }).toThrow('useFormWizard: initialStepIndex -1 is out of bounds')

      console.error = originalError
    })
  })

  describe('Navigation', () => {
    it('should navigate to next step', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      act(() => {
        result.current.nextStep()
      })

      expect(result.current.currentStepIndex).toBe(1)
      expect(result.current.currentStep).toEqual(mockSteps[1])
      expect(result.current.hasNextStep).toBe(true)
      expect(result.current.hasPreviousStep).toBe(true)
      expect(result.current.progress).toBe(67)
    })

    it('should navigate to previous step', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData, initialStepIndex: 1 })
      )

      act(() => {
        result.current.previousStep()
      })

      expect(result.current.currentStepIndex).toBe(0)
      expect(result.current.currentStep).toEqual(mockSteps[0])
    })

    it('should not go beyond last step', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData, initialStepIndex: 2 })
      )

      expect(result.current.isLastStep).toBe(true)
      expect(result.current.hasNextStep).toBe(false)

      act(() => {
        result.current.nextStep()
      })

      // Should remain on last step
      expect(result.current.currentStepIndex).toBe(2)
    })

    it('should not go before first step', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      expect(result.current.isFirstStep).toBe(true)
      expect(result.current.hasPreviousStep).toBe(false)

      act(() => {
        result.current.previousStep()
      })

      // Should remain on first step
      expect(result.current.currentStepIndex).toBe(0)
    })

    it('should go to specific step', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      act(() => {
        result.current.goToStep(2)
      })

      expect(result.current.currentStepIndex).toBe(2)
      expect(result.current.currentStep).toEqual(mockSteps[2])
    })

    it('should not go to invalid step index', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      act(() => {
        result.current.goToStep(10)
      })

      // Should remain on current step
      expect(result.current.currentStepIndex).toBe(0)

      act(() => {
        result.current.goToStep(-1)
      })

      expect(result.current.currentStepIndex).toBe(0)
    })
  })

  describe('Form Data Management', () => {
    it('should update form data partially', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      act(() => {
        result.current.updateFormData({ name: 'John' })
      })

      expect(result.current.formData).toEqual({
        name: 'John',
        email: '',
        age: 0,
      })

      act(() => {
        result.current.updateFormData({ email: 'john@example.com', age: 25 })
      })

      expect(result.current.formData).toEqual({
        name: 'John',
        email: 'john@example.com',
        age: 25,
      })
    })

    it('should set complete form data', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      const newData: TestFormData = {
        name: 'Jane',
        email: 'jane@example.com',
        age: 30,
      }

      act(() => {
        result.current.setFormData(newData)
      })

      expect(result.current.formData).toEqual(newData)
    })
  })

  describe('Validation', () => {
    it('should validate current step with validation function', () => {
      const stepsWithValidation: WizardStep[] = [
        {
          id: 'step1',
          label: 'Step 1',
          validate: () => false, // Niet valide
        },
        {
          id: 'step2',
          label: 'Step 2',
          validate: () => true, // Valide
        },
      ]

      const { result } = renderHook(() =>
        useFormWizard({ steps: stepsWithValidation, initialData })
      )

      expect(result.current.isCurrentStepValid).toBe(false)

      act(() => {
        result.current.nextStep()
      })

      expect(result.current.isCurrentStepValid).toBe(true)
    })

    it('should consider step valid when no validation function provided', () => {
      const stepsWithoutValidation: WizardStep[] = [
        {
          id: 'step1',
          label: 'Step 1',
          // Geen validate functie
        },
      ]

      const { result } = renderHook(() =>
        useFormWizard({ steps: stepsWithoutValidation, initialData })
      )

      expect(result.current.isCurrentStepValid).toBe(true)
    })

    it('should re-validate when form data changes', () => {
      let nameValue = ''

      const stepsWithDynamicValidation: WizardStep[] = [
        {
          id: 'step1',
          label: 'Step 1',
          validate: () => nameValue.length > 0,
        },
      ]

      const { result } = renderHook(() =>
        useFormWizard({ steps: stepsWithDynamicValidation, initialData })
      )

      // Initially invalid
      expect(result.current.isCurrentStepValid).toBe(false)

      // Update external validation state
      nameValue = 'John'

      // Update form data to trigger re-validation
      act(() => {
        result.current.updateFormData({ name: 'John' })
      })

      // Should now be valid
      expect(result.current.isCurrentStepValid).toBe(true)
    })
  })

  describe('Progress', () => {
    it('should calculate progress correctly', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      expect(result.current.progress).toBe(33) // Step 1/3

      act(() => {
        result.current.nextStep()
      })

      expect(result.current.progress).toBe(67) // Step 2/3

      act(() => {
        result.current.nextStep()
      })

      expect(result.current.progress).toBe(100) // Step 3/3
    })
  })

  describe('Reset', () => {
    it('should reset wizard to initial state', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData, initialStepIndex: 0 })
      )

      // Modify state
      act(() => {
        result.current.updateFormData({ name: 'John', email: 'john@example.com' })
        result.current.nextStep()
        result.current.nextStep()
      })

      expect(result.current.currentStepIndex).toBe(2)
      expect(result.current.formData.name).toBe('John')

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.currentStepIndex).toBe(0)
      expect(result.current.formData).toEqual(initialData)
      expect(result.current.currentStep).toEqual(mockSteps[0])
    })

    it('should reset to custom initial step if provided', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData, initialStepIndex: 1 })
      )

      // Go to last step
      act(() => {
        result.current.nextStep()
      })

      expect(result.current.currentStepIndex).toBe(2)

      // Reset should go back to initialStepIndex (1)
      act(() => {
        result.current.reset()
      })

      expect(result.current.currentStepIndex).toBe(1)
    })
  })

  describe('Edge cases', () => {
    it('should handle single step wizard', () => {
      const singleStep: WizardStep[] = [
        {
          id: 'only',
          label: 'Only Step',
        },
      ]

      const { result } = renderHook(() =>
        useFormWizard({ steps: singleStep, initialData })
      )

      expect(result.current.isFirstStep).toBe(true)
      expect(result.current.isLastStep).toBe(true)
      expect(result.current.hasNextStep).toBe(false)
      expect(result.current.hasPreviousStep).toBe(false)
      expect(result.current.progress).toBe(100)
    })

    it('should preserve step references', () => {
      const { result } = renderHook(() =>
        useFormWizard({ steps: mockSteps, initialData })
      )

      const firstStepRef = result.current.currentStep

      // Navigate and come back
      act(() => {
        result.current.nextStep()
      })

      act(() => {
        result.current.previousStep()
      })

      expect(result.current.currentStep).toBe(firstStepRef)
    })
  })
})
