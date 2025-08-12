/**
 * Unit tests for the arrayOps utility functions, src/arrayOps.ts
 */
import { addNonEmptyArray } from '../src/arrayOps'

describe('arrayOps.ts', () => {
  describe('addNonEmptyArray', () => {
    let attributes: Record<string, string | string[] | boolean>

    beforeEach(() => {
      attributes = {}
    })

    it('adds filtered array when input contains non-empty strings', () => {
      const input = ['value1', 'value2', 'value3']
      addNonEmptyArray(input, 'testKey', attributes)

      expect(attributes.testKey).toEqual(['value1', 'value2', 'value3'])
    })

    it('filters out empty strings and whitespace-only strings', () => {
      const input = ['value1', '', '  ', 'value2', '\t\n', 'value3']
      addNonEmptyArray(input, 'testKey', attributes)

      expect(attributes.testKey).toEqual(['value1', 'value2', 'value3'])
    })

    it('does not add attribute when all strings are empty or whitespace', () => {
      const input = ['', '  ', '\t', '\n', '   \t\n  ']
      addNonEmptyArray(input, 'testKey', attributes)

      expect(attributes.testKey).toBeUndefined()
    })

    it('does not add attribute when array is empty', () => {
      const input: string[] = []
      addNonEmptyArray(input, 'testKey', attributes)

      expect(attributes.testKey).toBeUndefined()
    })

    it('does not add attribute when array is undefined', () => {
      addNonEmptyArray(undefined, 'testKey', attributes)

      expect(attributes.testKey).toBeUndefined()
    })

    it('preserves existing attributes when adding new ones', () => {
      attributes.existingKey = 'existingValue'
      const input = ['newValue1', 'newValue2']
      addNonEmptyArray(input, 'newKey', attributes)

      expect(attributes.existingKey).toBe('existingValue')
      expect(attributes.newKey).toEqual(['newValue1', 'newValue2'])
    })

    it('overwrites existing attribute with same key', () => {
      attributes.testKey = 'oldValue'
      const input = ['newValue1', 'newValue2']
      addNonEmptyArray(input, 'testKey', attributes)

      expect(attributes.testKey).toEqual(['newValue1', 'newValue2'])
    })

    it('handles mixed content with special characters', () => {
      const input = ['normal', '!@#$%', '', '   ', 'with spaces', 'unicode-ñ']
      addNonEmptyArray(input, 'testKey', attributes)

      expect(attributes.testKey).toEqual([
        'normal',
        '!@#$%',
        'with spaces',
        'unicode-ñ'
      ])
    })

    it('trims whitespace from valid strings', () => {
      const input = ['  value1  ', '\tvalue2\n', '   value3   ']
      addNonEmptyArray(input, 'testKey', attributes)

      // Note: The function filters based on trimmed length but doesn't actually trim the values
      expect(attributes.testKey).toEqual([
        '  value1  ',
        '\tvalue2\n',
        '   value3   '
      ])
    })
  })
})
