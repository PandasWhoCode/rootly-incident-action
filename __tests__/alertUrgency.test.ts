/**
 * Unit tests for the environment functionality, src/environment.ts
 */
import { jest } from '@jest/globals'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { getAlertUrgencyId } = await import('../src/alertUrgency.js')

describe('alertUrgency.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockAlertUrgencyName = 'High'
  const mockAlertUrgencyId = 'urgency-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Gets environment ID successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: mockAlertUrgencyId }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getAlertUrgencyId(mockAlertUrgencyName, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alert_urgencies?filter%5Bname%5D=High',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + mockApiKey },
        body: undefined
      }
    )
    expect(result).toBe(mockAlertUrgencyId)
  })

  it('Handles environment names with spaces correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'urgency-456' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await getAlertUrgencyId('Medium', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alert_urgencies?filter%5Bname%5D=Medium',
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

    const result = await getAlertUrgencyId(mockAlertUrgencyName, mockApiKey)

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

    const result = await getAlertUrgencyId(mockAlertUrgencyName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'))

    consoleSpy.mockRestore()
  })

  it('Handles different environment types', async () => {
    const alertUrgencies = ['High', 'Medium', 'Low']

    for (const urgency of alertUrgencies) {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [{ id: `urgency-${urgency}` }]
        })
      } as unknown as Response
      mockFetch.mockResolvedValue(mockResponse)

      const result = await getAlertUrgencyId(urgency, mockApiKey)

      expect(result).toBe(`urgency-${urgency}`)
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.rootly.com/v1/alert_urgencies?filter%5Bname%5D=${urgency}`,
        expect.objectContaining({
          method: 'GET'
        })
      )
    }
  })

  it('Handles production environment type', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'urgency-High' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getAlertUrgencyId('High', mockApiKey)

    expect(result).toBe('urgency-High')
  })

  it('Returns empty string when API returns HTTP error status', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await getAlertUrgencyId('Medium', mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(
      new Error('HTTP error! status: 401 Unauthorized')
    )

    consoleSpy.mockRestore()
  })
})
