import { resolve } from 'node:path'
import { config } from 'dotenv'
import errorHandler from './error'

// 手动加载 .env.local
config({ path: resolve(__dirname, '.env.local') })

process.env.COMPATIBILITY_DATE = new Date().toISOString()
export default defineNitroConfig({
  devErrorHandler: errorHandler,
  errorHandler: '~/error',
  baseURL: '/api',
  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers':
          'Accept, Authorization, Content-Length, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, X-CSRF-TOKEN, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
      },
    },
  },
})
