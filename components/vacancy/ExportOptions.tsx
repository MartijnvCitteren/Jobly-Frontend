/**
 * ExportOptions Component
 *
 * Biedt verschillende export opties voor gegenereerde vacatures:
 * - Kopiëren naar klembord
 * - Exporteren als PDF
 * - Exporteren als Word document
 * - Delen via email
 */

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'
import { jsPDF } from 'jspdf'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx'
import { saveAs } from 'file-saver'
import { ERROR_MESSAGES, SUCCESS_MESSAGES, EXPORT, APP_META } from '@/lib/config/constants'
import { createLogger } from '@/lib/utils/logger'
import { sanitizeString } from '@/lib/utils/sanitize'

const logger = createLogger('ExportOptions')

export interface ExportOptionsProps {
  vacancy: GeneratedVacancy
  className?: string
  showLabels?: boolean
}

/**
 * Type voor vacancy sectie
 */
interface VacancySection {
  title: string
  content?: string
}

/**
 * ExportOptions - Component voor het exporteren van vacatures in verschillende formats
 */
export const ExportOptions: React.FC<ExportOptionsProps> = ({
  vacancy,
  className = '',
  showLabels = true,
}) => {
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  /**
   * Definieer sections van de vacature
   */
  const sections: VacancySection[] = [
    { title: 'Samenvatting', content: vacancy.summary },
    { title: 'Over het Bedrijf', content: vacancy.companyDescription },
    { title: 'Het Team', content: vacancy.teamDescription },
    { title: 'Dagelijkse Werkzaamheden', content: vacancy.dayToDayDescription },
    { title: 'Functieomschrijving', content: vacancy.jobDescription },
    { title: 'Waarom deze Functie?', content: vacancy.jobUniqueSellingPoints },
    { title: 'Vereisten', content: vacancy.requirements },
    { title: 'Wat wij Bieden', content: vacancy.offer },
    { title: 'Contact', content: vacancy.contactInformation },
  ]

  /**
   * Filter sections met content
   */
  const validSections = sections.filter((section): section is VacancySection & { content: string } =>
    Boolean(section.content)
  )

  /**
   * Converteer vacancy naar platte tekst format
   */
  const vacancyToText = useCallback((): string => {
    return validSections
      .map((section) => {
        const sanitizedTitle = sanitizeString(section.title)
        const sanitizedContent = sanitizeString(section.content)
        return `${sanitizedTitle}\n${'='.repeat(sanitizedTitle.length)}\n\n${sanitizedContent}`
      })
      .join('\n\n\n')
  }, [validSections])

  /**
   * Kopieer vacature naar klembord
   */
  const handleCopyToClipboard = useCallback(async () => {
    try {
      const text = vacancyToText()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      logger.info('Vacancy copied to clipboard')
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      logger.error('Failed to copy to clipboard', error)
      alert(ERROR_MESSAGES.COPY_CLIPBOARD)
    }
  }, [vacancyToText])

  /**
   * Exporteer als PDF
   */
  const handleExportPDF = useCallback(async () => {
    setIsExporting(true)
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = EXPORT.PDF.MARGIN
      const maxWidth = pageWidth - 2 * margin
      let yPos = margin

      /**
       * Helper functie om text te wrappen en toe te voegen
       */
      const addWrappedText = (
        text: string,
        fontSize: number,
        isBold = false
      ): void => {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')

        const lines = doc.splitTextToSize(text, maxWidth)

        for (const line of lines) {
          // Check of we een nieuwe pagina nodig hebben
          if (yPos + fontSize / 2 > pageHeight - margin) {
            doc.addPage()
            yPos = margin
          }

          doc.text(line, margin, yPos)
          yPos += fontSize / 2 + 2
        }
      }

      // Hoofdtitel
      doc.setFontSize(EXPORT.PDF.FONT_SIZE.TITLE)
      doc.setFont('helvetica', 'bold')
      doc.text('Vacature', margin, yPos)
      yPos += EXPORT.PDF.LINE_HEIGHT.TITLE

      // Voeg sections toe
      for (const section of validSections) {
        // Section titel
        yPos += 5
        addWrappedText(section.title, EXPORT.PDF.FONT_SIZE.SECTION_TITLE, true)
        yPos += EXPORT.PDF.LINE_HEIGHT.SECTION_TITLE

        // Section content
        addWrappedText(section.content, EXPORT.PDF.FONT_SIZE.BODY, false)
        yPos += EXPORT.PDF.LINE_HEIGHT.BODY
      }

      // Download PDF
      const fileName = `${EXPORT.FILE_NAME_PREFIX}-${Date.now()}.pdf`
      doc.save(fileName)

      logger.info('PDF exported successfully', { fileName })
    } catch (error) {
      logger.error('Failed to export PDF', error)
      alert(ERROR_MESSAGES.EXPORT_PDF)
    } finally {
      setIsExporting(false)
    }
  }, [validSections])

  /**
   * Exporteer als Word document
   */
  const handleExportWord = useCallback(async () => {
    setIsExporting(true)
    try {
      // Bouw document structuur
      const documentSections: Paragraph[] = []

      // Titel
      documentSections.push(
        new Paragraph({
          text: 'Vacature',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
        })
      )

      // Voeg sections toe
      for (const section of validSections) {
        // Section titel
        documentSections.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 300,
              after: 200,
            },
          })
        )

        // Section content - splits op nieuwe regels voor betere formatting
        const contentLines = section.content.split('\n')
        for (const line of contentLines) {
          if (line.trim()) {
            documentSections.push(
              new Paragraph({
                children: [new TextRun(line.trim())],
                spacing: {
                  after: 100,
                },
              })
            )
          } else {
            // Lege regel voor spacing
            documentSections.push(new Paragraph({ text: '' }))
          }
        }
      }

      // Creëer Word document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: documentSections,
          },
        ],
      })

      // Genereer en download
      const blob = await Packer.toBlob(doc)
      const fileName = `${EXPORT.FILE_NAME_PREFIX}-${Date.now()}.docx`
      saveAs(blob, fileName)

      logger.info('Word document exported successfully', { fileName })
    } catch (error) {
      logger.error('Failed to export Word document', error)
      alert(ERROR_MESSAGES.EXPORT_WORD)
    } finally {
      setIsExporting(false)
    }
  }, [validSections])

  /**
   * Deel via email
   */
  const handleEmailShare = useCallback(() => {
    try {
      const text = vacancyToText()
      const subject = encodeURIComponent(`Vacature van ${APP_META.NAME}`)
      const body = encodeURIComponent(text)
      const mailtoLink = `mailto:?subject=${subject}&body=${body}`
      window.location.href = mailtoLink

      logger.info('Email share initiated')
    } catch (error) {
      logger.error('Failed to initiate email share', error)
    }
  }, [vacancyToText])

  return (
    <div className={`space-y-4 ${className}`}>
      {showLabels && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Export Opties</h3>
          <p className="text-sm text-slate-600">
            Kies hoe je de vacature wilt delen of opslaan
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Kopieer naar Klembord */}
        <Button
          onClick={handleCopyToClipboard}
          variant={copied ? 'secondary' : 'outline'}
          className="flex items-center justify-center gap-2"
          aria-label="Kopieer vacature naar klembord"
        >
          <span className="text-xl" role="img" aria-label={copied ? 'Gekopieerd' : 'Klembord'}>
            {copied ? '✅' : '📋'}
          </span>
          <span>{copied ? SUCCESS_MESSAGES.COPIED : 'Kopieer Tekst'}</span>
        </Button>

        {/* Email Delen */}
        <Button
          onClick={handleEmailShare}
          variant="outline"
          className="flex items-center justify-center gap-2"
          aria-label="Deel vacature via email"
        >
          <span className="text-xl" role="img" aria-label="Email">
            📧
          </span>
          <span>Delen via Email</span>
        </Button>

        {/* PDF Export */}
        <Button
          onClick={handleExportPDF}
          variant="outline"
          disabled={isExporting}
          className="flex items-center justify-center gap-2"
          aria-label="Download vacature als PDF"
        >
          <span className="text-xl" role="img" aria-label="PDF">
            📄
          </span>
          <span>{isExporting ? 'Exporteren...' : 'Download als PDF'}</span>
        </Button>

        {/* Word Export */}
        <Button
          onClick={handleExportWord}
          variant="outline"
          disabled={isExporting}
          className="flex items-center justify-center gap-2"
          aria-label="Download vacature als Word document"
        >
          <span className="text-xl" role="img" aria-label="Word">
            📝
          </span>
          <span>{isExporting ? 'Exporteren...' : 'Download als Word'}</span>
        </Button>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span role="img" aria-label="Tip">💡</span> <strong>Tip:</strong> Export je vacature als PDF of Word document, of gebruik de kopieer
          functie om de tekst direct te gebruiken in andere applicaties.
        </p>
      </div>
    </div>
  )
}

export default ExportOptions
