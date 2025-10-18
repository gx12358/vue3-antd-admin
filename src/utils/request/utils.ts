import { isBoolean } from '@gx-design-vue/pro-utils'
import { isDev, typeViteEnv } from '@/utils/env'

export function getRequestUrl(url: string, mock?: { prefix: string; isMock: boolean }) {
  const isMock = isBoolean(typeViteEnv('VITE_IS_MOCK')) ? typeViteEnv('VITE_IS_MOCK') : mock?.isMock
  const prefix = isDev() && !isMock ? typeViteEnv('VITE_PROXY_PREFIX') : ''
  const baseUrl = isMock ? mock?.prefix : typeViteEnv('VITE_BASE_URL')

  return `${prefix}${baseUrl}${url}`
}
