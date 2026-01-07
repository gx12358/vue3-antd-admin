import { eventHandler } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { MOCK_DEPT, MOCK_ROLES } from '~/utils/mock-data'
import { sleep, unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const dept = MOCK_DEPT[userinfo.tenantId].find(item => item.id === userinfo.deptId)
  const roles = MOCK_ROLES[userinfo.tenantId].filter(item => userinfo.roleId.includes(item.id)).map(item => ({
    'id': item.id,
    'name': item.name
  }))
  if (!dept) {
    return useResponseSuccess({})
  }

  const details = {
    'id': userinfo.id,
    'username': userinfo.username,
    'nickname': userinfo.nickname,
    'email': userinfo.email,
    'mobile': '18818260272',
    'sex': 2,
    'avatar': userinfo.avatar,
    'loginIp': '127.0.0.1',
    'loginDate': 1764840023000,
    'createTime': 1609837427000,
    'roles': roles,
    'dept': {
      'id': dept.id,
      'name': dept.name,
      'parentId': dept.parentId
    },
    'posts': [
      {
        'id': 1,
        'name': '董事长'
      },
      {
        'id': 2,
        'name': '项目经理'
      }
    ]
  }

  await sleep(100)

  return useResponseSuccess(details)
})
