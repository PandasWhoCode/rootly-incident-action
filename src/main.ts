import * as core from '@actions/core'
import { createAlert } from './alert.js'
import { getAlertUrgencyId } from './alertUrgency.js'
import { createIncident } from './incident.js'
import { getServiceId } from './service.js'
import { getGroupId } from './group.js'
import { getTeamId } from './team.js'
import { getEnvironmentId } from './environment.js'
import { getSeverityId } from './severity.js'
import { getIncidentTypeId } from './incidentType.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const severity: string = core.getInput('severity')
    const title: string = core.getInput('title')
    const details: string = core.getInput('summary')
    const alertSvc: string = core.getInput('alert_service')
    const alertUrgency: string = core.getInput('alert_urgency')
    const alertExtId: string = core.getInput('alert_external_id')
    const alertExtUrl: string = core.getInput('alert_external_url')
    const services: string[] = core.getInput('services').split(',')
    const teams: string[] = core.getInput('teams').split(',')
    const groups: string[] = core.getInput('alert_groups').split(',')
    const environments: string[] = core.getInput('environments').split(',')
    const incidentTypes: string[] = core.getInput('incident_types').split(',')
    const createAlertFlag: boolean = core.getInput('create_alert') == 'true'
    const createIncidentFlag: boolean =
      core.getInput('create_incident_flag') == 'true'
    const createAsPublicFlag: boolean =
      core.getInput('create_public_incident') == 'true'

    // The API key is secret and shall not be logged in any way.
    // The API key shall be used during requests but never logged or stored.
    const apiKey: string = core.getInput('api_key')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Title: ${title}`)
    core.debug(`Details: ${details}`)
    core.debug(`Severity: ${severity}`)
    core.debug(`Service: ${services}`)
    core.debug(`Create Alert: ${createAlertFlag}`)
    core.debug(`Create Incident: ${createIncidentFlag}`)
    core.debug(`Alert Service: ${alertSvc}`)
    core.debug(`Alert Urgency: ${alertUrgency}`)
    core.debug(`Alert External ID: ${alertExtId}`)
    core.debug(`Alert External URL: ${alertExtUrl}`)
    core.debug(`Alert Group: ${groups}`)
    core.debug(`Team: ${teams}`)
    core.debug(`Environment: ${environments}`)
    core.debug(`IncidentType: ${incidentTypes}`)
    core.debug(`Create as Public Incident: ${createAsPublicFlag}`)
    core.debug(`Api Key Length: ${apiKey.length}`) // Do not log the actual API key

    // Ensure either createAlertFlag or createIncidentFlag is true
    if (!createAlertFlag && !createIncidentFlag) {
      throw new Error(
        'At least one of create_alert or create_incident_flag must be true.'
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

    // Grab the alert service ID
    let alertSvcId: string = ''
    if (createAlertFlag && alertSvc !== '') {
      alertSvcId = await getServiceId(alertSvc, apiKey)
    }

    // Grab the alert urgency ID
    let alertUrgencyId: string = ''
    if (createAlertFlag) {
      if (alertUrgency !== '') {
        alertUrgencyId = await getAlertUrgencyId(alertUrgency, apiKey)
      } else {
        // Default to 'high' if not provided
        alertUrgencyId = await getAlertUrgencyId('High', apiKey)
      }
    }

    // Set up group IDs (used for alert groups)
    // check if groups are provided, if not, use an empty array
    const groupIds: string[] = []
    for (const group of groups) {
      if (group !== '') {
        const groupId = await getGroupId(group, apiKey)
        groupIds.push(groupId)
      }
    }

    // Set up team IDs (teams are the incident groups)
    const teamIds: string[] = []
    if (createIncidentFlag) {
      for (const team of teams) {
        if (team !== '') {
          const teamId = await getTeamId(team, apiKey)
          teamIds.push(teamId)
        }
      }
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
    if (createIncidentFlag) {
      for (const incidentType of incidentTypes) {
        if (incidentType !== '') {
          const incidentTypeId = await getIncidentTypeId(incidentType, apiKey)
          incidentTypeIds.push(incidentTypeId)
        }
      }
    }

    // Set up severity ID
    let severityId = ''
    if (createIncidentFlag) {
      severityId = await getSeverityId(severity, apiKey)
    }

    // Create the alert
    let alertId = ''
    if (createAlertFlag) {
      alertId = await createAlert(
        apiKey,
        title, // Using title as summary for the alert
        details, // Using details as description for the alert
        alertSvcId, // Alert Service ID
        alertUrgencyId, // Alert Urgency ID
        alertExtId, // External ID
        alertExtUrl, // External URL
        serviceIds, // Service IDs
        groupIds, // Alert Group IDs
        environmentIds // Environment IDs
      )
    }

    // Debug log the created alert ID
    core.debug(`Created Alert ID: ${alertId}`)

    // Create the incident
    let incidentId = ''
    if (createIncidentFlag) {
      incidentId = await createIncident(
        apiKey,
        title,
        details,
        severityId,
        createAsPublicFlag,
        alertId,
        serviceIds,
        teamIds,
        environmentIds,
        incidentTypeIds
      )
    }

    // Set outputs for other workflow steps to use
    core.setOutput('incident-id', incidentId)
    core.setOutput('alert-id', alertId)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
