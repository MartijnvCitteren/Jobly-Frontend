'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { SeniorityLevel } from '@/lib/domain/vacancy.types'
import { z } from 'zod'

export interface JobBasicsStepData {
  jobTitle?: string
  seniorityLevel: SeniorityLevel
  jobSummary?: string
}

export interface JobBasicsStepProps {
  data: Partial<JobBasicsStepData>
  onChange: (data: Partial<JobBasicsStepData>) => void
}

const seniorityOptions: SelectOption[] = [
  { value: SeniorityLevel.INTERN, label: 'Stage' },
  { value: SeniorityLevel.JUNIOR, label: 'Junior' },
  { value: SeniorityLevel.MEDIOR, label: 'Medior' },
  { value: SeniorityLevel.SENIOR, label: 'Senior' },
]

/**
 * JobBasicsStep Component
 *
 * Tweede stap van de wizard voor basis functie-informatie
 */
export function JobBasicsStep({ data, onChange }: JobBasicsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateJobTitle = (value: string) => {
    if (!value) return true // Optional field
    try {
      z.string()
        .min(2, 'Functietitel moet minimaal 2 karakters bevatten')
        .max(75, 'Functietitel mag maximaal 75 karakters bevatten')
        .parse(value)
      setErrors((prev) => ({ ...prev, jobTitle: '' }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, jobTitle: error.errors[0]?.message || '' }))
        return false
      }
    }
    return true
  }

  const validateJobSummary = (value: string) => {
    if (!value) return true // Optional field
    try {
      z.string()
        .min(20, 'Functie samenvatting moet minimaal 20 karakters bevatten')
        .max(300, 'Functie samenvatting mag maximaal 300 karakters bevatten')
        .parse(value)
      setErrors((prev) => ({ ...prev, jobSummary: '' }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, jobSummary: error.errors[0]?.message || '' }))
        return false
      }
    }
    return true
  }

  const handleChange = (field: keyof JobBasicsStepData, value: string) => {
    onChange({ ...data, [field]: value || undefined })

    // Alleen valideren als het veld al is aangeraakt
    if (touched[field]) {
      if (field === 'jobTitle') validateJobTitle(value)
      if (field === 'jobSummary') validateJobSummary(value)
    }
  }

  const handleBlur = (field: keyof JobBasicsStepData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = data[field]
    if (field === 'jobTitle' && value) validateJobTitle(value as string)
    if (field === 'jobSummary' && value) validateJobSummary(value as string)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Functie Basis
        </h2>
        <p className="text-slate-600">
          Geef de belangrijkste informatie over de functie
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Functietitel"
          placeholder="Bijv. Senior Java Developer"
          value={data.jobTitle || ''}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          onBlur={() => handleBlur('jobTitle')}
          error={touched.jobTitle ? errors.jobTitle : undefined}
          helperText="De titel van de functie"
        />

        <Select
          label="Ervaringsniveau"
          options={seniorityOptions}
          value={data.seniorityLevel || ''}
          onChange={(e) => handleChange('seniorityLevel', e.target.value)}
          placeholder="Selecteer ervaringsniveau"
          required
        />

        <div>
          <label htmlFor="jobSummary" className="mb-2 block text-sm font-medium text-slate-700">
            Functie Samenvatting
          </label>
          <textarea
            id="jobSummary"
            rows={4}
            className={`w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none ${
              errors.jobSummary && touched.jobSummary
                ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-200'
            }`}
            placeholder="Een korte beschrijving van de functie..."
            value={data.jobSummary || ''}
            onChange={(e) => handleChange('jobSummary', e.target.value)}
            onBlur={() => handleBlur('jobSummary')}
            maxLength={300}
          />
          {touched.jobSummary && errors.jobSummary ? (
            <p className="mt-1.5 text-sm text-red-600">{errors.jobSummary}</p>
          ) : (
            <p className="mt-1.5 text-sm text-slate-500">
              Een korte samenvatting van de functie (20-300 karakters)
              {data.jobSummary && ` • ${data.jobSummary.length}/300`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
