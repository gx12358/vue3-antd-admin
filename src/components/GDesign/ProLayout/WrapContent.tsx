import type { FunctionalComponent, CSSProperties } from 'vue'
import { computed } from 'vue'
import { Layout } from 'ant-design-vue'
import PageLoading from './PageLoading'
import type { MultiTabProps } from './components/MultiTab'
import MultiTab from './components/MultiTab'
import { useRouteContext } from './RouteContext'

const { Content } = Layout

export interface WrapContentProps {
  style?: CSSProperties
  class?: string | string[] | any
  loading?: boolean
  isMobile: boolean
  collapsed?: boolean
  isShowTabsBar?: boolean
  isFixedMultiTab?: boolean
  isChildrenLayout?: boolean
  location?: string | string[] | any
  siderWidth?: number
  contentHeight?: number
  onReloadPage?: MultiTabProps['onReloadPage']
}

export const WrapContent: FunctionalComponent<WrapContentProps> = (props, { slots, attrs }) => {
  const { isMobile, loading, collapsed, siderWidth, isShowTabsBar, isFixedMultiTab, onReloadPage } =
    props

  if (props.isChildrenLayout) {
    return slots.default?.()
  }
  const context = useRouteContext()
  const { getPrefixCls } = useRouteContext()

  const prefixCls = getPrefixCls({
    suffixCls: 'basic-layout',
    isPor: true
  })

  const classNames = computed(() => {
    return {
      [`${prefixCls}-content`]: true,
      [`${prefixCls}-warp`]: context.flatMenuData.length === 0
    }
  })

  return (
    <>
      {context.flatMenuData.length > 0 && isShowTabsBar && (
        <MultiTab
          isMobile={isMobile}
          loading={loading}
          isFixedMultiTab={isFixedMultiTab}
          siderWidth={siderWidth}
          collapsed={collapsed}
          onReloadPage={onReloadPage}
        />
      )}
      <Content style={attrs.style} class={classNames.value}>
        {loading ? <PageLoading /> : slots.default?.()}
      </Content>
    </>
  )
}

WrapContent.inheritAttrs = false
WrapContent.displayName = 'wrap-content'
