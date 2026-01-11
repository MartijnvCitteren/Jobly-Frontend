/**
 * Vacancy Components
 *
 * Componenten voor het aanmaken en beheren van vacatures
 */

// Wizard components
export { VacancyWizard, VacancyWizardContainer } from './VacancyWizard'
export type { VacancyWizardProps, VacancyWizardContainerProps } from './VacancyWizard'

export { WizardStep, WizardStepSection } from './WizardStep'
export type { WizardStepProps, WizardStepSectionProps } from './WizardStep'

export { WizardNavigation, WizardNavigationSimple } from './WizardNavigation'
export type {
  WizardNavigationProps,
  WizardNavigationSimpleProps,
} from './WizardNavigation'

export { ProgressIndicator } from './ProgressIndicator'
export type { ProgressIndicatorProps } from './ProgressIndicator'

// Wizard steps
export {
  CompanyInfoStep,
  JobBasicsStep,
  JobRequirementsStep,
  JobDetailsStep,
  ReviewStep,
} from './steps'

export type {
  CompanyInfoStepProps,
  JobBasicsStepProps,
  JobBasicsStepData,
  JobRequirementsStepProps,
  JobRequirementsStepData,
  JobDetailsStepProps,
  JobDetailsStepData,
  ReviewStepProps,
  ReviewStepData,
} from './steps'

// Result components
export { VacancyResult } from './VacancyResult'
export type { VacancyResultProps } from './VacancyResult'

export { VacancyEditor } from './VacancyEditor'
export type { VacancyEditorProps } from './VacancyEditor'

export { ExportOptions } from './ExportOptions'
export type { ExportOptionsProps } from './ExportOptions'
