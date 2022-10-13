import type { FunctionalComponent } from 'vue'
import type { CardProps } from './typings'
import ProCard from './components/Card'
import Divider from './components/Divider'
import TabPane from './components/TabPane'

export const Group: FunctionalComponent<CardProps> = (props, { slots }) => {
  return (
    <ProCard bodyStyle={{ padding: 0 }} {...props}>
      {slots.default?.()}
    </ProCard>
  )
}

export { Divider, TabPane }

ProCard.Divider = Divider
ProCard.TabPane = TabPane
ProCard.Group = Group

export default ProCard
