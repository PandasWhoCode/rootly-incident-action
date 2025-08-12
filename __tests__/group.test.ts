/**
 * Unit tests for the group functionality, src/group.ts
 */
import { jest } from '@jest/globals'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { getGroupId } = await import('../src/group.js')

describe('group.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockGroupName = 'Test Group'
  const mockGroupId = 'group-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Gets group ID successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: mockGroupId }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getGroupId(mockGroupName, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alert_groups?include=Test%20Group',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + mockApiKey },
        body: undefined
      }
    )
    expect(result).toBe(mockGroupId)
  })

  it('Handles group names with spaces correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'group-456' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await getGroupId('Engineering Team', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alert_groups?include=Engineering%20Team',
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

    const result = await getGroupId(mockGroupName, mockApiKey)

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

    const result = await getGroupId(mockGroupName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'))

    consoleSpy.mockRestore()
  })

  it('Handles empty group name', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'group-empty' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await getGroupId('', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alert_groups?include=',
      expect.objectContaining({
        method: 'GET'
      })
    )
    expect(result).toBe('group-empty')

    consoleSpy.mockRestore()
  })

  it('Returns empty string when API returns HTTP error status', async () => {
    const mockResponse = {
      ok: false,
      status: 403,
      statusText: 'Forbidden'
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await getGroupId(mockApiKey, 'security-team')

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(
      new Error('HTTP error! status: 403 Forbidden')
    )

    consoleSpy.mockRestore()
  })
})
