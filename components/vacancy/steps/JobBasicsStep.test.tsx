import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { JobBasicsStep, JobBasicsStepData } from './JobBasicsStep'
import { SeniorityLevel } from '@/lib/domain/vacancy.types'

describe('JobBasicsStep', () => {
  const mockOnChange = jest.fn()

  const defaultData: Partial<JobBasicsStepData> = {
    jobTitle: '',
    seniorityLevel: undefined,
    jobSummary: '',
  }

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('should render all form fields', () => {
    render(<JobBasicsStep data={defaultData} onChange={mockOnChange} />)

    expect(screen.getByLabelText(/functietitel/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/ervaringsniveau/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/functie samenvatting/i)).toBeInTheDocument()
  })

  it('should call onChange when job title is changed', () => {
    render(<JobBasicsStep data={defaultData} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/functietitel/i)
    fireEvent.change(input, { target: { value: 'Senior Java Developer' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      jobTitle: 'Senior Java Developer',
    })
  })

  it('should call onChange when seniority level is selected', () => {
    render(<JobBasicsStep data={defaultData} onChange={mockOnChange} />)

    const select = screen.getByLabelText(/ervaringsniveau/i)
    fireEvent.change(select, { target: { value: SeniorityLevel.SENIOR } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      seniorityLevel: SeniorityLevel.SENIOR,
    })
  })

  it('should call onChange when job summary is changed', () => {
    render(<JobBasicsStep data={defaultData} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/functie samenvatting/i)
    fireEvent.change(textarea, { target: { value: 'A great job opportunity' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      jobSummary: 'A great job opportunity',
    })
  })

  it('should show validation error for job title that is too short', async () => {
    const dataWithShortTitle = { ...defaultData, jobTitle: 'A' }
    render(<JobBasicsStep data={dataWithShortTitle} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/functietitel/i)
    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.getByText(/minimaal 2 karakters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for job title that is too long', async () => {
    const longTitle = 'A'.repeat(76) // Max is 75
    const dataWithLongTitle = { ...defaultData, jobTitle: longTitle }
    render(<JobBasicsStep data={dataWithLongTitle} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/functietitel/i)
    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.getByText(/maximaal 75 karakters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for job summary that is too short', async () => {
    const dataWithShortSummary = { ...defaultData, jobSummary: 'Too short' }
    render(<JobBasicsStep data={dataWithShortSummary} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/functie samenvatting/i)
    fireEvent.blur(textarea)

    await waitFor(() => {
      expect(screen.getByText(/minimaal 20 karakters/i)).toBeInTheDocument()
    })
  })

  it('should show character count for job summary', () => {
    const data: Partial<JobBasicsStepData> = {
      jobSummary: 'This is a test summary with enough characters',
    }

    render(<JobBasicsStep data={data} onChange={mockOnChange} />)

    expect(screen.getByText(/45\/300/)).toBeInTheDocument()
  })

  it('should display current values', () => {
    const data: Partial<JobBasicsStepData> = {
      jobTitle: 'Senior Developer',
      seniorityLevel: SeniorityLevel.MEDIOR,
      jobSummary: 'An exciting opportunity to work with cutting-edge technology',
    }

    render(<JobBasicsStep data={data} onChange={mockOnChange} />)

    expect(screen.getByDisplayValue('Senior Developer')).toBeInTheDocument()
    const select = screen.getByLabelText(/ervaringsniveau/i) as HTMLSelectElement
    expect(select.value).toBe(SeniorityLevel.MEDIOR)
    expect(
      screen.getByDisplayValue('An exciting opportunity to work with cutting-edge technology')
    ).toBeInTheDocument()
  })

  it('should respect maxLength for job summary', () => {
    render(<JobBasicsStep data={defaultData} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/functie samenvatting/i) as HTMLTextAreaElement
    expect(textarea.maxLength).toBe(300)
  })

  it('should clear optional fields when empty string is entered', () => {
    const data: Partial<JobBasicsStepData> = {
      jobTitle: 'Developer',
    }

    render(<JobBasicsStep data={data} onChange={mockOnChange} />)

    const input = screen.getByLabelText(/functietitel/i)
    fireEvent.change(input, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...data,
      jobTitle: undefined,
    })
  })
})
