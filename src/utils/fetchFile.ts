import type { Method } from 'axios'
import { typeViteEnv } from '@/utils/env'
import { tansParams } from '@/utils/util'
import { defaultSettings } from '@gx-config'
import { message } from 'ant-design-vue'

const { tokenName } = defaultSettings

export interface DownLoadRequestConfig<D = any> {
  url: string;
  method?: Method | string;
  headers?: HeadersInit;
  data?: D;
  params?: any;
  name?: string; // 下载的名称
  direct?: boolean; // 是否直接使用url进行请求
  read?: boolean; // 返回下载地址，不下载
  showTip?: boolean; // 展示下载中字样
}

export default async function fetchFile(options: DownLoadRequestConfig): Promise<boolean | string> {
  const user = useStoreUser()
  if (options.showTip) {
    message.loading({
      content: `下载中，请耐心等待。。。。`,
      key: 'updatable',
      duration: 0
    })
  }
  const opations: RequestInit = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }
  if (!options.direct)
    options.url = `${typeViteEnv('VITE_BASE_URL')}${options.url}`
  if (user.accessToken && !options.direct)
    opations.headers[tokenName] = `${user.accessToken}`
  if (options.params) {
    let url = options.url + '?' + tansParams(options.params)
    url = url.slice(0, -1)
    options.url = url
  }
  if (options.method === 'post' && options.data) {
    opations.body = JSON.stringify(options.data)
  }
  const response = await fetch(options.url, opations)
  const fileName = options.name
    ? options.name
    : response.headers.get('content-disposition')
      ? response.headers.get('content-disposition').split(';')[1].split('=')[1]
      : ''
  const blobResponse = await response.blob()
  if (blobResponse) {
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(blobResponse)
    if (options.read)
      return downUrl
    a.href = downUrl
    a.download = `${decodeURI(fileName)}`
    a.click()
    if (options.showTip) {
      message.success({
        content: `下载成功`,
        key: 'updatable'
      })
    }
    window.URL.revokeObjectURL(downUrl)
    return true
  } else {
    if (options.showTip) {
      message.success({
        content: `下载失败`,
        key: 'updatable'
      })
    }
    return false
  }
}
