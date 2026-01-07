import { eventHandler, readFormData } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import {
  sleep,
  unAuthorizedResponse,
  useResponseSuccess,
} from '~/utils/response'

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }
  const formData = await readFormData(event)
  const file = formData.get('file') as File

  if (!file) {
    return useResponseSuccess({
      code: 400,
      message: '请上传文件'
    })
  }

  await sleep(200)
  return useResponseSuccess(true)
})
