/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

describe('main.ts', () => {
  // Create fresh mock functions for each test suite
  let createIncidentMock: jest.MockedFunction<
    (
      apiKey: string,
      title: string,
      createAsPublic: boolean,
      kind?: string,
      parentId?: string,
      duplicateId?: string,
      summary?: string,
      userId?: string,
      severityId?: string,
      alertIds?: string[],
      environmentIds?: string[],
      incidentTypeIds?: string[],
      serviceIds?: string[],
      functionalityIds?: string[],
      groupIds?: string[],
      causeIds?: string[],
      labels?: { key: string; value: string }[],
      slackChannelName?: string,
      slackChannelId?: string,
      slackChannelUrl?: string,
      googleDriveParentId?: string,
      googleDriveUrl?: string,
      notifyEmails?: string[]
    ) => Promise<string>
  >
  let getServiceIdMock: jest.MockedFunction<
    (serviceName: string, apiKey: string) => Promise<string>
  >
  let getTeamIdMock: jest.MockedFunction<
    (teamName: string, apiKey: string) => Promise<string>
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
  let getUserIdMock: jest.MockedFunction<
    (email: string, apiKey: string) => Promise<string>
  >
  let getCauseIdMock: jest.MockedFunction<
    (cause: string, apiKey: string) => Promise<string>
  >
  let getFunctionalityIdMock: jest.MockedFunction<
    (functionality: string, apiKey: string) => Promise<string>
  >
  let createLabelsFromStringMock: jest.MockedFunction<
    (labelString: string) => { key: string; value: string }[]
  >

  beforeAll(() => {
    // Set up mocks once before all tests
    createIncidentMock = jest.fn()
    getServiceIdMock = jest.fn()
    getTeamIdMock = jest.fn()
    getEnvironmentIdMock = jest.fn()
    getSeverityIdMock = jest.fn()
    getIncidentTypeIdMock = jest.fn()
    getUserIdMock = jest.fn()
    getCauseIdMock = jest.fn()
    getFunctionalityIdMock = jest.fn()
    createLabelsFromStringMock = jest.fn()

    // Mock all modules
    jest.unstable_mockModule('@actions/core', () => core)
    jest.unstable_mockModule('../src/incident.js', () => ({
      createIncident: createIncidentMock
    }))
    jest.unstable_mockModule('../src/service.js', () => ({
      getServiceId: getServiceIdMock
    }))
    jest.unstable_mockModule('../src/team.js', () => ({
      getTeamId: getTeamIdMock
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
    jest.unstable_mockModule('../src/user.js', () => ({
      getUserId: getUserIdMock
    }))
    jest.unstable_mockModule('../src/cause.js', () => ({
      getCauseId: getCauseIdMock
    }))
    jest.unstable_mockModule('../src/functionality.js', () => ({
      getFunctionalityId: getFunctionalityIdMock
    }))
    jest.unstable_mockModule('../src/label.js', () => ({
      createLabelsFromString: createLabelsFromStringMock
    }))
  })

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    createIncidentMock.mockClear()
    getServiceIdMock.mockClear()
    getTeamIdMock.mockClear()
    getEnvironmentIdMock.mockClear()
    getSeverityIdMock.mockClear()
    getIncidentTypeIdMock.mockClear()
    getUserIdMock.mockClear()
    getCauseIdMock.mockClear()
    getFunctionalityIdMock.mockClear()
    createLabelsFromStringMock.mockClear()

    // Set default resolved values
    createIncidentMock.mockResolvedValue('incident-456')
    getServiceIdMock.mockResolvedValue('service-123')
    getTeamIdMock.mockResolvedValue('team-123')
    getEnvironmentIdMock.mockResolvedValue('env-123')
    getSeverityIdMock.mockResolvedValue('severity-123')
    getIncidentTypeIdMock.mockResolvedValue('type-123')
    getUserIdMock.mockResolvedValue('user-123')
    getCauseIdMock.mockResolvedValue('cause-123')
    getFunctionalityIdMock.mockResolvedValue('func-123')
    createLabelsFromStringMock.mockReturnValue([{ key: 'env', value: 'prod' }])
  })

  describe('Successful incident creation', () => {
    it('Creates incident with all parameters provided', async () => {
      // Set up comprehensive input mocks
      core.getInput
        .mockReturnValueOnce('test-api-key') // api_key
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('normal') // kind
        .mockReturnValueOnce('parent-123') // parent_incident_id
        .mockReturnValueOnce('dup-456') // duplicate_incident_id
        .mockReturnValueOnce('true') // create_public_incident
        .mockReturnValueOnce('Test summary') // summary
        .mockReturnValueOnce('user@example.com') // user_email
        .mockReturnValueOnce('critical') // severity
        .mockReturnValueOnce('alert-1,alert-2') // alert_ids
        .mockReturnValueOnce('env1,env2') // environments
        .mockReturnValueOnce('type1,type2') // incident_types
        .mockReturnValueOnce('svc1,svc2') // services
        .mockReturnValueOnce('func1,func2') // functionalities
        .mockReturnValueOnce('team1,team2') // groups
        .mockReturnValueOnce('cause1,cause2') // causes
        .mockReturnValueOnce('env:prod,team:backend') // labels
        .mockReturnValueOnce('incident-channel') // slack_channel_name
        .mockReturnValueOnce('C123456') // slack_channel_id
        .mockReturnValueOnce('https://slack.com/channels/incident') // slack_channel_url
        .mockReturnValueOnce('drive-parent-123') // google_drive_parent_id
        .mockReturnValueOnce('https://drive.google.com/folder/123') // google_drive_url
        .mockReturnValueOnce('notify1@example.com,notify2@example.com') // notify_emails

      const { run } = await import('../src/main.js')
      await run()

      // Verify all ID lookups were called
      expect(getServiceIdMock).toHaveBeenCalledTimes(2)
      expect(getTeamIdMock).toHaveBeenCalledTimes(2)
      expect(getUserIdMock).toHaveBeenCalledWith(
        'user@example.com',
        'test-api-key'
      )
      expect(getEnvironmentIdMock).toHaveBeenCalledTimes(2)
      expect(getIncidentTypeIdMock).toHaveBeenCalledTimes(2)
      expect(getCauseIdMock).toHaveBeenCalledTimes(2)
      expect(getFunctionalityIdMock).toHaveBeenCalledTimes(2)
      expect(getSeverityIdMock).toHaveBeenCalledWith('critical', 'test-api-key')
      expect(createLabelsFromStringMock).toHaveBeenCalledWith(
        'env:prod,team:backend'
      )

      // Verify incident creation was called with correct parameters
      expect(createIncidentMock).toHaveBeenCalledWith(
        'test-api-key',
        'Test Incident',
        true, // createAsPublic
        'normal',
        'parent-123',
        'dup-456',
        'Test summary',
        'user-123',
        'severity-123',
        ['alert-1', 'alert-2'],
        ['env-123', 'env-123'],
        ['type-123', 'type-123'],
        ['service-123', 'service-123'],
        ['func-123', 'func-123'],
        ['team-123', 'team-123'],
        ['cause-123', 'cause-123'],
        [{ key: 'env', value: 'prod' }],
        'incident-channel',
        'C123456',
        'https://slack.com/channels/incident',
        'drive-parent-123',
        'https://drive.google.com/folder/123',
        ['notify1@example.com', 'notify2@example.com']
      )

      expect(core.setOutput).toHaveBeenCalledWith('incident-id', 'incident-456')
    })

    it('Creates incident with minimal parameters', async () => {
      // Set up minimal input mocks
      core.getInput
        .mockReturnValueOnce('test-api-key') // api_key
        .mockReturnValueOnce('Minimal Incident') // title
        .mockReturnValueOnce('') // kind (empty)
        .mockReturnValueOnce('') // parent_incident_id (empty)
        .mockReturnValueOnce('') // duplicate_incident_id (empty)
        .mockReturnValueOnce('false') // create_public_incident
        .mockReturnValueOnce('') // summary (empty)
        .mockReturnValueOnce('') // user_email (empty)
        .mockReturnValueOnce('low') // severity
        .mockReturnValueOnce('') // alert_ids (empty)
        .mockReturnValueOnce('') // environments (empty)
        .mockReturnValueOnce('') // incident_types (empty)
        .mockReturnValueOnce('') // services (empty)
        .mockReturnValueOnce('') // functionalities (empty)
        .mockReturnValueOnce('') // groups (empty)
        .mockReturnValueOnce('') // causes (empty)
        .mockReturnValueOnce('') // labels (empty)
        .mockReturnValueOnce('') // slack_channel_name (empty)
        .mockReturnValueOnce('') // slack_channel_id (empty)
        .mockReturnValueOnce('') // slack_channel_url (empty)
        .mockReturnValueOnce('') // google_drive_parent_id (empty)
        .mockReturnValueOnce('') // google_drive_url (empty)
        .mockReturnValueOnce('') // notify_emails (empty)

      createLabelsFromStringMock.mockReturnValue([])

      const { run } = await import('../src/main.js')
      await run()

      // Verify only severity lookup was called (required)
      expect(getSeverityIdMock).toHaveBeenCalledWith('low', 'test-api-key')
      expect(getUserIdMock).not.toHaveBeenCalled()
      expect(getServiceIdMock).not.toHaveBeenCalled()
      expect(getTeamIdMock).not.toHaveBeenCalled()

      // Verify incident creation with minimal parameters
      expect(createIncidentMock).toHaveBeenCalledWith(
        'test-api-key',
        'Minimal Incident',
        false, // createAsPublic
        '',
        '',
        '',
        '',
        '',
        'severity-123',
        [''], // alert_ids split from empty string results in ['']
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        '',
        '',
        '',
        '',
        '',
        [''] // notify_emails split from empty string results in ['']
      )

      expect(core.setOutput).toHaveBeenCalledWith('incident-id', 'incident-456')
    })
  })

  describe('Kind validation', () => {
    it('Accepts valid kind values', async () => {
      const validKinds = [
        'test',
        'test_sub',
        'example',
        'example_sub',
        'normal',
        'normal_sub',
        'backfilled',
        'scheduled'
      ]

      for (const kind of validKinds) {
        jest.clearAllMocks()

        core.getInput
          .mockReturnValueOnce('test-api-key') // api_key
          .mockReturnValueOnce('Test Incident') // title
          .mockReturnValueOnce(kind) // kind
          .mockReturnValueOnce('') // parent_incident_id
          .mockReturnValueOnce('') // duplicate_incident_id
          .mockReturnValueOnce('false') // create_public_incident
          .mockReturnValueOnce('') // summary
          .mockReturnValueOnce('') // user_email
          .mockReturnValueOnce('low') // severity
          .mockReturnValueOnce('') // alert_ids
          .mockReturnValueOnce('') // environments
          .mockReturnValueOnce('') // incident_types
          .mockReturnValueOnce('') // services
          .mockReturnValueOnce('') // functionalities
          .mockReturnValueOnce('') // groups
          .mockReturnValueOnce('') // causes
          .mockReturnValueOnce('') // labels
          .mockReturnValueOnce('') // slack_channel_name
          .mockReturnValueOnce('') // slack_channel_id
          .mockReturnValueOnce('') // slack_channel_url
          .mockReturnValueOnce('') // google_drive_parent_id
          .mockReturnValueOnce('') // google_drive_url
          .mockReturnValueOnce('') // notify_emails

        createLabelsFromStringMock.mockReturnValue([])

        const { run } = await import('../src/main.js')
        await run()

        expect(createIncidentMock).toHaveBeenCalledWith(
          'test-api-key',
          'Test Incident',
          false,
          kind,
          '',
          '',
          '',
          '',
          'severity-123',
          [''], // alert_ids split from empty string results in ['']
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          '',
          '',
          '',
          '',
          '',
          [''] // notify_emails split from empty string results in ['']
        )
      }
    })

    it('Throws error for invalid kind values', async () => {
      core.getInput
        .mockReturnValueOnce('test-api-key') // api_key
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('invalid_kind') // kind (invalid)
        .mockReturnValueOnce('') // parent_incident_id
        .mockReturnValueOnce('') // duplicate_incident_id
        .mockReturnValueOnce('false') // create_public_incident
        .mockReturnValueOnce('') // summary
        .mockReturnValueOnce('') // user_email
        .mockReturnValueOnce('low') // severity
        .mockReturnValueOnce('') // alert_ids
        .mockReturnValueOnce('') // environments
        .mockReturnValueOnce('') // incident_types
        .mockReturnValueOnce('') // services
        .mockReturnValueOnce('') // functionalities
        .mockReturnValueOnce('') // groups
        .mockReturnValueOnce('') // causes
        .mockReturnValueOnce('') // labels
        .mockReturnValueOnce('') // slack_channel_name
        .mockReturnValueOnce('') // slack_channel_id
        .mockReturnValueOnce('') // slack_channel_url
        .mockReturnValueOnce('') // google_drive_parent_id
        .mockReturnValueOnce('') // google_drive_url
        .mockReturnValueOnce('') // notify_emails

      createLabelsFromStringMock.mockReturnValue([])

      const { run } = await import('../src/main.js')
      await run()

      expect(core.setFailed).toHaveBeenCalledWith(
        "Invalid kind 'invalid_kind'. Valid kinds are: test, test_sub, example, example_sub, normal, normal_sub, backfilled, scheduled"
      )
    })

    it('Accepts empty kind value', async () => {
      core.getInput
        .mockReturnValueOnce('test-api-key') // api_key
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('') // kind (empty - should be accepted)
        .mockReturnValueOnce('') // parent_incident_id
        .mockReturnValueOnce('') // duplicate_incident_id
        .mockReturnValueOnce('false') // create_public_incident
        .mockReturnValueOnce('') // summary
        .mockReturnValueOnce('') // user_email
        .mockReturnValueOnce('low') // severity
        .mockReturnValueOnce('') // alert_ids
        .mockReturnValueOnce('') // environments
        .mockReturnValueOnce('') // incident_types
        .mockReturnValueOnce('') // services
        .mockReturnValueOnce('') // functionalities
        .mockReturnValueOnce('') // groups
        .mockReturnValueOnce('') // causes
        .mockReturnValueOnce('') // labels
        .mockReturnValueOnce('') // slack_channel_name
        .mockReturnValueOnce('') // slack_channel_id
        .mockReturnValueOnce('') // slack_channel_url
        .mockReturnValueOnce('') // google_drive_parent_id
        .mockReturnValueOnce('') // google_drive_url
        .mockReturnValueOnce('') // notify_emails

      createLabelsFromStringMock.mockReturnValue([])

      const { run } = await import('../src/main.js')
      await run()

      expect(core.setFailed).not.toHaveBeenCalled()
      expect(createIncidentMock).toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('Handles errors and sets failed status', async () => {
      // Make service lookup fail
      getServiceIdMock.mockRejectedValueOnce(new Error('Service lookup failed'))

      core.getInput
        .mockReturnValueOnce('test-api-key') // api_key
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('') // kind
        .mockReturnValueOnce('') // parent_incident_id
        .mockReturnValueOnce('') // duplicate_incident_id
        .mockReturnValueOnce('false') // create_public_incident
        .mockReturnValueOnce('') // summary
        .mockReturnValueOnce('') // user_email
        .mockReturnValueOnce('critical') // severity
        .mockReturnValueOnce('') // alert_ids
        .mockReturnValueOnce('') // environments
        .mockReturnValueOnce('') // incident_types
        .mockReturnValueOnce('Service1') // services (will cause error)
        .mockReturnValueOnce('') // functionalities
        .mockReturnValueOnce('') // groups
        .mockReturnValueOnce('') // causes
        .mockReturnValueOnce('') // labels
        .mockReturnValueOnce('') // slack_channel_name
        .mockReturnValueOnce('') // slack_channel_id
        .mockReturnValueOnce('') // slack_channel_url
        .mockReturnValueOnce('') // google_drive_parent_id
        .mockReturnValueOnce('') // google_drive_url
        .mockReturnValueOnce('') // notify_emails

      createLabelsFromStringMock.mockReturnValue([])

      const { run } = await import('../src/main.js')
      await run()

      expect(core.setFailed).toHaveBeenCalledWith('Service lookup failed')
    })

    it('Handles non-Error exceptions', async () => {
      // Make severity lookup throw a non-Error object
      getSeverityIdMock.mockRejectedValueOnce('String error')

      core.getInput
        .mockReturnValueOnce('test-api-key') // api_key
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('') // kind
        .mockReturnValueOnce('') // parent_incident_id
        .mockReturnValueOnce('') // duplicate_incident_id
        .mockReturnValueOnce('false') // create_public_incident
        .mockReturnValueOnce('') // summary
        .mockReturnValueOnce('') // user_email
        .mockReturnValueOnce('critical') // severity (will cause error)
        .mockReturnValueOnce('') // alert_ids
        .mockReturnValueOnce('') // environments
        .mockReturnValueOnce('') // incident_types
        .mockReturnValueOnce('') // services
        .mockReturnValueOnce('') // functionalities
        .mockReturnValueOnce('') // groups
        .mockReturnValueOnce('') // causes
        .mockReturnValueOnce('') // labels
        .mockReturnValueOnce('') // slack_channel_name
        .mockReturnValueOnce('') // slack_channel_id
        .mockReturnValueOnce('') // slack_channel_url
        .mockReturnValueOnce('') // google_drive_parent_id
        .mockReturnValueOnce('') // google_drive_url
        .mockReturnValueOnce('') // notify_emails

      createLabelsFromStringMock.mockReturnValue([])

      const { run } = await import('../src/main.js')
      await run()

      // Verify that setFailed was not called since the error is not an Error instance
      expect(core.setFailed).not.toHaveBeenCalled()
    })
  })

  describe('Debug logging', () => {
    it('Logs debug information correctly', async () => {
      core.getInput
        .mockReturnValueOnce('test-api-key') // api_key
        .mockReturnValueOnce('Test Incident') // title
        .mockReturnValueOnce('normal') // kind
        .mockReturnValueOnce('parent-123') // parent_incident_id
        .mockReturnValueOnce('dup-456') // duplicate_incident_id
        .mockReturnValueOnce('true') // create_public_incident
        .mockReturnValueOnce('Test summary') // summary
        .mockReturnValueOnce('user@example.com') // user_email
        .mockReturnValueOnce('critical') // severity
        .mockReturnValueOnce('alert-1,alert-2') // alert_ids
        .mockReturnValueOnce('env1,env2') // environments
        .mockReturnValueOnce('type1') // incident_types
        .mockReturnValueOnce('svc1') // services
        .mockReturnValueOnce('func1') // functionalities
        .mockReturnValueOnce('team1') // groups
        .mockReturnValueOnce('cause1') // causes
        .mockReturnValueOnce('env:prod') // labels
        .mockReturnValueOnce('incident-channel') // slack_channel_name
        .mockReturnValueOnce('C123456') // slack_channel_id
        .mockReturnValueOnce('https://slack.com/channels/incident') // slack_channel_url
        .mockReturnValueOnce('drive-parent-123') // google_drive_parent_id
        .mockReturnValueOnce('https://drive.google.com/folder/123') // google_drive_url
        .mockReturnValueOnce('notify1@example.com') // notify_emails

      createLabelsFromStringMock.mockReturnValue([
        { key: 'env', value: 'prod' }
      ])

      const { run } = await import('../src/main.js')
      await run()

      // Verify debug logs were called
      expect(core.debug).toHaveBeenCalledWith('Title: Test Incident')
      expect(core.debug).toHaveBeenCalledWith('Kind: normal')
      expect(core.debug).toHaveBeenCalledWith('Parent Incident ID: parent-123')
      expect(core.debug).toHaveBeenCalledWith('Duplicate Incident ID: dup-456')
      expect(core.debug).toHaveBeenCalledWith('Create as Public Incident: true')
      expect(core.debug).toHaveBeenCalledWith('Summary: Test summary')
      expect(core.debug).toHaveBeenCalledWith('User Email: user@example.com')
      expect(core.debug).toHaveBeenCalledWith('Alert IDs: alert-1,alert-2')
      expect(core.debug).toHaveBeenCalledWith('Environments: env1,env2')
      expect(core.debug).toHaveBeenCalledWith('Incident Types: type1')
      expect(core.debug).toHaveBeenCalledWith('Services: svc1')
      expect(core.debug).toHaveBeenCalledWith('Functionalities: func1')
      expect(core.debug).toHaveBeenCalledWith('Teams: team1')
      expect(core.debug).toHaveBeenCalledWith('Causes: cause1')
      expect(core.debug).toHaveBeenCalledWith('Labels: [object Object]')
      expect(core.debug).toHaveBeenCalledWith(
        'Slack Channel Name: incident-channel'
      )
      expect(core.debug).toHaveBeenCalledWith('Slack Channel ID: C123456')
      expect(core.debug).toHaveBeenCalledWith(
        'Slack Channel URL: https://slack.com/channels/incident'
      )
      expect(core.debug).toHaveBeenCalledWith(
        'Google Drive Parent ID: drive-parent-123'
      )
      expect(core.debug).toHaveBeenCalledWith(
        'Google Drive URL: https://drive.google.com/folder/123'
      )
      expect(core.debug).toHaveBeenCalledWith(
        'Notify Emails: notify1@example.com'
      )
      expect(core.debug).toHaveBeenCalledWith('Api Key Length: 12') // Length of 'test-api-key'
      expect(core.debug).toHaveBeenCalledWith('User ID: user-123')
    })
  })
})
