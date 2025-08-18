/**
 * Unit tests for the incident functionality, src/incident.ts
 */
import { jest } from '@jest/globals'
import { ApiResponse } from '../src/apiResponse.js'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { createIncident } = await import('../src/incident.js')

describe('incident.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockTitle = 'Test Incident'
  const mockSummary = 'This is a test incident summary'
  const mockKind = 'normal'
  const mockSeverityId = 'severity-123'
  const mockAlertId = 'alert-456'
  const mockServiceIds = ['service-1', 'service-2']
  const mockGroupIds = ['group-1', 'group-2']
  const mockEnvironmentIds = ['env-1', 'env-2']
  const mockIncidentTypeIds = ['type-1', 'type-2']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Creates an incident successfully with all parameters', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-123' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockSummary,
      mockSeverityId,
      mockAlertId,
      mockServiceIds,
      mockGroupIds,
      mockEnvironmentIds,
      mockIncidentTypeIds
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + mockApiKey,
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: false,
              public_title: mockTitle,
              title: mockTitle,
              summary: mockSummary,
              kind: mockKind,
              severity_id: mockSeverityId,
              environment_ids: mockEnvironmentIds,
              incident_type_ids: mockIncidentTypeIds,
              service_ids: mockServiceIds,
              group_ids: mockGroupIds,
              alert_ids: [mockAlertId]
            }
          }
        })
      }
    )
    expect(result).toBe('incident-123')

    consoleSpy.mockRestore()
  })

  it('Creates an incident successfully with minimal parameters', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-456' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockSummary,
      mockSeverityId
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + mockApiKey,
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: false,
              public_title: mockTitle,
              title: mockTitle,
              summary: mockSummary,
              kind: mockKind,
              severity_id: mockSeverityId
            }
          }
        })
      }
    )
    expect(result).toBe('incident-456')

    consoleSpy.mockRestore()
  })

  it('Handles undefined alert ID correctly', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-789' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockSummary,
      mockSeverityId,
      undefined,
      mockServiceIds
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      expect.objectContaining({
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: false,
              public_title: mockTitle,
              title: mockTitle,
              summary: mockSummary,
              kind: mockKind,
              severity_id: mockSeverityId,
              service_ids: mockServiceIds
            }
          }
        })
      })
    )
    expect(result).toBe('incident-789')

    consoleSpy.mockRestore()
  })

  it('Throws error when API request fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    await expect(
      createIncident(mockApiKey, mockTitle, mockSummary, mockSeverityId)
    ).rejects.toThrow('Network error')

    consoleSpy.mockRestore()
  })

  it('Throws error when response parsing fails', async () => {
    const mockResponse = {
      ok: true,
      json: jest
        .fn()
        .mockRejectedValue(
          new Error('JSON parse error')
        ) as jest.MockedFunction<() => Promise<ApiResponse>>
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    await expect(
      createIncident(mockApiKey, mockTitle, mockSummary, mockSeverityId)
    ).rejects.toThrow('JSON parse error')

    consoleSpy.mockRestore()
  })

  it('Handles empty arrays for optional parameters', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-empty' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockSummary,
      mockSeverityId,
      mockAlertId,
      [],
      [],
      [],
      []
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      expect.objectContaining({
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: false,
              public_title: mockTitle,
              title: mockTitle,
              summary: mockSummary,
              kind: mockKind,
              severity_id: mockSeverityId,
              alert_ids: [mockAlertId]
            }
          }
        })
      })
    )
    expect(result).toBe('incident-empty')

    consoleSpy.mockRestore()
  })

  it('Throws error when API returns HTTP error status', async () => {
    const mockResponse = {
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity'
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await expect(
      createIncident(mockApiKey, mockTitle, mockSummary, mockSeverityId)
    ).rejects.toThrow('HTTP error! status: 422 Unprocessable Entity')
  })

  it('Handles non-Error exceptions in error handling', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue('String error instead of Error object')
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await expect(
      createIncident(mockApiKey, mockTitle, mockSummary, mockSeverityId)
    ).rejects.toBe('String error instead of Error object')
  })
})
