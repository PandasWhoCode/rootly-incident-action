import * as core from '@actions/core'
import { ApiPostResponse } from './apiResponse.js'
import { addNonEmptyArray } from './arrayOps.js'

/**
 * Create an incident using the Rootly REST API.
 *
 * @param {string} apiKey - The API key to use for authentication.
 * @param {string} title - The title of the incident.
 * @param {string} summary - The description of the incident.
 * @param {string} severityId - The ID of the severity of the incident.
 * @param {boolean} createAsPublic - Whether to create the incident as public or private.
 * @param {string} alertId - The ID of the created alert. (If an alert was created.)
 * @param {string[]} serviceIds - The IDs of the services to create the incident for.
 * @param {string[]} groupIds - The IDs of the groups to create the incident for.
 * @param {string[]} environmentIds - The IDs of the environments to create the incident for.
 * @param {string[]} incidentTypeIds - The IDs of the incident types to create the incident for.
 * @returns {string} The ID of the incident.
 *
 */
export async function createIncident(
  apiKey: string,
  title: string,
  summary: string,
  severityId: string,
  createAsPublic: boolean,
  alertId?: string,
  serviceIds?: string[],
  groupIds?: string[],
  environmentIds?: string[],
  incidentTypeIds?: string[]
): Promise<string> {
  // Determine if the incident should be private or public
  let setPrivate: boolean = true
  if (createAsPublic) {
    setPrivate = false
  }

  // Build the rootly request
  const url = 'https://api.rootly.com/v1/incidents'

  const attributes: Record<string, string | string[] | boolean> = {
    private: setPrivate,
    public_title: title,
    title: title,
    summary: summary,
    status: 'started',
    kind: 'normal',
    severity_id: severityId
  }

  // Safely add non-empty arrays to attributes
  addNonEmptyArray(environmentIds, 'environment_ids', attributes)
  addNonEmptyArray(incidentTypeIds, 'incident_type_ids', attributes)
  addNonEmptyArray(serviceIds, 'service_ids', attributes)
  addNonEmptyArray(groupIds, 'group_ids', attributes)

  if (alertId && alertId.trim() !== '') {
    attributes.alert_ids = [alertId]
  }

  const incidentBody = JSON.stringify({
    data: {
      type: 'incidents',
      attributes
    }
  })

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/vnd.api+json'
    },
    body: incidentBody
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      )
    }
    const data = (await response.json()) as ApiPostResponse
    return data.data.id
  } catch (error) {
    const errorMessage = `Failed to create incident: ${error instanceof Error ? error.message : String(error)}`
    core.error(errorMessage)
    core.debug(`Incident Body:\n${incidentBody}`)
    throw error
  }
}
