import { computed, isVNode, cloneVNode, defineComponent, PropType } from 'vue'
import { Grid, Space, Tooltip } from 'ant-design-vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { useMemo } from '@gx-admin/hooks/core'
import { isBoolean } from '@/utils/validate'
import { proTableProps } from '../../props'

import './style.less'

export type ListToolBarSetting = {
  icon: VueNode
  tooltip?: string
  key?: string
  onClick?: (key?: string) => void
}

type SettingPropType = VueNode | ListToolBarSetting

const { useBreakpoint } = Grid

/**
 * 获取配置区域 DOM Item
 *
 * @param setting 配置项
 */
function getSettingItem(setting: SettingPropType) {
  if (isVNode(setting)) {
    return setting
  }
  if (setting) {
    const settingConfig: ListToolBarSetting = setting as ListToolBarSetting
    const { icon, tooltip, onClick, key } = settingConfig
    if (icon && tooltip) {
      return (
        <Tooltip title={tooltip}>
          <span
            key={key}
            onClick={() => {
              if (onClick) {
                onClick(key)
              }
            }}
          >
            {icon}
          </span>
        </Tooltip>
      )
    }
    return icon
  }
  return null
}

const ListToolBar = defineComponent({
  props: {
    actions: proTableProps.toolBarBtn,
    settings: [Array] as PropType<VueNode[]>,
    titleTip: proTableProps.titleTip,
    prefixCls: String,
    headerTitle: proTableProps.headerTitle,
    titleTipText: proTableProps.titleTipText,
    optionsExtra: proTableProps.optionsExtra
  },
  setup(props) {
    const screens = useBreakpoint()

    const hasLeft = computed(
      () => !!(props.titleTip || props.headerTitle || (props.actions as any[])?.length)
    )

    const hasRight = computed(() => !!(props.settings?.length || props.optionsExtra))

    const hasTitle = computed(() => !!(props.titleTip || props.headerTitle))

    const actionDom = useMemo(() => {
      if (!Array.isArray(props.actions)) {
        return props.actions
      }
      if (props.actions?.length < 1) {
        return null
      }

      return (
        <Space align="center">
          {props.actions.map((action, index) => {
            if (!isVNode(action)) {
              return <template key={index}>{action}</template>
            }
            return cloneVNode(action, {
              key: index,
              ...action?.props
            })
          })}
        </Space>
      )
    })

    const leftTitleDom = useMemo(() => {
      // 保留dom是为了占位，不然 right 就变到左边了
      if (!hasLeft.value && hasRight.value) {
        return <div class={`${props.prefixCls}-left`} />
      }
      // 减少 space 的dom，渲染的时候能节省点性能
      if (hasTitle.value) {
        return (
          <Space class={`${props.prefixCls}-left`}>
            <div class={`${props.prefixCls}-title flex items-center gap-8px`}>
              {props.headerTitle}
              {props.titleTip && (
                <Tooltip title={props.titleTipText}>
                  {isBoolean(props.titleTip) && props.titleTip ? (
                    <InfoCircleOutlined />
                  ) : (
                    props.titleTip
                  )}
                </Tooltip>
              )}
            </div>
            {actionDom.value && <div class={`${props.prefixCls}-actions`}>{actionDom.value}</div>}
          </Space>
        )
      }

      return (
        <Space class={`${props.prefixCls}-left`}>
          {actionDom.value && <div class={`${props.prefixCls}-actions`}>{actionDom.value}</div>}
        </Space>
      )
    })

    const rightTitleDom = useMemo(() => {
      if (!hasRight.value) return null
      return (
        <Space
          size={16}
          class={`${props.prefixCls}-right`}
          align={screens.value.lg ? 'center' : 'end'}
          direction={screens.value.lg ? 'horizontal' : 'vertical'}
        >
          {props.optionsExtra}
          {props.settings?.length ? (
            <Space size={12} align="center" class={`${props.prefixCls}-setting-items`}>
              {props.settings.map((setting, index) => {
                const settingItem = getSettingItem(setting)
                return (
                  <div key={index} class={`${props.prefixCls}-setting-item`}>
                    {settingItem}
                  </div>
                )
              })}
            </Space>
          ) : null}
        </Space>
      )
    })

    const titleNode = useMemo(() => {
      if (!hasRight.value && !hasLeft.value) return null

      const containerClassName = {
        [`${props.prefixCls}-container`]: true,
        [`${props.prefixCls}-container-mobile`]: !screens.value.xl
      }

      return (
        <div class={containerClassName}>
          {leftTitleDom.value}
          {rightTitleDom.value}
        </div>
      )
    })

    return () => {
      return <div class={`${props.prefixCls}`}>{titleNode.value}</div>
    }
  }
})

ListToolBar.inheritAttrs = false

export default ListToolBar
