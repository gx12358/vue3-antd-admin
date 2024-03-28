import { VitePWA } from 'vite-plugin-pwa'

import { defaultSettings } from '../../../config'

export function configPwaConfig(env: ViteEnv) {
  const { title, shortName } = defaultSettings
  const { VITE_USE_PWA } = env

  if (VITE_USE_PWA) {
    const pwaPlugin = VitePWA({
      manifest: {
        name: title || 'GX Pro Admin',
        short_name: shortName || 'gx_pro_admin',
        icons: [
          {
            src: './resource/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './resource/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
    return pwaPlugin
  }
  return []
}
