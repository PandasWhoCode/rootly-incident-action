import { ApiPostResponse } from './apiResponse.js'
import { addNonEmptyArray } from './arrayOps.js'

/**
 * Create an alert using the Rootly REST API.
 *
 * @param {string} apiKey - The API key to use for authentication.
 * @param {string} summary - The summary of the alert.
 * @param {string} details - The details of the alert.
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
    description: details
  }

  addNonEmptyArray(serviceIds, 'service_ids', attributes)
  addNonEmptyArray(groupIds, 'group_ids', attributes)
  addNonEmptyArray(environmentIds, 'environment_ids', attributes)

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
    return ''
  }
}
