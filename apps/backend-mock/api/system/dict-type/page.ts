import { eventHandler, getQuery } from 'h3'
import { dictTypeList } from '~/utils/dict-data'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const {
    pageNo = 1,
    pageSize = 10,
    name,
    type,
    status,
  } = getQuery(event)
  let listData = structuredClone(dictTypeList)
  if (name) {
    listData = listData.filter(item =>
      item.name.toLowerCase().includes(String(name).toLowerCase()),
    )
  }
  if (type) {
    listData = listData.filter(item => item.type === type)
  }
  if (['0', '1'].includes(status as string)) {
    listData = listData.filter(item => item.status === Number(status))
  }
  return usePageResponseSuccess(pageNo as string, pageSize as string, listData)
})
