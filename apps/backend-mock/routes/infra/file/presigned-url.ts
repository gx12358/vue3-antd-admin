import { eventHandler, getQuery, setResponseStatus } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { GenerateSignature } from '~/utils/oss'
import {
  unAuthorizedResponse,
  useResponseError,
  useResponseSuccess
} from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { name } = getQuery(event)

  if (!name) {
    setResponseStatus(event, 400)
    return useResponseError(
      'BadRequestException',
      '文件名是必须的'
    )
  }
  const result = await GenerateSignature(name as string)
  return useResponseSuccess({
    configId: 25,
    ...result
  })
})
