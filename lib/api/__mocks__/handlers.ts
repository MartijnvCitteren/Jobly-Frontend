import { http, HttpResponse } from 'msw'

// Basis URL voor de API (kan later via environment variabelen)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

/**
 * MSW Request Handlers
 *
 * Deze handlers worden gebruikt om API calls te mocken tijdens tests.
 * Voeg hier handlers toe voor verschillende API endpoints naarmate
 * je ze implementeert.
 */
export const handlers = [
  // Voorbeeld: Mock voor vacancy generatie endpoint
  http.post(`${API_BASE_URL}/vacancies/generate`, async () => {
    return HttpResponse.json(
      {
        id: 'mock-vacancy-id-123',
        title: 'Senior Java Developer',
        content: 'Mock generated vacancy content...',
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    )
  }),

  // Voorbeeld: Mock voor health check
  http.get(`${API_BASE_URL}/health`, () => {
    return HttpResponse.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
    })
  }),

  // Voeg hier meer handlers toe naarmate je API endpoints implementeert
  // Bijvoorbeeld:
  // http.get(`${API_BASE_URL}/vacancies/:id`, ({ params }) => {
  //   return HttpResponse.json({ id: params.id, ... })
  // }),
]
