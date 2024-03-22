import { createVNode } from 'vue'
import type { ModalFuncProps } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

export function globalConfirm({
  className,
  title,
  content,
  onOk
}: ModalFuncProps & { className?: string }) {
  Modal.confirm({
    width: 480,
    icon: createVNode(ExclamationCircleOutlined),
    closable: true,
    title: title || '二次确认',
    content,
    wrapClassName: `${className || ''}`,
    onOk
  })
}
