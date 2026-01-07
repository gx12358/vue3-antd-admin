import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { TENANT_LIST } from '~/utils/mock-data'
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

  const { id } = getQuery(event)
  const listData = structuredClone(TENANT_LIST)
  const row = listData.find(item => item.id === Number(id))

  if (row) return useResponseSuccess(row)

  return useResponseError('')
})
