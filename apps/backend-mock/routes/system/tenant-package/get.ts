import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import {
  unAuthorizedResponse,
  useResponseError,
  useResponseSuccess,
} from '~/utils/response'
import { TENANT_PACKAGE } from '~/utils/tenant-data'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { id } = getQuery(event)
  const listData = structuredClone(TENANT_PACKAGE)
  const row = listData.find(item => item.id === Number(id))

  if (row) return useResponseSuccess(row)

  return useResponseError('')
})
