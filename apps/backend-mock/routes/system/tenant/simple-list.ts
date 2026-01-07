import { eventHandler } from 'h3'
import { TENANT_LIST } from '~/utils/mock-data'
import { useResponseSuccess } from '~/utils/response'

export default eventHandler(async () => {
  return useResponseSuccess(structuredClone(TENANT_LIST))
})
