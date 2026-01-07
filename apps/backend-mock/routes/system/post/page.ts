import { eventHandler, getQuery } from 'h3'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_POST } from '~/utils/mock-data'
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const tenantId = getTenantCookie(event)

  const {
    pageNo = 1,
    pageSize = 10,
    name,
    id,
    code,
    status,
  } = getQuery(event)
  let listData = structuredClone(MOCK_POST[tenantId])
  if (name) {
    listData = listData.filter(item =>
      item.name.toLowerCase().includes(String(name).toLowerCase()),
    )
  }
  if (id) {
    listData = listData.filter(item =>
      item.id.toString().includes(String(id).toLowerCase()),
    )
  }
  if (code) {
    listData = listData.filter(item =>
      item.code?.toLowerCase()?.includes(String(code).toLowerCase()),
    )
  }

  if (['0', '1'].includes(status as string)) {
    listData = listData.filter(item => item.status === Number(status))
  }
  return usePageResponseSuccess(pageNo as string, pageSize as string, listData)
})
