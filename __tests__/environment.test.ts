import { jest } from '@jest/globals'

// Mock global fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

// Mock console.error
const mockConsoleError = jest.fn()
global.console.error = mockConsoleError

describe('environment.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Returns environment ID when API call is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'env-123' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getEnvironmentId } = await import('../src/environment.js')
    const result = await getEnvironmentId('production', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/environments?filter%5Bname%5D=production',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer test-api-key' }
      }
    )
    expect(result).toBe('env-123')
  })

  it('Encodes environment name in URL', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'env-456' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getEnvironmentId } = await import('../src/environment.js')
    await getEnvironmentId('staging & test', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/environments?filter%5Bname%5D=staging%20%26%20test',
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

    const { getEnvironmentId } = await import('../src/environment.js')
    const result = await getEnvironmentId('nonexistent_env', 'test-api-key')

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

    const { getEnvironmentId } = await import('../src/environment.js')
    const result = await getEnvironmentId('test_env', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(new Error('Invalid JSON'))
    expect(result).toBe('')
  })

  it('Returns empty string when network request fails', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const { getEnvironmentId } = await import('../src/environment.js')
    const result = await getEnvironmentId('test_env', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(networkError)
    expect(result).toBe('')
  })
})
