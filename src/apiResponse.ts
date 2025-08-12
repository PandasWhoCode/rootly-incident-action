/**
 * This file defines the structure of the API response.
 * It is used to type-check the response data when fetching from the Rootly API.
 */

export interface ApiResponse {
  data: {
    id: string
  }[]
}

export interface ApiPostResponse {
  data: { id: string }
}
