/**
 * useVacancyGeneration Hook
 *
 * Custom hook voor het beheren van vacancy generatie state en API calls
 */

import { useState, useCallback } from 'react'
import { createCompanyAndVacancy } from '@/lib/api/vacancy-repository'
import type {
  CompanyInfoRequest,
  JobInfoRequest,
  GeneratedVacancy,
} from '@/lib/domain/vacancy.types'

/**
 * Status van het vacancy generatie proces
 */
export type VacancyGenerationStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * Return type van de useVacancyGeneration hook
 */
export interface UseVacancyGenerationReturn {
  /** Huidige status van het generatie proces */
  status: VacancyGenerationStatus
  /** Gegenereerde vacancy data (indien succesvol) */
  vacancy: GeneratedVacancy | null
  /** Error message (indien gefaald) */
  error: string | null
  /** Functie om vacancy te genereren */
  generateVacancy: (
    companyInfo: CompanyInfoRequest,
    jobInfo: JobInfoRequest
  ) => Promise<void>
  /** Functie om state te resetten */
  reset: () => void
  /** Shortcut properties voor status checks */
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isIdle: boolean
}

/**
 * Custom hook voor vacancy generatie
 *
 * Beheert de complete workflow van bedrijfsinformatie aanmaken en
 * vacancy genereren, inclusief loading states en error handling.
 *
 * @returns Object met status, data en control functies
 *
 * @example
 * ```typescript
 * function VacancyForm() {
 *   const { generateVacancy, isLoading, vacancy, error } = useVacancyGeneration()
 *
 *   const handleSubmit = async () => {
 *     await generateVacancy(companyInfo, jobInfo)
 *   }
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <Error message={error} />
 *   if (vacancy) return <VacancyResult data={vacancy} />
 * }
 * ```
 */
export function useVacancyGeneration(): UseVacancyGenerationReturn {
  const [status, setStatus] = useState<VacancyGenerationStatus>('idle')
  const [vacancy, setVacancy] = useState<GeneratedVacancy | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Genereer vacancy op basis van bedrijfs- en job informatie
   */
  const generateVacancy = useCallback(
    async (companyInfo: CompanyInfoRequest, jobInfo: JobInfoRequest) => {
      try {
        // Reset previous results
        setStatus('loading')
        setError(null)
        setVacancy(null)

        // Call API
        const result = await createCompanyAndVacancy(companyInfo, jobInfo)

        // Success
        setVacancy(result)
        setStatus('success')
      } catch (err) {
        // Error handling
        const errorMessage =
          err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden'

        setError(errorMessage)
        setStatus('error')
        setVacancy(null)
      }
    },
    []
  )

  /**
   * Reset alle state naar initiële waarden
   */
  const reset = useCallback(() => {
    setStatus('idle')
    setVacancy(null)
    setError(null)
  }, [])

  return {
    status,
    vacancy,
    error,
    generateVacancy,
    reset,
    // Convenience properties
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle',
  }
}
