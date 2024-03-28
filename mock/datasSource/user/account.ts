import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import type { UserInfo } from '@gx-mock/config/user'
import { otherAccountList, userList } from '@gx-mock/config/user'
import { groupList } from '@gx-mock/config/group'
import { getMockRequest, getTokeUserInfo } from '@gx-mock/util/utils'

export type TabsKey = 'articles' | 'projects' | 'applications'

export default [
  getMockRequest<UserInfo | DefaultResult<null>, any>({
    url: '/user/queryUserDetail',
    method: 'get',
    callback: (_, token = '') => {
      if (token) {
        const tokenUserInfo = getTokeUserInfo(token)
        if (tokenUserInfo && tokenUserInfo?.userId) {
          const userInfo = userList.find(item => item.user.userId === tokenUserInfo?.userId)
          if (userInfo) {
            userInfo.user.loginDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
            return userInfo
          }
        }
      }

      return {
        code: 500,
        message: '用户信息获取失败'
      }
    }
  }),
  getMockRequest({
    url: '/user/account/update',
    method: 'post',
    timeout: 200,
    callback: () => null
  }),
  getMockRequest({
    url: '/user/account/list',
    method: 'get',
    timeout: 200,
    callback: () => cloneDeep(otherAccountList)
  }),
  getMockRequest({
    url: '/user/account/group',
    method: 'get',
    timeout: 200,
    callback: () => groupList?.filter((_, key) => key < 6)
  }),
  getMockRequest<any, Record<TabsKey, number>>({
    url: '/user/account/count',
    method: 'get',
    timeout: 200,
    callback: () => ({
      articles: 50,
      applications: 40,
      projects: 60
    })
  }),
]
