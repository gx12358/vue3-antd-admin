import type { FunctionalComponent, CSSProperties } from 'vue'
import { getPrefixCls } from '@gx-admin/utils'

import './style.less'

type ProCardDividerProps = {
  /**
   * 样式
   *
   * @ignore
   */
  style?: CSSProperties
  /**
   * ClassName
   *
   * @ignore
   */
  className?: string
  /**
   * 布局类型
   *
   * @default vertical
   */
  type?: 'horizontal' | 'vertical'
}

const ProCardDivider: FunctionalComponent<ProCardDividerProps> = (props) => {
  const baseClassName = getPrefixCls({
    suffixCls: 'card',
    isPor: true
  })

  const { className, style = {}, type } = props

  return (
    <div
      class={{
        [`${className}`]: className,
        [`${baseClassName}-divider`]: true,
        [`${baseClassName}-divider-${type}`]: type
      }}
      style={style}
    />
  )
}

export default ProCardDivider
