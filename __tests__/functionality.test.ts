import { jest } from '@jest/globals'

// Mock global fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

// Mock console.error
const mockConsoleError = jest.fn()
global.console.error = mockConsoleError

describe('functionality.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Returns functionality ID when API call is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'func-123' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getFunctionalityId } = await import('../src/functionality.js')
    const result = await getFunctionalityId(
      'user_authentication',
      'test-api-key'
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/functionalities?include=user_authentication',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer test-api-key' }
      }
    )
    expect(result).toBe('func-123')
  })

  it('Encodes functionality name in URL', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'func-456' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getFunctionalityId } = await import('../src/functionality.js')
    await getFunctionalityId('payment & billing', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/functionalities?include=payment%20%26%20billing',
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

    const { getFunctionalityId } = await import('../src/functionality.js')
    const result = await getFunctionalityId('nonexistent_func', 'test-api-key')

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

    const { getFunctionalityId } = await import('../src/functionality.js')
    const result = await getFunctionalityId('test_func', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(new Error('Invalid JSON'))
    expect(result).toBe('')
  })

  it('Returns empty string when network request fails', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const { getFunctionalityId } = await import('../src/functionality.js')
    const result = await getFunctionalityId('test_func', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(networkError)
    expect(result).toBe('')
  })
})
