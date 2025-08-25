import { ApiResponse } from './apiResponse.js'

/**
 * Retrieve a functionality using the Rootly REST API.
 *
 * @param {string} functionality - The name of the functionality.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the functionality.
 */
export async function getFunctionalityId(
  functionality: string,
  apiKey: string
): Promise<string> {
  const apiFunctionalityName = encodeURIComponent(functionality)
  const url =
    'https://api.rootly.com/v1/functionalities?include=' + apiFunctionalityName
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
