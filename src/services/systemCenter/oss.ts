import request from '@/utils/request'

export function getUplaodInfos() {
  return request({
    url: '/oss/token-picture-video/url',
    method: 'get',
    isMock: true
  })
}

export function getOssClient() {
  return request({
    url: '/oss/aliOss/token',
    method: 'get',
    isMock: true
  })
}
