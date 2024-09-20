import { router } from '@/router'
import { useStoreUser } from '@/store'
import { message } from 'ant-design-vue'

/**
 * @author gx12358 2539306317@qq.com
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
export const handleCode = (code: number, msg: string) => {
  const user = useStoreUser()
  switch (code) {
    case 401:
      user.resetPermissions()
      router.push({ path: '/user/login' })
      break
    case 403:
      router.push({ path: '/exception/403' })
      break
    default:
      message.error(msg || '后端接口异常')
      break
  }
}
