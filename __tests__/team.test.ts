import { jest } from '@jest/globals'

// Mock global fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

// Mock console.error
const mockConsoleError = jest.fn()
global.console.error = mockConsoleError

describe('team.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Returns team ID when API call is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'team-123' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getTeamId } = await import('../src/team.js')
    const result = await getTeamId('backend', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/teams?filter%5Bname%5D=backend',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer test-api-key' }
      }
    )
    expect(result).toBe('team-123')
  })

  it('Encodes team name in URL', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'team-456' }]
      })
    }
    mockFetch.mockResolvedValue(mockResponse as unknown as Response)

    const { getTeamId } = await import('../src/team.js')
    await getTeamId('platform & infrastructure', 'test-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/teams?filter%5Bname%5D=platform%20%26%20infrastructure',
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

    const { getTeamId } = await import('../src/team.js')
    const result = await getTeamId('nonexistent_team', 'test-api-key')

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

    const { getTeamId } = await import('../src/team.js')
    const result = await getTeamId('test_team', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(new Error('Invalid JSON'))
    expect(result).toBe('')
  })

  it('Returns empty string when network request fails', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const { getTeamId } = await import('../src/team.js')
    const result = await getTeamId('test_team', 'test-api-key')

    expect(mockConsoleError).toHaveBeenCalledWith(networkError)
    expect(result).toBe('')
  })
})
