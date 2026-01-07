import { eventHandler, getQuery } from 'h3'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_ROLES } from '~/utils/mock-data'
import {
  unAuthorizedResponse,
  useResponseError,
  useResponseSuccess,
} from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const tenantId = getTenantCookie(event)

  const { id } = getQuery(event)
  const listData = structuredClone(MOCK_ROLES[tenantId])
  const row = listData.find(item => item.id === Number(id))

  if (row) return useResponseSuccess(row)

  return useResponseError('')
})
