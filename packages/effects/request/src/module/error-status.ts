import type { RequestOptions, ResponseError } from '../typings'
import axios from 'axios'
import { RequestClient } from '../client'

export default async function ({
  client,
  error,
  formatToken,
  refreshToken,
  createMessages,
  expiredToken
}: {
  client: RequestClient
  error: ResponseError;
  refreshToken: () => any;
  formatToken?: (token: string) => Record<string, any>;
  expiredToken?: () => Promise<void>;
  createMessages?: (message: string, error: ResponseError) => void;
}) {
  if (axios.isCancel(error)) {
    return Promise.reject(error)
  }

  const config = error.config as RequestOptions
  const errorStr = error?.toString?.() ?? ''
  let messages = ''
  if (errorStr?.includes('Network Error')) {
    messages = '网络异常，请检查您的网络连接后重试。'
  } else if (error?.message?.includes?.('timeout')) {
    messages = '请求超时，请稍后再试。'
  }

  if (messages) {
    createMessages?.(messages, error)
    return Promise.reject(error)
  }

  const status = error?.response?.status

  if (status === 401) {
    // 判断是否启用了 refreshToken 功能
    // 如果没有启用或者已经是重试请求了，直接跳转到重新登录
    if (!refreshToken) {
      await expiredToken?.()
      return Promise.reject(error)
    }

    if (client.isRefreshing) {
      return new Promise((resolve) => {
        client.refreshTokenQueue.push((token: string) => {
          config.headers = {
            ...(config.headers || {}),
            ...(formatToken?.(token) || {})
          }
          resolve(client?.request(config.url, { ...config, retry: true }))
        })
      })
    }

    client.isRefreshing = true
    try {
      const token = await refreshToken()
      // 处理队列中的请求
      client.refreshTokenQueue.forEach(callback => callback(token))
      // 清空队列
      client.refreshTokenQueue = []

      return client.request(config.url, { ...config, retry: true })
    } catch (e) {
      // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
      client.refreshTokenQueue.forEach(callback => callback(''))
      client.refreshTokenQueue = []
      expiredToken?.()
      return Promise.reject(e)
    }
  }

  switch (status) {
    case 400: {
      messages = '请求错误。请检查您的输入并重试。'
      break
    }
    case 403: {
      messages = '哎呀！访问被拒绝'
      break
    }
    case 404: {
      messages = '未找到, 请求的资源不存在。'
      break
    }
    case 408: {
      messages = '请求超时，请稍后再试。'
      break
    }
    default: {
      messages = '内部服务器错误，请稍后再试。'
    }
  }

  createMessages?.(messages, error)
  return Promise.reject(error)
}
