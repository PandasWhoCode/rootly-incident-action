/**
 * Unit tests for the incident type functionality, src/incidentType.ts
 */
import { jest } from '@jest/globals'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { getIncidentTypeId } = await import('../src/incidentType.js')

describe('incidentType.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockIncidentTypeName = 'outage'
  const mockIncidentTypeId = 'incident-type-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Gets incident type ID successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { id: mockIncidentTypeId }
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getIncidentTypeId(mockIncidentTypeName, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incident_types?filter%5Bname%5D=outage',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + mockApiKey },
        body: undefined
      }
    )
    expect(result).toBe(mockIncidentTypeId)
  })

  it('Handles incident type names with spaces correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { id: 'incident-type-456' }
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await getIncidentTypeId('service outage', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incident_types?filter%5Bname%5D=service%20outage',
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

    const result = await getIncidentTypeId(mockIncidentTypeName, mockApiKey)

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

    const result = await getIncidentTypeId(mockIncidentTypeName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'))

    consoleSpy.mockRestore()
  })

  it('Handles different incident types', async () => {
    const incidentTypes = ['outage', 'degradation', 'maintenance', 'security']

    for (const type of incidentTypes) {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: { id: `type-${type}` }
        })
      } as unknown as Response
      mockFetch.mockResolvedValue(mockResponse)

      const result = await getIncidentTypeId(type, mockApiKey)

      expect(result).toBe(`type-${type}`)
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.rootly.com/v1/incident_types?filter%5Bname%5D=${type}`,
        expect.objectContaining({
          method: 'GET'
        })
      )
    }
  })
})
