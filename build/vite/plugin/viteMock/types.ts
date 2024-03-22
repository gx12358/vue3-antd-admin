import type { IncomingMessage, ServerResponse } from 'http'

export interface ViteMockOptions {
  mockPath?: string
  configPath?: string
  ignore?: RegExp | ((fileName: string) => boolean)
  watchFiles?: boolean
  localEnabled?: boolean
  prodEnabled?: boolean
  injectFile?: string
  injectCode?: string
  /**
   * Automatic recognition, no need to configure again
   * @deprecated Deprecated after 2.8.0
   */
  supportTs?: boolean
  logger?: boolean
}

export interface RespThisType {
  req: IncomingMessage
  res: ServerResponse
  parseJson: () => any
}

export type Recordable<T = any> = Record<string, T>

export interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any
}
