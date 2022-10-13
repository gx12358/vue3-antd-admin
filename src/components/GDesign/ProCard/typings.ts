import type { ExtractPropTypes, CSSProperties } from 'vue'
import type {
  TabPosition,
  RenderTabBar,
  TabsLocale,
  AnimatedConfig,
  OnTabScroll
} from 'ant-design-vue/lib/tabs/src/interface'
import type { TabsType } from 'ant-design-vue/lib/tabs/src/Tabs'
import { PropTypes } from '@/utils'
import type { SizeType } from '@gx-admin/utils'
import { cardProps, proCardTabPaneProps } from './props'

export const tabsProps = () => {
  return {
    prefixCls: { type: String },
    id: { type: String },

    activeKey: { type: [ String, Number ] },
    defaultActiveKey: { type: [ String, Number ] },
    direction: { type: String as PropType<'ltr' | 'rtl'> },
    animated: { type: [ Boolean, Object ] as PropType<boolean | AnimatedConfig> },
    renderTabBar: { type: Function as PropType<RenderTabBar> },
    tabBarGutter: { type: Number },
    tabBarStyle: { type: Object as PropType<CSSProperties> },
    tabPosition: { type: String as PropType<TabPosition> },
    destroyInactiveTabPane: { type: Boolean },

    hideAdd: Boolean,
    type: { type: String as PropType<TabsType> },
    size: { type: String as PropType<SizeType> },
    centered: Boolean,
    onEdit: {
      type: Function as PropType<(
        e: MouseEvent | KeyboardEvent | string | number,
        action: 'add' | 'remove'
      ) => void>
    },
    onChange: { type: Function as PropType<(activeKey: string | number) => void> },
    onTabClick: {
      type: Function as PropType<(
        activeKey: string | number,
        e: KeyboardEvent | MouseEvent
      ) => void>
    },
    onTabScroll: { type: Function as PropType<OnTabScroll> },

    // Accessibility
    locale: { type: Object as PropType<TabsLocale>, default: undefined as TabsLocale },
    onPrevClick: Function,
    onNextClick: Function,
    tabBarExtraContent: PropTypes.any
  }
}

export const antTabsProps = {
  ...tabsProps(),
  tabPosition: 'top',
  animated: {
    inkBar: true,
    tabPane: false
  }
}

export type TabsProps = Partial<ExtractPropTypes<ReturnType<typeof tabsProps>>>;

export type Gutter = number | Partial<Record<Breakpoint, number>>;

export type ColSpanType = number | string;

export type ProCardTabsProps = Partial<ExtractPropTypes<typeof antTabsProps>>;

export type CardProps = Partial<ExtractPropTypes<typeof cardProps>>;

export type ProCardTabPaneProps = Partial<ExtractPropTypes<typeof proCardTabPaneProps>>;

