import type { CSSProperties, ExtractPropTypes } from 'vue'
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onBeforeUnmount,
  toRefs,
  onMounted,
  unref
} from 'vue'
import { Layout } from 'ant-design-vue'
import { useMediaQuery } from '@gx-admin/hooks/event'
import { getSlot, getPrefixCls } from '@gx-admin/utils'
import { basicLayoutProps } from './props'
import type {
  BreadcrumbRender,
  MenuContentRender,
  MenuFooterRender,
  MenuExtraRender,
  CopyrightRender,
  HeaderContentRender,
  HeaderRender,
  LinksRender,
  FooterRender,
  RightContentRender,
  HeaderLogoRender,
  MenuItemRender,
  SubMenuItemRender,
  CollapsedButtonRender,
  ExtraRightDropdownRender
} from './RenderTypings'
import type { RouteContextProps, BreadcrumbProps } from './RouteContext'
import { provideRouteContext, defaultRouteContext } from './RouteContext'
import { WrapContent } from './WrapContent'
import GlobalHeader from './components/GlobalHeader'
import GlobalFooter from './components/GlobalFooter'
import SiderMenuWrapper from './components/SiderMenu'
import { getMenuFirstChildren, pick } from './utils'
import './style.less'

export type BasicLayoutProps = Partial<ExtractPropTypes<typeof basicLayoutProps>>

