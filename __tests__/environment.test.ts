/**
 * Unit tests for the environment functionality, src/environment.ts
 */
import { jest } from '@jest/globals'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { getEnvironmentId } = await import('../src/environment.js')

describe('environment.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockEnvironmentName = 'production'
  const mockEnvironmentId = 'env-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Gets environment ID successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: mockEnvironmentId }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getEnvironmentId(mockEnvironmentName, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/environments?filter%5Bname%5D=production',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + mockApiKey },
        body: undefined
      }
    )
    expect(result).toBe(mockEnvironmentId)
  })

  it('Handles environment names with spaces correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'env-456' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await getEnvironmentId('staging environment', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/environments?filter%5Bname%5D=staging%20environment',
      expect.objectContaining({
        method: 'GET'
      })
    )
  })

  it('Returns empty string when API request fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await getEnvironmentId(mockEnvironmentName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('Network error'))

    consoleSpy.mockRestore()
  })

  it('Returns empty string when response parsing fails', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue(new Error('JSON parse error'))
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await getEnvironmentId(mockEnvironmentName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'))

    consoleSpy.mockRestore()
  })

  it('Handles different environment types', async () => {
    const environments = ['development', 'staging', 'production', 'test']

    for (const env of environments) {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [{ id: `env-${env}` }]
        })
      } as unknown as Response
      mockFetch.mockResolvedValue(mockResponse)

      const result = await getEnvironmentId(env, mockApiKey)

      expect(result).toBe(`env-${env}`)
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.rootly.com/v1/environments?filter%5Bname%5D=${env}`,
        expect.objectContaining({
          method: 'GET'
        })
      )
    }
  })
})
