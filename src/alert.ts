import { ApiResponse } from './apiResponse.js'

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
  apiKey: string,
  summary: string,
  details: string,
  serviceIds?: string[],
  groupIds?: string[],
  environmentIds?: string[]
): Promise<string> {
  // Quick helper for nullish coalescing
  const safeArray = <T>(arr?: T[]) => arr ?? []

  const url = 'https://api.rootly.com/v1/alerts'
  const attributes: Record<string, string | string[] | boolean> = {
    summary: summary,
    source: 'api',
    noise: 'noise',
    status: 'triggered',
    description: details
  }

  if (serviceIds !== undefined && serviceIds.length > 0) {
    attributes.service_ids = safeArray(serviceIds)
  }

  if (groupIds !== undefined && groupIds.length > 0) {
    attributes.group_ids = safeArray(groupIds)
  }

  if (environmentIds !== undefined && environmentIds.length > 0) {
    attributes.environment_ids = safeArray(environmentIds)
  }

  const alertBody = JSON.stringify({
    data: {
      type: 'alerts',
      attributes
    }
  })

  // log the alert body for debugging
  console.log('Alert Body:', alertBody)

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

    const data = (await response.json()) as ApiResponse
    return data.data[0].id
  } catch (error) {
    console.error(error)
    return ''
  }
}
