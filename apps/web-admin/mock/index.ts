import type { Recordable } from '@gx/types'
import type { FakeRouteConfig, RequestHeater } from '@gx/types/mock'
import { isArray, isBoolean, isFunction } from '@gx-design-vue/pro-utils'
import { defineFakeRoute } from '@gx/vite-config'
import { omit } from 'lodash-es'
import { app } from '../config'
import { checkBackDataFun } from './utils/util'

const { mock } = app

export interface MockResponse {
  body: any;
  query: any;
  headers: RequestHeater
}

export type MockResponseCallback
  = | ((response: MockResponse) => any)
  | string | number | Recordable | any[] | null

export type MockConfig = FakeRouteConfig & {
  merageRoot?: boolean;
  carryToken?: boolean;
  callback: MockResponseCallback;
}

function getRequestData(callback: MockResponseCallback, request: MockResponse) {
  if (isFunction(callback)) {
    return callback?.(request)
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
        return checkBackDataFun(getRequestData(config.callback, request) || {}, config.merageRoot)
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
