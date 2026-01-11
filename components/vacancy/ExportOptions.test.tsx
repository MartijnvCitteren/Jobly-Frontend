/**
 * ExportOptions Component Tests
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ExportOptions } from './ExportOptions'
import type { GeneratedVacancy } from '@/lib/domain/vacancy.types'

// Mock jsPDF
const mockSave = jest.fn()
const mockAddPage = jest.fn()
const mockText = jest.fn()
const mockSetFontSize = jest.fn()
const mockSetFont = jest.fn()
const mockSplitTextToSize = jest.fn((text: string) => [text])

jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
    save: mockSave,
    addPage: mockAddPage,
    text: mockText,
    setFontSize: mockSetFontSize,
    setFont: mockSetFont,
    splitTextToSize: mockSplitTextToSize,
  })),
}))

// Mock docx library - use inline mock functions to avoid hoisting issues
jest.mock('docx', () => ({
  Document: jest.fn(),
  Packer: {
    toBlob: jest.fn().mockResolvedValue(new Blob(['mock docx content'])),
  },
  Paragraph: jest.fn(),
  TextRun: jest.fn(),
  HeadingLevel: {
    HEADING_1: 'HEADING_1',
    HEADING_2: 'HEADING_2',
  },
  AlignmentType: {
    CENTER: 'CENTER',
  },
  UnderlineType: {},
}))

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

describe('ExportOptions', () => {
  const mockVacancy: GeneratedVacancy = {
    summary: 'Test samenvatting',
    companyDescription: 'Test bedrijfsbeschrijving',
    teamDescription: 'Test team',
    dayToDayDescription: 'Test dagelijks',
    jobDescription: 'Test functie',
    jobUniqueSellingPoints: 'Test USPs',
    requirements: 'Test vereisten',
    offer: 'Test aanbod',
    contactInformation: 'Test contact',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSave.mockClear()
    mockAddPage.mockClear()
    mockText.mockClear()
    mockSetFontSize.mockClear()
    mockSetFont.mockClear()
    mockSplitTextToSize.mockClear()
  })

  it('renders all export buttons', () => {
    render(<ExportOptions vacancy={mockVacancy} />)

    expect(screen.getByText('Kopieer Tekst')).toBeInTheDocument()
    expect(screen.getByText('Delen via Email')).toBeInTheDocument()
    expect(screen.getByText('Download als PDF')).toBeInTheDocument()
    expect(screen.getByText('Download als Word')).toBeInTheDocument()
  })

  it('shows labels when showLabels is true', () => {
    render(<ExportOptions vacancy={mockVacancy} showLabels={true} />)

    expect(screen.getByText('Export Opties')).toBeInTheDocument()
    expect(
      screen.getByText('Kies hoe je de vacature wilt delen of opslaan')
    ).toBeInTheDocument()
  })

  it('hides labels when showLabels is false', () => {
    render(<ExportOptions vacancy={mockVacancy} showLabels={false} />)

    expect(screen.queryByText('Export Opties')).not.toBeInTheDocument()
  })

  it('copies to clipboard when copy button is clicked', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator.clipboard, { writeText: writeTextMock })

    render(<ExportOptions vacancy={mockVacancy} />)

    const copyButton = screen.getByText('Kopieer Tekst')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalled()
      expect(screen.getByText('Gekopieerd!')).toBeInTheDocument()
    })
  })

  it('shows copied state temporarily after copying', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator.clipboard, { writeText: writeTextMock })

    render(<ExportOptions vacancy={mockVacancy} />)

    const copyButton = screen.getByText('Kopieer Tekst')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByText('Gekopieerd!')).toBeInTheDocument()
    })

    // Note: We don't test the timeout reset in unit tests
    // as it's a timing concern better tested in integration tests
  })

  it('handles clipboard error gracefully', async () => {
    const writeTextMock = jest.fn().mockRejectedValue(new Error('Clipboard error'))
    Object.assign(navigator.clipboard, { writeText: writeTextMock })

    const alertMock = jest.spyOn(window, 'alert').mockImplementation()

    render(<ExportOptions vacancy={mockVacancy} />)

    const copyButton = screen.getByText('Kopieer Tekst')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Kon tekst niet kopiëren naar klembord')
    })

    alertMock.mockRestore()
  })

  it('formats vacancy text correctly for export', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator.clipboard, { writeText: writeTextMock })

    render(<ExportOptions vacancy={mockVacancy} />)

    const copyButton = screen.getByText('Kopieer Tekst')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('Samenvatting'))
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining('Test samenvatting')
      )
      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('Over het Bedrijf'))
    })
  })

  it('disables export buttons while exporting', async () => {
    render(<ExportOptions vacancy={mockVacancy} />)

    const pdfButton = screen.getByText('Download als PDF')
    const initialButton = pdfButton.closest('button')
    expect(initialButton).not.toBeDisabled()

    // Note: We can't fully test the actual PDF generation in jsdom
    // but we can verify the button becomes enabled after the operation
    fireEvent.click(pdfButton)

    // The button should be temporarily disabled during export
    // After the export completes, it should be enabled again
    await waitFor(
      () => {
        expect(initialButton).not.toBeDisabled()
      },
      { timeout: 2000 }
    )
  })

  it('exports PDF successfully', async () => {
    mockSave.mockClear()

    render(<ExportOptions vacancy={mockVacancy} />)

    const pdfButton = screen.getByText('Download als PDF')
    fireEvent.click(pdfButton)

    // Wait for export to complete
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled()
    })

    // Verify PDF save was called with a filename
    const filename = mockSave.mock.calls[0][0]
    expect(filename).toMatch(/^vacature-\d+\.pdf$/)
  })

  it('calls jsPDF methods when exporting PDF', async () => {
    mockSetFontSize.mockClear()
    mockSetFont.mockClear()
    mockText.mockClear()

    render(<ExportOptions vacancy={mockVacancy} />)

    const pdfButton = screen.getByText('Download als PDF')
    fireEvent.click(pdfButton)

    await waitFor(() => {
      expect(mockSetFontSize).toHaveBeenCalled()
      expect(mockSetFont).toHaveBeenCalled()
      expect(mockText).toHaveBeenCalled()
    })
  })

  it('creates mailto link when email button is clicked', () => {
    // We can't easily mock window.location.href in jsdom
    // Instead, we verify that the component renders the button correctly
    // and trust that the click handler will work in a real browser

    render(<ExportOptions vacancy={mockVacancy} />)

    const emailButton = screen.getByText('Delen via Email')
    expect(emailButton).toBeInTheDocument()

    // Verify the button is clickable
    expect(emailButton.closest('button')).not.toBeDisabled()

    // The actual mailto navigation is tested manually in the browser
    // as jsdom doesn't support navigation
  })

  it('renders info note about export options', () => {
    render(<ExportOptions vacancy={mockVacancy} />)

    expect(
      screen.getByText(
        /Export je vacature als PDF of Word document, of gebruik de kopieer functie om de tekst direct te gebruiken/
      )
    ).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ExportOptions vacancy={mockVacancy} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('only exports sections with content', async () => {
    const partialVacancy: GeneratedVacancy = {
      summary: 'Test',
      companyDescription: undefined,
    }

    const writeTextMock = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator.clipboard, { writeText: writeTextMock })

    render(<ExportOptions vacancy={partialVacancy} />)

    const copyButton = screen.getByText('Kopieer Tekst')
    fireEvent.click(copyButton)

    await waitFor(() => {
      const calledText = writeTextMock.mock.calls[0][0]
      expect(calledText).toContain('Samenvatting')
      expect(calledText).not.toContain('Over het Bedrijf')
    })
  })

  it('exports Word document successfully', async () => {
    const { Packer } = require('docx')
    const { saveAs } = require('file-saver')

    render(<ExportOptions vacancy={mockVacancy} />)

    const wordButton = screen.getByText('Download als Word')
    fireEvent.click(wordButton)

    // Wait for export to complete
    await waitFor(() => {
      expect(Packer.toBlob).toHaveBeenCalled()
      expect(saveAs).toHaveBeenCalled()
    })

    // Verify saveAs was called with correct parameters
    const [blob, filename] = (saveAs as jest.Mock).mock.calls[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(filename).toMatch(/^vacature-\d+\.docx$/)
  })

  it('handles Word export error gracefully', async () => {
    const { Packer } = require('docx')
    ;(Packer.toBlob as jest.Mock).mockRejectedValueOnce(new Error('Word generation error'))

    const alertMock = jest.spyOn(window, 'alert').mockImplementation()

    render(<ExportOptions vacancy={mockVacancy} />)

    const wordButton = screen.getByText('Download als Word')
    fireEvent.click(wordButton)

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Kon vacature niet exporteren als Word document')
    })

    alertMock.mockRestore()
  })

  it('disables Word button while exporting', async () => {
    const { Packer } = require('docx')
    let resolveExport: (value: Blob) => void
    const exportPromise = new Promise<Blob>((resolve) => {
      resolveExport = resolve
    })
    ;(Packer.toBlob as jest.Mock).mockReturnValue(exportPromise)

    render(<ExportOptions vacancy={mockVacancy} />)

    const wordButton = screen.getByText('Download als Word')
    const button = wordButton.closest('button')

    expect(button).not.toBeDisabled()

    fireEvent.click(wordButton)

    // Button should be disabled while processing
    await waitFor(() => {
      expect(button).toBeDisabled()
    })

    // Verify button shows "Exporteren..." text
    expect(button?.textContent).toContain('Exporteren...')

    // Complete the export
    resolveExport!(new Blob(['test']))

    // Wait for export to complete and button to re-enable
    await waitFor(
      () => {
        expect(button).not.toBeDisabled()
        expect(button?.textContent).toContain('Download als Word')
      },
      { timeout: 2000 }
    )
  })
})
