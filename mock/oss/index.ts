import { MockMethod } from 'vite-plugin-mock'
import { builder, getRequestToken, requestParams } from '../_util'

export default [
  {
    url: '/mock-server/aliOss/token',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {
        data: {
          'accessKeyId': 'STS.NTkTyy5rrAhUyZYh6zgCXMjeL',
          'accessKeySecret': 'Gxci5LznnqdEia2XgMsUunBhcicuQ4XaUboGnXMGKv16',
          'securityToken': 'CAIS7AF1q6Ft5B2yfSjIr5feH8PN2K1T9qq+e3zojDYva8x0oq/Orjz2IH5OdHFqCewdv/8wnG1V5v8dlqp6U4cd+4w2wT8ovPpt6gqET9frma7ctM4p6vCMHWyUFGSIvqv7aPn4S9XwY+qkb0u++AZ43br9c0fJPTXnS+rr76RqddMKRAK1QCNbDdNNXGtYpdQdKGHaOITGUHeooBKJVRU25Vsh0DkisP7gkpDE0HeE0g2mkN1yjp/qP52pY/NrOJpCSNqv1IR0DPGfin4IsUgWr/Yt0/QZpGee4cv/GVBU5A6dN+vK/82t8ceqkQnZcRqAARbD3u0ifeBfq6A+HJg+u85U+cyFTpiOxtgGTWDLoBb34XtcuSofXRoLnHGsW/fG7jYFXf2eOr8tkb1uuFTwMa5WOzyn2N0keJf17sCMNxmMq8DYnU3OC4OHmUYLAWFEgJDdGYnB4eaRxIGlFTKGCkDY8AdIZHb18GzxdWSWU8kb',
          'expiration': '2022-08-20T09:24:31Z'
        }
      })
    }
  }
] as MockMethod[]
