import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_USERS } from '~/utils/mock-data'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { userId } = getQuery(event)

  const currentUser = structuredClone(MOCK_USERS).find(item => item.id === Number(userId))

  return useResponseSuccess(currentUser?.roleId)
})
