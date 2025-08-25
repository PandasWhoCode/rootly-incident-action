import { jest } from '@jest/globals'

// Mock global fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

// Mock console.error
const mockConsoleError = jest.fn()
global.console.error = mockConsoleError

describe('severity.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Returns severity ID when API call is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'severity-123' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getSeverityId } = await import('../src/severity.js')
    const result = await getSeverityId('critical', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/severities?filter%5Bname%5D=critical',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer test-api-key' }
      }
    )
    expect(result).toBe('severity-123')
  })

  it('Encodes severity name in URL', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'severity-456' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getSeverityId } = await import('../src/severity.js')
    await getSeverityId('high & urgent', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/severities?filter%5Bname%5D=high%20%26%20urgent',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer test-api-key' }
      }
    )
  })

  it('Returns empty string when HTTP request fails', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found'
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getSeverityId } = await import('../src/severity.js')
    const result = await getSeverityId('nonexistent_severity', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(
      new Error('HTTP error! status: 404 Not Found')
    )
    expect(result).toBe('')
  })

  it('Returns empty string when JSON parsing fails', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getSeverityId } = await import('../src/severity.js')
    const result = await getSeverityId('test_severity', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(new Error('Invalid JSON'))
    expect(result).toBe('')
  })

  it('Returns empty string when network request fails', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const { getSeverityId } = await import('../src/severity.js')
    const result = await getSeverityId('test_severity', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(networkError)
    expect(result).toBe('')
  })
})
