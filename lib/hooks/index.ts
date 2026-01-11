/**
 * Hooks exports
 *
 * Centraal export punt voor alle custom hooks
 */

export { useVacancyGeneration } from './useVacancyGeneration'
export type {
  VacancyGenerationStatus,
  UseVacancyGenerationReturn,
} from './useVacancyGeneration'

export { useFormWizard } from './useFormWizard'
export type {
  WizardStep,
  UseFormWizardReturn,
  UseFormWizardOptions,
} from './useFormWizard'

// Utility hooks
export * from './useDebounce'
export * from './useLocalStorage'
export * from './usePrevious'
export * from './useMount'
