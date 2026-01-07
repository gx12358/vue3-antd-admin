import { eventHandler } from 'h3'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_ROLES } from '~/utils/mock-data'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }
  const tenantId = getTenantCookie(event)

  return useResponseSuccess(structuredClone(MOCK_ROLES[tenantId]) || [])
})
