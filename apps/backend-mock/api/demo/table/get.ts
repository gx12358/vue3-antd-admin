import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import {
  sleep,
  unAuthorizedResponse,
  useResponseSuccess,
} from '~/utils/response'
import { tableMockData } from '~/utils/table'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { id } = getQuery(event)
  const row = tableMockData.find(item => item.id === id)
  if (!row) {
    return useResponseSuccess(null)
  }
  await sleep(200)
  return useResponseSuccess(row)
})
