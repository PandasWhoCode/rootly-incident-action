import { ApiResponse } from './apiResponse.js'

/**
 * Retrieve a cause using the Rootly REST API.
 *
 * @param {string} cause - The name of the cause.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the cause.
 */
export async function getCauseId(
  cause: string,
  apiKey: string
): Promise<string> {
  const apiCauseName = encodeURIComponent(cause)
  const url = 'https://api.rootly.com/v1/causes?include=' + apiCauseName
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
