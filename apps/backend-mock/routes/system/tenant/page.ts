import { isArray } from '@gx-design-vue/pro-utils'
import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { TENANT_LIST } from '~/utils/mock-data'
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
    id,
    contactMobile,
    contactName,
    createTime,
    status,
  } = getQuery(event)
  let listData = structuredClone(TENANT_LIST)
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
  if (contactName) {
    listData = listData.filter(item =>
      item.contactName.toString().includes(String(contactName).toLowerCase()),
    )
  }
  if (contactMobile) {
    listData = listData.filter(item =>
      item.contactMobile.toString().includes(String(contactMobile).toLowerCase()),
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
