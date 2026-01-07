import { eventHandler } from 'h3'
import { pick } from 'lodash-es'
import { useResponseSuccess } from '~/utils/response'
import { TENANT_PACKAGE } from '~/utils/tenant-data'

export default eventHandler(async () => {
  return useResponseSuccess(structuredClone(TENANT_PACKAGE).map(item => pick(item, ['name', 'id'])))
})
