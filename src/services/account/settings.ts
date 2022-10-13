import request from '@/utils/request'
import type { CurrentUser, GeographicItemType } from './typings'

export function queryCurrent(): Promise<ResponseResult<CurrentUser>> {
  return request({
    url: '/accountSettingCurrentUser',
    method: 'post',
    isMock: true
  })
}

export function queryProvince(): Promise<ResponseResult<GeographicItemType[]>> {
  return request({
    url: '/geographic/province',
    method: 'post',
    isMock: true
  })
}

export function queryCity(province: string): Promise<ResponseResult<GeographicItemType[]>> {
  return request({
    url: `/geographic/city/${province}`,
    method: 'post',
    isMock: true
  })
}
