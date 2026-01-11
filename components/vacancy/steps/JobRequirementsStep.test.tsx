import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { JobRequirementsStep, JobRequirementsStepData } from './JobRequirementsStep'

describe('JobRequirementsStep', () => {
  const mockOnChange = jest.fn()

  const defaultData: Partial<JobRequirementsStepData> = {
    tasks: '',
    skills: '',
    teamDescription: '',
  }

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('should render all form fields', () => {
    render(<JobRequirementsStep data={defaultData} onChange={mockOnChange} />)

    expect(screen.getByLabelText(/taken en verantwoordelijkheden/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/vereiste vaardigheden/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/team beschrijving/i)).toBeInTheDocument()
  })

  it('should call onChange when tasks is changed', () => {
    render(<JobRequirementsStep data={defaultData} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/taken en verantwoordelijkheden/i)
    fireEvent.change(textarea, { target: { value: 'Develop new features' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      tasks: 'Develop new features',
    })
  })

  it('should call onChange when skills is changed', () => {
    render(<JobRequirementsStep data={defaultData} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/vereiste vaardigheden/i)
    fireEvent.change(textarea, { target: { value: 'Java, Spring Boot' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      skills: 'Java, Spring Boot',
    })
  })

  it('should call onChange when team description is changed', () => {
    render(<JobRequirementsStep data={defaultData} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/team beschrijving/i)
    fireEvent.change(textarea, { target: { value: 'A dynamic team of 5 developers' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultData,
      teamDescription: 'A dynamic team of 5 developers',
    })
  })

  it('should show validation error for tasks that is too short', async () => {
    const dataWithShortTasks = { ...defaultData, tasks: 'Short' }
    render(<JobRequirementsStep data={dataWithShortTasks} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/taken en verantwoordelijkheden/i)
    fireEvent.blur(textarea)

    await waitFor(() => {
      expect(screen.getByText(/minimaal 10 karakters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for skills that is too long', async () => {
    const longSkills = 'A'.repeat(301) // Max is 300
    const dataWithLongSkills = { ...defaultData, skills: longSkills }
    render(<JobRequirementsStep data={dataWithLongSkills} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/vereiste vaardigheden/i)
    fireEvent.blur(textarea)

    await waitFor(() => {
      expect(screen.getByText(/maximaal 300 karakters/i)).toBeInTheDocument()
    })
  })

  it('should show character count for all fields', () => {
    const data: Partial<JobRequirementsStepData> = {
      tasks: 'Develop and maintain applications', // 33 characters
      skills: 'Java, Spring', // 12 characters
      teamDescription: 'Great team', // 10 characters
    }

    render(<JobRequirementsStep data={data} onChange={mockOnChange} />)

    expect(screen.getByText(/33\/300/)).toBeInTheDocument() // tasks
    expect(screen.getByText(/12\/300/)).toBeInTheDocument() // skills
    expect(screen.getByText(/10\/300/)).toBeInTheDocument() // teamDescription
  })

  it('should display current values', () => {
    const data: Partial<JobRequirementsStepData> = {
      tasks: 'Design and implement features',
      skills: 'TypeScript, React, Node.js',
      teamDescription: 'Collaborative team environment',
    }

    render(<JobRequirementsStep data={data} onChange={mockOnChange} />)

    expect(screen.getByDisplayValue('Design and implement features')).toBeInTheDocument()
    expect(screen.getByDisplayValue('TypeScript, React, Node.js')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Collaborative team environment')).toBeInTheDocument()
  })

  it('should respect maxLength for all textareas', () => {
    render(<JobRequirementsStep data={defaultData} onChange={mockOnChange} />)

    const textareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[]
    textareas.forEach((textarea) => {
      expect(textarea.maxLength).toBe(300)
    })
  })

  it('should clear optional fields when empty string is entered', () => {
    const data: Partial<JobRequirementsStepData> = {
      tasks: 'Some tasks',
    }

    render(<JobRequirementsStep data={data} onChange={mockOnChange} />)

    const textarea = screen.getByLabelText(/taken en verantwoordelijkheden/i)
    fireEvent.change(textarea, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...data,
      tasks: undefined,
    })
  })

  it('should not show validation errors before field is touched', () => {
    const dataWithShortTasks = { ...defaultData, tasks: 'Short' }
    render(<JobRequirementsStep data={dataWithShortTasks} onChange={mockOnChange} />)

    // Error should not appear until blur
    expect(screen.queryByText(/minimaal 10 karakters/i)).not.toBeInTheDocument()

    // Now blur the field
    const textarea = screen.getByLabelText(/taken en verantwoordelijkheden/i)
    fireEvent.blur(textarea)

    // Now error should appear
    expect(screen.getByText(/minimaal 10 karakters/i)).toBeInTheDocument()
  })
})
