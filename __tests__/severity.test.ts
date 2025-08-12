/**
 * Unit tests for the severity functionality, src/severity.ts
 */
import { jest } from '@jest/globals'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { getSeverityId } = await import('../src/severity.js')

describe('severity.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockSeverityName = 'critical'
  const mockSeverityId = 'severity-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Gets severity ID successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: mockSeverityId }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getSeverityId(mockSeverityName, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/severities?filter%5Bname%5D=critical',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + mockApiKey },
        body: undefined
      }
    )
    expect(result).toBe(mockSeverityId)
  })

  it('Handles severity names with spaces correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'severity-456' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await getSeverityId('high priority', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/severities?filter%5Bname%5D=high%20priority',
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

    const result = await getSeverityId('critical', mockApiKey)

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

    const result = await getSeverityId('critical', mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'))

    consoleSpy.mockRestore()
  })

  it('Handles different severity levels', async () => {
    const severityLevels = ['low', 'medium', 'high', 'critical']

    for (const severity of severityLevels) {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [{ id: `severity-${severity}` }]
        })
      } as unknown as Response
      mockFetch.mockResolvedValue(mockResponse)

      const result = await getSeverityId(severity, mockApiKey)

      expect(result).toBe(`severity-${severity}`)
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.rootly.com/v1/severities?filter%5Bname%5D=${severity}`,
        expect.objectContaining({
          method: 'GET'
        })
      )
    }
  })

  it('Handles critical severity level', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'severity-critical' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getSeverityId(mockApiKey, 'critical')

    expect(result).toBe('severity-critical')
  })

  it('Returns empty string when API returns HTTP error status', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found'
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await getSeverityId(mockApiKey, 'unknown')

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(
      new Error('HTTP error! status: 404 Not Found')
    )

    consoleSpy.mockRestore()
  })
})
