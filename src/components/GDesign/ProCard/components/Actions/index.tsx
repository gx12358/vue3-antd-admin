import type { FunctionalComponent } from 'vue'

import './style.less'

export type ProCardActionsProps = {
  /**
   * 自定义前缀
   *
   * @ignore
   */
  prefixCls?: string
  /** 操作按钮 */
  actions?: VueNode[]
}

const ProCardActions: FunctionalComponent<ProCardActionsProps> = (props) => {
  const { actions, prefixCls } = props
  return actions && actions.length ? (
    <ul class={`${prefixCls}-actions`}>
      {actions.map((action, index) => (
        <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
          <span>{action}</span>
        </li>
      ))}
    </ul>
  ) : null
}

export default ProCardActions
