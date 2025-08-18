import { ApiPostResponse } from './apiResponse.js'
import { addNonEmptyArray } from './arrayOps.js'

/**
 * Create an alert using the Rootly REST API.
 *
 * @param {string} apiKey - The API key to use for authentication.
 * @param {string} summary - The summary of the alert.
 * @param {string} details - The details of the alert.
 * @param {string} alertServiceId - The ID of the service for the alert to target.
 * @param {string} externalId - The external ID of the alert (optional).
 * @param {string} externalUrl - The external URL of the alert (optional).
 * @param {'Low' | 'Medium' | 'High'} alertUrgency - The urgency of the alert (default is 'high').
 * @param {string[]} serviceIds - The IDs of the services to create the alert for.
 * @param {string[]} groupIds - The IDs of the groups to create the alert for.
 * @param {string[]} environmentIds - The IDs of the environments to create the alert for.
 * @returns {string} The ID of the alert.
 *
 */
export async function createAlert(
  apiKey: string, // apiKey is required, this is the bearer token for authentication
  summary: string, // summary is required, this is a brief summary of the alert
  details: string, // details is required, this is a detailed description of the alert
  alertServiceId: string, // alertServiceId is required, this is the service ID for the alert to target
  alertUrgency: string, // alertUrgency is required, this is the urgency of the alert, default is 'high'
  externalId?: string, // externalId is optional, this is the external ID field for the alert
  externalUrl?: string, // externalUrl is optional, this is the external URL field for the alert
  serviceIds?: string[], // serviceIds is optional, this is an array of service IDs associated with the alert
  groupIds?: string[], // groupIds is optional, this is an array of Alert Group IDs associated with the alert
  environmentIds?: string[] // environmentIds is optional, this is an array of environment IDs associated with the alert
): Promise<string> {
  const url = 'https://api.rootly.com/v1/alerts'
  const attributes: Record<string, string | string[] | boolean> = {
    summary: summary,
    source: 'api',
    noise: 'noise',
    status: 'triggered',
    description: details,
    notification_target_type: 'Service',
    notification_target_id: alertServiceId,
    alert_urgency_id: alertUrgency
  }

  addNonEmptyArray(serviceIds, 'service_ids', attributes)
  addNonEmptyArray(groupIds, 'group_ids', attributes)
  addNonEmptyArray(environmentIds, 'environment_ids', attributes)

  // Only add externalId and externalUrl if they are provided and not empty
  if (externalId && externalId !== '') {
    attributes['external_id'] = externalId
  }
  if (externalUrl && externalUrl !== '') {
    attributes['external_url'] = externalUrl
  }

  const alertBody = JSON.stringify({
    data: {
      type: 'alerts',
      attributes
    }
  })

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/vnd.api+json'
    },
    body: alertBody
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
    console.error(error)
    console.log(`Alert Body:\n${alertBody}`)
    return ''
  }
}
