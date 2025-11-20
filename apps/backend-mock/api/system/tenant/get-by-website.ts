import { eventHandler } from 'h3'
import { useResponseSuccess } from '~/utils/response'

export default eventHandler(async () => {
  return useResponseSuccess(null)
})
