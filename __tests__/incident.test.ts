/**
 * Unit tests for the incident functionality, src/incident.ts
 */
import { jest } from '@jest/globals'
import { ApiPostResponse } from '../src/apiResponse.js'

// Mock the global fetch function
const mockFetch = jest.fn<typeof globalThis.fetch>()
global.fetch = mockFetch

// Import the module being tested dynamically
const { createIncident } = await import('../src/incident.js')

describe('incident.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockTitle = 'Test Incident'
  const mockCreateAsPublic = false
  const mockKind = 'normal'
  const mockParentId = 'parent-123'
  const mockDuplicateId = 'dup-456'
  const mockSummary = 'This is a test incident summary'
  const mockUserId = 'user-123'
  const mockSeverityId = 'severity-123'
  const mockAlertIds = ['alert-1', 'alert-2']
  const mockEnvironmentIds = ['env-1', 'env-2']
  const mockIncidentTypeIds = ['type-1', 'type-2']
  const mockServiceIds = ['service-1', 'service-2']
  const mockFunctionalityIds = ['func-1', 'func-2']
  const mockGroupIds = ['group-1', 'group-2']
  const mockCauseIds = ['cause-1', 'cause-2']
  const mockLabels = [{ key: 'env', value: 'prod' }]
  const mockSlackChannelName = 'incident-channel'
  const mockSlackChannelId = 'C123456'
  const mockSlackChannelUrl = 'https://slack.com/channels/incident'
  const mockGoogleDriveParentId = 'drive-parent-123'
  const mockGoogleDriveUrl = 'https://drive.google.com/folder/123'
  const mockNotifyEmails = ['notify1@example.com', 'notify2@example.com']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Creates an incident successfully with all parameters', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-123' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockCreateAsPublic,
      mockKind,
      mockParentId,
      mockDuplicateId,
      mockSummary,
      mockUserId,
      mockSeverityId,
      mockAlertIds,
      mockEnvironmentIds,
      mockIncidentTypeIds,
      mockServiceIds,
      mockFunctionalityIds,
      mockGroupIds,
      mockCauseIds,
      mockLabels,
      mockSlackChannelName,
      mockSlackChannelId,
      mockSlackChannelUrl,
      mockGoogleDriveParentId,
      mockGoogleDriveUrl,
      mockNotifyEmails
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + mockApiKey,
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: true,
              public_title: mockTitle,
              title: mockTitle,
              status: 'started',
              kind: mockKind,
              parent_id: mockParentId,
              duplicate_id: mockDuplicateId,
              summary: mockSummary,
              user_id: mockUserId,
              severity_id: mockSeverityId,
              environment_ids: mockEnvironmentIds,
              incident_type_ids: mockIncidentTypeIds,
              service_ids: mockServiceIds,
              group_ids: mockGroupIds,
              alert_ids: mockAlertIds,
              functionality_ids: mockFunctionalityIds,
              cause_ids: mockCauseIds,
              labels: mockLabels,
              notify_emails: mockNotifyEmails,
              slack_channel_name: mockSlackChannelName,
              slack_channel_id: mockSlackChannelId,
              slack_channel_url: mockSlackChannelUrl,
              google_drive_parent_id: mockGoogleDriveParentId,
              google_drive_url: mockGoogleDriveUrl
            }
          }
        })
      }
    )
    expect(result).toBe('incident-123')
  })

  it('Creates an incident successfully with minimal parameters', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-456' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockCreateAsPublic
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + mockApiKey,
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: true,
              public_title: mockTitle,
              title: mockTitle,
              status: 'started'
            }
          }
        })
      }
    )
    expect(result).toBe('incident-456')
  })

  it('Creates a public incident when createAsPublic is true', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-789' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      true // createAsPublic = true
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      expect.objectContaining({
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: false, // Should be false when createAsPublic is true
              public_title: mockTitle,
              title: mockTitle,
              status: 'started'
            }
          }
        })
      })
    )
    expect(result).toBe('incident-789')
  })

  it('Handles empty optional parameters correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-empty' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockCreateAsPublic,
      '', // empty kind
      '', // empty parentId
      '', // empty duplicateId
      '', // empty summary
      '', // empty userId
      '', // empty severityId
      [], // empty alertIds
      [], // empty environmentIds
      [], // empty incidentTypeIds
      [], // empty serviceIds
      [], // empty functionalityIds
      [], // empty groupIds
      [], // empty causeIds
      [], // empty labels
      '', // empty slackChannelName
      '', // empty slackChannelId
      '', // empty slackChannelUrl
      '', // empty googleDriveParentId
      '', // empty googleDriveUrl
      [] // empty notifyEmails
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      expect.objectContaining({
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: true,
              public_title: mockTitle,
              title: mockTitle,
              status: 'started'
            }
          }
        })
      })
    )
    expect(result).toBe('incident-empty')
  })

  it('Handles undefined optional parameters correctly', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'incident-undefined' } })
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    const result = await createIncident(
      mockApiKey,
      mockTitle,
      mockCreateAsPublic,
      undefined, // undefined kind
      undefined, // undefined parentId
      undefined, // undefined duplicateId
      undefined, // undefined summary
      undefined, // undefined userId
      undefined, // undefined severityId
      undefined, // undefined alertIds
      undefined, // undefined environmentIds
      undefined, // undefined incidentTypeIds
      undefined, // undefined serviceIds
      undefined, // undefined functionalityIds
      undefined, // undefined groupIds
      undefined, // undefined causeIds
      undefined, // undefined labels
      undefined, // undefined slackChannelName
      undefined, // undefined slackChannelId
      undefined, // undefined slackChannelUrl
      undefined, // undefined googleDriveParentId
      undefined, // undefined googleDriveUrl
      undefined // undefined notifyEmails
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/incidents',
      expect.objectContaining({
        body: JSON.stringify({
          data: {
            type: 'incidents',
            attributes: {
              private: true,
              public_title: mockTitle,
              title: mockTitle,
              status: 'started'
            }
          }
        })
      })
    )
    expect(result).toBe('incident-undefined')
  })

  it('Throws error when API request fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    await expect(
      createIncident(mockApiKey, mockTitle, mockCreateAsPublic)
    ).rejects.toThrow('Network error')
  })

  it('Throws error when response parsing fails', async () => {
    const mockResponse = {
      ok: true,
      json: jest
        .fn()
        .mockRejectedValue(
          new Error('JSON parse error')
        ) as jest.MockedFunction<() => Promise<ApiPostResponse>>
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await expect(
      createIncident(mockApiKey, mockTitle, mockCreateAsPublic)
    ).rejects.toThrow('JSON parse error')
  })

  it('Throws error when API returns HTTP error status', async () => {
    const mockResponse = {
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity'
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await expect(
      createIncident(mockApiKey, mockTitle, mockCreateAsPublic)
    ).rejects.toThrow('HTTP error! status: 422 Unprocessable Entity')
  })

  it('Handles non-Error exceptions in error handling', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue('String error instead of Error object')
    } as unknown as Response
    mockFetch.mockResolvedValue(mockResponse)

    await expect(
      createIncident(mockApiKey, mockTitle, mockCreateAsPublic)
    ).rejects.toBe('String error instead of Error object')
  })

  it('Logs error and debug information when incident creation fails', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as jest.MockedFunction<typeof console.error>

    const coreErrorSpy = jest.fn()
    const coreDebugSpy = jest.fn()

    // Mock core module
    jest.unstable_mockModule('@actions/core', () => ({
      error: coreErrorSpy,
      debug: coreDebugSpy
    }))

    mockFetch.mockRejectedValue(new Error('API error'))

    await expect(
      createIncident(mockApiKey, mockTitle, mockCreateAsPublic)
    ).rejects.toThrow('API error')

    consoleSpy.mockRestore()
  })
})
