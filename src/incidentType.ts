import { ApiResponse } from './apiResponse.js'

/**
 * Retrieve an incident type using the Rootly REST API.
 *
 * @param {string} incidentType - The name of the incident type.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the incident type.
 */
export async function getIncidentTypeId(
  incidentType: string,
  apiKey: string
): Promise<string> {
  const apiIncidentTypeName = incidentType.replace(' ', '%20')
  const url =
    'https://api.rootly.com/v1/incident_types?filter%5Bname%5D=' +
    apiIncidentTypeName
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
