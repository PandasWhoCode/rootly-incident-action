import { Label } from './label'

/**
 * Safely adds an array to attributes if it contains non-empty strings or valid Label objects.
 * @param arr - The array to filter and add
 * @param attributeKey - The key to add to attributes
 * @param attributes - The attributes object to modify
 */
export function addNonEmptyArray(
  arr: string[] | Label[] | undefined,
  attributeKey: string,
  attributes: Record<string, string | string[] | boolean | Label[]>
): void {
  if (arr !== undefined && arr.length > 0) {
    if (attributeKey === 'labels') {
      // Handle Label[] objects - filter out labels with empty keys or values
      const labelArray = arr as Label[]
      const filtered = labelArray.filter(
        (label) => label.key.trim().length > 0 && label.value.trim().length > 0
      )
      if (filtered.length > 0) {
        attributes[attributeKey] = filtered
      }
    } else {
      // Handle string[] arrays
      const stringArray = arr as string[]
      const filtered = stringArray.filter((str) => str.trim().length > 0)
      if (filtered.length > 0) {
        attributes[attributeKey] = filtered
      }
    }
  }
}
