import { eventHandler, getQuery } from 'h3'
import { AUTH_DATA } from '~/utils/auth-data'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { roleId } = getQuery(event)

  const menusId = structuredClone(AUTH_DATA[roleId as string])
  return useResponseSuccess(menusId ?? [])
})
