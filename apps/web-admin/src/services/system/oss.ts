import { requestClient } from '@/services/base'

export function getUploadInfo() {
  return requestClient.get('/oss/token-picture-video/url', {
    isMock: true
  })
}

export function getOssClient() {
  return requestClient.get('/oss/aliOss/token', {
    isMock: true
  })
}
