import * as core from '@actions/core'
import { createAlert } from './alert.js'
import { createIncident } from './incident.js'
import { getServiceId } from './service.js'
import { getGroupId } from './group.js'
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
    const summary: string = core.getInput('summary')
    const services: string[] = core.getInput('services').split(',')
    const groups: string[] = core.getInput('groups').split(',')
    const environments: string[] = core.getInput('environments').split(',')
    const incidentTypes: string[] = core.getInput('incident-types').split(',')
    const createAlertFlag: boolean = core.getInput('create-alert') == 'true'

    // The API key is secret and shall not be logged in any way.
    // The API key shall be used during requests but never logged or stored.
    const apiKey: string = core.getInput('api-key')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Title: ${title}`)
    core.debug(`Summary: ${summary}`)
    core.debug(`Severity: ${severity}`)
    core.debug(`Service: ${services}`)
    core.debug(`Group: ${groups}`)
    core.debug(`Environment: ${environments}`)
    core.debug(`Create Alert: ${createAlertFlag}`)

    // Set up service IDs
    const serviceIds: string[] = []
    for (const service of services) {
      const serviceId = await getServiceId(service, apiKey)
      serviceIds.push(serviceId)
    }

    // Set up group IDs
    const groupIds: string[] = []
    for (const group of groups) {
      const groupId = await getGroupId(group, apiKey)
      groupIds.push(groupId)
    }

    // Set up environment IDs
    const environmentIds: string[] = []
    for (const environment of environments) {
      const environmentId = await getEnvironmentId(environment, apiKey)
      environmentIds.push(environmentId)
    }

    // Set up incident type IDs
    const incidentTypeIds: string[] = []
    for (const incidentType of incidentTypes) {
      const incidentTypeId = await getIncidentTypeId(incidentType, apiKey)
      incidentTypeIds.push(incidentTypeId)
    }

    // Set up severity ID
    const severityId = await getSeverityId(severity, apiKey)

    // Create the alert
    let alertId = ''
    if (createAlertFlag) {
      alertId = await createAlert(
        apiKey,
        summary,
        serviceIds,
        groupIds,
        environmentIds
      )
    }

    // Create the incident
    const incidentId = await createIncident(
      apiKey,
      title,
      summary,
      severityId,
      alertId,
      serviceIds,
      groupIds,
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
