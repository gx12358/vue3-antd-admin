import { eventHandler, getQuery } from 'h3'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_USERS } from '~/utils/mock-data'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { id } = getQuery(event)
  const tenantId = getTenantCookie(event)
  const users = structuredClone(MOCK_USERS).filter(item => item.tenantId === Number(tenantId))

  return useResponseSuccess(users.find(item => item.id === Number(id)))
})
