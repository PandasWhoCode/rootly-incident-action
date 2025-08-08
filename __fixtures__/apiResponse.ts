// __fixtures__/apiResponse.ts
import type { ApiResponse } from '../src/apiResponse.js'

/**
 * This file contains a mock API response for testing purposes.
 */

export const validApiResponse: ApiResponse = { data: [{ id: '12345' }] }

export const emptyApiResponse: ApiResponse = { data: [] }
