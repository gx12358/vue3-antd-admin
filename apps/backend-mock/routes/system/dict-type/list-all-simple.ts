import { eventHandler } from 'h3'
import { dictTypeList } from '~/utils/dict-data'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  return useResponseSuccess(structuredClone(dictTypeList))
})
