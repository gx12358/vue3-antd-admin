import type { FunctionalComponent, ExtractPropTypes } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import Logo from '@/assets/logo.png'
import { globalHeaderProps } from './props'
import type { SiderMenuProps } from '../SiderMenu/SiderMenu'
import { defaultRenderCollapsedButton } from '../SiderMenu/SiderMenu'
import { siderMenuProps } from '../SiderMenu/props'
import BaseMenu from '../SiderMenu/BaseMenu'
import DeFaultRightContent from '../RightContent'
import LogoContent, { defaultRenderLogo } from '../LogoContent'
import { useRouteContext } from '../../RouteContext'

export const defaultHeaderProps = { ...siderMenuProps, ...globalHeaderProps }

export type DefaultHeaderProps = Partial<ExtractPropTypes<typeof defaultHeaderProps>> &
  Partial<SiderMenuProps>

const renderLogo = (
  menuHeaderRender: SiderMenuProps['menuHeaderRender'],
  logoDom: CustomRender
) => {
  if (menuHeaderRender === false) {
    return null
  }
  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null)
  }
  return logoDom
}

const RightContent = defineComponent({
  props: defaultHeaderProps,
  setup(props) {
    const rightSize = ref<number | string>('auto')

    const handleResize = ({ width }: { width: number }) => {
      rightSize.value = width
    }

    return () => (
      <div
        style={{
          minWidth: typeof rightSize.value === 'string' ? rightSize.value : `${rightSize.value}px`
        }}
      >
        <div
          style={{
            paddingRight: '8px'
          }}
        >
          <ResizeObserver onResize={handleResize}>
            {props.rightContentRender && typeof props.rightContentRender === 'function' ? (
              <div>
                {props.rightContentRender({
                  ...props
                })}
              </div>
            ) : (
              <DeFaultRightContent theme={props.theme} extra={props.extraRightDropdownRender} />
            )}
          </ResizeObserver>
        </div>
      </div>
    )
  }
})

export const DefaultHeader: FunctionalComponent<DefaultHeaderProps> = (props, { slots, emit }) => {
  const {
    isMobile,
    wideWidth,
    logo = Logo,
    collapsed,
    collapsedButtonRender = defaultRenderCollapsedButton,
    onOpenKeys,
    onSelect,
    layout,
    extraRightDropdownRender,
    rightContentRender,
    menuHeaderRender,
    menuData,
    splitMenus,
    theme
  } = props

  const router = useRouter()
  const context = useRouteContext()

  const { width } = useWindowSize()

  const baseClassName = context.getPrefixCls({
    suffixCls: 'global-header',
    isPor: true
  })
  const className = computed(() => {
    return {
      [`${baseClassName}`]: true,
      [`${theme}`]: true,
      ['wide']: layout === 'wide'
    }
  })

  const handleChangeKeys = (type: string) => {
    if (router.currentRoute) {
      const matched = router.currentRoute.value.matched.concat()
      if (onSelect && type === 'select')
        onSelect(matched.filter((r) => r.name !== 'index').map((r) => r.path))
      if (onOpenKeys && type === 'openKeys')
        onOpenKeys(
          matched.filter((r) => r.path !== router.currentRoute.value.path).map((r) => r.path)
        )
    }
  }

  const logoDom = (
    <span class={[`${baseClassName}-logo`, isMobile ? 'mobile' : '']} key="logo">
      <a>{defaultRenderLogo(logo)}</a>
    </span>
  )

  const onCollapse = () => {
    emit('collapse', !props.collapsed)
  }

  const contentRender = () => (
    <>
      {layout === 'mix' && !isMobile && splitMenus ? (
        <div style={{ flex: 1 }} class={`${baseClassName}-menu`}>
          <BaseMenu
            theme={props.theme}
            mode={props.mode}
            collapsed={props.collapsed}
            menuData={menuData}
            openKeys={context.openKeys}
            selectedKeys={context.selectedKeys}
            iconfontUrl={props.iconfontUrl}
            menuItemRender={props.menuItemRender}
            subMenuItemRender={props.subMenuItemRender}
            class={{ 'top-nav-menu': props.mode === 'horizontal' }}
            {...{
              'onUpdate:openKeys': () => handleChangeKeys('openKeys'),
              'onUpdate:selectedKeys': () => handleChangeKeys('select')
            }}
          />
        </div>
      ) : (
        <div style={{ flex: 1 }}>{slots.default?.()}</div>
      )}
      {layout !== 'simple' && (
        <RightContent
          extraRightDropdownRender={extraRightDropdownRender}
          rightContentRender={rightContentRender}
          {...props}
        />
      )}
    </>
  )

  return (
    <div
      style={{
        height: '100%',
        ...(isMobile || layout !== 'mix' ? {} : { padding: 0 })
      }}
      class={className.value}
    >
      {isMobile ? (
        <>
          {renderLogo(menuHeaderRender, logoDom)}
          {isMobile && collapsedButtonRender && (
            <span class={`${baseClassName}-collapsed-button`} onClick={onCollapse}>
              {collapsedButtonRender(collapsed)}
            </span>
          )}
          {contentRender()}
        </>
      ) : layout === 'mix' || layout === 'wide' ? (
        <>
          <div
            style={{
              width: layout === 'wide' ? `${wideWidth}px` : undefined,
              padding: layout === 'wide' && width.value < wideWidth ? '0 50px' : undefined
            }}
            class={`${baseClassName}-main`}
          >
            <div class={`${baseClassName}-main-left`}>
              <LogoContent {...props} renderKey="headerTitleRender" />
            </div>
            {contentRender()}
          </div>
        </>
      ) : (
        contentRender()
      )}
    </div>
  )
}
DefaultHeader.inheritAttrs = false
