import { jest } from '@jest/globals'

// Mock global fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

// Mock console.error
const mockConsoleError = jest.fn()
global.console.error = mockConsoleError

// Mock @actions/core
jest.unstable_mockModule('@actions/core', () => ({
  warning: jest.fn()
}))

describe('user.ts', () => {
  let mockCore: {
    warning: jest.MockedFunction<typeof import('@actions/core').warning>
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    mockCore = await import('@actions/core')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Returns user ID when API call is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'user-123' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getUserId } = await import('../src/user.js')
    const result = await getUserId('test@example.com', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/users?filter%5Bemail%5D=test%40example.com',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer test-api-key' }
      }
    )
    expect(result).toBe('user-123')
  })

  it('Encodes email in URL', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'user-456' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getUserId } = await import('../src/user.js')
    await getUserId('user+test@example.com', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/users?filter%5Bemail%5D=user%2Btest%40example.com',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer test-api-key' }
      }
    )
  })

  it('Returns empty string and logs warning when user not found', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: []
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getUserId } = await import('../src/user.js')
    const result = await getUserId('nonexistent@example.com', 'test-api-key')

    expect(mockCore.warning).toHaveBeenCalledWith(
      "User 'nonexistent@example.com' not found"
    )
    expect(result).toBe('')
  })

  it('Returns empty string and logs warning when data is null', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: null
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getUserId } = await import('../src/user.js')
    const result = await getUserId('test@example.com', 'test-api-key')

    expect(mockCore.warning).toHaveBeenCalledWith(
      "User 'test@example.com' not found"
    )
    expect(result).toBe('')
  })

  it('Returns empty string when HTTP request fails', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found'
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getUserId } = await import('../src/user.js')
    const result = await getUserId('test@example.com', 'test-api-key')

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

    const { getUserId } = await import('../src/user.js')
    const result = await getUserId('test@example.com', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(new Error('Invalid JSON'))
    expect(result).toBe('')
  })

  it('Returns empty string when network request fails', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const { getUserId } = await import('../src/user.js')
    const result = await getUserId('test@example.com', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(networkError)
    expect(result).toBe('')
  })
})
