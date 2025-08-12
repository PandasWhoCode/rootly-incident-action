/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

describe('main.ts', () => {
  // Create fresh mock functions for each test suite
  let createAlertMock: jest.MockedFunction<
    (
      apiKey: string,
      summary: string,
      details: string,
      serviceIds?: string[],
      groupIds?: string[],
      environmentIds?: string[]
    ) => Promise<string>
  >
  let createIncidentMock: jest.MockedFunction<
    (
      apiKey: string,
      title: string,
      summary: string,
      severityId: string,
      alertId: string,
      serviceIds: string[],
      groupIds: string[],
      environmentIds: string[],
      incidentTypeIds: string[]
    ) => Promise<string>
  >
  let getServiceIdMock: jest.MockedFunction<
    (serviceName: string, apiKey: string) => Promise<string>
  >
  let getTeamIdMock: jest.MockedFunction<
    (teamName: string, apiKey: string) => Promise<string>
  >
  let getGroupIdMock: jest.MockedFunction<
    (groupName: string, apiKey: string) => Promise<string>
  >
  let getEnvironmentIdMock: jest.MockedFunction<
    (environmentName: string, apiKey: string) => Promise<string>
  >
  let getSeverityIdMock: jest.MockedFunction<
    (severityName: string, apiKey: string) => Promise<string>
  >
  let getIncidentTypeIdMock: jest.MockedFunction<
    (incidentTypeName: string, apiKey: string) => Promise<string>
  >

  beforeAll(() => {
    // Set up mocks once before all tests
    createAlertMock = jest.fn()
    createIncidentMock = jest.fn()
    getServiceIdMock = jest.fn()
    getTeamIdMock = jest.fn()
    getGroupIdMock = jest.fn()
    getEnvironmentIdMock = jest.fn()
    getSeverityIdMock = jest.fn()
    getIncidentTypeIdMock = jest.fn()

    // Mock all modules
    jest.unstable_mockModule('@actions/core', () => core)
    jest.unstable_mockModule('../src/alert.js', () => ({
      createAlert: createAlertMock
    }))
    jest.unstable_mockModule('../src/incident.js', () => ({
      createIncident: createIncidentMock
    }))
    jest.unstable_mockModule('../src/service.js', () => ({
      getServiceId: getServiceIdMock
    }))
    jest.unstable_mockModule('../src/team.js', () => ({
      getTeamId: getTeamIdMock
    }))
    jest.unstable_mockModule('../src/group.js', () => ({
      getGroupId: getGroupIdMock
    }))
    jest.unstable_mockModule('../src/environment.js', () => ({
      getEnvironmentId: getEnvironmentIdMock
    }))
    jest.unstable_mockModule('../src/severity.js', () => ({
      getSeverityId: getSeverityIdMock
    }))
    jest.unstable_mockModule('../src/incidentType.js', () => ({
      getIncidentTypeId: getIncidentTypeIdMock
    }))
  })

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    createAlertMock.mockClear()
    createIncidentMock.mockClear()
    getServiceIdMock.mockClear()
    getTeamIdMock.mockClear()
    getGroupIdMock.mockClear()
    getEnvironmentIdMock.mockClear()
    getSeverityIdMock.mockClear()
    getIncidentTypeIdMock.mockClear()

    // Set default resolved values
    createAlertMock.mockResolvedValue('alert-123')
    createIncidentMock.mockResolvedValue('incident-456')
    getServiceIdMock.mockResolvedValue('service-123')
    getTeamIdMock.mockResolvedValue('team-123')
    getGroupIdMock.mockResolvedValue('group-123')
    getEnvironmentIdMock.mockResolvedValue('env-123')
    getSeverityIdMock.mockResolvedValue('severity-123')
    getIncidentTypeIdMock.mockResolvedValue('type-123')
  })

  describe('Alert creation enabled', () => {
    it('Runs successfully with alert creation enabled', async () => {
      // Set up input mocks
      core.getInput
        .mockReturnValueOnce('critical') // severity
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('This is a test incident.') // details
        .mockReturnValueOnce('Service1,Service2') // services
        .mockReturnValueOnce('Team1,Team2') // teams
        .mockReturnValueOnce('Group1,Group2') // alert_groups
        .mockReturnValueOnce('Environment1,Environment2') // environments
        .mockReturnValueOnce('IncidentType1,IncidentType2') // incident-types
        .mockReturnValueOnce('true') // create-alert
        .mockReturnValueOnce('test-api-key') // api key

      // Import and run the main function
      const { run } = await import('../src/main.js')
      await run()

      // Verify all service functions were called
      expect(getServiceIdMock).toHaveBeenCalledTimes(2)
      expect(getServiceIdMock).toHaveBeenCalledWith('Service1', 'test-api-key')
      expect(getServiceIdMock).toHaveBeenCalledWith('Service2', 'test-api-key')

      expect(getTeamIdMock).toHaveBeenCalledTimes(2)
      expect(getTeamIdMock).toHaveBeenCalledWith('Team1', 'test-api-key')
      expect(getTeamIdMock).toHaveBeenCalledWith('Team2', 'test-api-key')

      expect(getGroupIdMock).toHaveBeenCalledTimes(2)
      expect(getGroupIdMock).toHaveBeenCalledWith('Group1', 'test-api-key')
      expect(getGroupIdMock).toHaveBeenCalledWith('Group2', 'test-api-key')

      expect(getEnvironmentIdMock).toHaveBeenCalledTimes(2)
      expect(getEnvironmentIdMock).toHaveBeenCalledWith(
        'Environment1',
        'test-api-key'
      )
      expect(getEnvironmentIdMock).toHaveBeenCalledWith(
        'Environment2',
        'test-api-key'
      )

      expect(getIncidentTypeIdMock).toHaveBeenCalledTimes(2)
      expect(getIncidentTypeIdMock).toHaveBeenCalledWith(
        'IncidentType1',
        'test-api-key'
      )
      expect(getIncidentTypeIdMock).toHaveBeenCalledWith(
        'IncidentType2',
        'test-api-key'
      )

      expect(getSeverityIdMock).toHaveBeenCalledWith('critical', 'test-api-key')

      // Verify alert was created
      expect(createAlertMock).toHaveBeenCalledWith(
        'test-api-key',
        'Test Incident',
        'This is a test incident.',
        ['service-123', 'service-123'],
        ['group-123', 'group-123'],
        ['env-123', 'env-123']
      )

      // Verify incident was created
      expect(createIncidentMock).toHaveBeenCalledWith(
        'test-api-key',
        'Test Incident',
        'This is a test incident.',
        'severity-123',
        'alert-123',
        ['service-123', 'service-123'],
        ['team-123', 'team-123'],
        ['env-123', 'env-123'],
        ['type-123', 'type-123']
      )

      // Verify outputs were set
      expect(core.setOutput).toHaveBeenCalledWith('incident-id', 'incident-456')
      expect(core.setOutput).toHaveBeenCalledWith('alert-id', 'alert-123')
    })
  })

  describe('Alert creation disabled', () => {
    it('Runs successfully with alert creation disabled', async () => {
      // Set up input mocks for alert creation disabled
      core.getInput
        .mockReturnValueOnce('high') // severity
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('This is a test incident.') // summary
        .mockReturnValueOnce('Service1') // services
        .mockReturnValueOnce('Team1') // teams
        .mockReturnValueOnce('Group1') // alert_groups
        .mockReturnValueOnce('Environment1') // environments
        .mockReturnValueOnce('IncidentType1') // incident-types
        .mockReturnValueOnce('false') // create-alert
        .mockReturnValueOnce('test-api-key') // api key

      // Import and run the main function
      const { run } = await import('../src/main.js')
      await run()

      // Verify alert was not created
      expect(createAlertMock).not.toHaveBeenCalled()

      // Verify incident was created without alert ID
      expect(createIncidentMock).toHaveBeenCalledWith(
        'test-api-key',
        'Test Incident',
        'This is a test incident.',
        'severity-123',
        '',
        ['service-123'],
        ['team-123'],
        ['env-123'],
        ['type-123']
      )

      // Verify outputs were set
      expect(core.setOutput).toHaveBeenCalledWith('incident-id', 'incident-456')
      expect(core.setOutput).toHaveBeenCalledWith('alert-id', '')
    })
  })

  describe('Error handling', () => {
    it('Handles errors and sets failed status', async () => {
      // Make one of the service calls fail
      getServiceIdMock.mockRejectedValueOnce(new Error('Service lookup failed'))

      // Set up input mocks
      core.getInput
        .mockReturnValueOnce('critical') // severity
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('This is a test incident.') // summary
        .mockReturnValueOnce('Service1,Service2') // services
        .mockReturnValueOnce('Team1,Team2') // teams
        .mockReturnValueOnce('Group1,Group2') // alert_groups
        .mockReturnValueOnce('Environment1,Environment2') // environments
        .mockReturnValueOnce('IncidentType1,IncidentType2') // incident-types
        .mockReturnValueOnce('true') // create-alert
        .mockReturnValueOnce('test-api-key') // api key

      // Import and run the main function
      const { run } = await import('../src/main.js')
      await run()

      // Verify that the action was marked as failed
      expect(core.setFailed).toHaveBeenCalledWith('Service lookup failed')
    })

    it('Handles non-Error exceptions', async () => {
      // Make one of the service calls throw a non-Error object
      getSeverityIdMock.mockRejectedValueOnce('String error')

      // Set up input mocks
      core.getInput
        .mockReturnValueOnce('critical') // severity
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('This is a test incident.') // summary
        .mockReturnValueOnce('Service1,Service2') // services
        .mockReturnValueOnce('Team1,Team2') // teams
        .mockReturnValueOnce('Group1,Group2') // alert_groups
        .mockReturnValueOnce('Environment1,Environment2') // environments
        .mockReturnValueOnce('IncidentType1,IncidentType2') // incident-types
        .mockReturnValueOnce('true') // create-alert
        .mockReturnValueOnce('test-api-key') // api key

      // Import and run the main function
      const { run } = await import('../src/main.js')
      await run()

      // Verify that setFailed was not called since the error is not an Error instance
      expect(core.setFailed).not.toHaveBeenCalled()
    })
  })

  describe('Empty input handling', () => {
    it('Handles empty input arrays correctly', async () => {
      // Set up input mocks for empty arrays
      core.getInput
        .mockReturnValueOnce('low') // severity
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('This is a test incident.') // summary
        .mockReturnValueOnce('') // services (empty)
        .mockReturnValueOnce('') // teams (empty)
        .mockReturnValueOnce('') // alert_groups (empty)
        .mockReturnValueOnce('') // environments (empty)
        .mockReturnValueOnce('') // incident-types (empty)
        .mockReturnValueOnce('false') // create-alert
        .mockReturnValueOnce('test-api-key') // api key

      // Import and run the main function
      const { run } = await import('../src/main.js')
      await run()

      // Verify incident was created with arrays containing one empty string result each
      expect(createIncidentMock).toHaveBeenCalledWith(
        'test-api-key', // api key
        'Test Incident', // title
        'This is a test incident.', // summary
        'severity-123', // severity ID
        '', // alert ID (not created)
        [], // service IDs are empty, so no service IDs
        [], // teams are empty, so no team IDs
        [], // environments are empty, so no environment IDs
        [] // incident types are empty, so no incident type IDs
      )
    })
  })

  describe('Debug logging', () => {
    it('Logs debug information correctly', async () => {
      // Set up input mocks
      core.getInput
        .mockReturnValueOnce('critical') // severity
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('This is a test incident.') // Details
        .mockReturnValueOnce('Service1,Service2') // services
        .mockReturnValueOnce('Team1,Team2') // teams
        .mockReturnValueOnce('Group1,Group2') // alert_groups
        .mockReturnValueOnce('Environment1,Environment2') // environments
        .mockReturnValueOnce('IncidentType1,IncidentType2') // incident-types
        .mockReturnValueOnce('true') // create-alert
        .mockReturnValueOnce('test-api-key') // api key

      // Import and run the main function
      const { run } = await import('../src/main.js')
      await run()

      // Verify debug logs were called
      expect(core.debug).toHaveBeenCalledWith('Title: Test Incident')
      expect(core.debug).toHaveBeenCalledWith(
        'Details: This is a test incident.'
      )
      expect(core.debug).toHaveBeenCalledWith('Severity: critical')
      expect(core.debug).toHaveBeenCalledWith('Service: Service1,Service2')
      expect(core.debug).toHaveBeenCalledWith('Team: Team1,Team2')
      expect(core.debug).toHaveBeenCalledWith('Alert Group: Group1,Group2')
      expect(core.debug).toHaveBeenCalledWith(
        'Environment: Environment1,Environment2'
      )
      expect(core.debug).toHaveBeenCalledWith('Create Alert: true')
    })
  })
})
