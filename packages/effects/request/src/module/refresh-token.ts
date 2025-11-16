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
async function getNewAccessToken({ timeout, doRefreshToken }: {
  timeout: number
  doRefreshToken: () => Promise<any>
}): Promise<any> {
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

      return doRefreshToken()
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

export async function refreshAccessTokenOrRelogin(
  options: {
    timeout: number
    doRefreshToken: () => Promise<any>
  }
) {
  return Promise.race([new Promise<void>((_resolve, reject) => setTimeout(() => {
    releaseRefreshLock()
    reject(new Error('request timeout'))
  }, options.timeout)), getNewAccessToken(options)])
}
