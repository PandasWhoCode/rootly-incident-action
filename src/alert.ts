/**
 * Create an alert using the Rootly REST API.
 *
 * @param {string} summary - The summary of the alert.
 * @param {string[]} serviceIds - The IDs of the services to create the alert for.
 * @param {string[]} groupIds - The IDs of the groups to create the alert for.
 * @param {string[]} environmentIds - The IDs of the environments to create the alert for.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the alert.
 *
 */
export async function createAlert(
  summary: string,
  serviceIds: string[],
  groupIds: string[],
  environmentIds: string[],
  apiKey: string
): Promise<string> {
  // Quick helper for nullish coalescing
  const safeArray = <T>(arr?: T[]) => arr ?? []

  const url = 'https://api.rootly.com/v1/alerts'
  const alertBody = JSON.stringify({
    data: {
      type: 'alerts',
      attributes: {
        summary: summary,
        noise: 'noise',
        status: 'triggered',
        description: summary,
        service_ids: safeArray(serviceIds),
        group_ids: safeArray(groupIds),
        environment_ids: safeArray(environmentIds)
      }
    }
  })
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer' + apiKey,
      'Content-Type': 'application/vnd.api+json'
    },
    body: alertBody
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return data.data[0].id
  } catch (error) {
    console.error(error)
    return ''
  }
}
