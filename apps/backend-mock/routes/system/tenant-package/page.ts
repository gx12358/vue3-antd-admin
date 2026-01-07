import { isArray } from '@gx-design-vue/pro-utils'
import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response'
import { TENANT_PACKAGE } from '~/utils/tenant-data'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const {
    pageNo = 1,
    pageSize = 10,
    name,
    id,
    createTime,
    status,
  } = getQuery(event)
  let listData = structuredClone(TENANT_PACKAGE)
  if (name) {
    listData = listData.filter(item =>
      item.name.toLowerCase().includes(String(name).toLowerCase()),
    )
  }
  if (id) {
    listData = listData.filter(item =>
      item.id.toString().includes(String(id).toLowerCase()),
    )
  }

  if (isArray(createTime)) {
    const startTime = createTime[0]
    const endTime = createTime[1]
    if (startTime) {
      listData = listData.filter(item => new Date(item.createTime) >= new Date(startTime as string))
    }
    if (endTime) {
      listData = listData.filter(item => new Date(item.createTime) <= new Date(endTime as string))
    }
  }

  if (['0', '1'].includes(status as string)) {
    listData = listData.filter(item => item.status === Number(status))
  }
  return usePageResponseSuccess(pageNo as string, pageSize as string, listData)
})
