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
  const mockAlertServiceId = 'svc-123' // Default value for alertServiceId
  const mockAlertUrgency = 'urgency-123' // Default value for alertUrg
  const mockExternalId = 'ext-123'
  const mockExternalUrl = 'https://example.com/alert'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Creates an alert successfully with all parameters', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'alert-123' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDetails,
      mockAlertServiceId,
      mockAlertUrgency,
      mockExternalId,
      mockExternalUrl,
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
            source: 'api',
            noise: 'noise',
            status: 'triggered',
            description: mockDetails,
            notification_target_type: 'Service',
            notification_target_id: mockAlertServiceId,
            urgency: mockAlertUrgency,
            service_ids: mockServiceIds,
            group_ids: mockGroupIds,
            environment_ids: mockEnvironmentIds,
            external_id: mockExternalId,
            external_url: mockExternalUrl
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
      json: jest.fn().mockResolvedValue({ data: { id: 'alert-456' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDetails,
      mockAlertServiceId,
      mockAlertUrgency
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
            source: 'api',
            noise: 'noise',
            status: 'triggered',
            description: mockDetails,
            notification_target_type: 'Service',
            notification_target_id: 'svc-123', // Default value for alertServiceId
            urgency: 'urgency-123' // Default value for alertUrgency
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
      json: jest.fn().mockResolvedValue({ data: { id: 'alert-789' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDetails,
      mockAlertServiceId,
      mockAlertUrgency,
      undefined,
      undefined,
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
              source: 'api',
              noise: 'noise',
              status: 'triggered',
              description: mockDetails,
              notification_target_type: 'Service',
              notification_target_id: 'svc-123', // Default value for alertServiceId
              urgency: 'urgency-123' // Default value for alertUrgency
            }
          }
        })
      })
    )
    expect(result).toBe('alert-789')

    consoleSpy.mockRestore()
  })

  it('Returns empty string when API returns HTTP error status', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request'
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await createAlert(mockApiKey, mockSummary)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(
      new Error('HTTP error! status: 400 Bad Request')
    )

    consoleSpy.mockRestore()
  })
})
