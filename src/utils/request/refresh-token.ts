import { getAccessToken, setAccessToken } from '@/utils/accessToken'
import { getRequestUrl } from '@/utils/request/utils'
import { fetchWithRetry } from '@/utils/util'

const LOCAL_STORAGE_KEY = 'is_other_tab_refreshing'

let isRefreshing = false
function waitUntilTokenRefreshed() {
  return new Promise<void>((resolve) => {
    function _check() {
      const isRefreshingSign = globalThis.localStorage.getItem(LOCAL_STORAGE_KEY)
      if ((isRefreshingSign && isRefreshingSign === '1') || isRefreshing) {
        setTimeout(() => {
          _check()
        }, 1000)
      }
      else {
        resolve()
      }
    }
    _check()
  })
}

const isRefreshingSignAvailable = function (delta: number) {
  const nowTime = new Date().getTime()
  const lastTime = globalThis.localStorage.getItem('last_refresh_time') || '0'
  return nowTime - Number.parseInt(lastTime) <= delta
}

// only one request can send
async function getNewAccessToken(timeout: number): Promise<void> {
  try {
    const isRefreshingSign = globalThis.localStorage.getItem(LOCAL_STORAGE_KEY)
    if ((isRefreshingSign && isRefreshingSign === '1' && isRefreshingSignAvailable(timeout)) || isRefreshing) {
      await waitUntilTokenRefreshed()
    }
    else {
      isRefreshing = true
      globalThis.localStorage.setItem(LOCAL_STORAGE_KEY, '1')
      globalThis.localStorage.setItem('last_refresh_time', new Date().getTime().toString())
      globalThis.addEventListener('beforeunload', releaseRefreshLock)
      const refresh_token = getAccessToken().refreshToken

      // Do not use baseFetch to refresh tokens.
      // If a 401 response occurs and baseFetch itself attempts to refresh the token,
      // it can lead to an infinite loop if the refresh attempt also returns 401.
      // To avoid this, handle token refresh separately in a dedicated function
      // that does not call baseFetch and uses a single retry mechanism.
      const url = getRequestUrl('/refresh-token')
      const [error, ret] = await fetchWithRetry(globalThis.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;utf-8',
        },
        body: JSON.stringify({ refresh_token }),
      }))
      if (error) {
        return Promise.reject(error)
      }
      else {
        if (ret.status === 401)
          return Promise.reject(ret)

        const { data } = await ret.json()
        const response = data as ResponseResult<{ token: string; refreshToken: string }>
        setAccessToken({ token: response.data.token, refreshToken: response.data.refreshToken })
      }
    }
  }
  catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
  finally {
    releaseRefreshLock()
  }
}

function releaseRefreshLock() {
  if (isRefreshing) {
    isRefreshing = false
    globalThis.localStorage.removeItem(LOCAL_STORAGE_KEY)
    globalThis.localStorage.removeItem('last_refresh_time')
    globalThis.removeEventListener('beforeunload', releaseRefreshLock)
  }
}

export async function refreshAccessTokenOrRelogin(timeout: number) {
  return Promise.race([new Promise<void>((_resolve, reject) => setTimeout(() => {
    releaseRefreshLock()
    reject(new Error('request timeout'))
  }, timeout)), getNewAccessToken(timeout)])
}
