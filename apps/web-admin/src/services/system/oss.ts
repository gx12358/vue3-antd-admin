import { requestClient } from '@/services/base'

export function getUploadInfo() {
  return requestClient.get('/oss/token-picture-video/url')
}

export function getFilePresignedUrl<T = any>(name: string) {
  return requestClient.get<T>('/infra/file/presigned-url', {
    params: {
      name,
    },
  })
}

export function getOssClient() {
  return requestClient.get('/oss/aliOss/token')
}
