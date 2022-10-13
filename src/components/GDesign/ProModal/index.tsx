import type { ExtractPropTypes } from 'vue'
import { computed, defineComponent, onUnmounted, ref, watchEffect } from 'vue'
import { omit } from 'lodash-es'
import { Modal, Empty, Skeleton, Spin, Button, Space } from 'ant-design-vue'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import Nodata from '@/assets/public_images/nodata.png'
import { getSlotVNode, getPrefixCls } from '@gx-admin/utils'
import { modalProps, proModalProps } from './props'
import { useModalDragMove } from './hooks/useModalDrag'

import './style.less'
import { isNumber } from '@/utils/validate'

export type ModalProps = Partial<ExtractPropTypes<typeof modalProps>>

export type ProModalProps = Partial<ExtractPropTypes<typeof proModalProps>>

function defaultFooter(className: string, onCancel: () => void) {
  return (
    <div class={className}>
      <Button key="cancel" onClick={() => onCancel()}>
        关闭
      </Button>
    </div>
  )
}

export default defineComponent({
  name: 'GProModal',
  props: proModalProps,
  emits: ['cancel', 'ok', 'changeView'],
  setup(props, { emit, slots, attrs }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'modal',
      isPor: true
    })
    const modalWrapperRef = ref()
    const fullScreen = ref(false)
    const innerWidth = ref(window.innerWidth)

    const getProps = computed(() => {
      const newProps: Recordable = {
        ...props,
        centered: props.type === 'fixed',
        closable: false
      }
      if (props.isFail) newProps.centered = false
      if (props.spinning) newProps.maskClosable = false
      return omit(newProps, [
        'onCancel',
        'width',
        'bodyStyle',
        'wrapClassName',
        'isFail',
        'spinning'
      ])
    })

    const handleModalClass = computed(() => {
      const publicClass = [baseClassName]
      let heightClass: string[]
      if (props.isFail || props.type !== 'fixed') {
        heightClass = ['default']
      } else {
        heightClass = innerWidth.value < 1540 ? ['small'] : []
      }
      const fullScreenClass = fullScreen.value ? `${baseClassName}-full-screen` : ''
      return [
        ...publicClass,
        ...heightClass,
        fullScreenClass,
        props.spinning ? 'spinning' : '',
        attrs.class
      ]
    })

    const getModalWidth = computed(() =>
      fullScreen.value ? '100%' : props.width === 520 || !props.width ? '850px' : props.width
    )

    const getModalWrapClassName = computed(() => {
      const hiddeClass = !getProps.value.visible || props.skeletonLoading || props.isFail
      return props.wrapClassName
        ? hiddeClass
          ? `${baseClassName}-hidden ${props.wrapClassName}`
          : `${props.wrapClassName}`
        : hiddeClass
        ? `${baseClassName}-hidden`
        : ''
    })

    watchEffect(() => {
      useModalDragMove({
        visible: getProps.value.visible,
        destroyOnClose: getProps.value.destroyOnClose,
        draggable: getProps.value.draggable
      })
    })

    onUnmounted(() => emit('cancel'))

    const onOK = () => emit(props.view ? 'changeView' : 'ok')

    const onCancel = () => emit('cancel')

    const handleFullScreen = (e) => {
      e?.stopPropagation()
      e?.preventDefault()
      fullScreen.value = !fullScreen.value
    }

    const renderSkeleton = () => {
      const show = []
      for (let i = 0; i < props.skeletonRow; i += 1) {
        show.push(<Skeleton loading={props.skeletonLoading} active />)
      }
      return show
    }

    const renderContent = () => {
      const extraRender = getSlotVNode(slots, props, 'extra')
      return (
        <div class={`${baseClassName}-body`} style={props.contentStyle}>
          {props.spinning && <div class={`${baseClassName}-spinning-content`} />}
          {props.skeletonLoading && (
            <div
              class={`${baseClassName}-skeleton`}
              style={{ marginTop: `${props.title ? '' : '55px'}` }}
            >
              {props.skeletonRow && isNumber(props.skeletonRow) ? (
                renderSkeleton()
              ) : (
                <>
                  <Skeleton loading={props.skeletonLoading} active />
                  {props.type === 'fixed' && (
                    <>
                      <Skeleton loading={props.skeletonLoading} active />
                      <Skeleton loading={props.skeletonLoading} active />
                    </>
                  )}
                </>
              )}
            </div>
          )}
          {props.isFail && <Empty class={`${baseClassName}-error-warp`} image={Nodata} />}
          <div class={`${baseClassName}-grid`}>{slots.default?.()}</div>
          {extraRender}
        </div>
      )
    }

    const renderProFooter = () => (
      <div class={`${baseClassName}-footer`}>
        <Button loading={props.confirmLoading} key="confirm" type="primary" onClick={() => onOK()}>
          {props.view ? '编辑' : '确认'}
        </Button>
        <Button key="calcel" onClick={() => onCancel()}>
          取消
        </Button>
      </div>
    )

    const renderFooter = () => {
      const footerRender = getSlotVNode(slots, props, 'footer')
      const loading = props.skeletonLoading || props.isFail
      if (!props.visible) return defaultFooter(`${baseClassName}-footer`, onCancel)
      return footerRender
        ? props.isFail || loading
          ? defaultFooter(`${baseClassName}-footer`, onCancel)
          : footerRender
        : props.showDefaultFooter
        ? defaultFooter(`${baseClassName}-footer`, onCancel)
        : renderProFooter()
    }

    const renderDefault = () => (
      <>
        {props.fullscreen && props.showClose && (
          <div class={`${baseClassName}-close`}>
            <span class={`${baseClassName}-close-x`}>
              <Space size={24}>
                {props.fullscreen &&
                  (fullScreen.value ? (
                    <FullscreenExitOutlined role="full" onClick={(e) => handleFullScreen(e)} />
                  ) : (
                    <FullscreenOutlined role="full" onClick={(e) => handleFullScreen(e)} />
                  ))}
                {props.showClose && <CloseOutlined onClick={() => onCancel()} />}
              </Space>
            </span>
          </div>
        )}
        <div class={`${baseClassName}-wrap`} ref={(e) => (modalWrapperRef.value = e)}>
          {props.spinning && (
            <div class={`${baseClassName}-spin`}>
              <Spin spinning={props.spinning} tip={props.spinningTip} />
            </div>
          )}
          <g-bars style={{ height: '100%' }}>{renderContent()}</g-bars>
        </div>
      </>
    )

    return () => {
      return (
        <Modal
          class={handleModalClass.value}
          wrapClassName={getModalWrapClassName.value}
          width={getModalWidth.value}
          bodyStyle={
            fullScreen.value ? { height: `${window.innerHeight - 110}px !important` } : undefined
          }
          onCancel={() => onCancel()}
          {...getProps.value}
          v-slots={{
            ...slots,
            default: () => renderDefault(),
            footer: () => renderFooter()
          }}
        />
      )
    }
  }
})
