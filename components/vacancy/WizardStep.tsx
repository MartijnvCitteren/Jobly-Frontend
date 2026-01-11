import React from 'react'

export interface WizardStepProps {
  /** Unieke identifier voor de stap */
  id: string
  /** Titel van de stap */
  title: string
  /** Optionele beschrijving/subtitle */
  description?: string
  /** Of deze stap actief is */
  isActive: boolean
  /** Children content van de stap */
  children: React.ReactNode
  /** Custom className */
  className?: string
}

/**
 * WizardStep Component
 *
 * Wrapper component voor een individuele stap in de wizard.
 * Zorgt voor consistente styling en animaties tussen stappen.
 */
export const WizardStep: React.FC<WizardStepProps> = ({
  id,
  title,
  description,
  isActive,
  children,
  className = '',
}) => {
  if (!isActive) {
    return null // Render alleen actieve stap
  }

  return (
    <div
      id={`wizard-step-${id}`}
      className={`
        animate-fade-in
        ${className}
      `}
      role="tabpanel"
      aria-labelledby={`step-${id}-label`}
    >
      {/* Step header */}
      <div className="mb-8">
        <h2
          id={`step-${id}-label`}
          className="text-3xl font-bold text-slate-800 mb-2"
        >
          {title}
        </h2>
        {description && (
          <p className="text-slate-600 text-lg">
            {description}
          </p>
        )}
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

/**
 * WizardStepSection Component
 *
 * Helper component voor het groeperen van gerelateerde velden binnen een stap
 */
export interface WizardStepSectionProps {
  /** Titel van de sectie */
  title?: string
  /** Beschrijving van de sectie */
  description?: string
  /** Children content */
  children: React.ReactNode
  /** Custom className */
  className?: string
}

export const WizardStepSection: React.FC<WizardStepSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-slate-800">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}
