import { ApiResponse } from './apiResponse.js'

/**
 * Retrieve the environment ID using the Rootly REST API.
 *
 * @param {string} environment - The name of the environment.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the environment.
 */
export async function getEnvironmentId(
  environment: string,
  apiKey: string
): Promise<string> {
  const apiEnvironmentName = encodeURIComponent(environment)
  const url =
    'https://api.rootly.com/v1/environments?filter%5Bname%5D=' +
    apiEnvironmentName
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
