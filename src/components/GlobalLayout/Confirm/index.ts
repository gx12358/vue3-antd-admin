import type { ModalFuncProps } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { createVNode } from 'vue'

export function globalConfirm(props: ModalFuncProps & { className?: string }) {
  const modal = Modal.confirm({
    ...props,
    width: 480,
    icon: createVNode(ExclamationCircleOutlined),
    closable: props.closable ?? true,
    okText: props.okText || '确认',
    cancelText: props.cancelText || '取消',
    title: props.title || '系统提示',
    content: props.content,
    wrapClassName: `${props.className || ''}`,
    onOk: props.onOk,
    onCancel: props.onCancel,
  })

  return modal
}
