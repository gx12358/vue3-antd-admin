import type { Method } from 'axios'
import { defaultSettings } from '@gx-config'
import { convertValueBoolean, isObject } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { isDev, typeViteEnv } from '@/utils/env'
import { tansParams } from '@/utils/util'

const { token } = defaultSettings

export type CustomeRequestInit = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, any>
}

export interface DownLoadRequestConfig<D = any> {
  url: string;
  method?: Method | string;
  data?: D;
  params?: any;
  name?: string; // 下载的名称
  direct?: boolean; // 是否直接使用url进行请求
  read?: boolean; // 返回下载地址，不下载
  loading?: boolean | {
    text?: string;
    progress?: boolean;
  }; // 展示下载中字样
  isZip?: boolean; // 是不是zip文件
  onProgress?: (number: string, remainingTime?: string) => void
  requestInit?: CustomeRequestInit
}

const SUCCESS_STATUSES = [
  200, // OK - 请求成功
  201, // Created - 已创建（通常是 POST 请求）
  202, // Accepted - 请求已接受但尚未处理
  203, // Non-Authoritative Information - 返回的元信息可能来自本地或第三方副本
  204, // No Content - 请求成功但没有返回内容
  205, // Reset Content - 请求成功，但客户端应重置视图
  206 // Partial Content - 部分内容成功返回（常见于文件下载和断点续传）
]

function estimateRemainingTime(startTime, loadedBytes, totalBytes) {
  const currentTime = Date.now()

  // 已用时间 (秒)
  const elapsedTime = (currentTime - startTime) / 1000

  // 已下载字节数
  const downloadSpeed = loadedBytes / elapsedTime // 每秒下载的字节数

  // 剩余字节数
  const remainingBytes = totalBytes - loadedBytes

  // 估算剩余时间 (秒)
  const remainingTime = remainingBytes / downloadSpeed

  return remainingTime // 返回剩余时间，单位是秒
}

// 格式化为更易读的时间格式
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return minutes > 0 ? `${minutes} 分钟 ${secs} 秒` : secs ? `${secs} 秒` : ''
}

export default async function fetchFile(options: DownLoadRequestConfig): Promise<boolean | string> {
  const user = useStoreUser()

  const loadingText = ref()
  const loading = convertValueBoolean(options.loading)
  const loadingProgress = isObject(options.loading) ? options.loading.progress : false
  const tipText = isObject(options.loading) ? options.loading.text || '' : ''
  loadingText.value = loading
    ? tipText || '下载中，请耐心等待...'
    : ''
  if (loading) {
    message.loading({
      content: () => loadingText.value,
      key: 'updatable',
      duration: 0
    })
  }

  let url = options.url
  const requestInit = options.requestInit || {} as CustomeRequestInit
  const fetchOptions: CustomeRequestInit = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...requestInit
  }

  if (!options.direct) {
    const prefix = isDev() ? typeViteEnv('VITE_PROXY_PREFIX') : ''
    const baseUrl = typeViteEnv('VITE_BASE_URL')
    url = `${prefix}${baseUrl}${url}`
  }
  if (user.token && !options.direct && fetchOptions.headers) {
    fetchOptions.headers[token.name] = `${user.token}`
  }
  if (options.params) {
    url = url + '?' + tansParams(options.params)
    url = url.slice(0, -1)
  }
  if (options.method === 'post' && options.data) {
    fetchOptions.body = JSON.stringify(options.data)
  }
  try {
    const response = await fetch(url, fetchOptions)
    if (SUCCESS_STATUSES.includes(response.status)) {
      // 获取文件的总大小（字节数）
      const contentLength = response.headers.get('Content-Length')
      const totalSize = contentLength ? Number.parseInt(contentLength, 10) : 0
      let loadedSize = 0
      // 获取文件的类型
      const contentType = response.headers.get('Content-Type') || 'application/octet-stream'
      const startTime = Date.now()

      // 创建可读流并逐块处理数据
      const reader = response.body?.getReader()
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            // 从流中读取一块数据
            const readerResult = await reader?.read()
            if (readerResult?.done) {
              break
            }

            // 更新已加载的字节数
            loadedSize += (readerResult?.value?.length || 0)

            // 计算并传递下载进度
            if (totalSize) {
              const percent = ((loadedSize / totalSize) * 100).toFixed(2)
              const remainingTime = estimateRemainingTime(startTime, loadedSize, totalSize)
              const remainingTimeStr = remainingTime ? formatTime(remainingTime) : ''
              if (loadingProgress && !tipText) {
                loadingText.value = `${remainingTimeStr
                  ? '下载中'
                  : '即将完成'}，当前进度: ${percent}%` + (remainingTimeStr && `，预计完成时间: ${remainingTimeStr}`)
              }
              if (options?.onProgress) {
                options.onProgress(percent, remainingTimeStr) // 调用回调函数传递进度
              }
            }

            // 推送数据到新的流
            controller.enqueue(readerResult?.value)
          }
          controller.close()
        }
      })
      const newResponse = new Response(stream, { headers: { 'Content-Type': contentType } })
      let blobResponse = await newResponse.blob()
      if (options.isZip) blobResponse = new Blob([ blobResponse ], { type: 'application/zip' })
      if (blobResponse) {
        const fileName = options.name
          ? options.name
          : response.headers.get('content-disposition')
            ? response.headers.get('content-disposition')?.split?.(';')?.[1]?.split?.('=')?.[1] || ''
            : ''
        const a = window.document.createElement('a')
        const downUrl = window.URL.createObjectURL(blobResponse)
        if (options.read) return downUrl
        a.href = downUrl
        a.download = `${decodeURI(fileName)}`
        a.click()
        if (loading) {
          message.success({
            content: `下载成功`,
            key: 'updatable'
          })
          loadingText.value = ''
        }
        window.URL.revokeObjectURL(downUrl)
        return true
      }
    }
    if (loading) {
      message.error({
        content: `下载失败`,
        key: 'updatable'
      })
      loadingText.value = ''
    }
    return false
  } catch (e) {
    console.error(e)
    if (loading) {
      message.error({
        content: `下载失败`,
        key: 'updatable'
      })
      loadingText.value = ''
    }
    return false
  }
}
