export type Label = { key: string; value: string }

// Expect labels to be passed in as
// key1:value1,key2:value2,key3:value3,etc.
export function createLabelsFromString(labelString: string): Label[] {
  const labels: Label[] = []
  if (!labelString.trim()) {
    return labels
  }

  const labelPairs = labelString.split(',')
  for (const labelPair of labelPairs) {
    const [key, value] = labelPair.split(':')
    labels.push({
      key: key ? key.trim() : '',
      value: value ? value.trim() : ''
    })
  }
  return labels
}
