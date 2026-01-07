import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { eventHandler, setResponseHeaders } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { unAuthorizedResponse } from '~/utils/response'

// 获取当前文件所在目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  try {
    const filePath = join(__dirname, '../../public', '测试导出.xls')
    const fileBuffer = readFileSync(filePath)

    // 设置响应头
    const fileName = encodeURIComponent('用户数据.xls')
    setResponseHeaders(event, {
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Disposition': `attachment; filename="${fileName}"; filename*=UTF-8''${fileName}`,
      'Content-Length': fileBuffer.length.toString(),
    })

    return fileBuffer
  }
  catch (error) {
    console.error('File download error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'File download failed',
    })
  }
})
