import * as core from '@actions/core'
import { ApiPostResponse } from './apiResponse.js'
import { addNonEmptyArray } from './arrayOps.js'
import type { Label } from './label.js'

/**
 * Create an incident using the Rootly REST API.
 *
 * @param {string} apiKey - The API key to use for authentication. (required)
 * @param {string} title - The title of the incident. (required)
 * @param {boolean} createAsPublic - Whether to create the incident as public or private. (default is false, meaning private)
 * @param {string} url - The URL for rootly incidents (optional)
 * @param {string} kind - The kind of the incident. (optional)
 * @param {string} parentId - The ID of the parent incident. (If creating a child incident.) (optional)
 * @param {string} duplicateId - The ID of the incident to mark as duplicate. (If marking as duplicate.) (optional)
 * @param {string} summary - The description of the incident. (optional)
 * @param {string} userId - The ID of the user attached to the incident. (optional)
 * @param {string} severityId - The ID of the severity of the incident. (optional)
 * @param {string[]} alertIds - The ID of the created alert. (If an alert was created.) (optional)
 * @param {string[]} environmentIds - The IDs of the environments to create the incident for. (optional)
 * @param {string[]} incidentTypeIds - The IDs of the incident types to create the incident for. (optional)
 * @param {string[]} serviceIds - The IDs of the services to create the incident for. (optional)
 * @param {string[]} functionalityIds - The IDs of the functionalities to create the incident for. (optional)
 * @param {string[]} groupIds - The IDs of the groups to create the incident for. (optional)
 * @param {string[]} causeIds - The IDs of the causes to create the incident with. (optional)
 * @param {Label[]} labels - The labels to create the incident with. (optional)
 * @param {string} slackChannelName - The Slack channel name to post the incident to. (If posting to Slack.) (optional)
 * @param {string} slackChannelId - The Slack channel ID to post the incident to. (If posting to Slack.) (optional)
 * @param {string} slackChannelUrl - The Slack channel URL to post the incident to. (If posting to Slack.) (optional)
 * @param {string} googleDriveParentId - The Google Drive parent ID to create the incident with. (If creating a Google Drive folder.) (optional)
 * @param {string} googleDriveUrl - The Google Drive URL to create the incident with. (If creating a Google Drive folder.) (optional)
 * @param {string[]} notifyEmails - The email addresses to notify about the incident. (optional)
 * @returns {string} The ID of the incident.
 *
 */
export async function createIncident(
  apiKey: string,
  title: string,
  createAsPublic: boolean,
  url?: string,
  kind?: string,
  parentId?: string,
  duplicateId?: string,
  summary?: string,
  userId?: string,
  severityId?: string,
  alertIds?: string[],
  environmentIds?: string[],
  incidentTypeIds?: string[],
  serviceIds?: string[],
  functionalityIds?: string[],
  groupIds?: string[],
  causeIds?: string[],
  labels?: Label[],
  slackChannelName?: string,
  slackChannelId?: string,
  slackChannelUrl?: string,
  googleDriveParentId?: string,
  googleDriveUrl?: string,
  notifyEmails?: string[]
): Promise<string> {
  // Determine if the incident should be private or public
  let setPrivate: boolean = true
  if (createAsPublic) {
    setPrivate = false
  }

  // Build the rootly request
  const apiUrl = 'https://api.rootly.com/v1/incidents'

  const attributes: Record<string, string | string[] | boolean> = {
    private: setPrivate,
    public_title: title,
    title: title,
    status: 'started'
  }

  if (kind && kind !== '') {
    attributes['kind'] = kind
  }
  if (url && url !== '') {
    attributes['url'] = url
  }
  if (parentId && parentId !== '') {
    attributes['parent_id'] = parentId
  }
  if (duplicateId && duplicateId !== '') {
    attributes['duplicate_id'] = duplicateId
  }
  if (summary && summary !== '') {
    attributes['summary'] = summary
  }
  if (userId && userId !== '') {
    attributes['user_id'] = userId
  }
  if (severityId && severityId !== '') {
    attributes['severity_id'] = severityId
  }

  // Safely add non-empty arrays to attributes
  addNonEmptyArray(environmentIds, 'environment_ids', attributes)
  addNonEmptyArray(incidentTypeIds, 'incident_type_ids', attributes)
  addNonEmptyArray(serviceIds, 'service_ids', attributes)
  addNonEmptyArray(groupIds, 'group_ids', attributes)
  addNonEmptyArray(alertIds, 'alert_ids', attributes)
  addNonEmptyArray(functionalityIds, 'functionality_ids', attributes)
  addNonEmptyArray(causeIds, 'cause_ids', attributes)
  addNonEmptyArray(labels, 'labels', attributes)
  addNonEmptyArray(notifyEmails, 'notify_emails', attributes)

  if (slackChannelName && slackChannelName !== '') {
    attributes['slack_channel_name'] = slackChannelName
  }
  if (slackChannelId && slackChannelId !== '') {
    attributes['slack_channel_id'] = slackChannelId
  }
  if (slackChannelUrl && slackChannelUrl !== '') {
    attributes['slack_channel_url'] = slackChannelUrl
  }
  if (googleDriveParentId && googleDriveParentId !== '') {
    attributes['google_drive_parent_id'] = googleDriveParentId
  }
  if (googleDriveUrl && googleDriveUrl !== '') {
    attributes['google_drive_url'] = googleDriveUrl
  }

  const incidentBody = JSON.stringify({
    data: {
      type: 'incidents',
      attributes
    }
  })

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/vnd.api+json'
    },
    body: incidentBody
  }

  try {
    const response = await fetch(apiUrl, options)
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      )
    }
    const data = (await response.json()) as ApiPostResponse
    return data.data.id
  } catch (error) {
    const errorMessage = `Failed to create incident: ${error instanceof Error ? error.message : String(error)}`
    core.error(errorMessage)
    core.debug(`Incident Body:\n${incidentBody}`)
    throw error
  }
}
