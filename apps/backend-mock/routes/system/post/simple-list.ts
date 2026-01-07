import { eventHandler } from 'h3'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_POST } from '~/utils/mock-data'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }
  const tenantId = getTenantCookie(event)

  const depts = structuredClone(MOCK_POST[tenantId])
  return useResponseSuccess(depts.sort((a, b) => a.sort - b.sort))
})
