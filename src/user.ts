import { ApiResponse } from './apiResponse.js'
import * as core from '@actions/core'

/**
 * Get the Usery ID using the Rootly REST API.
 *
 * @param {string} email - The name of the escalation policy.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the user.
 */
export async function getUserId(
  email: string,
  apiKey: string
): Promise<string> {
  const apiUserEmail = encodeURIComponent(email)
  const url =
    'https://api.rootly.com/v1/users?filter%5Bemail%5D=' + apiUserEmail
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
      core.warning(`User '${email}' not found`)
      return ''
    }

    return data.data[0].id
  } catch (error) {
    console.error(error)
    return ''
  }
}
