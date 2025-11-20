import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
  setTenantCookie
} from '~/utils/cookie-utils'
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils'
import { MOCK_USERS } from '~/utils/mock-data'
import {
  forbiddenResponse,
  useResponseError,
  useResponseSuccess,
} from '~/utils/response'

export default defineEventHandler(async (event) => {
  const { password, username, tenantId } = await readBody(event)
  if (!password || !username || !tenantId) {
    setResponseStatus(event, 400)
    return useResponseError(
      'BadRequestException',
      '用户名、密码和租户ID是必需的'
    )
  }

  const findUser = MOCK_USERS.find(
    item => item.username === username && item.password === password && item.tenantId === tenantId,
  )

  if (!findUser) {
    clearRefreshTokenCookie(event)
    return forbiddenResponse(event, '登录失败，账号密码不正确')
  }

  const accessToken = generateAccessToken(findUser)
  const refreshToken = generateRefreshToken(findUser)

  setRefreshTokenCookie(event, refreshToken)
  setTenantCookie(event, findUser.tenantId as any)

  return useResponseSuccess({
    expiresTime: 3600 * 1000 * 24 * 7,
    accessToken,
    refreshToken,
    userId: findUser.id
  })
})
