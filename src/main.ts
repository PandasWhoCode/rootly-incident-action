import * as core from '@actions/core'
import { createIncident } from './incident.js'
import { getServiceId } from './service.js'
import { getTeamId } from './team.js'
import { getEnvironmentId } from './environment.js'
import { getSeverityId } from './severity.js'
import { getIncidentTypeId } from './incidentType.js'
import { createLabelsFromString } from './label.js'
import { getUserId } from './user.js'
import { getCauseId } from './cause.js'
import { getFunctionalityId } from './functionality.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // The API key is secret and shall not be logged in any way.
    // The API key shall be used during requests but never logged or stored.
    const apiKey: string = core.getInput('api_key')

    // other inputs
    const alertIds: string[] = core.getInput('alert_ids').split(',')
    const causes: string[] = core.getInput('causes').split(',')
    const createAsPublicFlag: boolean =
      core.getInput('create_public_incident') == 'true'
    const duplicateIncidentId: string = core.getInput('duplicate_incident_id')
    const environments: string[] = core.getInput('environments').split(',')
    const functionalities: string[] = core
      .getInput('functionalities')
      .split(',')
    const googleDriveParentId: string = core.getInput('google_drive_parent_id')
    const googleDriveUrl: string = core.getInput('google_drive_url')
    const incidentTypes: string[] = core.getInput('incident_types').split(',')
    const kind: string = core.getInput('kind')
    const labels = createLabelsFromString(core.getInput('labels'))
    const notifyEmails: string[] = core.getInput('notify_emails').split(',')
    const parentIncidentId: string = core.getInput('parent_incident_id')
    const services: string[] = core.getInput('services').split(',')
    const severity: string = core.getInput('severity')
    const slackChannelId: string = core.getInput('slack_channel_id')
    const slackChannelName: string = core.getInput('slack_channel_name')
    const slackChannelUrl: string = core.getInput('slack_channel_url')
    const summary: string = core.getInput('summary')
    const teams: string[] = core.getInput('groups').split(',')
    const title: string = core.getInput('title')
    const url: string = core.getInput('url')
    const userEmail: string = core.getInput('user_email')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Title: ${title}`)
    core.debug(`Kind: ${kind}`)
    core.debug(`Parent Incident ID: ${parentIncidentId}`)
    core.debug(`Duplicate Incident ID: ${duplicateIncidentId}`)
    core.debug(`Create as Public Incident: ${createAsPublicFlag}`)
    core.debug(`Summary: ${summary}`)
    core.debug(`User Email: ${userEmail}`)
    core.debug(`Alert IDs: ${alertIds}`)
    core.debug(`Environments: ${environments}`)
    core.debug(`Incident Types: ${incidentTypes}`)
    core.debug(`Services: ${services}`)
    core.debug(`Functionalities: ${functionalities}`)
    core.debug(`Teams: ${teams}`)
    core.debug(`Causes: ${causes}`)
    core.debug(`Labels: ${labels}`)
    core.debug(`URL: ${url}`)
    core.debug(`Slack Channel Name: ${slackChannelName}`)
    core.debug(`Slack Channel ID: ${slackChannelId}`)
    core.debug(`Slack Channel URL: ${slackChannelUrl}`)
    core.debug(`Google Drive Parent ID: ${googleDriveParentId}`)
    core.debug(`Google Drive URL: ${googleDriveUrl}`)
    core.debug(`Notify Emails: ${notifyEmails}`)
    core.debug(`Api Key Length: ${apiKey.length}`) // Do not log the actual API key

    // verify kind is valid
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

    if (kind !== '' && !validKinds.includes(kind)) {
      throw new Error(
        `Invalid kind '${kind}'. Valid kinds are: ${validKinds.join(', ')}`
      )
    }

    // Set up service IDs
    const serviceIds: string[] = []
    for (const service of services) {
      if (service !== '') {
        const serviceId = await getServiceId(service, apiKey)
        serviceIds.push(serviceId)
      }
    }

    // Set up team IDs (teams are the incident groups)
    const teamIds: string[] = []
    for (const team of teams) {
      if (team !== '') {
        const teamId = await getTeamId(team, apiKey)
        teamIds.push(teamId)
      }
    }

    // Set up user ids
    let userId: string = ''
    if (userEmail !== '') {
      userId = await getUserId(userEmail, apiKey)
      core.debug(`User ID: ${userId}`)
    }

    // Set up environment IDs
    const environmentIds: string[] = []
    for (const environment of environments) {
      if (environment !== '') {
        const environmentId = await getEnvironmentId(environment, apiKey)
        environmentIds.push(environmentId)
      }
    }

    // Set up incident type IDs
    const incidentTypeIds: string[] = []
    for (const incidentType of incidentTypes) {
      if (incidentType !== '') {
        const incidentTypeId = await getIncidentTypeId(incidentType, apiKey)
        incidentTypeIds.push(incidentTypeId)
      }
    }

    // set up cause IDs
    const causeIds: string[] = []
    for (const cause of causes) {
      if (cause !== '') {
        const causeId = await getCauseId(cause, apiKey)
        causeIds.push(causeId)
      }
    }

    // set up the functionality IDs
    const functionalityIds: string[] = []
    for (const functionality of functionalities) {
      if (functionality !== '') {
        const functionalityId = await getFunctionalityId(functionality, apiKey)
        functionalityIds.push(functionalityId)
      }
    }

    // Set up severity ID
    const severityId = await getSeverityId(severity, apiKey)

    // Create the incident
    const incidentId = await createIncident(
      apiKey,
      title,
      url,
      createAsPublicFlag,
      kind,
      parentIncidentId,
      duplicateIncidentId,
      summary,
      userId,
      severityId,
      alertIds,
      environmentIds,
      incidentTypeIds,
      serviceIds,
      functionalityIds,
      teamIds,
      causeIds,
      labels,
      slackChannelName,
      slackChannelId,
      slackChannelUrl,
      googleDriveParentId,
      googleDriveUrl,
      notifyEmails
    )

    // Set outputs for other workflow steps to use
    core.setOutput('incident-id', incidentId)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
