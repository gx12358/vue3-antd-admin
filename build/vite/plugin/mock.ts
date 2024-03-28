import { viteMockServe } from './viteMock'

export function configMockPlugin() {
  return viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    enable: true
  })
}
