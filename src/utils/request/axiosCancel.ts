import type { Canceler } from 'axios'
import type { GAxiosOptions } from './typings'
import { isFunction } from '@gx-design-vue/pro-utils'
import axios from 'axios'

export const getPendingUrl = (
  config: GAxiosOptions,
  key?: string
) => key || config.cancelKey || [ config.method, config.url ].join('&')

export class AxiosCanceler {
  ignoreCancelToken: boolean
  pendingMap: Map<string, Canceler>

  constructor(ignoreCancel?: boolean) {
    this.pendingMap = new Map<string, Canceler>()

    this.ignoreCancelToken = ignoreCancel
  }

  /**
   * Add request
   * @param {object} config
   */
  addPending(config: GAxiosOptions) {
    !this.ignoreCancelToken && this.removePending(config)

    const url = getPendingUrl(config)
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
      if (!this.pendingMap.has(url)) {
        // If there is no current request in pending, add it
        this.pendingMap.set(url, cancel)
      }
    })
  }

  /**
   * @description: Clear all pending
   */
  removeAllPending() {
    this.pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    this.pendingMap.clear()
  }

  /**
   * Removal request
   * @param {object} config
   */
  removePending(config: GAxiosOptions, key?: string) {
    const url = getPendingUrl(config, key)

    if (this.pendingMap.has(url)) {
      // If there is a current request identifier in pending,
      // the current request needs to be cancelled and removed
      const cancel = this.pendingMap.get(url)
      cancel && cancel(url)
      this.pendingMap.delete(url)
    }
  }

  /**
   * @description: reset
   */
  reset(): void {
    this.pendingMap = new Map<string, Canceler>()
  }
}
