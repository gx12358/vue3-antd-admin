import { MockMethod } from 'vite-plugin-mock'
import city from './geographic/city.json'
import province from './geographic/province.json'
import { builder, getRequestToken, requestParams } from '../_util'

export default [
  {
    url: '/mock-server/accountSettingCurrentUser',
    method: 'post',
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: {
          name: 'gx12358',
          avatar: 'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/20211111162748.jpg',
          userid: '00000001',
          email: '2539306317@qq.com',
          signature: '海纳百川，有容乃大',
          title: '交互专家',
          group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
          tags: [
            {
              key: '0',
              label: '很有想法的'
            },
            {
              key: '1',
              label: '专注设计'
            },
            {
              key: '2',
              label: '辣~'
            },
            {
              key: '3',
              label: '大长腿'
            },
            {
              key: '4',
              label: '川妹子'
            },
            {
              key: '5',
              label: '海纳百川'
            }
          ],
          notifyCount: 12,
          unreadCount: 11,
          country: 'China',
          geographic: {
            province: {
              label: '安徽省',
              key: '340000'
            },
            city: {
              label: '合肥市',
              key: '340100'
            }
          },
          address: '庐阳区财富广场首座',
          phone: '0752-268888888'
        }
      })
    }
  },
  {
    url: '/mock-server/geographic/province',
    method: 'post',
    timeout: 500,
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: province
      })
    }
  },
  {
    url: '/mock-server/geographic/city/:province',
    method: 'post',
    timeout: 500,
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: city[request.query.province]
      })
    }
  }
] as MockMethod[]
