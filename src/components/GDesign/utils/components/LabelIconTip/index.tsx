import type { FunctionalComponent } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '@gx-admin/utils'
import type { LabelTooltipType, WrapperTooltipProps } from '../../typings'

import './index.less'

/**
 * 在 form 的 label 后面增加一个 tips 来展示一些说明文案
 *
 * @param props
 */
const LabelIconTip: FunctionalComponent<{
  label: VueNode
  subTitle?: VueNode
  tooltip?: string | LabelTooltipType
  ellipsis?: boolean
}> = (props) => {
  const { label, tooltip, ellipsis, subTitle } = props

  if (!tooltip && !subTitle) {
    return <>{label}</>
  }
  const className = getPrefixCls({
    suffixCls: 'core-label-tip',
    isPor: true
  })
  const tooltipProps =
    typeof tooltip === 'string' ? { title: tooltip } : (tooltip as WrapperTooltipProps)

  const icon = tooltipProps?.icon || <InfoCircleOutlined />
  return (
    <div
      class={className}
      onMousedown={(e) => e.stopPropagation()}
      onMouseleave={(e) => e.stopPropagation()}
      onMousemove={(e) => e.stopPropagation()}
    >
      <div
        class={{
          [`${className}-title`]: true,
          [`${className}-title-ellipsis`]: ellipsis
        }}
      >
        {label}
      </div>
      {subTitle && <div class={`${className}-subtitle`}>{subTitle}</div>}
      {tooltip && (
        <a-tooltip {...tooltipProps}>
          <span class={`${className}-icon`}>{icon}</span>
        </a-tooltip>
      )}
    </div>
  )
}

export default LabelIconTip
