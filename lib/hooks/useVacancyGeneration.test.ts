/**
 * Tests voor useVacancyGeneration hook
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useVacancyGeneration } from './useVacancyGeneration'
import * as vacancyRepository from '@/lib/api/vacancy-repository'
import {
  CompanyInfoRequest,
  JobInfoRequest,
  GeneratedVacancy,
  Country,
  SeniorityLevel,
  WritingStyle,
  Language,
  SalaryPeriod,
} from '@/lib/domain/vacancy.types'

// Mock de vacancy repository
jest.mock('@/lib/api/vacancy-repository')

describe('useVacancyGeneration', () => {
  const mockCompanyInfo: CompanyInfoRequest = {
    companyName: 'Tech Corp',
    companyWebsite: 'www.techcorp.com',
    country: Country.THE_NETHERLANDS,
  }

  const mockJobInfo: JobInfoRequest = {
    jobTitle: 'Senior Developer',
    seniorityLevel: SeniorityLevel.SENIOR,
    writingStyle: {
      writingStyle: WritingStyle.BUSINESS_CASUAL,
      language: Language.ENGLISH,
    },
    benefits: {
      salaryPeriod: SalaryPeriod.YEARLY,
      minSalary: 60000,
      maxSalary: 80000,
    },
  }

  const mockVacancy: GeneratedVacancy = {
    summary: 'Join our team',
    companyDescription: 'Tech Corp is a leading company',
    jobDescription: 'We are looking for a Senior Developer',
    requirements: '5+ years of experience',
    offer: 'Competitive salary',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial state', () => {
    it('should initialize with idle status', () => {
      const { result } = renderHook(() => useVacancyGeneration())

      expect(result.current.status).toBe('idle')
      expect(result.current.vacancy).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.isIdle).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should provide generateVacancy and reset functions', () => {
      const { result } = renderHook(() => useVacancyGeneration())

      expect(typeof result.current.generateVacancy).toBe('function')
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('generateVacancy', () => {
    it('should successfully generate vacancy', async () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockResolvedValue(mockVacancy)

      const { result } = renderHook(() => useVacancyGeneration())

      // Start generatie
      act(() => {
        result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      // Loading state
      expect(result.current.status).toBe('loading')
      expect(result.current.isLoading).toBe(true)
      expect(result.current.vacancy).toBeNull()
      expect(result.current.error).toBeNull()

      // Wacht op completion
      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      // Success state
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.vacancy).toEqual(mockVacancy)
      expect(result.current.error).toBeNull()

      // Verify API call
      expect(mockCreateCompanyAndVacancy).toHaveBeenCalledWith(
        mockCompanyInfo,
        mockJobInfo
      )
      expect(mockCreateCompanyAndVacancy).toHaveBeenCalledTimes(1)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'API request failed'
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useVacancyGeneration())

      // Start generatie
      act(() => {
        result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      // Wacht op completion
      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      // Error state
      expect(result.current.isError).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.vacancy).toBeNull()
    })

    it('should handle non-Error thrown values', async () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockRejectedValue('String error')

      const { result } = renderHook(() => useVacancyGeneration())

      act(() => {
        result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBe('Er is een onbekende fout opgetreden')
    })

    it('should reset previous results on new generation', async () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockResolvedValue(mockVacancy)

      const { result } = renderHook(() => useVacancyGeneration())

      // Eerste generatie
      await act(async () => {
        await result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      expect(result.current.vacancy).toEqual(mockVacancy)

      // Tweede generatie - moet eerste result resetten
      const newMockVacancy = { ...mockVacancy, summary: 'New vacancy' }
      mockCreateCompanyAndVacancy.mockResolvedValue(newMockVacancy)

      act(() => {
        result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      // Direct na aanroep moet vacancy null zijn (loading state)
      expect(result.current.vacancy).toBeNull()
      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.vacancy).toEqual(newMockVacancy)
      })
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockResolvedValue(mockVacancy)

      const { result } = renderHook(() => useVacancyGeneration())

      // Genereer vacancy
      await act(async () => {
        await result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      expect(result.current.status).toBe('success')
      expect(result.current.vacancy).toEqual(mockVacancy)

      // Reset
      act(() => {
        result.current.reset()
      })

      // Check reset state
      expect(result.current.status).toBe('idle')
      expect(result.current.vacancy).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.isIdle).toBe(true)
    })

    it('should reset error state', async () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(() => useVacancyGeneration())

      // Genereer error
      await act(async () => {
        await result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toBeTruthy()

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBeNull()
      expect(result.current.status).toBe('idle')
    })
  })

  describe('Status convenience properties', () => {
    it('should correctly set isLoading', () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(mockVacancy), 100))
        )

      const { result } = renderHook(() => useVacancyGeneration())

      act(() => {
        result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should correctly set isSuccess', async () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockResolvedValue(mockVacancy)

      const { result } = renderHook(() => useVacancyGeneration())

      await act(async () => {
        await result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      expect(result.current.isSuccess).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should correctly set isError', async () => {
      const mockCreateCompanyAndVacancy = jest
        .spyOn(vacancyRepository, 'createCompanyAndVacancy')
        .mockRejectedValue(new Error('Error'))

      const { result } = renderHook(() => useVacancyGeneration())

      await act(async () => {
        await result.current.generateVacancy(mockCompanyInfo, mockJobInfo)
      })

      expect(result.current.isError).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isIdle).toBe(false)
      expect(result.current.isSuccess).toBe(false)
    })
  })
})
