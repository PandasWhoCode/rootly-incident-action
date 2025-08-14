import { ApiResponse } from './apiResponse.js'

/**
 * Retrieve the environment ID using the Rootly REST API.
 *
 * @param {string} alertUrgency - The name of the alert urgency.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the environment.
 */
export async function getAlertUrgencyId(
  alertUrgency: string,
  apiKey: string
): Promise<string> {
  const apiAlertUrgencyName = encodeURIComponent(alertUrgency)
  const url =
    'https://api.rootly.com/v1/alert_urgencies?filter%5Bname%5D=' +
    apiAlertUrgencyName
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
    return data.data[0].id
  } catch (error) {
    console.error(error)
    return ''
  }
}
