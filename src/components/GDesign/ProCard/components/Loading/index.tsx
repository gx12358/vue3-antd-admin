import type { FunctionalComponent, CSSProperties } from 'vue'

import './style.less'

type LoadingProps = {
  /** 类名 */
  class?: string
  /** 样式属性 */
  style?: CSSProperties
  /** Prefix */
  prefix?: string
}

const Loading: FunctionalComponent<LoadingProps> = (props) => {
  const { style, prefix } = props

  return (
    <div class={`${prefix}-loading-content`} style={style}>
      <a-row gutter={8}>
        <a-col span={22}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
      </a-row>
      <a-row gutter={8}>
        <a-col span={8}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
        <a-col span={15}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
      </a-row>
      <a-row gutter={8}>
        <a-col span={6}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
        <a-col span={18}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
      </a-row>
      <a-row gutter={8}>
        <a-col span={13}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
        <a-col span={9}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
      </a-row>
      <a-row gutter={8}>
        <a-col span={4}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
        <a-col span={3}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
        <a-col span={16}>
          <div class={`${prefix}-loading-block`} />
        </a-col>
      </a-row>
    </div>
  )
}

export default Loading
