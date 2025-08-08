import * as core from '@actions/core'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const service: string = core.getInput('service')
    const group: string = core.getInput('group')
    const environment: string = core.getInput('environment')
    const severity: string = core.getInput('severity')
    const title: string = core.getInput('title')
    const createAlert: boolean = core.getInput('create-alert') == 'true'

    // The API key is secret and shall not be logged in any way.
    // The API key shall be used during requests but never logged or stored.
    const apiKey: string = core.getInput('api-key')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Title: ${title}`)
    core.debug(`Severity: ${severity}`)
    core.debug(`Service: ${service}`)
    core.debug(`Group: ${group}`)
    core.debug(`Environment: ${environment}`)
    core.debug(`Create Alert: ${createAlert}`)
    core.debug(`API Key Length: ${apiKey.length}`)

    // Do things
    alertId = createAlert ? 'fake-alert-id' : ''

    // Set outputs for other workflow steps to use
    core.setOutput('incident-id', 'fake-incident-id')
    core.setOutput('alert-id', alertId)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
