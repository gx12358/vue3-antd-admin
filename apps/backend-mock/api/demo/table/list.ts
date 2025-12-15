import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import {
  sleep,
  unAuthorizedResponse,
  usePageResponseSuccess,
} from '~/utils/response'
import { tableMockData } from '~/utils/table'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  await sleep(500)

  const { pageNo, pageSize } = getQuery(event)
  // 规范化分页参数，处理 string[]
  const pageRaw = Array.isArray(pageNo) ? pageNo[0] : pageNo
  const pageSizeRaw = Array.isArray(pageSize) ? pageSize[0] : pageSize
  const pageNumber = Math.max(
    1,
    Number.parseInt(String(pageRaw ?? '1'), 10) || 1,
  )
  const pageSizeNumber = Math.min(
    100,
    Math.max(1, Number.parseInt(String(pageSizeRaw ?? '10'), 10) || 10),
  )
  const listData = structuredClone(tableMockData)

  return usePageResponseSuccess(
    String(pageNumber),
    String(pageSizeNumber),
    listData,
  )
})