export default defineComponent({
  name: 'GProLayout',
  inheritAttrs: false,
  components: {
    GlobalHeader,
    GlobalFooter,
    SiderMenuWrapper
  },
  props: basicLayoutProps,
  emits: [
    'update:collapsed',
    'update:open-keys',
    'update:selected-keys',
    'collapse',
    'openKeys',
    'reloadPage',
    'select',
    'menuHeaderClick',
    'menuClick'
  ],
  setup(props, { emit, slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'basic-layout',
      isPor: true
    })

    const layoutClassName = getPrefixCls({
      suffixCls: 'layout',
      isPor: true
    })
    const colSize = useMediaQuery()
    const width = ref(document.body.getBoundingClientRect().width)

    const hasSide = computed(
      () => props.layout === 'mix' || props.layout === 'side' || props.layout === 'wide' || false
    )
    const hasContentWide = computed(() => props.layout === 'wide')
    const hasFlatMenu = computed(() => hasSide.value)

    const siderWidth = computed(() => (props.collapsed ? props.collapsedWidth : props.siderWidth))

    onMounted(() => {
      window.addEventListener('resize', handleLayouts)
      handleLayouts()
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleLayouts)
    })

    const isMobile = computed(
      () =>
        (colSize.value === 'sm' || colSize.value === 'xs') &&
        !props.disableMobile &&
        !hasContentWide.value
    )

    const genLayoutStyle = reactive<CSSProperties>({
      position: 'relative'
    })

    // if is some layout children, don't need min height
    if (props.isChildrenLayout || (props.contentStyle && props.contentStyle.minHeight)) {
      genLayoutStyle.minHeight = 0
    }

    const handleLayouts = () => {
      const clientWidth = document.body.getBoundingClientRect().width
      if (width.value !== clientWidth) {
        colSize.value = useMediaQuery().value
        width.value = clientWidth
      }
    }

    const headerRender = (
      p: BasicLayoutProps & {
        hasSiderMenu: boolean
        headerRender: HeaderRender
        rightContentRender: RightContentRender
      },
      matchMenuKeys?: string[]
    ): CustomRender | null => {
      if (p.headerRender === false || p.pure) {
        return null
      }
      return <GlobalHeader {...p} matchMenuKeys={matchMenuKeys || []} />
    }

    const breadcrumb = computed<BreadcrumbProps>(() => ({
      ...props.breadcrumb,
      itemRender: getSlot<BreadcrumbRender>(slots, props, 'breadcrumbRender') as BreadcrumbRender
    }))

    const flatMenuData = computed(
      () =>
        (hasFlatMenu.value &&
          props.selectedKeys &&
          getMenuFirstChildren(props.menuData, props.selectedKeys[0])) ||
        []
    )

    const onCollapse = (collapsed: boolean) => {
      emit('update:collapsed', collapsed)
      emit('collapse', collapsed)
    }
    const onOpenKeys = (openKeys: string[] | false) => {
      emit('update:open-keys', openKeys)
      emit('openKeys', openKeys)
    }
    const onSelect = (selectedKeys: string[] | false) => {
      emit('update:selected-keys', selectedKeys)
      emit('select', selectedKeys)
    }
    const onMenuHeaderClick = (e: MouseEvent) => {
      emit('menuHeaderClick', e)
    }
    const onMenuClick = (args: any) => {
      emit('menuClick', args)
    }

    const onReloadPage = () => {
      emit('reloadPage')
    }

    const routeContext = reactive<RouteContextProps>({
      ...defaultRouteContext,
      ...(pick(toRefs(props), [
        'menuData',
        'openKeys',
        'selectedKeys',
        'disableMobile',
        'fixSiderbar',
        'fixedHeader'
        // 'hasSideMenu',
        // 'hasHeader',
        // 'hasFooter',
        // 'hasFooterToolbar',
        // 'setHasFooterToolbar',
      ]) as any),
      hasContentWide,
      isMobile,
      siderWidth,
      breadcrumb,
      flatMenuData,
      hasSide,
      flatMenu: hasFlatMenu
    })
    provideRouteContext(routeContext)

    return () => {
      const { pure, ...restProps } = props

      const collapsedButtonRender = getSlot<CollapsedButtonRender>(
        slots,
        props,
        'collapsedButtonRender'
      )
      const headerContentRender = getSlot<HeaderContentRender>(slots, props, 'headerContentRender')
      const rightContentRender = getSlot<RightContentRender>(slots, props, 'rightContentRender')
      const customHeaderRender = getSlot<HeaderRender>(slots, props, 'headerRender')
      const footerRender = getSlot<FooterRender>(slots, props, 'footerRender')
      const linksRender = getSlot<LinksRender>(slots, props, 'links')
      const copyrightRender = getSlot<CopyrightRender>(slots, props, 'copyrightRender')
      const extraRightDropdownRender = getSlot<ExtraRightDropdownRender>(
        slots,
        props,
        'extraRightDropdownRender'
      )

      // menu
      const menuHeaderRender = getSlot<HeaderLogoRender>(slots, props, 'menuHeaderRender')
      const menuExtraRender = getSlot<MenuExtraRender>(slots, props, 'menuExtraRender')
      const menuContentRender = getSlot<MenuContentRender>(slots, props, 'menuContentRender')
      const menuFooterRender = getSlot<MenuFooterRender>(slots, props, 'menuFooterRender')
      const menuItemRender = getSlot<MenuItemRender>(slots, props, 'menuItemRender')
      const subMenuItemRender = getSlot<SubMenuItemRender>(slots, props, 'subMenuItemRender')

      const menuRenders = {
        menuItemRender,
        subMenuItemRender
      }

      const headerDom = computed(() =>
        headerRender(
          {
            ...props,
            ...menuRenders,
            hasSiderMenu: hasSide.value,
            menuData: props.menuData,
            isMobile: unref(isMobile),
            onCollapse,
            onOpenKeys,
            onSelect,
            onMenuHeaderClick,
            rightContentRender,
            extraRightDropdownRender,
            headerTitleRender: menuHeaderRender,
            headerContentRender,
            headerRender: customHeaderRender,
            theme: (props.theme || 'dark').toLocaleLowerCase().includes('dark') ? 'dark' : 'light'
          },
          props.matchMenuKeys
        )
      )

      const layoutBaseClassName = computed(() => {
        return {
          [`${baseClassName}`]: true,
          ['wide']: hasContentWide.value,
          ['empty']: !props.menuData.length
        }
      })

      const layoutBaseStyle = computed(() => {
        return hasContentWide.value
          ? {
              minWidth: `${props.wideWidth}px`
            }
          : undefined
      })

      const layoutWideStyle = computed(() => {
        return hasContentWide.value
          ? {
              width: props.menuData.length
                ? `${props.wideWidth}px`
                : `${props.wideWidth - props.siderWidth - 20}px`,
              paddingTop: `${props.headerHeight + 20}px`
            }
          : undefined
      })

      const wrapContentStyle = computed(() => {
        return hasContentWide.value
          ? {
              minHeight: '835px'
            }
          : {}
      })

      return (
        <>
          {pure ? (
            slots.default?.()
          ) : (
            <div class={layoutBaseClassName.value} style={layoutBaseStyle.value}>
              <Layout
                class={{
                  [`${layoutClassName}-wide`]: hasContentWide.value
                }}
                style={layoutWideStyle.value}
              >
                <SiderMenuWrapper
                  {...restProps}
                  links={linksRender}
                  isMobile={isMobile.value}
                  menuHeaderRender={menuHeaderRender}
                  menuContentRender={menuContentRender}
                  menuExtraRender={menuExtraRender}
                  menuFooterRender={menuFooterRender}
                  collapsedButtonRender={collapsedButtonRender}
                  onCollapse={onCollapse}
                  onSelect={onSelect}
                  onOpenKeys={onOpenKeys}
                  onMenuClick={onMenuClick}
                />
                <Layout style={genLayoutStyle}>
                  {headerDom.value}
                  <WrapContent
                    isMobile={isMobile.value}
                    isChildrenLayout={props.isChildrenLayout}
                    loading={props.loading}
                    isShowTabsBar={props.showTabsBar}
                    isFixedMultiTab={props.fixedMultiTab}
                    siderWidth={props.siderWidth}
                    collapsed={props.collapsed}
                    style={
                      props.disableContentMargin
                        ? wrapContentStyle.value
                        : { ...props.contentStyle, ...wrapContentStyle.value }
                    }
                    onReloadPage={onReloadPage}
                  >
                    {slots.default?.()}
                  </WrapContent>
                  {footerRender === false ? null : footerRender ? (
                    footerRender(props)
                  ) : (
                    <GlobalFooter copyright={copyrightRender} />
                  )}
                </Layout>
              </Layout>
            </div>
          )}
        </>
      )
    }
  }
})
