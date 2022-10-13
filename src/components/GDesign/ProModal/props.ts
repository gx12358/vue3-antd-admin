import { LegacyButtonType } from 'ant-design-vue/lib/button/buttonTypes'
import { PropTypes } from '@/utils'
import { buttonTypes } from '@gx-design/Button'

function noop() {}

export const modalProps = {
  prefixCls: PropTypes.string,
  /** 对话框是否可见*/
  visible: PropTypes.looseBool,
  /** 确定按钮 loading*/
  confirmLoading: PropTypes.looseBool,
  /** 标题*/
  title: PropTypes.any,
  /** 是否显示右上角的关闭按钮*/
  closable: PropTypes.looseBool,
  closeIcon: PropTypes.any,
  /** 点击确定回调*/
  onOk: {
    type: Function as PropType<(e: MouseEvent) => void>
  },
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
  onCancel: {
    type: Function as PropType<(e: MouseEvent) => void>
  },
  afterClose: PropTypes.func.def(noop),
  /** 垂直居中 */
  centered: PropTypes.looseBool,
  /** 宽度*/
  width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  /** 底部内容*/
  footer: PropTypes.any,
  /** 确认按钮文字*/
  okText: PropTypes.any,
  /** 确认按钮类型*/
  okType: {
    type: String as PropType<LegacyButtonType>
  },
  /** 取消按钮文字*/
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  /** 点击蒙层是否允许关闭*/
  maskClosable: PropTypes.looseBool,
  /** 强制渲染 Modal*/
  forceRender: PropTypes.looseBool,
  okButtonProps: PropTypes.shape(buttonTypes).loose,
  cancelButtonProps: PropTypes.shape(buttonTypes).loose,
  wrapClassName: PropTypes.string,
  maskTransitionName: PropTypes.string,
  transitionName: PropTypes.string,
  getContainer: PropTypes.any,
  zIndex: PropTypes.number,
  bodyStyle: PropTypes.style,
  maskStyle: PropTypes.style,
  mask: PropTypes.looseBool,
  keyboard: PropTypes.looseBool,
  wrapProps: PropTypes.object,
  focusTriggerAfterClose: PropTypes.looseBool
}

export const proModalProps = {
  ...modalProps,
  view: PropTypes.bool,
  isFail: PropTypes.bool,
  skeletonLoading: PropTypes.bool,
  skeletonRow: PropTypes.number,
  type: {
    type: String as PropType<'fixed' | 'normal'>,
    default: 'fixed'
  },
  spinning: PropTypes.bool,
  spinningTip: PropTypes.string,
  errorText: PropTypes.string.def('暂无数据'),
  contentStyle: PropTypes.style,
  draggable: PropTypes.bool.def(true),
  showClose: PropTypes.bool.def(true),
  showDefaultFooter: PropTypes.bool.def(false),
  fullscreen: PropTypes.bool.def(true),
  extra: PropTypes.VueNode,
  destroyOnClose: PropTypes.bool.def(true),
  onChangeView: [ Function ] as PropType<() => void>
}
