'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { CompanyInfoRequestSchema } from '@/lib/domain/vacancy.schema'
import { CompanyInfoRequest, Country } from '@/lib/domain/vacancy.types'
import { z } from 'zod'

export interface CompanyInfoStepProps {
  data: Partial<CompanyInfoRequest>
  onChange: (data: Partial<CompanyInfoRequest>) => void
}

const countryOptions: SelectOption[] = [
  { value: Country.THE_NETHERLANDS, label: 'Nederland' },
  { value: Country.BELGIUM, label: 'België' },
  { value: Country.GERMANY, label: 'Duitsland' },
]

/**
 * CompanyInfoStep Component
 *
 * Eerste stap van de wizard voor het invoeren van bedrijfsinformatie
 */
export function CompanyInfoStep({ data, onChange }: CompanyInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (fieldName: keyof CompanyInfoRequest, value: unknown) => {
    try {
      const fieldSchema = CompanyInfoRequestSchema.shape[fieldName]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors((prev) => ({ ...prev, [fieldName]: '' }))
        return true
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [fieldName]: error.errors[0]?.message || 'Validatie fout' }))
        return false
      }
    }
    return true
  }

  const handleChange = (field: keyof CompanyInfoRequest, value: string) => {
    onChange({ ...data, [field]: value || undefined })

    // Alleen valideren als het veld al is aangeraakt
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: keyof CompanyInfoRequest) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, data[field])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Bedrijfsinformatie
        </h2>
        <p className="text-slate-600">
          Vertel ons over het bedrijf waarvoor je een vacature wilt maken
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Bedrijfsnaam"
          placeholder="Bijv. TechCorp"
          value={data.companyName || ''}
          onChange={(e) => handleChange('companyName', e.target.value)}
          onBlur={() => handleBlur('companyName')}
          error={touched.companyName ? errors.companyName : undefined}
          helperText="De naam van het bedrijf (optioneel)"
        />

        <Input
          label="Bedrijfswebsite"
          placeholder="www.voorbeeld.nl"
          value={data.companyWebsite || ''}
          onChange={(e) => handleChange('companyWebsite', e.target.value)}
          onBlur={() => handleBlur('companyWebsite')}
          error={touched.companyWebsite ? errors.companyWebsite : undefined}
          helperText="Begin met 'www.' gevolgd door het domein"
          required
        />

        <Select
          label="Land"
          options={countryOptions}
          value={data.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
          onBlur={() => handleBlur('country')}
          error={touched.country ? errors.country : undefined}
          placeholder="Selecteer een land"
          required
        />

        <Input
          label="Voorbeeld vacature URL"
          placeholder="www.voorbeeld.nl/vacatures/senior-developer"
          value={data.exampleVacancyUrl || ''}
          onChange={(e) => handleChange('exampleVacancyUrl', e.target.value)}
          onBlur={() => handleBlur('exampleVacancyUrl')}
          error={touched.exampleVacancyUrl ? errors.exampleVacancyUrl : undefined}
          helperText="Link naar een bestaande vacature voor referentie (optioneel)"
        />
      </div>
    </div>
  )
}
