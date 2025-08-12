/**
 * Safely adds an array to attributes if it contains non-empty strings.
 * @param arr - The array to filter and add
 * @param attributeKey - The key to add to attributes
 * @param attributes - The attributes object to modify
 */
export function addNonEmptyArray(
  arr: string[] | undefined,
  attributeKey: string,
  attributes: Record<string, string | string[] | boolean>
): void {
  if (arr !== undefined && arr.length > 0) {
    const filtered = arr.filter((str) => str.trim().length > 0)
    if (filtered.length > 0) {
      attributes[attributeKey] = filtered
    }
  }
}
