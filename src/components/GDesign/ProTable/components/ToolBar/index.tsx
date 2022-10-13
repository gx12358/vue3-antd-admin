import type { FunctionalComponent as FC } from 'vue'
import { computed, ref, unref } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import ColumnSetting from '../ColumnSetting'
import FullScreenIcon from './FullscreenIcon'
import DensityIcon from './DensityIcon'
import ListToolBar from '../ListToolBar'
import type { OptionConfig } from '../../types/table'
import { useTableContext } from '../../context/TableContext'
import { getPrefixCls } from '@gx-admin/utils'

import './style.less'

export type ToolBarProps = {
  headerTitle?: VueNode | string
  titleTip?: VueNode | boolean
  toolBarBtn?: WithFalse<() => CustomRender>
  titleTipText?: string
  optionsExtra?: VueNode
  settingExtra?: VueNode
  options?: OptionConfig | boolean
}

export type OptionsFunctionType = () => void

function getButtonText() {
  return {
    reload: {
      text: '刷新',
      icon: <ReloadOutlined />
    },
    density: {
      text: '表格密度',
      icon: <DensityIcon />
    },
    setting: {
      text: '列设置',
      icon: <SettingOutlined />
    },
    fullScreen: {
      text: '全屏',
      icon: <FullScreenIcon />
    }
  }
}

/**
 * @Author      gx12358
 * @DateTime    2022/1/24
 * @lastTime    2022/1/24
 * @description 渲染默认的 工具栏
 */
function renderDefaultOption(options: OptionConfig, defaultOptions: OptionConfig) {
  return Object.keys(options)
    .filter((item) => item)
    .map((key) => {
      const value = options[key]
      if (!value) {
        return null
      }

      let onClick: OptionsFunctionType = value === true ? defaultOptions[key] : () => value?.()

      if (typeof onClick !== 'function') {
        onClick = () => {}
      }

      if (key === 'setting') {
        return <ColumnSetting {...options[key]} key={key} />
      }
      if (key === 'fullScreen') {
        return (
          <span key={key} onClick={onClick}>
            <FullScreenIcon />
          </span>
        )
      }

      const optionItem = getButtonText()[key]
      if (optionItem) {
        return (
          <span key={key} onClick={onClick}>
            <Tooltip title={optionItem.text}>{optionItem.icon}</Tooltip>
          </span>
        )
      }
      return null
    })
    .filter((item) => item)
}

function ToolBar({
  toolBarBtn,
  headerTitle,
  titleTip,
  titleTipText,
  options: propsOptions,
  optionsExtra,
  settingExtra
}: ToolBarProps) {
  const listToolBar = ref()
  const prefixCls = getPrefixCls({
    suffixCls: 'table-list-toolbar',
    isPor: true
  })

  const { action } = useTableContext()

  const optionDom = computed(() => {
    const defaultOptions = {
      reload: () => action?.reload(),
      density: true,
      setting: true,
      fullScreen: () => action?.toggle()
    }
    if (!Object.keys(propsOptions || {}).length) return []

    const options = {
      ...defaultOptions,
      ...(propsOptions as object)
    } as OptionConfig

    if (options.setting !== false) {
      if (settingExtra) {
        options.setting = {}
        options.setting.extra = settingExtra
      }
    }

    return renderDefaultOption(options, { ...defaultOptions })
  })

  // 操作列表
  const actions = toolBarBtn ? toolBarBtn : []

  return (
    <ListToolBar
      ref={() => listToolBar.value}
      prefixCls={prefixCls}
      actions={actions}
      optionsExtra={optionsExtra}
      headerTitle={headerTitle}
      settings={unref(optionDom)}
      titleTip={titleTip}
      titleTipText={titleTipText}
    />
  )
}

const ToolbarRender: FC<ToolBarProps> = (props) => {
  return <ToolBar {...props} />
}

export default ToolbarRender
