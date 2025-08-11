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
  const apiGroupName = group.replace(' ', '%20')
  const url = 'https://api.rootly.com/v1/teams?filter%5Bname%5D=' + apiGroupName
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
