/**
 * VacancyEditor Component
 *
 * Editable versie van de vacancy display met rich text editing mogelijkheden.
 * Stelt gebruikers in staat om gegenereerde tekst aan te passen voordat export.
 */

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'

export interface VacancyEditorProps {
  vacancy: GeneratedVacancy
  onSave?: (updatedVacancy: GeneratedVacancy) => void
  onCancel?: () => void
}

interface EditableSection {
  key: keyof GeneratedVacancy
  title: string
  icon: string
  placeholder: string
}

/**
 * VacancyEditor - Component voor het bewerken van gegenereerde vacatures
 */
export const VacancyEditor: React.FC<VacancyEditorProps> = ({
  vacancy,
  onSave,
  onCancel,
}) => {
  const [editedVacancy, setEditedVacancy] = useState<GeneratedVacancy>(vacancy)
  const [hasChanges, setHasChanges] = useState(false)

  const sections: EditableSection[] = [
    {
      key: 'summary',
      title: 'Samenvatting',
      icon: '📝',
      placeholder: 'Korte samenvatting van de functie...',
    },
    {
      key: 'companyDescription',
      title: 'Over het Bedrijf',
      icon: '🏢',
      placeholder: 'Beschrijving van het bedrijf...',
    },
    {
      key: 'teamDescription',
      title: 'Het Team',
      icon: '👥',
      placeholder: 'Beschrijving van het team...',
    },
    {
      key: 'dayToDayDescription',
      title: 'Dagelijkse Werkzaamheden',
      icon: '📅',
      placeholder: 'Wat doe je dagelijks...',
    },
    {
      key: 'jobDescription',
      title: 'Functieomschrijving',
      icon: '💼',
      placeholder: 'Volledige functieomschrijving...',
    },
    {
      key: 'jobUniqueSellingPoints',
      title: 'Waarom deze Functie?',
      icon: '✨',
      placeholder: 'Waarom is deze functie interessant...',
    },
    {
      key: 'requirements',
      title: 'Vereisten',
      icon: '🎯',
      placeholder: 'Wat vragen we van de kandidaat...',
    },
    {
      key: 'offer',
      title: 'Wat wij Bieden',
      icon: '🎁',
      placeholder: 'Wat biedt het bedrijf...',
    },
    {
      key: 'contactInformation',
      title: 'Contact',
      icon: '📞',
      placeholder: 'Contactinformatie...',
    },
  ]

  const handleSectionChange = (key: keyof GeneratedVacancy, value: string) => {
    setEditedVacancy((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedVacancy)
      setHasChanges(false)
    }
  }

  const handleReset = () => {
    setEditedVacancy(vacancy)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Bewerkmodus</h3>
            <p className="text-sm text-slate-600">
              Pas de gegenereerde tekst aan naar jouw wensen
            </p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                ↺ Reset
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                Annuleren
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              💾 Opslaan
            </Button>
          </div>
        </div>
      </div>

      {/* Editable Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const value = editedVacancy[section.key]

          return (
            <Card key={section.key} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-[120px] p-4 border border-slate-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                           resize-y text-slate-700 leading-relaxed
                           transition-all duration-200"
                  value={value || ''}
                  onChange={(e) => handleSectionChange(section.key, e.target.value)}
                  placeholder={section.placeholder}
                />
                <div className="mt-2 text-xs text-slate-500">
                  {value?.length || 0} karakters
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 sticky bottom-4 bg-white rounded-lg p-4 shadow-lg border border-slate-200">
        {hasChanges && (
          <span className="text-sm text-amber-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            Niet opgeslagen wijzigingen
          </span>
        )}
        <div className="flex-1"></div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Annuleren
          </Button>
        )}
        {hasChanges && (
          <Button variant="secondary" onClick={handleReset}>
            Reset naar Origineel
          </Button>
        )}
        <Button variant="primary" onClick={handleSave} disabled={!hasChanges}>
          💾 Wijzigingen Opslaan
        </Button>
      </div>
    </div>
  )
}

export default VacancyEditor
