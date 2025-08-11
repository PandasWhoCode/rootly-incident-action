import { ApiResponse } from './apiResponse.js'

/**
 * Get the group ID using the Rootly REST API.
 *
 * @param {string} group - The name of the group.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the group.
 */
export async function getGroupId(
  group: string,
  apiKey: string
): Promise<string> {
  const apiGroupName = encodeURIComponent(group)
  const url = 'https://api.rootly.com/v1/teams?filter%5Bname%5D=' + apiGroupName
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
