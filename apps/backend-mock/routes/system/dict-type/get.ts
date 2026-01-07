import { eventHandler, getQuery } from 'h3'
import { dictTypeList } from '~/utils/dict-data'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { id } = getQuery(event)

  return useResponseSuccess(structuredClone(dictTypeList).find(item => item.id === Number(id)))
})
