import { apiFetch, get, post, ApiError } from '@/lib/api/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api/v1'

// Mock global fetch
global.fetch = jest.fn()

// Helper om fetch mock te resetten
beforeEach(() => {
  (global.fetch as jest.Mock).mockClear()
})

describe('API Client', () => {
  describe('apiFetch', () => {
    it('should successfully fetch data', async () => {
      const mockResponse = { message: 'success' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const data = await apiFetch<{ message: string }>('/test')

      expect(data).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('should throw ApiError on HTTP error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not Found' }),
      })

      await expect(apiFetch('/error')).rejects.toThrow(ApiError)

      try {
        await apiFetch('/error')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).message).toBe('Not Found')
        expect((error as ApiError).status).toBe(404)
      }
    })

    it('should include error status in ApiError', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server Error' }),
      })

      try {
        await apiFetch('/error')
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).status).toBe(500)
      }
    })

    it('should set correct Content-Type header', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await apiFetch('/test', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      })

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })
  })

  describe('get', () => {
    it('should perform GET request', async () => {
      const mockData = { items: ['item1', 'item2'] }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const data = await get<{ items: string[] }>('/items')

      expect(data).toEqual(mockData)
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/items`,
        expect.objectContaining({
          method: 'GET',
        })
      )
    })
  })

  describe('post', () => {
    it('should perform POST request with data', async () => {
      const requestData = { name: 'Test Item' }
      const responseData = { id: '123', ...requestData }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      })

      const response = await post('/items', requestData)

      expect(response).toMatchObject(responseData)
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/items`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      )
    })
  })

  describe('Health Check', () => {
    it('should successfully call health endpoint', async () => {
      const mockHealth = {
        status: 'UP',
        timestamp: new Date().toISOString(),
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
      })

      const data = await get<{ status: string }>('/health')

      expect(data).toHaveProperty('status', 'UP')
      expect(data).toHaveProperty('timestamp')
    })
  })

  describe('Vacancy Generation', () => {
    it('should successfully generate vacancy', async () => {
      const requestData = {
        jobTitle: 'Senior Java Developer',
        companyName: 'Test Corp',
      }

      const mockResponse = {
        id: 'mock-id-123',
        title: 'Senior Java Developer',
        content: 'Generated vacancy content...',
        createdAt: new Date().toISOString(),
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const response = await post('/vacancies/generate', requestData)

      expect(response).toHaveProperty('id')
      expect(response).toHaveProperty('title')
      expect(response).toHaveProperty('content')
      expect(response).toHaveProperty('createdAt')
    })
  })
})
