import { jest } from '@jest/globals'

// Mock the global fetch function
export const fetch = jest.fn<typeof globalThis.fetch>()

// Set up the global fetch mock
global.fetch = fetch
