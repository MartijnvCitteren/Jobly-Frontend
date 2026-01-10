'use client'

import React, { ReactElement } from 'react'
import { Card } from '../ui/Card'
import { ProgressIndicator } from './ProgressIndicator'
import { WizardNavigation } from './WizardNavigation'
import { useFormWizard, WizardStep as WizardStepConfig } from '@/lib/hooks/useFormWizard'

export interface VacancyWizardProps<T> {
  /** Configuratie van de wizard stappen */
  steps: WizardStepConfig[]
  /** Initiële form data */
  initialData: T
  /** Callback wanneer de wizard wordt ingediend (laatste stap) */
  onSubmit: (data: T) => void | Promise<void>
  /** Render functie voor de huidige stap content */
  renderStep: (data: {
    stepId: string
    stepIndex: number
    formData: T
    updateFormData: (data: Partial<T>) => void
  }) => ReactElement
  /** Titel van de wizard */
  title?: string
  /** Beschrijving van de wizard */
  description?: string
  /** Of de wizard aan het laden is */
  isLoading?: boolean
  /** Custom className voor de container */
  className?: string
}

/**
 * VacancyWizard Component
 *
 * Hoofd wizard component die de complete multi-step form experience beheert.
 * Gebruikt compound component pattern met de useFormWizard hook.
 *
 * @template T - Type van de form data
 *
 * @example
 * ```tsx
 * interface VacancyFormData {
 *   jobTitle: string
 *   company: string
 *   description: string
 * }
 *
 * function CreateVacancyPage() {
 *   const steps: WizardStep[] = [
 *     { id: 'basics', label: 'Basis Informatie', validate: () => !!data.jobTitle },
 *     { id: 'details', label: 'Details', validate: () => !!data.description },
 *     { id: 'review', label: 'Controleren' }
 *   ]
 *
 *   const handleSubmit = async (data: VacancyFormData) => {
 *     await createVacancy(data)
 *   }
 *
 *   const renderStep = ({ stepId, formData, updateFormData }) => {
 *     switch (stepId) {
 *       case 'basics':
 *         return <BasicInfoStep data={formData} onChange={updateFormData} />
 *       case 'details':
 *         return <DetailsStep data={formData} onChange={updateFormData} />
 *       case 'review':
 *         return <ReviewStep data={formData} />
 *       default:
 *         return <div>Unknown step</div>
 *     }
 *   }
 *
 *   return (
 *     <VacancyWizard
 *       steps={steps}
 *       initialData={{ jobTitle: '', company: '', description: '' }}
 *       onSubmit={handleSubmit}
 *       renderStep={renderStep}
 *       title="Maak een Vacature"
 *       description="Vul de informatie in om een professionele vacature te genereren"
 *     />
 *   )
 * }
 * ```
 */
export function VacancyWizard<T>({
  steps,
  initialData,
  onSubmit,
  renderStep,
  title,
  description,
  isLoading = false,
  className = '',
}: VacancyWizardProps<T>) {
  const wizard = useFormWizard<T>({
    steps,
    initialData,
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(wizard.formData)
    } catch (error) {
      console.error('Error submitting wizard:', error)
      // TODO: Error handling - show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepLabels = steps.map((step) => step.label)

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Wizard Header */}
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-10">
        <ProgressIndicator
          totalSteps={steps.length}
          currentStep={wizard.currentStepIndex}
          stepLabels={stepLabels}
          onStepClick={wizard.goToStep}
          onlyCompletedClickable={true}
        />
      </div>

      {/* Wizard Content Card */}
      <Card padding="lg" className="min-h-[500px]">
        {/* Current Step Content */}
        <div className="mb-6">
          {renderStep({
            stepId: wizard.currentStep.id,
            stepIndex: wizard.currentStepIndex,
            formData: wizard.formData,
            updateFormData: wizard.updateFormData,
          })}
        </div>

        {/* Navigation */}
        <WizardNavigation
          hasPreviousStep={wizard.hasPreviousStep}
          hasNextStep={wizard.hasNextStep}
          isFirstStep={wizard.isFirstStep}
          isLastStep={wizard.isLastStep}
          isCurrentStepValid={wizard.isCurrentStepValid}
          onPrevious={wizard.previousStep}
          onNext={wizard.nextStep}
          onSubmit={handleSubmit}
          isLoading={isLoading || isSubmitting}
        />
      </Card>

      {/* Helper text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Stap {wizard.currentStepIndex + 1} van {steps.length}
          {' · '}
          <span className="font-medium">{wizard.progress}% voltooid</span>
        </p>
      </div>
    </div>
  )
}

/**
 * VacancyWizardContainer Component
 *
 * Alternative container component die meer flexibiliteit biedt
 * door children te gebruiken in plaats van renderStep prop.
 */
export interface VacancyWizardContainerProps<T> {
  steps: WizardStepConfig[]
  initialData: T
  onSubmit: (data: T) => void | Promise<void>
  children: (wizard: ReturnType<typeof useFormWizard<T>>) => ReactElement
  title?: string
  description?: string
  isLoading?: boolean
  showProgress?: boolean
  className?: string
}

export function VacancyWizardContainer<T>({
  steps,
  initialData,
  onSubmit,
  children,
  title,
  description,
  isLoading = false,
  showProgress = true,
  className = '',
}: VacancyWizardContainerProps<T>) {
  const wizard = useFormWizard<T>({
    steps,
    initialData,
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(wizard.formData)
    } catch (error) {
      console.error('Error submitting wizard:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const enhancedWizard = {
    ...wizard,
    handleSubmit,
    isSubmitting: isSubmitting || isLoading,
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && <h1 className="text-4xl font-bold text-slate-900 mb-3">{title}</h1>}
          {description && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}

      {showProgress && (
        <div className="mb-10">
          <ProgressIndicator
            totalSteps={steps.length}
            currentStep={wizard.currentStepIndex}
            stepLabels={steps.map((s) => s.label)}
            onStepClick={wizard.goToStep}
            onlyCompletedClickable={true}
          />
        </div>
      )}

      {children(enhancedWizard as ReturnType<typeof useFormWizard<T>> & { handleSubmit: () => Promise<void>; isSubmitting: boolean })}
    </div>
  )
}
