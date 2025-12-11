import type { ResponseResult } from '@gx/types/request'
import { faker } from '@faker-js/faker'
import { deepMerge, isObject } from '@gx-design-vue/pro-utils'

export function handleRandomImage(width: number, height: number) {
  return faker.image.url({
    width,
    height
  })
}

export const checkBackDataFun = (
  config: Partial<ResponseResult>,
  merageRoot?: boolean
): ResponseResult => {
  let result: Partial<ResponseResult> = {
    code: 200,
    data: null
  }
  if (isObject(config)) {
    const { data } = config
    if (merageRoot) {
      result = deepMerge(result, config)
    } else {
      result.data = config
    }
    if (data) {
      result.data = data
    }
  } else {
    result.data = config as any
  }

  return result as unknown as ResponseResult
}

export function getArraryList<T>(length: number, callback: (key: number) => T) {
  return Array.from({ length }).map((_, key) => callback(key))
}

export function getMockRandowList<T = any>(data: T[]) {
  return data[faker.number.int({ min: 0, max: data.length - 1 })] as T
}

export function mockNumber(min: number, max: number) {
  return faker.number.int({ min, max })
}
