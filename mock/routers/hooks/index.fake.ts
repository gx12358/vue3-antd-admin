import { createMockRoute } from '../../../mock'

export default createMockRoute({
  url: '/hooks/request',
  method: 'get',
  timeout: 2000,
  callback: () => ({
    name: 'request',
    type: 'function',
  })
})
