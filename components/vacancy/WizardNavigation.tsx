import React from 'react'
import { Button } from '../ui/Button'

export interface WizardNavigationProps {
  /** Of er een vorige stap is */
  hasPreviousStep: boolean
  /** Of er een volgende stap is */
  hasNextStep: boolean
  /** Of de huidige stap de eerste is */
  isFirstStep: boolean
  /** Of de huidige stap de laatste is */
  isLastStep: boolean
  /** Of de huidige stap valide is (voor next button) */
  isCurrentStepValid: boolean
  /** Callback voor vorige stap */
  onPrevious: () => void
  /** Callback voor volgende stap */
  onNext: () => void
  /** Callback voor submit (laatste stap) */
  onSubmit?: () => void
  /** Of de wizard aan het laden is (bijv. tijdens submit) */
  isLoading?: boolean
  /** Custom tekst voor next button */
  nextButtonText?: string
  /** Custom tekst voor previous button */
  previousButtonText?: string
  /** Custom tekst voor submit button */
  submitButtonText?: string
  /** Custom className */
  className?: string
}

/**
 * WizardNavigation Component
 *
 * Navigatie component met Previous/Next/Submit buttons voor de wizard.
 * Handelt automatisch de state en disabled states van de buttons.
 */
export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  hasPreviousStep,
  hasNextStep,
  isLastStep,
  isCurrentStepValid,
  onPrevious,
  onNext,
  onSubmit,
  isLoading = false,
  nextButtonText = 'Volgende',
  previousButtonText = 'Vorige',
  submitButtonText = 'Vacature Genereren',
  className = '',
}) => {
  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit()
    } else {
      onNext()
    }
  }

  return (
    <div
      className={`
        flex items-center justify-between
        pt-6 mt-8 border-t border-slate-200
        ${className}
      `}
    >
      {/* Previous button */}
      <div>
        {hasPreviousStep ? (
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            disabled={isLoading}
            className="min-w-[140px]"
            aria-label="Ga naar vorige stap"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {previousButtonText}
            </span>
          </Button>
        ) : (
          // Placeholder om layout consistent te houden
          <div className="w-[140px]" aria-hidden="true" />
        )}
      </div>

      {/* Step indicator text */}
      <div className="text-sm text-slate-500 font-medium">
        {isLastStep ? 'Laatste stap' : hasNextStep ? 'Ga verder' : ''}
      </div>

      {/* Next/Submit button */}
      <div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!isCurrentStepValid || isLoading}
          isLoading={isLoading}
          className="min-w-[140px]"
          aria-label={
            isLastStep
              ? 'Dien formulier in'
              : hasNextStep
                ? 'Ga naar volgende stap'
                : 'Voltooien'
          }
        >
          <span className="flex items-center gap-2">
            {isLastStep ? (
              <>
                {submitButtonText}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </>
            ) : (
              <>
                {nextButtonText}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </span>
        </Button>
      </div>
    </div>
  )
}

/**
 * WizardNavigationSimple Component
 *
 * Simplified versie van WizardNavigation voor eenvoudigere use cases.
 * Gebruikt alleen Previous/Next zonder alle extra features.
 */
export interface WizardNavigationSimpleProps {
  /** Of previous button getoond moet worden */
  showPrevious?: boolean
  /** Of next button getoond moet worden */
  showNext?: boolean
  /** Of next button disabled moet zijn */
  nextDisabled?: boolean
  /** Callback voor previous */
  onPrevious?: () => void
  /** Callback voor next */
  onNext?: () => void
  /** Custom className */
  className?: string
}

export const WizardNavigationSimple: React.FC<WizardNavigationSimpleProps> = ({
  showPrevious = true,
  showNext = true,
  nextDisabled = false,
  onPrevious,
  onNext,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {showPrevious && onPrevious ? (
        <Button variant="outline" onClick={onPrevious}>
          Vorige
        </Button>
      ) : (
        <div />
      )}

      {showNext && onNext && (
        <Button variant="primary" onClick={onNext} disabled={nextDisabled}>
          Volgende
        </Button>
      )}
    </div>
  )
}
