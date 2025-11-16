import type { WatchSource } from 'vue'
import { serialize } from '../serialize'

export type keyType = string | any[] | null | undefined

export type IKey = keyType | WatchSource<keyType>

export interface ICacheItem<Data> {
  data: Data;
  createdAt: number;
  expiresAt: number;
}

export default class SWRVCache<CacheData> {
  protected ttl: number
  private items?: Map<string, ICacheItem<CacheData>>

  constructor(ttl = 0) {
    this.items = new Map()
    this.ttl = ttl
  }

  serializeKey(key: IKey): string {
    return serialize(key)
  }

  get(k: string): ICacheItem<CacheData> {
    const _key = this.serializeKey(k)
    return this.items?.get(_key) as any
  }

  set(k: string, v: any, ttl?: number) {
    const _key = this.serializeKey(k)
    const timeToLive = ttl || this.ttl
    const now = Date.now()
    const item = {
      data: v,
      createdAt: now,
      expiresAt: timeToLive ? now + timeToLive : Infinity
    }

    this.dispatchExpire(timeToLive, item, _key)
    this.items?.set(_key, item) as any
  }

  dispatchExpire(ttl, item, serializedKey) {
    ttl && setTimeout(() => {
      const current = Date.now()
      const hasExpired = current >= item.expiresAt
      if (hasExpired) this.delete(serializedKey)
    }, ttl)
  }

  delete(serializedKey: string) {
    this.items?.delete(serializedKey) as any
  }
}
