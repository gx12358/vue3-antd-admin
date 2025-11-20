import { defineEventHandler } from 'h3'
import { omit } from 'lodash-es'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_MENUS, MOCK_ROLES } from '~/utils/mock-data'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default defineEventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const roles = MOCK_ROLES[userinfo.tenantId].filter(role => userinfo.roleId.includes(role.id)).map(role => role.name)

  const menus = MOCK_MENUS[userinfo.tenantId] || []

  return useResponseSuccess({
    user: omit(userinfo, ['tenantId', 'roleId']),
    permissions: ['*:*:*'],
    roles,
    menus
  })
})
