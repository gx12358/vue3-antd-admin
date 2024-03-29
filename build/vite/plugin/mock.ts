import { viteMockServe } from './viteMock'

export function configMockPlugin() {
  return viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    enable: true,
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  })
}
