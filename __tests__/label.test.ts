import { jest } from '@jest/globals'

describe('label.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Creates labels from valid string with multiple key:value pairs', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString(
      'env:production,team:backend,priority:high'
    )

    expect(result).toEqual([
      { key: 'env', value: 'production' },
      { key: 'team', value: 'backend' },
      { key: 'priority', value: 'high' }
    ])
  })

  it('Creates labels from single key:value pair', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString('environment:staging')

    expect(result).toEqual([{ key: 'environment', value: 'staging' }])
  })

  it('Handles labels with whitespace by trimming', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString(' env : production , team : backend ')

    expect(result).toEqual([
      { key: 'env', value: 'production' },
      { key: 'team', value: 'backend' }
    ])
  })

  it('Returns empty array for empty string', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString('')

    expect(result).toEqual([])
  })

  it('Returns empty array for whitespace-only string', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString('   ')

    expect(result).toEqual([])
  })

  it('Handles missing value in key:value pair', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString('env:,team:backend')

    expect(result).toEqual([
      { key: 'env', value: '' },
      { key: 'team', value: 'backend' }
    ])
  })

  it('Handles missing key in key:value pair', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString(':production,team:backend')

    expect(result).toEqual([
      { key: '', value: 'production' },
      { key: 'team', value: 'backend' }
    ])
  })

  it('Handles label pair without colon separator', async () => {
    const { createLabelsFromString } = await import('../src/label.js')
    const result = createLabelsFromString('environment,team:backend')

    expect(result).toEqual([
      { key: 'environment', value: '' },
      { key: 'team', value: 'backend' }
    ])
  })
})
