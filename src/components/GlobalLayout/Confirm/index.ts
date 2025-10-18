import type { ModalFuncProps } from 'ant-design-vue'
import type { CSSProperties } from 'vue'
import { ExclamationCircleFilled, InfoCircleFilled } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { h } from 'vue'

// @ts-ignore
const iconMap: Record<ModalFuncProps['type'], any> = {
  info: InfoCircleFilled,
  confirm: ExclamationCircleFilled
}

export function globalConfirm(props: Omit<ModalFuncProps, 'icon'> & {
  className?: string;
  iconProps?: {
    className?: string;
    style?: CSSProperties;
  },
  icon?: any;
}) {
  const type = props.type || 'confirm'
  const Icon = props.icon || iconMap[type] || ExclamationCircleFilled
  const modal = Modal[type]({
    ...props,
    width: 400,
    icon: h(Icon, { class: props.iconProps?.className, style: props.iconProps?.style }),
    closable: props.closable ?? true,
    okText: props.okText || '确认',
    cancelText: props.cancelText || '取消',
    title: props.title || '系统提示',
    content: props.content,
    wrapClassName: `${props.className || ''}`,
    onOk: props.onOk,
    onCancel: props.onCancel
  })

  return modal
}
