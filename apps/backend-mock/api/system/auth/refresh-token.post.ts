import { defineEventHandler, getQuery } from 'h3'
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie-utils'
import { generateAccessToken, verifyRefreshToken } from '~/utils/jwt-utils'
import { MOCK_USERS } from '~/utils/mock-data'
import { forbiddenResponse } from '~/utils/response'

export default defineEventHandler(async (event) => {
  const { refreshToken } = getQuery(event)
  if (!refreshToken) {
    return forbiddenResponse(event)
  }

  clearRefreshTokenCookie(event)

  const userinfo = verifyRefreshToken(refreshToken as string)
  if (!userinfo) {
    return forbiddenResponse(event)
  }

  const findUser = MOCK_USERS.find(
    item => item.username === userinfo.username,
  )
  if (!findUser) {
    return forbiddenResponse(event)
  }
  const accessToken = generateAccessToken(findUser)

  setRefreshTokenCookie(event, refreshToken as string)

  return {
    userId: findUser.id,
    expiresTime: 1000 * 60 * 60 * 24 * 7,
    accessToken,
    refreshToken
  }
})
