import React from 'react'

export interface ProgressIndicatorProps {
  /** Totaal aantal stappen */
  totalSteps: number
  /** Huidige stap index (0-based) */
  currentStep: number
  /** Labels voor elke stap */
  stepLabels?: string[]
  /** Callback wanneer op een stap wordt geklikt */
  onStepClick?: (stepIndex: number) => void
  /** Toon alleen voltooide stappen als klikbaar */
  onlyCompletedClickable?: boolean
  /** Custom className */
  className?: string
}

/**
 * ProgressIndicator Component
 *
 * Visuele weergave van de voortgang door een multi-step wizard.
 * Toont een horizontale lijn met stap indicatoren.
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  currentStep,
  stepLabels = [],
  onStepClick,
  onlyCompletedClickable = true,
  className = '',
}) => {
  const handleStepClick = (stepIndex: number) => {
    if (!onStepClick) return

    const isClickable = onlyCompletedClickable ? stepIndex <= currentStep : true

    if (isClickable) {
      onStepClick(stepIndex)
    }
  }

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'current'
    return 'upcoming'
  }

  const isStepClickable = (stepIndex: number): boolean => {
    if (!onStepClick) return false
    return onlyCompletedClickable ? stepIndex <= currentStep : true
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200" />

        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-indigo-500 transition-all duration-500 ease-out"
          style={{
            width: `${(currentStep / (totalSteps - 1)) * 100}%`,
          }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const status = getStepStatus(index)
            const clickable = isStepClickable(index)
            const label = stepLabels[index] || `Stap ${index + 1}`

            return (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ width: `${100 / totalSteps}%` }}
              >
                {/* Step circle */}
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!clickable}
                  className={`
                    relative z-10 w-10 h-10 rounded-full border-2
                    flex items-center justify-center
                    transition-all duration-300 ease-out
                    font-semibold text-sm
                    ${
                      status === 'completed'
                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-md scale-100'
                        : status === 'current'
                          ? 'bg-white border-indigo-500 text-indigo-600 shadow-lg scale-110 ring-4 ring-indigo-100'
                          : 'bg-white border-slate-300 text-slate-400'
                    }
                    ${
                      clickable
                        ? 'cursor-pointer hover:scale-105 hover:shadow-lg'
                        : 'cursor-default'
                    }
                  `}
                  aria-label={`${label} - ${status === 'completed' ? 'voltooid' : status === 'current' ? 'huidige stap' : 'toekomstige stap'}`}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {status === 'completed' ? (
                    // Checkmark icon
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Step label */}
                <div className="mt-3 text-center">
                  <p
                    className={`
                      text-xs font-medium transition-colors duration-300
                      ${
                        status === 'completed' || status === 'current'
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }
                    `}
                  >
                    {label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
