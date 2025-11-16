import type { AxiosError } from 'axios'
import axios from 'axios'

export default function ({ error, refreshTokenFn, makeErrorMessage }: {
  error: AxiosError;
  refreshTokenFn: (error: AxiosError) => any;
  makeErrorMessage?: (message: string, error: AxiosError) => void;
}) {
  if (axios.isCancel(error)) {
    return Promise.reject(error)
  }

  const err: string = error?.toString?.() ?? ''
  let errMsg = ''
  if (err?.includes('Network Error')) {
    errMsg = '网络异常，请检查您的网络连接后重试。'
  } else if (error?.message?.includes?.('timeout')) {
    errMsg = '请求超时，请稍后再试。'
  }

  if (errMsg) {
    makeErrorMessage?.(errMsg, error)
    return Promise.reject(error)
  }

  let errorMessage = ''
  const status = error?.response?.status

  if (status === 401) {
    refreshTokenFn(error)
  }

  switch (status) {
    case 400: {
      errorMessage = '请求错误。请检查您的输入并重试。'
      break
    }
    case 403: {
      errorMessage = '哎呀！访问被拒绝'
      break
    }
    case 404: {
      errorMessage = '未找到, 请求的资源不存在。'
      break
    }
    case 408: {
      errorMessage = '请求超时，请稍后再试。'
      break
    }
    default: {
      errorMessage = '内部服务器错误，请稍后再试。'
    }
  }

  makeErrorMessage?.(errorMessage, error)
  return Promise.reject(error)
}
