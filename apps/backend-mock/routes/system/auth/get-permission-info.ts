import { defineEventHandler } from 'h3'
import { omit } from 'lodash-es'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_MENUS } from '~/utils/menus-data'
import { MOCK_ROLES } from '~/utils/mock-data'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

function filterMenusByType(menus: any[]): any[] {
  return menus
    .filter(menu => menu.type !== 3)
    .map((menu) => {
      const newMenu = { ...menu }

      if (newMenu.children && newMenu.children.length > 0) {
        const filteredChildren = filterMenusByType(newMenu.children)

        if (filteredChildren.length > 0) {
          newMenu.children = filteredChildren
        } else {
          delete newMenu.children
        }
      }

      return newMenu
    })
}

export default defineEventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const roles = structuredClone(MOCK_ROLES[userinfo.tenantId]).filter(role => userinfo.roleId.includes(role.id)).map(role => role.name)

  const menus = structuredClone(MOCK_MENUS[userinfo.tenantId] || [])

  return useResponseSuccess({
    user: omit(userinfo, ['tenantId', 'roleId']),
    permissions: ['*:*:*'],
    roles,
    menus: filterMenusByType(menus)
  })
})
