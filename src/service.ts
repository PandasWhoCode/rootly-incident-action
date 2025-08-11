import { ApiResponse } from './apiResponse.js'
import * as core from '@actions/core'

/**
 * Get the service ID using the Rootly REST API.
 *
 * @param {string} service - The name of the service.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the service.
 */
export async function getServiceId(
  service: string,
  apiKey: string
): Promise<string> {
  const apiServiceName = encodeURIComponent(service)
  const url =
    'https://api.rootly.com/v1/services?filter%5Bname%5D=' + apiServiceName
  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` }
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      )
    }
    const data = (await response.json()) as ApiResponse

    if (!data.data || data.data.length === 0) {
      core.warning(`Service '${service}' not found`)
      return ''
    }

    return data.data[0].id
  } catch (error) {
    console.error(error)
    return ''
  }
}
