/**
 * Unit tests for the alert functionality, src/alert.ts
 */
import { jest } from '@jest/globals'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { createAlert } = await import('../src/alert.js')

describe('alert.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockSummary = 'Test alert summary'
  const mockDetails = 'Test alert details'
  const mockServiceIds = ['service-1', 'service-2']
  const mockGroupIds = ['group-1', 'group-2']
  const mockEnvironmentIds = ['env-1', 'env-2']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Creates an alert successfully with all parameters', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'alert-123' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDetails,
      mockServiceIds,
      mockGroupIds,
      mockEnvironmentIds
    )

    expect(mockFetch).toHaveBeenCalledWith('https://api.rootly.com/v1/alerts', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + mockApiKey,
        'Content-Type': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          type: 'alerts',
          attributes: {
            summary: mockSummary,
            noise: 'noise',
            status: 'triggered',
            description: mockDetails,
            service_ids: mockServiceIds,
            group_ids: mockGroupIds,
            environment_ids: mockEnvironmentIds
          }
        }
      })
    })
    expect(result).toBe('alert-123')
  })

  it('Creates an alert successfully with minimal parameters', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'alert-456' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createAlert(mockApiKey, mockSummary, mockDetails)

    expect(mockFetch).toHaveBeenCalledWith('https://api.rootly.com/v1/alerts', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + mockApiKey,
        'Content-Type': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          type: 'alerts',
          attributes: {
            summary: mockSummary,
            noise: 'noise',
            status: 'triggered',
            description: mockDetails
          }
        }
      })
    })
    expect(result).toBe('alert-456')

    consoleSpy.mockRestore()
  })

  it('Returns empty string when API request fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await createAlert(mockApiKey, mockSummary)

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

    const result = await createAlert(mockApiKey, mockSummary)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'))

    consoleSpy.mockRestore()
  })

  it('Handles undefined optional parameters correctly', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'alert-789' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDetails,
      undefined,
      undefined,
      undefined
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alerts',
      expect.objectContaining({
        body: JSON.stringify({
          data: {
            type: 'alerts',
            attributes: {
              summary: mockSummary,
              noise: 'noise',
              status: 'triggered',
              description: mockDetails
            }
          }
        })
      })
    )
    expect(result).toBe('alert-789')

    consoleSpy.mockRestore()
  })
})
