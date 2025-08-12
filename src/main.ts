import * as core from '@actions/core'
import { createAlert } from './alert.js'
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
    const services: string[] = core.getInput('services').split(',')
    const teams: string[] = core.getInput('teams').split(',')
    const groups: string[] = core.getInput('alert_groups').split(',')
    const environments: string[] = core.getInput('environments').split(',')
    const incidentTypes: string[] = core.getInput('incident_types').split(',')
    const createAlertFlag: boolean = core.getInput('create_alert') == 'true'

    // The API key is secret and shall not be logged in any way.
    // The API key shall be used during requests but never logged or stored.
    const apiKey: string = core.getInput('api_key')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Title: ${title}`)
    core.debug(`Details: ${details}`)
    core.debug(`Severity: ${severity}`)
    core.debug(`Service: ${services}`)
    core.debug(`Team: ${teams}`)
    core.debug(`Alert Group: ${groups}`)
    core.debug(`Environment: ${environments}`)
    core.debug(`IncidentType: ${incidentTypes}`)
    core.debug(`Create Alert: ${createAlertFlag}`)
    core.debug(`Api Key Length: ${apiKey.length}`) // Do not log the actual API key

    // Set up service IDs
    const serviceIds: string[] = []
    for (const service of services) {
      if (service !== '') {
        const serviceId = await getServiceId(service, apiKey)
        serviceIds.push(serviceId)
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
    for (const team of teams) {
      if (team !== '') {
        const teamId = await getTeamId(team, apiKey)
        teamIds.push(teamId)
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
    for (const incidentType of incidentTypes) {
      if (incidentType !== '') {
        const incidentTypeId = await getIncidentTypeId(incidentType, apiKey)
        incidentTypeIds.push(incidentTypeId)
      }
    }

    // Set up severity ID
    const severityId = await getSeverityId(severity, apiKey)

    // Create the alert
    let alertId = ''
    if (createAlertFlag) {
      alertId = await createAlert(
        apiKey,
        title, // Using title as summary for the alert
        details, // Using details as description for the alert
        serviceIds, // Service IDs
        groupIds, // Alert Group IDs
        environmentIds // Environment IDs
      )
    }

    // Create the incident
    const incidentId = await createIncident(
      apiKey,
      title,
      details,
      severityId,
      alertId,
      serviceIds,
      teamIds,
      environmentIds,
      incidentTypeIds
    )

    // Set outputs for other workflow steps to use
    core.setOutput('incident-id', incidentId)
    core.setOutput('alert-id', alertId)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
