import type { DownLoadRequestConfig } from '@/utils/fetchFile'
import fetchFile from '@/utils/fetchFile'

export function download(params: DownLoadRequestConfig) {
  const { showTip = true, method = 'get' } = params
  return fetchFile({
    ...params,
    showTip,
    method
  })
}
