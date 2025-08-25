import { jest } from '@jest/globals'
import { Label } from '../src/label.js'

describe('arrayOps.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('addNonEmptyArray', () => {
    it('Adds valid string array to attributes', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const stringArray = ['service1', 'service2', 'service3']

      addNonEmptyArray(stringArray, 'service_ids', attributes)

      expect(attributes.service_ids).toEqual([
        'service1',
        'service2',
        'service3'
      ])
    })

    it('Filters out empty strings from string array', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const stringArray = ['service1', '', '   ', 'service2']

      addNonEmptyArray(stringArray, 'service_ids', attributes)

      expect(attributes.service_ids).toEqual(['service1', 'service2'])
    })

    it('Does not add attribute when all strings are empty', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const stringArray = ['', '   ', '']

      addNonEmptyArray(stringArray, 'service_ids', attributes)

      expect(attributes.service_ids).toBeUndefined()
    })

    it('Adds valid label array to attributes', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const labelArray = [
        { key: 'env', value: 'production' },
        { key: 'team', value: 'backend' }
      ]

      addNonEmptyArray(labelArray, 'labels', attributes)

      expect(attributes.labels).toEqual([
        { key: 'env', value: 'production' },
        { key: 'team', value: 'backend' }
      ])
    })

    it('Filters out labels with empty keys or values', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const labelArray = [
        { key: 'env', value: 'production' },
        { key: '', value: 'backend' },
        { key: 'team', value: '' },
        { key: '   ', value: '   ' },
        { key: 'priority', value: 'high' }
      ]

      addNonEmptyArray(labelArray, 'labels', attributes)

      expect(attributes.labels).toEqual([
        { key: 'env', value: 'production' },
        { key: 'priority', value: 'high' }
      ])
    })

    it('Does not add attribute when all labels have empty keys or values', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const labelArray = [
        { key: '', value: 'production' },
        { key: 'team', value: '' },
        { key: '   ', value: '   ' }
      ]

      addNonEmptyArray(labelArray, 'labels', attributes)

      expect(attributes.labels).toBeUndefined()
    })

    it('Does not add attribute when array is undefined', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}

      addNonEmptyArray(undefined, 'service_ids', attributes)

      expect(attributes.service_ids).toBeUndefined()
    })

    it('Does not add attribute when array is empty', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}

      addNonEmptyArray([], 'service_ids', attributes)

      expect(attributes.service_ids).toBeUndefined()
    })

    it('Handles mixed whitespace in string arrays', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const stringArray = [' service1 ', '\t\t', '\n', ' service2\n']

      addNonEmptyArray(stringArray, 'environment_ids', attributes)

      expect(attributes.environment_ids).toEqual([' service1 ', ' service2\n'])
    })

    it('Handles mixed whitespace in label arrays', async () => {
      const { addNonEmptyArray } = await import('../src/arrayOps.js')
      const attributes: Record<string, string | string[] | boolean | Label[]> =
        {}
      const labelArray = [
        { key: ' env ', value: ' production ' },
        { key: '\t', value: '\n' },
        { key: ' team\n', value: ' backend\t' }
      ]

      addNonEmptyArray(labelArray, 'labels', attributes)

      expect(attributes.labels).toEqual([
        { key: ' env ', value: ' production ' },
        { key: ' team\n', value: ' backend\t' }
      ])
    })
  })
})
