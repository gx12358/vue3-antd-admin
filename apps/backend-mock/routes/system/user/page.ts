import { eventHandler, getQuery } from 'h3'
import { omit } from 'lodash-es'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_DEPT, MOCK_USERS } from '~/utils/mock-data'
import { sleep, unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const tenantId = getTenantCookie(event)
  const {
    pageNo = 1,
    pageSize = 10,
    username,
    mobile,
    id,
    startTime,
    endTime,
    status,
  } = getQuery(event)
  let listData = structuredClone(MOCK_USERS.filter(item => item.tenantId === Number(tenantId)))
  if (username) {
    listData = listData.filter(item =>
      item.username.toLowerCase().includes(String(username).toLowerCase()),
    )
  }
  if (mobile) {
    listData = listData.filter(item =>
      item.mobile.toString().includes(String(mobile).toLowerCase()),
    )
  }
  if (id) {
    listData = listData.filter(item =>
      item.id.toString().includes(String(id).toLowerCase()),
    )
  }
  if (startTime) {
    // 这里改为dayjs判断
    listData = listData.filter(item => new Date(item.createTime) >= new Date(startTime as string))
  }
  if (endTime) {
    listData = listData.filter(item => new Date(item.createTime) <= new Date(endTime as string))
  }
  if (['0', '1'].includes(status as string)) {
    listData = listData.filter(item => item.status === Number(status))
  }
  listData = listData.map((item) => {
    return {
      ...omit(item, ['password', 'tenantId']),
      deptName: MOCK_DEPT[tenantId].find(el => el.id === item.deptId)?.name,
    }
  })

  await sleep(100)
  return usePageResponseSuccess(pageNo as string, pageSize as string, listData)
})
