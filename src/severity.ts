import { ApiResponse } from './apiResponse.js'

/**
 * Get the service ID using the Rootly REST API.
 *
 * @param {string} severity - The name of the severity.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the severity.
 */
export async function getSeverityId(
  severity: string,
  apiKey: string
): Promise<string> {
  const apiSeverityName = severity.replace(' ', '%20')
  const url =
    'https://api.rootly.com/v1/severities?filter%5Bname%5D=' + apiSeverityName
  const options = {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + apiKey },
    body: undefined
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
