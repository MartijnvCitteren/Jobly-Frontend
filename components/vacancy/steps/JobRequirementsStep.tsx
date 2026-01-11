'use client'

import { useState } from 'react'
import { z } from 'zod'

export interface JobRequirementsStepData {
  tasks?: string
  skills?: string
  teamDescription?: string
}

export interface JobRequirementsStepProps {
  data: Partial<JobRequirementsStepData>
  onChange: (data: Partial<JobRequirementsStepData>) => void
}

/**
 * JobRequirementsStep Component
 *
 * Derde stap van de wizard voor taken, vaardigheden en team beschrijving
 */
export function JobRequirementsStep({ data, onChange }: JobRequirementsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: keyof JobRequirementsStepData, value: string) => {
    if (!value) return true // All fields are optional
    try {
      z.string()
        .min(10, `${getFieldLabel(field)} moet minimaal 10 karakters bevatten`)
        .max(300, `${getFieldLabel(field)} mag maximaal 300 karakters bevatten`)
        .parse(value)
      setErrors((prev) => ({ ...prev, [field]: '' }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0]?.message || '' }))
        return false
      }
    }
    return true
  }

  const getFieldLabel = (field: keyof JobRequirementsStepData): string => {
    const labels = {
      tasks: 'Taken',
      skills: 'Vaardigheden',
      teamDescription: 'Team beschrijving',
    }
    return labels[field]
  }

  const handleChange = (field: keyof JobRequirementsStepData, value: string) => {
    onChange({ ...data, [field]: value || undefined })

    // Alleen valideren als het veld al is aangeraakt
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: keyof JobRequirementsStepData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = data[field]
    if (value) validateField(field, value)
  }

  const renderTextarea = (
    field: keyof JobRequirementsStepData,
    label: string,
    placeholder: string,
    helperText: string
  ) => (
    <div key={field}>
      <label htmlFor={field} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={field}
        rows={4}
        className={`w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none ${
          errors[field] && touched[field]
            ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
            : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-200'
        }`}
        placeholder={placeholder}
        value={data[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={() => handleBlur(field)}
        maxLength={300}
      />
      {touched[field] && errors[field] ? (
        <p className="mt-1.5 text-sm text-red-600">{errors[field]}</p>
      ) : (
        <p className="mt-1.5 text-sm text-slate-500">
          {helperText}
          {data[field] && ` • ${data[field].length}/300`}
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Functie Eisen
        </h2>
        <p className="text-slate-600">
          Beschrijf de taken, vereiste vaardigheden en het team
        </p>
      </div>

      <div className="space-y-5">
        {renderTextarea(
          'tasks',
          'Taken en Verantwoordelijkheden',
          'Beschrijf de dagelijkse taken en verantwoordelijkheden...',
          'Wat zal de medewerker dagelijks doen? (10-300 karakters)'
        )}

        {renderTextarea(
          'skills',
          'Vereiste Vaardigheden',
          'Bijv. Java, Spring Boot, React, Agile...',
          'Welke vaardigheden en ervaring zijn vereist? (10-300 karakters)'
        )}

        {renderTextarea(
          'teamDescription',
          'Team Beschrijving',
          'Beschrijf het team waarin de medewerker komt te werken...',
          'Informatie over het team en de werkomgeving (10-300 karakters)'
        )}
      </div>
    </div>
  )
}
