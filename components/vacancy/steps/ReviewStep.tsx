'use client'
import { Card } from '@/components/ui/Card'
import {
  CompanyInfoRequest,
  Country,
  SeniorityLevel,
  WritingStyle,
  Language,
  SalaryPeriod,
  JobInfoRequest,
} from '@/lib/domain/vacancy.types'

export interface ReviewStepData {
  companyInfo: Partial<CompanyInfoRequest>
  jobInfo: Partial<JobInfoRequest>
}

export interface ReviewStepProps {
  data: ReviewStepData
}

/**
 * ReviewStep Component
 *
 * Laatste stap van de wizard voor het controleren van alle ingevoerde gegevens
 */
export function ReviewStep({ data }: ReviewStepProps) {
  const { companyInfo, jobInfo } = data

  const formatEnumValue = (value: string | undefined): string => {
    if (!value) return '-'

    const translations: Record<string, string> = {
      // Countries
      [Country.THE_NETHERLANDS]: 'Nederland',
      [Country.BELGIUM]: 'België',
      [Country.GERMANY]: 'Duitsland',
      // Seniority
      [SeniorityLevel.INTERN]: 'Stage',
      [SeniorityLevel.JUNIOR]: 'Junior',
      [SeniorityLevel.MEDIOR]: 'Medior',
      [SeniorityLevel.SENIOR]: 'Senior',
      // Writing Style
      [WritingStyle.FORMAL]: 'Formeel',
      [WritingStyle.BUSINESS_CASUAL]: 'Zakelijk Informeel',
      [WritingStyle.CASUAL]: 'Informeel',
      [WritingStyle.CREATIVE]: 'Creatief',
      [WritingStyle.TECHNICAL]: 'Technisch',
      // Language
      [Language.DUTCH]: 'Nederlands',
      [Language.ENGLISH]: 'Engels',
      [Language.FLEMISH]: 'Vlaams',
      [Language.FRENCH]: 'Frans',
      [Language.GERMAN]: 'Duits',
      // Salary Period
      [SalaryPeriod.YEARLY]: 'Per jaar',
      [SalaryPeriod.MONTHLY]: 'Per maand',
      [SalaryPeriod.WEEKLY]: 'Per week',
      [SalaryPeriod.DAILY]: 'Per dag',
      [SalaryPeriod.HOURLY]: 'Per uur',
    }

    return translations[value] || value
  }

  const formatSalary = (min?: number, max?: number, period?: SalaryPeriod): string => {
    if (!min && !max) return '-'
    const periodStr = period ? ` ${formatEnumValue(period).toLowerCase()}` : ''
    if (min && max) {
      return `€${min.toLocaleString('nl-NL')} - €${max.toLocaleString('nl-NL')}${periodStr}`
    }
    if (min) {
      return `vanaf €${min.toLocaleString('nl-NL')}${periodStr}`
    }
    if (max) {
      return `tot €${max.toLocaleString('nl-NL')}${periodStr}`
    }
    return '-'
  }

  const renderSection = (title: string, items: Array<{ label: string; value: string }>) => (
    <Card padding="md" className="bg-slate-50">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      <dl className="space-y-3">
        {items.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start">
            <dt className="text-sm font-medium text-slate-600 flex-shrink-0 w-1/3">{label}:</dt>
            <dd className="text-sm text-slate-800 flex-grow text-right break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Controleer je Gegevens
        </h2>
        <p className="text-slate-600">
          Controleer alle gegevens voordat je de vacature genereert
        </p>
      </div>

      <div className="space-y-5">
        {/* Company Info */}
        {renderSection('Bedrijfsinformatie', [
          { label: 'Bedrijfsnaam', value: companyInfo.companyName || '-' },
          { label: 'Website', value: companyInfo.companyWebsite || '-' },
          { label: 'Land', value: formatEnumValue(companyInfo.country) },
          { label: 'Voorbeeld URL', value: companyInfo.exampleVacancyUrl || '-' },
        ])}

        {/* Job Basics */}
        {renderSection('Functie Basis', [
          { label: 'Functietitel', value: jobInfo.jobTitle || '-' },
          { label: 'Ervaringsniveau', value: formatEnumValue(jobInfo.seniorityLevel) },
          {
            label: 'Samenvatting',
            value: jobInfo.jobSummary
              ? jobInfo.jobSummary.length > 100
                ? `${jobInfo.jobSummary.substring(0, 100)}...`
                : jobInfo.jobSummary
              : '-',
          },
        ])}

        {/* Job Requirements */}
        {renderSection('Functie Eisen', [
          {
            label: 'Taken',
            value: jobInfo.tasks
              ? jobInfo.tasks.length > 100
                ? `${jobInfo.tasks.substring(0, 100)}...`
                : jobInfo.tasks
              : '-',
          },
          {
            label: 'Vaardigheden',
            value: jobInfo.skills
              ? jobInfo.skills.length > 100
                ? `${jobInfo.skills.substring(0, 100)}...`
                : jobInfo.skills
              : '-',
          },
          {
            label: 'Team',
            value: jobInfo.teamDescription
              ? jobInfo.teamDescription.length > 100
                ? `${jobInfo.teamDescription.substring(0, 100)}...`
                : jobInfo.teamDescription
              : '-',
          },
        ])}

        {/* Writing Style */}
        {renderSection('Schrijfstijl', [
          { label: 'Toon', value: formatEnumValue(jobInfo.writingStyle?.writingStyle) },
          { label: 'Taal', value: formatEnumValue(jobInfo.writingStyle?.language) },
        ])}

        {/* Benefits */}
        {(jobInfo.benefits?.minSalary ||
          jobInfo.benefits?.maxSalary ||
          jobInfo.benefits?.extraPerks) && (
          <>
            {renderSection('Salaris & Voordelen', [
              {
                label: 'Salaris',
                value: formatSalary(
                  jobInfo.benefits?.minSalary,
                  jobInfo.benefits?.maxSalary,
                  jobInfo.benefits?.salaryPeriod
                ),
              },
              { label: 'Extra voordelen', value: jobInfo.benefits?.extraPerks || '-' },
            ])}
          </>
        )}

        {/* Contact Info */}
        {(jobInfo.contactInfo?.name ||
          jobInfo.contactInfo?.mail ||
          jobInfo.contactInfo?.phoneNumber) && (
          <>
            {renderSection('Contactinformatie', [
              { label: 'Naam', value: jobInfo.contactInfo?.name || '-' },
              { label: 'E-mail', value: jobInfo.contactInfo?.mail || '-' },
              { label: 'Telefoon', value: jobInfo.contactInfo?.phoneNumber || '-' },
            ])}
          </>
        )}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
        <p className="text-sm text-indigo-800">
          💡 <strong>Let op:</strong> Na het genereren kun je de vacaturetekst nog bewerken en
          aanpassen naar je wensen.
        </p>
      </div>
    </div>
  )
}
