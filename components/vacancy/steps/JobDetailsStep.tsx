'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import {
  WritingStyle,
  Language,
  SalaryPeriod,
  WritingStyleRequest,
  BenefitsRequest,
  ContactInfoRequest,
} from '@/lib/domain/vacancy.types'
import { BenefitsRequestSchema } from '@/lib/domain/vacancy.schema'
import { z } from 'zod'

export interface JobDetailsStepData {
  writingStyle: WritingStyleRequest
  benefits?: BenefitsRequest
  contactInfo?: ContactInfoRequest
}

export interface JobDetailsStepProps {
  data: Partial<JobDetailsStepData>
  onChange: (data: Partial<JobDetailsStepData>) => void
}

const writingStyleOptions: SelectOption[] = [
  { value: WritingStyle.FORMAL, label: 'Formeel' },
  { value: WritingStyle.BUSINESS_CASUAL, label: 'Zakelijk Informeel' },
  { value: WritingStyle.CASUAL, label: 'Informeel' },
  { value: WritingStyle.CREATIVE, label: 'Creatief' },
  { value: WritingStyle.TECHNICAL, label: 'Technisch' },
]

const languageOptions: SelectOption[] = [
  { value: Language.DUTCH, label: 'Nederlands' },
  { value: Language.ENGLISH, label: 'Engels' },
  { value: Language.FLEMISH, label: 'Vlaams' },
  { value: Language.FRENCH, label: 'Frans' },
  { value: Language.GERMAN, label: 'Duits' },
]

const salaryPeriodOptions: SelectOption[] = [
  { value: SalaryPeriod.YEARLY, label: 'Per jaar' },
  { value: SalaryPeriod.MONTHLY, label: 'Per maand' },
  { value: SalaryPeriod.WEEKLY, label: 'Per week' },
  { value: SalaryPeriod.DAILY, label: 'Per dag' },
  { value: SalaryPeriod.HOURLY, label: 'Per uur' },
]

/**
 * JobDetailsStep Component
 *
 * Vierde stap van de wizard voor schrijfstijl, salaris en contactinformatie
 */
