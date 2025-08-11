import { ApiResponse } from './apiResponse.js'

/**
 * Create an incident using the Rootly REST API.
 *
 * @param {string} apiKey - The API key to use for authentication.
 * @param {string} title - The title of the incident.
 * @param {string} summary - The description of the incident.
 * @param {string} severityId - The ID of the severity of the incident.
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
  alertId?: string,
  serviceIds?: string[],
  groupIds?: string[],
  environmentIds?: string[],
  incidentTypeIds?: string[]
): Promise<string> {
  // Quick helper for nullish coalescing
  const safeArray = <T>(arr?: T[]) => arr ?? []

  const url = 'https://api.rootly.com/v1/incidents'
  const incidentBody = JSON.stringify({
    data: {
      attributes: {
        private: false,
        title: title,
        summary: summary,
        severity_id: severityId,
        alert_ids: [alertId ?? ''],
        environment_ids: safeArray(environmentIds),
        incident_type_ids: safeArray(incidentTypeIds),
        service_ids: safeArray(serviceIds),
        group_ids: safeArray(groupIds)
      },
      type: 'incidents'
    }
  })
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/vnd.api+json'
    },
    body: incidentBody
  }

  try {
    const response = await fetch(url, options)
    const data = (await response.json()) as ApiResponse
    return data.data.id
  } catch (error) {
    console.error(error)
    return ''
  }
}
