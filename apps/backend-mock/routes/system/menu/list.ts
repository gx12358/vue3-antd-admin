import { getLevelData } from '@gx-design-vue/pro-utils'
import { eventHandler } from 'h3'
import { getTenantCookie } from '~/utils/cookie-utils'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_MENUS } from '~/utils/menus-data'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const tenantId = getTenantCookie(event)

  const menus = structuredClone(MOCK_MENUS[tenantId])
  return useResponseSuccess(getLevelData(menus).map((item) => {
    delete item.children
    return item
  }))
})
