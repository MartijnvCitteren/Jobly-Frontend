'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, LoadingSpinner } from '@/components/ui'
import { VacancyResult, VacancyEditor, ExportOptions } from '@/components/vacancy'
import { ErrorMessage } from '@/components/common'
import { handleError, type AppError } from '@/lib/utils/error-handler'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'

/**
 * Vacancy Result Page
 *
 * Toont de gegenereerde vacature met alle secties
 */
export default function VacancyResultPage() {
  const router = useRouter()
  const [vacancy, setVacancy] = useState<GeneratedVacancy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    // Haal de gegenereerde vacature op uit sessionStorage
    if (typeof window !== 'undefined') {
      const storedVacancy = sessionStorage.getItem('generatedVacancy')
      if (storedVacancy) {
        try {
          const parsed = JSON.parse(storedVacancy)
          setVacancy(parsed)
        } catch (err) {
          const appError = handleError(err, 'VacancyResultPage.loadVacancy')
          setError(appError)
        }
      }
    }
    setIsLoading(false)
  }, [])

  const handleSaveEdits = (updatedVacancy: GeneratedVacancy) => {
    try {
      setVacancy(updatedVacancy)
      // Update sessionStorage met bewerkte versie
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('generatedVacancy', JSON.stringify(updatedVacancy))
      }
      setIsEditMode(false)
      setError(null) // Clear any previous errors
    } catch (err) {
      const appError = handleError(err, 'VacancyResultPage.saveEdits')
      setError(appError)
    }
  }

  const handleCreateAnother = () => {
    // Clear sessionStorage en ga terug naar create page
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('generatedVacancy')
      sessionStorage.removeItem('vacancyFormData')
    }
    router.push('/vacancies/create')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-600">Vacature laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="mx-auto max-w-4xl">
          {error && (
            <div className="mb-6">
              <ErrorMessage
                error={error}
                title="Fout bij laden van vacature"
                showRetry
                onRetry={() => {
                  setError(null)
                  window.location.reload()
                }}
              />
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="mb-4 text-2xl font-bold text-slate-800">
              Geen vacature gevonden
            </h2>
            <p className="mb-6 text-slate-600">
              Er is geen gegenereerde vacature beschikbaar. Start met het maken van een nieuwe vacature.
            </p>
            <Button onClick={() => router.push('/vacancies/create')} variant="primary" size="lg">
              ➕ Maak een Nieuwe Vacature
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage
              error={error}
              title="Er is een fout opgetreden"
              showRetry
              onRetry={() => setError(null)}
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-slate-800">
                ✨ Jouw Gegenereerde Vacature
              </h1>
              <p className="text-lg text-slate-600">
                {isEditMode
                  ? 'Pas de vacaturetekst aan naar jouw wensen'
                  : 'Hieronder vind je de volledige vacaturetekst'}
              </p>
            </div>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              ← Terug naar Home
            </Button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditMode(false)}
              variant={!isEditMode ? 'primary' : 'outline'}
              size="sm"
            >
              👁️ Weergave
            </Button>
            <Button
              onClick={() => setIsEditMode(true)}
              variant={isEditMode ? 'primary' : 'outline'}
              size="sm"
            >
              ✏️ Bewerken
            </Button>
          </div>
          <Button onClick={handleCreateAnother} variant="secondary" size="sm">
            ➕ Nieuwe Vacature
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vacancy Display/Editor */}
          <div className="lg:col-span-2">
            {isEditMode ? (
              <VacancyEditor
                vacancy={vacancy}
                onSave={handleSaveEdits}
                onCancel={() => setIsEditMode(false)}
              />
            ) : (
              <VacancyResult vacancy={vacancy} />
            )}
          </div>

          {/* Sidebar - Export Options */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Export Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <ExportOptions vacancy={vacancy} showLabels={true} />
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Snelle Acties
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsEditMode(!isEditMode)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {isEditMode ? '👁️ Bekijk Vacature' : '✏️ Bewerk Vacature'}
                  </Button>
                  <Button
                    onClick={handleCreateAnother}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    ➕ Nieuwe Vacature
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    🏠 Terug naar Home
                  </Button>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100">
                <div className="text-3xl mb-3">💡</div>
                <h4 className="font-semibold text-slate-800 mb-2">Tips</h4>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• Bewerk de tekst naar jouw wensen</li>
                  <li>• Exporteer als PDF of Word</li>
                  <li>• Deel direct via email</li>
                  <li>• Kopieer naar klembord voor direct gebruik</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
