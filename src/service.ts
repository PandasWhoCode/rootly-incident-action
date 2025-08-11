import { ApiResponse } from './apiResponse.js'

/**
 * Get the service ID using the Rootly REST API.
 *
 * @param {string} service - The name of the service.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the service.
 */
export async function getServiceId(
  service: string,
  apiKey: string
): Promise<string> {
  const apiServiceName = service.replace(' ', '%20')
  const url =
    'https://api.rootly.com/v1/services?filter%5Bname%5D=' + apiServiceName
  const options = {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + apiKey },
    body: undefined
  }

  try {
    const response = await fetch(url, options)
    const data = (await response.json()) as ApiResponse
    return data?.data?.id || 'FAILED'
  } catch (error) {
    console.error(error)
    return ''
  }
}
