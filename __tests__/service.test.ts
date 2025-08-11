/**
 * Unit tests for the service functionality, src/service.ts
 */
import { jest } from '@jest/globals'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { getServiceId } = await import('../src/service.js')

describe('service.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockServiceName = 'Test Service'
  const mockServiceId = 'service-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Gets service ID successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: mockServiceId }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await getServiceId(mockServiceName, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/services?filter%5Bname%5D=Test%20Service',
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + mockApiKey },
        body: undefined
      }
    )
    expect(result).toBe(mockServiceId)
  })

  it('Handles service names with spaces correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'service-456' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await getServiceId('My Test Service', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/services?filter%5Bname%5D=My%20Test%20Service',
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

    const result = await getServiceId(mockServiceName, mockApiKey)

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

    const result = await getServiceId(mockServiceName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(new Error('JSON parse error'))

    consoleSpy.mockRestore()
  })

  it('Handles empty service name', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'service-empty' }]
      })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const result = await getServiceId('', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/services?filter%5Bname%5D=',
      expect.objectContaining({
        method: 'GET'
      })
    )
    expect(result).toBe('service-empty')

    consoleSpy.mockRestore()
  })
})
