/**
 * VacancyResult Component
 *
 * Display component voor een gegenereerde vacature.
 * Toont alle secties van de vacature in een clean, leesbaar format.
 */

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'

export interface VacancyResultProps {
  vacancy: GeneratedVacancy
  editable?: boolean
  onEdit?: (section: keyof GeneratedVacancy, value: string) => void
}

/**
 * VacancyResult - Pure presentatie component voor vacature weergave
 */
export const VacancyResult: React.FC<VacancyResultProps> = ({
  vacancy,
  editable = false,
  onEdit,
}) => {
  const sections = [
    {
      key: 'summary' as const,
      title: '📝 Samenvatting',
      content: vacancy.summary,
      highlight: true,
    },
    {
      key: 'companyDescription' as const,
      title: '🏢 Over het Bedrijf',
      content: vacancy.companyDescription,
    },
    {
      key: 'teamDescription' as const,
      title: '👥 Het Team',
      content: vacancy.teamDescription,
    },
    {
      key: 'dayToDayDescription' as const,
      title: '📅 Dagelijkse Werkzaamheden',
      content: vacancy.dayToDayDescription,
    },
    {
      key: 'jobDescription' as const,
      title: '💼 Functieomschrijving',
      content: vacancy.jobDescription,
    },
    {
      key: 'jobUniqueSellingPoints' as const,
      title: '✨ Waarom deze Functie?',
      content: vacancy.jobUniqueSellingPoints,
    },
    {
      key: 'requirements' as const,
      title: '🎯 Vereisten',
      content: vacancy.requirements,
    },
    {
      key: 'offer' as const,
      title: '🎁 Wat wij Bieden',
      content: vacancy.offer,
    },
    {
      key: 'contactInformation' as const,
      title: '📞 Contact',
      content: vacancy.contactInformation,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {sections.map((section) => {
        if (!section.content) return null

        return (
          <Card
            key={section.key}
            className={section.highlight ? 'border-2 border-indigo-200 shadow-md' : ''}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-slate-700 leading-relaxed ${
                  section.highlight ? 'text-lg font-medium' : ''
                }`}
              >
                {editable && onEdit ? (
                  <textarea
                    className="w-full min-h-[100px] p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y"
                    value={section.content}
                    onChange={(e) => onEdit(section.key, e.target.value)}
                    placeholder={`Bewerk ${section.title}...`}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{section.content}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default VacancyResult