export function JobDetailsStep({ data, onChange }: JobDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateBenefitsField = (
    field: keyof BenefitsRequest,
    value: unknown,
    allBenefits: Partial<BenefitsRequest>
  ) => {
    if (!value && value !== 0) return true // Optional fields

    try {
      if (field === 'minSalary' || field === 'maxSalary') {
        // Valideer het hele benefits object voor cross-field validatie
        BenefitsRequestSchema.parse(allBenefits)
        setErrors((prev) => ({ ...prev, minSalary: '', maxSalary: '' }))
      } else if (field === 'extraPerks') {
        z.string()
          .min(10, 'Extra voordelen moeten minimaal 10 karakters bevatten')
          .max(100, 'Extra voordelen mogen maximaal 100 karakters bevatten')
          .parse(value)
        setErrors((prev) => ({ ...prev, [field]: '' }))
      } else {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || 'Validatie fout'
        setErrors((prev) => ({ ...prev, [field]: errorMessage }))
        return false
      }
    }
    return true
  }

  const validateContactField = (field: keyof ContactInfoRequest, value: unknown) => {
    if (!value || value === '') return true // All contact fields are optional
    try {
      if (field === 'name') {
        z.string().max(25, 'Naam mag maximaal 25 karakters bevatten').parse(value)
      } else if (field === 'mail') {
        z.string()
          .max(50, 'Email mag maximaal 50 karakters bevatten')
          .email('Ongeldig email formaat')
          .parse(value)
      } else if (field === 'phoneNumber') {
        z.string()
          .min(10, 'Telefoonnummer moet minimaal 10 karakters bevatten')
          .max(15, 'Telefoonnummer mag maximaal 15 karakters bevatten')
          .regex(/^[0-9\-+ ]+$/, 'Telefoonnummer mag alleen cijfers, -, + en spaties bevatten')
          .parse(value)
      }
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

  const handleWritingStyleChange = (field: keyof WritingStyleRequest, value: string) => {
    const newWritingStyle = { ...data.writingStyle, [field]: value }
    onChange({ ...data, writingStyle: newWritingStyle as WritingStyleRequest })
  }

  const handleBenefitsChange = (field: keyof BenefitsRequest, value: string | number) => {
    const currentBenefits = data.benefits || {}
    const newBenefits = { ...currentBenefits, [field]: value || undefined }
    onChange({ ...data, benefits: newBenefits as BenefitsRequest })

    if (touched[field]) {
      validateBenefitsField(field, value, newBenefits)
    }
  }

  const handleContactChange = (field: keyof ContactInfoRequest, value: string) => {
    const currentContact = data.contactInfo || {}
    const newContact = { ...currentContact, [field]: value || undefined }
    onChange({ ...data, contactInfo: newContact })

    if (touched[field]) {
      validateContactField(field, value)
    }
  }

  const handleBlur = (section: 'benefits' | 'contact', field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    if (section === 'benefits') {
      const value = data.benefits?.[field as keyof BenefitsRequest]
      validateBenefitsField(field as keyof BenefitsRequest, value, data.benefits || {})
    } else if (section === 'contact') {
      const value = data.contactInfo?.[field as keyof ContactInfoRequest]
      validateContactField(field as keyof ContactInfoRequest, value)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Schrijfstijl & Details
        </h2>
        <p className="text-slate-600">
          Bepaal de schrijfstijl en voeg extra details toe
        </p>
      </div>

      {/* Writing Style Section */}
      <div className="space-y-5 p-5 bg-slate-50 rounded-xl">
        <h3 className="text-lg font-semibold text-slate-800">Schrijfstijl</h3>

        <Select
          label="Toon"
          options={writingStyleOptions}
          value={data.writingStyle?.writingStyle || ''}
          onChange={(e) => handleWritingStyleChange('writingStyle', e.target.value)}
          placeholder="Selecteer schrijfstijl"
          required
        />

        <Select
          label="Taal"
          options={languageOptions}
          value={data.writingStyle?.language || ''}
          onChange={(e) => handleWritingStyleChange('language', e.target.value)}
          placeholder="Selecteer taal"
          required
        />
      </div>

      {/* Benefits Section */}
      <div className="space-y-5 p-5 bg-slate-50 rounded-xl">
        <h3 className="text-lg font-semibold text-slate-800">Salaris & Voordelen (optioneel)</h3>

        <Select
          label="Salaris Periode"
          options={salaryPeriodOptions}
          value={data.benefits?.salaryPeriod || ''}
          onChange={(e) => handleBenefitsChange('salaryPeriod', e.target.value)}
          placeholder="Selecteer periode"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Minimum Salaris"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            max="999999.99"
            value={data.benefits?.minSalary?.toString() || ''}
            onChange={(e) => handleBenefitsChange('minSalary', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('benefits', 'minSalary')}
            error={touched.minSalary ? errors.minSalary : undefined}
          />

          <Input
            label="Maximum Salaris"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            max="999999.99"
            value={data.benefits?.maxSalary?.toString() || ''}
            onChange={(e) => handleBenefitsChange('maxSalary', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('benefits', 'maxSalary')}
            error={touched.maxSalary ? errors.maxSalary : undefined}
          />
        </div>

        <div>
          <label htmlFor="extraPerks" className="mb-2 block text-sm font-medium text-slate-700">
            Extra Voordelen
          </label>
          <textarea
            id="extraPerks"
            rows={3}
            className={`w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none ${
              errors.extraPerks && touched.extraPerks
                ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-200'
            }`}
            placeholder="Bijv. leaseauto, thuiswerken, pensioenregeling..."
            value={data.benefits?.extraPerks || ''}
            onChange={(e) => handleBenefitsChange('extraPerks', e.target.value)}
            onBlur={() => handleBlur('benefits', 'extraPerks')}
            maxLength={100}
          />
          {touched.extraPerks && errors.extraPerks ? (
            <p className="mt-1.5 text-sm text-red-600">{errors.extraPerks}</p>
          ) : (
            <p className="mt-1.5 text-sm text-slate-500">
              Andere voordelen naast het salaris (10-100 karakters)
              {data.benefits?.extraPerks && ` • ${data.benefits.extraPerks.length}/100`}
            </p>
          )}
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="space-y-5 p-5 bg-slate-50 rounded-xl">
        <h3 className="text-lg font-semibold text-slate-800">Contactinformatie (optioneel)</h3>

        <Input
          label="Naam"
          placeholder="Jan Jansen"
          value={data.contactInfo?.name || ''}
          onChange={(e) => handleContactChange('name', e.target.value)}
          onBlur={() => handleBlur('contact', 'name')}
          error={touched.name ? errors.name : undefined}
          helperText="Naam van de contactpersoon"
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="contact@bedrijf.nl"
          value={data.contactInfo?.mail || ''}
          onChange={(e) => handleContactChange('mail', e.target.value)}
          onBlur={() => handleBlur('contact', 'mail')}
          error={touched.mail ? errors.mail : undefined}
          helperText="E-mailadres voor sollicitaties"
        />

        <Input
          label="Telefoonnummer"
          type="tel"
          placeholder="+31 20 123 4567"
          value={data.contactInfo?.phoneNumber || ''}
          onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
          onBlur={() => handleBlur('contact', 'phoneNumber')}
          error={touched.phoneNumber ? errors.phoneNumber : undefined}
          helperText="Telefoonnummer (10-15 karakters)"
        />
      </div>
    </div>
  )
}
