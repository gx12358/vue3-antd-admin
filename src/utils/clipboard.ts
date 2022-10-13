import { message } from 'ant-design-vue'
import Clipboard from 'clipboard'

function clipboardSuccess(msg: string) {
  message.success(msg || '复制成功')
}

/**
 * @description 复制数据
 * @param text
 * @param event
 */
export default function handleClipboard(text: string, msg?: string) {
  const fake_el = document.createElement('button')
  const clipboard: any = new Clipboard(fake_el, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(msg)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    message.error(`复制失败！`)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
