import request from '@/utils/request'
import type { CurrentUser, ListItemDataType } from './typings'

export function queryCurrent(): Promise<ResponseResult<CurrentUser>> {
  return request({
    url: '/currentUserDetail',
    method: 'post',
    isMock: true
  })
}

export function queryFakeList(params: {
  count: number;
}): Promise<ResponseResult<ListItemDataType>> {
  return request({
    url: '/fake_list_Detail',
    method: 'post',
    data: params,
    isMock: true
  })
}
