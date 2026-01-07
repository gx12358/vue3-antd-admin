import { eventHandler, getQuery } from 'h3'
import { dictDataList } from '~/utils/dict-data'
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
    label,
    dictType,
    status,
  } = getQuery(event)
  let listData = structuredClone(dictDataList)
  if (label) {
    listData = listData.filter(item =>
      item.label.toLowerCase().includes(String(label).toLowerCase()),
    )
  }
  if (dictType) {
    listData = listData.filter(item => item.dictType === dictType)
  }
  if (['0', '1'].includes(status as string)) {
    listData = listData.filter(item => item.status === Number(status))
  }
  listData = listData.sort((a, b) => a.sort - b.sort)
  return usePageResponseSuccess(pageNo as string, pageSize as string, listData)
})
