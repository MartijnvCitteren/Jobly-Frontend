/**
 * useFormWizard Hook
 *
 * Custom hook voor het beheren van multi-step form navigation en state
 */

import { useState, useCallback, useMemo } from 'react'

/**
 * Configuratie voor een wizard stap
 */
export interface WizardStep {
  /** Unieke identifier voor de stap */
  id: string
  /** Weergave naam van de stap */
  label: string
  /** Optionele beschrijving */
  description?: string
  /** Validatie functie - returnt true als stap compleet is */
  validate?: () => boolean
}

/**
 * Return type van de useFormWizard hook
 */
export interface UseFormWizardReturn<T> {
  /** Huidige stap index (0-based) */
  currentStepIndex: number
  /** Huidige stap configuratie */
  currentStep: WizardStep
  /** Alle stappen */
  steps: WizardStep[]
  /** Form data */
  formData: T
  /** Update form data (merge) */
  updateFormData: (data: Partial<T>) => void
  /** Set complete form data */
  setFormData: (data: T) => void
  /** Ga naar volgende stap */
  nextStep: () => void
  /** Ga naar vorige stap */
  previousStep: () => void
  /** Ga naar specifieke stap (0-based index) */
  goToStep: (stepIndex: number) => void
  /** Check of er een volgende stap is */
  hasNextStep: boolean
  /** Check of er een vorige stap is */
  hasPreviousStep: boolean
  /** Check of de huidige stap de eerste is */
  isFirstStep: boolean
  /** Check of de huidige stap de laatste is */
  isLastStep: boolean
  /** Check of de huidige stap valide is */
  isCurrentStepValid: boolean
  /** Progress percentage (0-100) */
  progress: number
  /** Reset wizard naar begin */
  reset: () => void
}

/**
 * Opties voor de useFormWizard hook
 */
export interface UseFormWizardOptions<T> {
  /** Array van wizard stappen */
  steps: WizardStep[]
  /** Initiële form data */
  initialData: T
  /** Initiële stap index (default: 0) */
  initialStepIndex?: number
}

/**
 * Custom hook voor multi-step form wizard
 *
 * Beheert navigatie tussen stappen, form data state en validatie.
 * Type-safe door gebruik van generics.
 *
 * @template T - Type van de form data
 * @param options - Configuratie opties
 * @returns Object met wizard state en control functies
 *
 * @example
 * ```typescript
 * interface MyFormData {
 *   name: string
 *   email: string
 *   preferences: string[]
 * }
 *
 * function RegistrationWizard() {
 *   const wizard = useFormWizard<MyFormData>({
 *     steps: [
 *       { id: 'personal', label: 'Persoonlijke Info', validate: () => !!formData.name },
 *       { id: 'contact', label: 'Contact Info', validate: () => !!formData.email },
 *       { id: 'preferences', label: 'Voorkeuren' }
 *     ],
 *     initialData: { name: '', email: '', preferences: [] }
 *   })
 *
 *   return (
 *     <div>
 *       <Progress value={wizard.progress} />
 *       <CurrentStepComponent
 *         data={wizard.formData}
 *         onChange={wizard.updateFormData}
 *       />
 *       <button onClick={wizard.previousStep} disabled={!wizard.hasPreviousStep}>
 *         Vorige
 *       </button>
 *       <button onClick={wizard.nextStep} disabled={!wizard.hasNextStep}>
 *         {wizard.isLastStep ? 'Voltooien' : 'Volgende'}
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFormWizard<T>({
  steps,
  initialData,
  initialStepIndex = 0,
}: UseFormWizardOptions<T>): UseFormWizardReturn<T> {
  // Valideer input
  if (steps.length === 0) {
    throw new Error('useFormWizard: steps array cannot be empty')
  }

  if (initialStepIndex < 0 || initialStepIndex >= steps.length) {
    throw new Error(
      `useFormWizard: initialStepIndex ${initialStepIndex} is out of bounds (0-${steps.length - 1})`
    )
  }

  // State
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex)
  const [formData, setFormData] = useState<T>(initialData)

  // Huidige stap
  const currentStep = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex])

  // Validatie van huidige stap
  const isCurrentStepValid = useMemo(() => {
    if (!currentStep.validate) {
      return true // Geen validatie = altijd valid
    }
    return currentStep.validate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData]) // formData als dependency zodat validatie re-runs bij updates

  // Navigatie checks
  const hasNextStep = currentStepIndex < steps.length - 1
  const hasPreviousStep = currentStepIndex > 0
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  // Progress berekening (percentage)
  const progress = useMemo(() => {
    return Math.round(((currentStepIndex + 1) / steps.length) * 100)
  }, [currentStepIndex, steps.length])

  /**
   * Update form data (partial merge)
   */
  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  /**
   * Ga naar volgende stap (indien mogelijk)
   */
  const nextStep = useCallback(() => {
    if (hasNextStep) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }, [hasNextStep])

  /**
   * Ga naar vorige stap (indien mogelijk)
   */
  const previousStep = useCallback(() => {
    if (hasPreviousStep) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }, [hasPreviousStep])

  /**
   * Ga naar specifieke stap
   */
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStepIndex(stepIndex)
      }
    },
    [steps.length]
  )

  /**
   * Reset wizard naar initiële staat
   */
  const reset = useCallback(() => {
    setCurrentStepIndex(initialStepIndex)
    setFormData(initialData)
  }, [initialStepIndex, initialData])

  return {
    currentStepIndex,
    currentStep,
    steps,
    formData,
    updateFormData,
    setFormData,
    nextStep,
    previousStep,
    goToStep,
    hasNextStep,
    hasPreviousStep,
    isFirstStep,
    isLastStep,
    isCurrentStepValid,
    progress,
    reset,
  }
}
