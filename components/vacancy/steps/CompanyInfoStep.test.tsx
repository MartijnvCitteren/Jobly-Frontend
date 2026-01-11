import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompanyInfoStep } from './CompanyInfoStep'
import { Country, CompanyInfoRequest } from '@/lib/domain/vacancy.types'

describe('CompanyInfoStep', () => {
  const mockOnChange = jest.fn()

  const defaultData: Partial<CompanyInfoRequest> = {
    companyName: '',
    companyWebsite: '',
    country: undefined,
    exampleVacancyUrl: '',
  }

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('should render all form fields', () => {
    render(<CompanyInfoStep data={defaultData} onChange={mockOnChange} />)

    expect(screen.getByLabelText(/bedrijfsnaam/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/bedrijfswebsite/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/land/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/voorbeeld vacature url/i)).toBeInTheDocument()
  })

  it('should call onChange when company name is changed', () => {
    render(<CompanyInfoStep data={defaultData} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/bedrijfsnaam/i)
    fireEvent.change(input, { target: { value: 'TechCorp' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      companyName: 'TechCorp',
    })
  })

  it('should call onChange when website is changed', () => {
    render(<CompanyInfoStep data={defaultData} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/bedrijfswebsite/i)
    fireEvent.change(input, { target: { value: 'www.techcorp.nl' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      companyWebsite: 'www.techcorp.nl',
    })
  })

  it('should call onChange when country is selected', () => {
    render(<CompanyInfoStep data={defaultData} onChange={mockOnChange} />)

    const select = screen.getByLabelText(/land/i)
    fireEvent.change(select, { target: { value: Country.THE_NETHERLANDS } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      country: Country.THE_NETHERLANDS,
    })
  })

  it('should show validation error for invalid website format', async () => {
    const dataWithWebsite = { ...defaultData, companyWebsite: 'invalid' }
    render(<CompanyInfoStep data={dataWithWebsite} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/bedrijfswebsite/i)
    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.getByText(/website moet beginnen met 'www.'/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for company name that is too long', async () => {
    const longName = 'A'.repeat(51) // Max is 50
    const dataWithLongName = { ...defaultData, companyName: longName }
    render(<CompanyInfoStep data={dataWithLongName} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/bedrijfsnaam/i)
    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.getByText(/maximaal 50 karakters/i)).toBeInTheDocument()
    })
  })

  it('should display current values', () => {
    const data: Partial<CompanyInfoRequest> = {
      companyName: 'TechCorp',
      companyWebsite: 'www.techcorp.nl',
      country: Country.BELGIUM,
      exampleVacancyUrl: 'www.example.com/job',
    }

    render(<CompanyInfoStep data={data} onChange={mockOnChange} />)

    expect(screen.getByDisplayValue('TechCorp')).toBeInTheDocument()
    expect(screen.getByDisplayValue('www.techcorp.nl')).toBeInTheDocument()
    const select = screen.getByLabelText(/land/i) as HTMLSelectElement
    expect(select.value).toBe(Country.BELGIUM)
    expect(screen.getByDisplayValue('www.example.com/job')).toBeInTheDocument()
  })

  it('should clear optional fields when empty string is entered', () => {
    const data: Partial<CompanyInfoRequest> = {
      companyName: 'TechCorp',
    }

    render(<CompanyInfoStep data={data} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/bedrijfsnaam/i)
    fireEvent.change(input, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...data,
      companyName: undefined,
    })
  })

  it('should show helper text for fields', () => {
    render(<CompanyInfoStep data={defaultData} onChange={mockOnChange} />)

    expect(screen.getByText(/de naam van het bedrijf \(optioneel\)/i)).toBeInTheDocument()
    expect(screen.getByText(/begin met 'www.' gevolgd door het domein/i)).toBeInTheDocument()
  })
})
