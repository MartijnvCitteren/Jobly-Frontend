import { http, HttpResponse } from 'msw'

// Basis URL voor de API (kan later via environment variabelen)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api/v1'

/**
 * MSW Request Handlers
 *
 * Deze handlers worden gebruikt om API calls te mocken tijdens tests.
 * Handlers gebaseerd op de OpenAPI specificatie.
 */
export const handlers = [
  // Mock voor create-company-info endpoint
  http.post(`${API_BASE_URL}/create-company-info`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>

    // Validatie: check required fields
    if (!body.companyWebsite || !body.country) {
      return HttpResponse.json(
        {
          message: 'Validation failed',
          details: 'companyWebsite and country are required',
        },
        { status: 400 }
      )
    }

    // Return mock token
    return HttpResponse.json(
      {
        token: '550e8400-e29b-41d4-a716-446655440000',
      },
      { status: 201 }
    )
  }),

  // Mock voor create-vacancy endpoint
  http.post(`${API_BASE_URL}/create-vacancy`, async ({ request }) => {
    const url = new URL(request.url)
    const requestId = url.searchParams.get('requestId')
    const body = (await request.json()) as Record<string, unknown>

    // Validatie: check requestId
    if (!requestId) {
      return HttpResponse.json(
        {
          message: 'Validation failed',
          details: 'requestId query parameter is required',
        },
        { status: 400 }
      )
    }

    // Validatie: check invalid requestId
    if (requestId === 'invalid-token') {
      return HttpResponse.json(
        {
          message: 'Request ID not found',
          details: 'The provided requestId does not exist or has expired',
        },
        { status: 404 }
      )
    }

    // Validatie: check required fields
    if (!body.seniorityLevel || !body.writingStyle) {
      return HttpResponse.json(
        {
          message: 'Validation failed',
          details: 'seniorityLevel and writingStyle are required',
        },
        { status: 400 }
      )
    }

    // Return mock generated vacancy
    return HttpResponse.json(
      {
        summary: 'Join our team as a Senior Full Stack Developer',
        companyDescription:
          'Tech Innovators BV is a leading software company specializing in cloud-based solutions...',
        teamDescription:
          'Work alongside a talented team of 8 developers in an agile environment...',
        dayToDayDescription:
          'Your day will involve designing scalable applications, mentoring team members...',
        jobDescription:
          "As a Senior Full Stack Developer, you'll be responsible for building and maintaining...",
        jobUniqueSellingPoints:
          'Work on cutting-edge technology, influence architectural decisions...',
        requirements: '5+ years of Java development, strong React skills, experience with AWS...',
        offer:
          'Competitive salary between €65,000 and €85,000, flexible hours, remote work...',
        contactInformation:
          'Interested? Contact Sarah Johnson at sarah.johnson@example.com or +31 20 123 4567',
      },
      { status: 201 }
    )
  }),
]
