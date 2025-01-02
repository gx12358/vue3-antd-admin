import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { createMockRoute } from '../../../mock'
import { groupList } from '../../config/group'
import { otherAccountList, userList } from '../../config/user'
import { tokenByUserInfo } from '../../utils/util'

export type TabsKey = 'articles' | 'projects' | 'applications'

export default createMockRoute([
  {
    url: '/user/queryUserDetail',
    method: 'get',
    merageRoot: true,
    callback: (_, token) => {
      if (token) {
        const tokenUserInfo = tokenByUserInfo(token)
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
  },
  {
    url: '/user/account/update',
    method: 'post',
    timeout: 200,
    callback: () => null
  },
  {
    url: '/user/account/list',
    method: 'get',
    timeout: 200,
    callback: () => cloneDeep(otherAccountList)
  },
  {
    url: '/user/account/group',
    method: 'get',
    timeout: 200,
    callback: () => groupList?.filter((_, key) => key < 6)
  },
  {
    url: '/user/account/count',
    method: 'get',
    timeout: 200,
    callback: () => ({
      articles: 50,
      applications: 40,
      projects: 60
    })
  }
])
