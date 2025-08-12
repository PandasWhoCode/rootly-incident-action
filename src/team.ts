import { ApiResponse } from './apiResponse.js'

/**
 * Get the team ID using the Rootly REST API.
 *
 * @param {string} team - The name of the group.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the group.
 */
export async function getTeamId(team: string, apiKey: string): Promise<string> {
  const apiTeamName = encodeURIComponent(team)
  const url = 'https://api.rootly.com/v1/teams?filter%5Bname%5D=' + apiTeamName
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
