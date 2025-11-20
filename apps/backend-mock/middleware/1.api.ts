import { defineEventHandler } from 'h3'
import { forbiddenResponse, sleep } from '~/utils/response'

export default defineEventHandler(async (event) => {
  event.node.res.setHeader(
    'Access-Control-Allow-Origin',
    event.headers.get('Origin') ?? '*',
  )
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.statusMessage = 'No Content.'
    return 'OK'
  } else if (
    ['DELETE', 'PATCH', 'POST', 'PUT'].includes(event.method)
    && event.path.startsWith('/api/system/')
    // 本地开发环境不限制写操作
    && process.env.NODE_ENV !== 'development'
  ) {
    await sleep(Math.floor(Math.random() * 2000))
    return forbiddenResponse(event, '演示环境，禁止修改')
  }
})
