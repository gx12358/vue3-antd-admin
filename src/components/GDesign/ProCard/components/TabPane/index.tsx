import type { FunctionalComponent } from 'vue'
import { Tabs } from 'ant-design-vue'
import { getPrefixCls } from '@gx-admin/utils'
import type { ProCardTabPaneProps } from '../../typings'
import Card from '../Card'

import './style.less'

const TabPane: FunctionalComponent<ProCardTabPaneProps> = (props, { slots, attrs }) => {
  const { key, tab, tabKey, disabled, destroyInactiveTabPane, cardProps = {}, ...rest } = props

  const baseClassName = getPrefixCls({
    suffixCls: 'card',
    isPor: true
  })

  return (
    <Tabs.TabPane
      key={key}
      tabKey={tabKey}
      tab={tab}
      class={{
        [`${attrs.class}`]: attrs.class,
        [`${baseClassName}-tabpane`]: true
      }}
      style={attrs.style}
      disabled={disabled}
      destroyInactiveTabPane={destroyInactiveTabPane}
      {...rest}
    >
      <Card {...cardProps}>{slots.default?.()}</Card>
    </Tabs.TabPane>
  )
}

export default TabPane
