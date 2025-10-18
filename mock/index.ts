import { isArray, isBoolean, isFunction } from '@gx-design-vue/pro-utils'
import { omit } from 'lodash-es'
import { defaultSettings } from '../config'
import { defineFakeRoute } from '../internal/vite-plugin/fake-server/client'
import { checkBackDataFun, getToken } from './utils/util'

const { mock } = defaultSettings

export interface MockResponse {
  body: any;
  query: any;
  headers: RequestHeater
}

export type MockResponseCallback
  = | ((response: MockResponse, token?: string) => any)
  | string | number | Recordable | any[] | null

export type MockConfig = FakeRouteConfig & {
  merageRoot?: boolean;
  carryToken?: boolean;
  callback: MockResponseCallback;
}

function getRequestData(callback: MockResponseCallback, request: MockResponse, token?: string) {
  if (isFunction(callback)) {
    return callback?.(request, token)
  }

  return callback
}

function getMockRouteConfig(config: MockConfig) {
  const carryToken = isBoolean(config.carryToken) ? config.carryToken : true
  return {
    ...omit(config, 'callback'),
    url: `${mock.prefix}${config.url}`,
    response: (request: MockResponse) => {
      if (carryToken) {
        const token = getToken(request.headers)
        return checkBackDataFun(getRequestData(config.callback, request, token) || {}, token || '', config.merageRoot)
      }
      return getRequestData(config.callback, request)
    }
  }
}

export function createMockRoute(router: MockConfig | MockConfig[]) {
  const fakeRoute = isArray(router)
    ? router.map(item => getMockRouteConfig(item))
    : getMockRouteConfig(router)

  return defineFakeRoute(fakeRoute)
}
